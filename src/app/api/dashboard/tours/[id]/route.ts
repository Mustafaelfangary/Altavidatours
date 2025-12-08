import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET single tour by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to find by ID first
    const tourById = await prisma.dailyTour.findUnique({
      where: { id },
      include: { images: true, itinerary: true },
    });

    // If not found by ID, try by slug (slug is not a unique field)
    const tour = tourById ?? await prisma.dailyTour.findFirst({
      where: { slug: id },
      include: { images: true, itinerary: true },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...tour,
      pricePerDay: Number(tour.pricePerDay),
    });
  } catch (error) {
    console.error('Failed to fetch tour:', error);
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}

// PUT update tour
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if slug is being changed and if new slug already exists
    if (data.slug) {
      const existingTour = await prisma.dailyTour.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existingTour) {
        return NextResponse.json({ error: 'A tour with this slug already exists' }, { status: 400 });
      }
    }

    const tour = await prisma.dailyTour.update({
      where: { id },
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        pricePerDay: data.pricePerDay,
        capacity: data.capacity,
        features: data.features || [],
        amenities: data.amenities || [],
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
        duration: data.duration,
        location: data.location,
        meetingPoint: data.meetingPoint,
        cancellationPolicy: data.cancellationPolicy,
        type: data.type,
        category: data.category,
        mainImageUrl: data.mainImageUrl,
        videoUrl: data.videoUrl,
        rating: data.rating,
      },
      include: { images: true },
    });

    // Handle images if provided
    if (data.images && Array.isArray(data.images)) {
      // Delete existing images
      await prisma.image.deleteMany({ where: { dailyTourId: id } });
      
      // Create new images
      for (const img of data.images) {
        await prisma.image.create({
          data: {
            url: img.url,
            alt: img.alt || '',
            category: img.category || 'OUTDOOR',
            dailyTourId: id,
          },
        });
      }
    }

    return NextResponse.json({
      ...tour,
      pricePerDay: Number(tour.pricePerDay),
    });
  } catch (error) {
    console.error('Failed to update tour:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}

// DELETE tour
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete related images first
    await prisma.image.deleteMany({ where: { dailyTourId: id } });
    
    await prisma.dailyTour.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete tour:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}
