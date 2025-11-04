import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/itineraries/[id] - Get single itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        days: { orderBy: { dayNumber: 'asc' } },
        pricingTiers: { orderBy: { category: 'asc' } },
      } as any,
    } as any);

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/itineraries/[id] - Update itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Generate slug if not provided
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug is unique (excluding current itinerary)
    const existingItinerary = await prisma.itinerary.findFirst({
      where: {
        slug: slug,
        NOT: { id: id }
      }
    });

    if (existingItinerary) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Update itinerary with related data
    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        durationDays: data.durationDays ? parseInt(data.durationDays) : null,
        mainImageUrl: data.mainImageUrl,
        heroImageUrl: data.heroImageUrl,
        videoUrl: data.videoUrl,
        price: data.price ? parseFloat(data.price) : null,
        maxGuests: data.maxGuests ? parseInt(data.maxGuests) : null,
        highlights: data.highlights || [],
        included: data.included || [],
        notIncluded: data.notIncluded || [],
        childrenPolicy: data.childrenPolicy,
        cancellationPolicy: data.cancellationPolicy,
        observations: data.observations,
        isActive: data.isActive ?? true,
        featured: data.featured ?? false,
        days: {
          deleteMany: {},
          create: (data.days || []).map((day: any) => ({
            dayNumber: Number(day.dayNumber) || 1,
            title: day.title,
            description: day.description,
            location: day.location || null,
            activities: Array.isArray(day.activities) ? day.activities : [],
            meals: Array.isArray(day.meals) ? day.meals : [],
            coordinates: day.coordinates || null,
          })),
        },
        pricingTiers: {
          deleteMany: {},
          create: (data.pricingTiers || []).map((tier: any) => ({
            category: tier.category,
            paxRange: tier.paxRange,
            price: parseFloat(tier.price),
            singleSupplement: tier.singleSupplement ? parseFloat(tier.singleSupplement) : null,
          })),
        },
      } as any,
      include: {
        days: { orderBy: { dayNumber: 'asc' } },
        pricingTiers: { orderBy: { category: 'asc' } },
      } as any,
    } as any);

    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/itineraries/[id] - Partial update itinerary
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Update only the provided fields
    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: data as any,
      include: {
        days: { orderBy: { dayNumber: 'asc' } },
        pricingTiers: { orderBy: { category: 'asc' } },
      } as any,
    } as any);

    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/itineraries/[id] - Delete itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Delete itinerary (cascade will handle related records)
    await prisma.itinerary.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}