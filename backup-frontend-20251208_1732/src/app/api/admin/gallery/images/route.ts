import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/gallery/images - Get all gallery images
export async function GET() {
  console.log('🔍 Gallery images GET request received');
  try {
    const session = await getServerSession(authOptions);
    console.log('📋 Session check:', session?.user ? 'authenticated' : 'not authenticated');
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('🗄️ Fetching gallery images from database...');
    const images = await prisma.galleryImage.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`✅ Found ${images.length} images in database`);

    // Transform images for frontend
    const transformedImages = images.map(image => ({
      id: image.id,
      title: image.title,
      description: image.description,
      imageUrl: image.url,
      category: image.category?.name || 'Uncategorized',
      photographer: image.photographer,
      location: image.location,
      tags: image.tags || [],
      featured: image.isFeatured || false,
      isActive: image.isActive,
      views: image.views || 0,
      likes: image.likes || 0,
      createdAt: image.createdAt.toISOString(),
      updatedAt: image.updatedAt.toISOString()
    }));

    console.log('🎉 Returning gallery images response');
    return NextResponse.json({ images: transformedImages });
  } catch (error) {
    console.error('😱 Error fetching gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST /api/admin/gallery/images - Create new gallery image
export async function POST(request: NextRequest) {
  console.log('📝 Gallery images POST request received');
  try {
    const session = await getServerSession(authOptions);
    console.log('📋 POST Session check:', session?.user ? 'authenticated' : 'not authenticated');
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await request.json();
    let { title, description, imageUrl, category, tags, featured, isActive, photographer, location } = raw;

    // Apply safe defaults so uploads don't fail due to missing metadata
    const normalizedCategory = (typeof category === 'string' && category.trim().length > 0)
      ? category.trim()
      : 'General';

    const derivedTitleFromUrl = (() => {
      if (typeof imageUrl !== 'string' || !imageUrl) return '';
      const base = imageUrl.split('?')[0].split('#')[0].split('/').pop() || '';
      const withoutExt = base.includes('.') ? base.substring(0, base.lastIndexOf('.')) : base;
      return withoutExt.replace(/[-_]+/g, ' ').trim();
    })();

    const safeTitle = (typeof title === 'string' && title.trim().length > 0)
      ? title.trim()
      : (derivedTitleFromUrl || 'Untitled Image');

    // Find or create category by name
    let categoryRecord = await prisma.galleryCategory.findFirst({
      where: { name: normalizedCategory }
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.galleryCategory.create({
        data: { 
          name: normalizedCategory,
          slug: normalizedCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
      });
    }

    // Create image
    const image = await prisma.galleryImage.create({
      data: {
        title: safeTitle,
        description,
        url: imageUrl || '/images/placeholder.svg',
        alt: safeTitle,
        photographer,
        location,
        categoryId: categoryRecord.id,
        tags: Array.isArray(tags) ? tags : [],
        isFeatured: !!featured,
        isActive: isActive !== false
      },
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
        id: image.id,
        title: image.title,
        description: image.description,
        imageUrl: image.url,
        category: image.category?.name || 'Uncategorized',
        photographer: image.photographer,
        location: image.location,
        tags: image.tags || [],
        featured: image.isFeatured || false,
        isActive: image.isActive,
        views: image.views || 0,
        likes: image.likes || 0,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString()
      },
      message: 'Image created successfully' 
    });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ 
      error: 'Failed to create image',
      message: 'An error occurred while creating the image' 
    }, { status: 500 });
  }
}

// PUT /api/admin/gallery/images - Update gallery image
export async function PUT(request: NextRequest) {
  console.log('📝 Gallery images PUT request received');
  try {
    const session = await getServerSession(authOptions);
    console.log('📋 PUT Session check:', session?.user ? 'authenticated' : 'not authenticated');
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, title, description, url, categoryId, tags, isFeatured, isActive, photographer, location, order } = data;

    // Validate required fields
    if (!id || !title) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'ID and title are required' 
      }, { status: 400 });
    }

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
      data: {
        title,
        description,
        url: url || existingImage.url,
        alt: title,
        photographer,
        location,
        categoryId: categoryId || existingImage.categoryId,
        tags: tags || [],
        isFeatured: isFeatured || false,
        isActive: isActive !== false,
        order: order || existingImage.order
      },
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

// DELETE /api/admin/gallery/images - Delete gallery image
export async function DELETE(request: NextRequest) {
  console.log('🗑️ Gallery images DELETE request received');
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing required field',
        message: 'ID is required' 
      }, { status: 400 });
    }

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
