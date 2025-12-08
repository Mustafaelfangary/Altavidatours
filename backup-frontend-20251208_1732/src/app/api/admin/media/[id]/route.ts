import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// DELETE /api/admin/media/[id] - Delete media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if file exists (MediaAsset)
    const mediaAsset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!mediaAsset) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete physical file
    const relativeUrl = mediaAsset.url.startsWith('/') ? mediaAsset.url.slice(1) : mediaAsset.url;
    const filePath = join(process.cwd(), 'public', relativeUrl);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete from database
    await prisma.mediaAsset.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting media file:', error);
    return NextResponse.json({ 
      error: 'Failed to delete file',
      message: 'An error occurred while deleting the file' 
    }, { status: 500 });
  }
}