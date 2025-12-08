import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    const quality = searchParams.get('quality') || '75';

    if (!imagePath) {
      return new NextResponse('Missing image path', { status: 400 });
    }

    // Normalize the image path
    let normalizedPath = imagePath;
    if (imagePath.startsWith('/') && !imagePath.startsWith('/images/')) {
      normalizedPath = `/images${imagePath}`;
    } else if (!imagePath.startsWith('/')) {
      normalizedPath = `/images/${imagePath}`;
    }

    // Remove leading slash for file system path
    const filePath = join(process.cwd(), 'public', normalizedPath);

    // Check if file exists
    if (!existsSync(filePath)) {
      console.log(`Image not found: ${filePath}`);
      
      // Try alternative paths
      const alternativePaths = [
        join(process.cwd(), 'public', 'images', 'default-placeholder.svg'),
        join(process.cwd(), 'public', 'images', 'about-placeholder.svg'),
        join(process.cwd(), 'public', 'images', 'altavida-logo-1.png')
      ];

      for (const altPath of alternativePaths) {
        if (existsSync(altPath)) {
          const fileBuffer = await readFile(altPath);
          return new NextResponse(fileBuffer, {
            headers: {
              'Content-Type': 'image/svg+xml',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }

      return new NextResponse('Image not found', { status: 404 });
    }

    // Read the image file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg';
    
    switch (ext) {
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      default:
        contentType = 'image/jpeg';
    }

    // Set cache headers for better performance
    const cacheControl = width || height ? 
      'public, max-age=31536000, immutable' : 
      'public, max-age=86400';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
