import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// POST /api/admin/media/upload - Upload media files
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string || 'general';
    const tags = (formData.get('tags') as string || '').split(',').map(tag => tag.trim()).filter(tag => tag);
    const description = formData.get('description') as string || '';
    const isPublic = formData.get('isPublic') === 'true';

    if (files.length === 0) {
      return NextResponse.json({ 
        error: 'No files provided',
        message: 'Please select at least one file to upload' 
      }, { status: 400 });
    }

    const uploadedFiles = [] as Array<{
      id: string;
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      url: string;
      category: string;
      tags: string[];
      description: string;
      isPublic: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    const uploadDir = join(process.cwd(), 'public', 'uploads', category);

    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Extract client info for auditing
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    for (const file of files) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ 
          error: 'File too large',
          message: `File ${file.name} exceeds 10MB limit` 
        }, { status: 400 });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${fileExtension}`;
      const filePath = join(uploadDir, filename);
      const publicUrl = `/uploads/${category}/${filename}`;

      // Write file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Save to database (MediaAsset schema)
      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'IMAGE' : (file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT'),
          alt: file.name,
          caption: description || null,
        }
      });

      // Return UI-friendly shape with defaults for legacy fields
      uploadedFiles.push({
        id: mediaAsset.id,
        filename: mediaAsset.filename,
        originalName: mediaAsset.originalName,
        mimeType: mediaAsset.mimeType,
        size: mediaAsset.size,
        url: mediaAsset.url,
        category: category || 'general',
        tags: tags || [],
        description: description || '',
        isPublic: isPublic,
        createdAt: mediaAsset.createdAt.toISOString(),
        updatedAt: mediaAsset.updatedAt.toISOString()
      });

      // Persist audit row
      try {
        await prisma.uploadAudit.create({
          data: {
            userId: String(session.user.id || ''),
            role: session.user.role as any,
            source: 'ADMIN',
            url: mediaAsset.url,
            mimeType: mediaAsset.mimeType,
            size: mediaAsset.size,
            ip,
            userAgent,
            status: 'SUCCESS'
          }
        });
      } catch (e) {
        console.error('upload_audit_admin_error', { error: e instanceof Error ? e.message : String(e) });
      }
    }

    // Structured audit log
    console.log('media_upload_admin', {
      userId: session.user.id,
      role: session.user.role,
      count: uploadedFiles.length,
      category,
      isPublic,
      files: uploadedFiles.map(f => ({ id: f.id, url: f.url, size: f.size, type: f.mimeType, name: f.originalName })),
      ts: new Date().toISOString()
    });

    return NextResponse.json({ 
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully` 
    });
  } catch (error) {
    console.error('media_upload_admin_error', {
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString()
    });
    return NextResponse.json({ 
      error: 'Failed to upload files',
      message: 'An error occurred while uploading files' 
    }, { status: 500 });
  }
}