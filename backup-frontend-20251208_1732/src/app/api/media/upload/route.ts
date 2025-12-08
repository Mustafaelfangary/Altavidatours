import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Route segment config for handling large file uploads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum allowed size is 50MB.' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Determine media type
    let mediaType: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    if (file.type.startsWith('image/')) {
      mediaType = 'IMAGE';
    } else if (file.type.startsWith('video/')) {
      mediaType = 'VIDEO';
    } else {
      mediaType = 'DOCUMENT';
    }

    // Save to database
    const mediaItem = await prisma.mediaAsset.create({
      data: {
        filename: filename,
        originalName: file.name,
        url: `/uploads/${filename}`,
        type: mediaType,
        size: file.size,
        mimeType: file.type,
      },
    });

    // Structured audit log (single upload)
    console.log('media_upload_single', {
      userId: session.user.id,
      role: session.user.role,
      file: {
        id: mediaItem.id,
        url: mediaItem.url,
        size: mediaItem.size,
        type: mediaItem.mimeType,
        name: mediaItem.originalName,
      },
      ts: new Date().toISOString(),
    });

    return NextResponse.json(mediaItem);
  } catch (error) {
    console.error('media_upload_single_error', {
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
