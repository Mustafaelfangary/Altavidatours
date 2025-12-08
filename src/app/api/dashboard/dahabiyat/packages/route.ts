import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dahabiyaId = searchParams.get('dahabiyaId');

    if (!dahabiyaId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const itineraries = await prisma.itinerary.findMany({
      where: { dahabiyat: { some: { id: dahabiyaId } } },
      include: {
        days: {
          include: {
            excursions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Failed to fetch itineraries:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { dahabiyaId, name, description, durationDays, days } = body;

    const itinerary = await prisma.itinerary.create({
      data: {
        name,
        description,
        durationDays,
        dahabiyat: {
          connect: { id: dahabiyaId },
        },
        days: {
          create: days.map((day: any) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
            location: day.location,
            activities: day.activities,
            meals: day.meals,
            coordinates: day.coordinates,
          })),
        },
      },
      include: {
        days: {
          include: {
            excursions: true,
          },
        },
      },
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Failed to create itinerary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, durationDays, days } = body;

    if (!id) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // First, delete existing days
    await prisma.itineraryDay.deleteMany({
      where: { itineraryId: id },
    });

    // Then update the itinerary with new data
    const itinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        name,
        description,
        durationDays,
        days: {
          create: days.map((day: any) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
            location: day.location,
            activities: day.activities,
            meals: day.meals,
            coordinates: day.coordinates,
          })),
        },
      },
      include: {
        days: {
          include: {
            excursions: true,
          },
        },
      },
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Failed to update itinerary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    await prisma.itinerary.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete itinerary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}