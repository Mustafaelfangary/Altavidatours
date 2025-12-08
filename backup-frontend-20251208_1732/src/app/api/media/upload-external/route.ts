import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import prisma from '@/lib/prisma';

// Ensure Node.js runtime for fs/prisma usage and longer processing time for large downloads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // seconds

export async function POST(request: NextRequest) {
  // Keep external URL accessible in catch for audit logging
  let extOriginalUrl: string | null = null;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({
        error: "Unauthorized access. Admin or Manager role required."
      }, { status: 401 });
    }

    const contentType = request.headers.get('content-type');
    let file: File;
    let originalUrl: string | null = null;

    if (contentType?.includes('application/json')) {
      // Handle URL-based upload
      const body = await request.json();
      const { url } = body;

      if (!url) {
        return NextResponse.json({
          error: "No URL provided"
        }, { status: 400 });
      }

      originalUrl = url;
      extOriginalUrl = url;

      // Validate URL
      try {
        new URL(url);
      } catch {
        return NextResponse.json({
          error: "Invalid URL format"
        }, { status: 400 });
      }

      // Fetch the file from the external URL
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        return NextResponse.json({
          error: `Failed to fetch file from URL: ${response.status} ${response.statusText}`
        }, { status: 400 });
      }

      const blob = await response.blob();
      const filename = url.split('/').pop()?.split('?')[0] || 'external-file';

      // Create a File object from the blob
      file = new File([blob], filename, { type: blob.type || 'application/octet-stream' });
    } else {
      // Handle FormData upload (existing functionality)
      const formData = await request.formData();
      file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({
          error: "No file provided"
        }, { status: 400 });
      }
    }

    // Enhanced file validation for external sources
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi',
      // Documents
      'application/pdf', 'text/plain',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
      'mp4', 'webm', 'mov', 'avi',
      'pdf', 'txt',
      'mp3', 'wav', 'ogg'
    ];

    // Check both MIME type and file extension for better compatibility
    const isValidType = allowedTypes.includes(file.type);
    const isValidExtension = validExtensions.includes(fileExtension || '');

    if (!isValidType && !isValidExtension) {
      return NextResponse.json({
        error: `Invalid file type: ${file.type}`,
        details: {
          fileName: file.name,
          fileType: file.type,
          fileExtension: fileExtension,
          allowedTypes: allowedTypes,
          allowedExtensions: validExtensions
        }
      }, { status: 400 });
    }

    // File size validation (100MB max for external uploads)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 100MB.`
      }, { status: 400 });
    }

    // Determine upload directory based on file type
    let uploadDir = 'uploads';
    if (file.type.startsWith('image/')) {
      uploadDir = 'images';
    } else if (file.type.startsWith('video/')) {
      uploadDir = 'videos';
    } else if (file.type.startsWith('audio/')) {
      uploadDir = 'audio';
    } else if (file.type === 'application/pdf') {
      uploadDir = 'documents';
    }

    // Create upload directory if it doesn't exist
    const uploadPath = join(process.cwd(), 'public', uploadDir);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadPath, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const fileUrl = `/${uploadDir}/${filename}`;

    // Determine media type for database
    let mediaType = 'DOCUMENT';
    if (file.type.startsWith('image/')) {
      mediaType = 'IMAGE';
    } else if (file.type.startsWith('video/')) {
      mediaType = 'VIDEO';
    }

    // Save to database (mediaAsset table used elsewhere in the app)
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename: filename,
        originalName: file.name,
        url: fileUrl,
        type: mediaType as any,
        size: file.size,
        mimeType: file.type,
        alt: file.name,
        caption: originalUrl ? `Uploaded from: ${originalUrl}` : file.name
      }
    });

    // Structured audit log (external URL upload)
    console.log('media_upload_external', {
      source: 'external',
      sourceUrl: originalUrl,
      file: {
        id: mediaAsset.id,
        url: fileUrl,
        size: file.size,
        type: file.type,
        name: file.name,
        savedAs: filename,
      },
      ts: new Date().toISOString(),
    });

    // Persist audit row (SUCCESS)
    try {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
      const userAgent = request.headers.get('user-agent') || '';
      await prisma.uploadAudit.create({
        data: {
          userId: session.user.id as any,
          role: session.user.role as any,
          source: 'EXTERNAL',
          url: fileUrl,
          mimeType: file.type,
          size: file.size,
          ip,
          userAgent,
          status: 'SUCCESS',
          message: originalUrl || null,
        }
      });
    } catch (e) {
      console.error('upload_audit_external_error', { error: e instanceof Error ? e.message : String(e) });
    }

    return NextResponse.json({
      success: true,
      id: mediaAsset.id,
      url: fileUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadDir: uploadDir,
      sourceUrl: originalUrl
    });

  } catch (error) {
    console.error('media_upload_external_error', {
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    // Attempt to persist audit row (ERROR)
    try {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
      const userAgent = request.headers.get('user-agent') || '';
      await prisma.uploadAudit.create({
        data: {
          userId: null,
          role: null,
          source: 'EXTERNAL',
          url: extOriginalUrl || '',
          mimeType: 'unknown',
          size: 0,
          ip,
          userAgent,
          status: 'ERROR',
          message: error instanceof Error ? error.message : String(error),
        }
      });
    } catch (e) {
      console.error('upload_audit_external_error_persist', { error: e instanceof Error ? e.message : String(e) });
    }
    return NextResponse.json({
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
