import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/dahabiyas - Get all dahabiyas
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dahabiyas = await prisma.dahabiya.findMany({
      include: {
        amenityItems: true,
        imageItems: true,
        itineraries: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(dahabiyas);
  } catch (error) {
    console.error('Error fetching dahabiyas:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/dahabiyas - Create a new dahabiya
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    
    const dahabiya = await prisma.dahabiya.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        summary: data.summary || null,
        capacity: data.capacity ? parseInt(data.capacity) : 0,
        cabins: data.cabins ? parseInt(data.cabins) : 0,
        crew: data.crew ? parseInt(data.crew) : null,
        length: data.length ? parseFloat(data.length) : null,
        imageCover: data.imageCover || null,
        images: Array.isArray(data.images) ? data.images : [],
        isFeatured: !!data.isFeatured,
        isActive: data.isActive !== undefined ? !!data.isActive : true,
        // optional amenity relation connect
        amenityItems: data.amenities?.length
          ? { connect: data.amenities.map((id: string) => ({ id })) }
          : undefined,
        // optional relational images creation
        imageItems: Array.isArray(data.imageItems) && data.imageItems.length
          ? {
              create: data.imageItems.map((img: any, idx: number) => ({
                url: typeof img === 'string' ? img : img.url,
                alt: (typeof img === 'object' && img.alt) || data.name,
                order: (typeof img === 'object' && img.order) ?? idx,
              })),
            }
          : undefined,
        // optional dahabiya itinerary steps
        itineraries: Array.isArray(data.itineraries) && data.itineraries.length
          ? {
              create: data.itineraries.map((step: any, idx: number) => ({
                day: step.day ?? idx + 1,
                title: step.title,
                description: step.description,
              })),
            }
          : undefined,
      },
      include: {
        amenityItems: true,
        imageItems: true,
        itineraries: true,
      },
    });

    return NextResponse.json(dahabiya);
  } catch (error) {
    console.error('Error creating dahabiya:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
