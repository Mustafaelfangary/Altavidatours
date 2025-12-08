import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all daily tours
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tours = await prisma.dailyTour.findMany({
      include: {
        images: true,
        itinerary: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tours.map(tour => ({
      ...tour,
      pricePerDay: Number(tour.pricePerDay),
    })));
  } catch (error) {
    console.error('Failed to fetch tours:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

// POST create new daily tour
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Generate slug from name if not provided
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingTour = await prisma.dailyTour.findUnique({
      where: { slug },
    });

    if (existingTour) {
      return NextResponse.json({ error: 'A tour with this slug already exists' }, { status: 400 });
    }

    const tour = await prisma.dailyTour.create({
      data: {
        slug,
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || null,
        pricePerDay: data.pricePerDay,
        capacity: data.capacity,
        features: data.features || [],
        amenities: data.amenities || [],
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
        duration: data.duration || null,
        location: data.location || null,
        meetingPoint: data.meetingPoint || null,
        cancellationPolicy: data.cancellationPolicy || null,
        type: data.type || 'STANDARD',
        category: data.category || 'DELUXE',
        mainImageUrl: data.mainImageUrl || null,
        videoUrl: data.videoUrl || null,
        rating: data.rating || 0,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({
      ...tour,
      pricePerDay: Number(tour.pricePerDay),
    });
  } catch (error) {
    console.error('Failed to create tour:', error);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}

