import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/gallery/images/[id] - Update gallery image
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    // Map incoming fields to Prisma model
    const data: any = { ...body };
    if (typeof body.featured !== 'undefined') data.isFeatured = !!body.featured;
    if (typeof body.imageUrl === 'string') data.url = body.imageUrl;

    // Check if image exists
    const existingImage = await prisma.galleryImage.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Update image
    const updatedImage = await prisma.galleryImage.update({
      where: { id },
      data: data,
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({ 
      image: {
        id: updatedImage.id,
        title: updatedImage.title,
        description: updatedImage.description,
        imageUrl: updatedImage.url,
        category: updatedImage.category?.name || 'Uncategorized',
        photographer: updatedImage.photographer,
        location: updatedImage.location,
        tags: updatedImage.tags || [],
        featured: updatedImage.isFeatured || false,
        isActive: updatedImage.isActive,
        views: updatedImage.views || 0,
        likes: updatedImage.likes || 0,
        createdAt: updatedImage.createdAt.toISOString(),
        updatedAt: updatedImage.updatedAt.toISOString()
      },
      message: 'Image updated successfully' 
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ 
      error: 'Failed to update image',
      message: 'An error occurred while updating the image' 
    }, { status: 500 });
  }
}

// DELETE /api/admin/gallery/images/[id] - Delete gallery image
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

    // Check if image exists
    const image = await prisma.galleryImage.findUnique({
      where: { id }
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete image
    await prisma.galleryImage.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ 
      error: 'Failed to delete image',
      message: 'An error occurred while deleting the image' 
    }, { status: 500 });
  }
}