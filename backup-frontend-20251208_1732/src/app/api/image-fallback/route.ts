import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath) {
      return NextResponse.json({ error: 'Image path required' }, { status: 400 });
    }

    // Clean the path and ensure it starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const fullPath = join(process.cwd(), 'public', cleanPath.slice(1));

    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json({ 
        error: 'Image not found',
        exists: false,
        path: cleanPath 
      }, { status: 404 });
    }

    try {
      // Get file stats
      const stats = await stat(fullPath);
      
      // Basic validation - check if file size is reasonable
      if (stats.size === 0) {
        return NextResponse.json({ 
          error: 'Empty file',
          exists: true,
          path: cleanPath,
          size: 0
        }, { status: 400 });
      }

      // Read first few bytes to check if it's a valid image
      const buffer = await readFile(fullPath);
      const firstBytes = buffer.slice(0, 12);
      
      // Check for common image file signatures
      const isValidImage = checkImageSignature(firstBytes);
      
      return NextResponse.json({
        exists: true,
        path: cleanPath,
        size: stats.size,
        lastModified: stats.mtime,
        isValidImage
      });
    } catch (fileError) {
      return NextResponse.json({ 
        error: 'File access error',
        exists: true,
        path: cleanPath,
        details: fileError instanceof Error ? fileError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Image validation error:', error);
    return NextResponse.json({ 
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function checkImageSignature(buffer: Buffer): boolean {
  // Check for common image file signatures
  const signatures = [
    // JPEG
    [0xFF, 0xD8, 0xFF],
    // PNG
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
    // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    // GIF89a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
    // WebP
    [0x52, 0x49, 0x46, 0x46], // RIFF (need to check for WEBP later in file)
    // BMP
    [0x42, 0x4D]
  ];

  for (const signature of signatures) {
    let matches = true;
    for (let i = 0; i < signature.length && i < buffer.length; i++) {
      if (buffer[i] !== signature[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      // For RIFF files, check if it's WebP
      if (signature[0] === 0x52 && buffer.length >= 12) {
        const webpSig = [0x57, 0x45, 0x42, 0x50]; // WEBP
        let isWebP = true;
        for (let i = 0; i < webpSig.length; i++) {
          if (buffer[8 + i] !== webpSig[i]) {
            isWebP = false;
            break;
          }
        }
        return isWebP;
      }
      return true;
    }
  }
  
  return false;
}
