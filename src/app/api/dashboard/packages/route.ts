import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const {
      name,
      description,
      durationDays,
      dahabiyaIds,
      days,
      contentBlocks,
      imageId,
    } = await request.json();

    // Validate required fields
    if (!name || !description || !durationDays || !dahabiyaIds) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.create({
      data: {
        name,
        description,
        durationDays,
        dahabiyat: { connect: dahabiyaIds.map((id: string) => ({ id })) },
        days: days ? { create: days } : undefined,
        contentBlocks: contentBlocks ? { create: contentBlocks } : undefined,
        imageId: imageId || undefined,
      },
      include: {
        dahabiyat: true,
        days: true,
        contentBlocks: true,
        image: true,
      },
    });

    return new NextResponse(JSON.stringify(itinerary));
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create itinerary' }),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [itineraries, total] = await Promise.all([
      prisma.itinerary.findMany({
        where,
        include: {
          dahabiyat: {
            select: {
              name: true,
              id: true,
            },
          },
          days: true,
          contentBlocks: true,
          image: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.itinerary.count({ where }),
    ]);

    return new NextResponse(
      JSON.stringify({
        itineraries,
        total,
        pages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch itineraries' }),
      { status: 500 }
    );
  }
}

