import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/media - Get all media files
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mediaAssets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Transform files for frontend - both formats for compatibility
    const transformedFiles = mediaAssets.map(asset => ({
      id: asset.id,
      filename: asset.filename,
      originalName: asset.originalName,
      mimeType: asset.mimeType,
      size: asset.size,
      url: asset.url,
      // MediaLibrarySelector expected format
      name: asset.originalName || asset.filename,
      type: asset.mimeType,
      // Defaults for UI filters that existed in the legacy model
      category: 'general',
      tags: [] as string[],
      description: asset.caption || '',
      isPublic: true,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString()
    }));

    return NextResponse.json({ files: transformedFiles, media: transformedFiles });
  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json({ error: 'Failed to fetch media files' }, { status: 500 });
  }
}