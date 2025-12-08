import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/gallery/categories - Get all gallery categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.galleryCategory.findMany({
      include: {
        _count: {
          select: {
            images: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform categories for frontend
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      imageCount: category._count.images
    }));

    return NextResponse.json({ categories: transformedCategories });
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/admin/gallery/categories - Create new gallery category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { name, description } = data;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Name is required' 
      }, { status: 400 });
    }

    // Check if category already exists
    const existingCategory = await prisma.galleryCategory.findFirst({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json({ 
        error: 'Category already exists',
        message: 'A category with this name already exists' 
      }, { status: 409 });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Create category
    const category = await prisma.galleryCategory.create({
      data: {
        name,
        slug,
        description
      },
      include: {
        _count: {
          select: {
            images: true
          }
        }
      }
    });

    return NextResponse.json({ 
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        imageCount: category._count.images
      },
      message: 'Category created successfully' 
    });
  } catch (error) {
    console.error('Error creating gallery category:', error);
    return NextResponse.json({ 
      error: 'Failed to create category',
      message: 'An error occurred while creating the category' 
    }, { status: 500 });
  }
}