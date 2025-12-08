import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by ID first
    let pkg = await prisma.package.findUnique({ where: { id } });

    // If not found by ID, try to find by slug or name
    if (!pkg) {
      pkg = await prisma.package.findFirst({
        where: {
          OR: [
            { slug: id },
            { name: { contains: id, mode: 'insensitive' } },
          ],
        },
      });
    }

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Normalize itinerary JSON into the expected structure
    const rawItinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary as any[] : [];
    const itineraryDays = rawItinerary.map((day: any, index: number) => ({
      day: Number(day?.dayNumber ?? index + 1),
      title: day?.title || `Day ${Number(day?.dayNumber ?? index + 1)}`,
      description: day?.description || '',
      activities: Array.isArray(day?.activities)
        ? day.activities.map((a: any, i: number) => ({
            id: `act-${pkg!.id}-${index}-${i}`,
            description: typeof a === 'string' ? a : (a?.description || 'Activity'),
            time: typeof a === 'string' ? 'TBD' : (a?.time || 'TBD'),
            order: i,
          }))
        : [],
      isActive: true,
      id: `day-${pkg!.id}-${index + 1}`,
    }));

    // Convert values and map image URLs
    const formattedPackage = {
      ...pkg,
      price: Number(pkg.price),
      mainImageUrl: pkg.mainImage || '/images/default-package.jpg',
      highlights: pkg.includes || [],
      included: pkg.includes || [],
      excluded: pkg.excludes || [],
      maxGuests: pkg.maxGroupSize ?? 20,
      slug: pkg.slug,
      longDescription: pkg.description,
      itineraryDays,
      images: Array.isArray(pkg.images)
        ? pkg.images.map((url, i) => ({ id: `img-${pkg!.id}-${i}`, url, alt: pkg!.name, order: i, isActive: true }))
        : [],
      reviews: [],
    };

    return NextResponse.json(formattedPackage);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Update package
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        duration: body.durationDays ?? body.duration,
        price: body.price,
        mainImage: body.mainImageUrl ?? body.mainImage,
        isFeatured: body.isFeatured ?? body.isFeaturedOnHomepage,
        order: body.homepageOrder ?? body.order,
      },
    });

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}
