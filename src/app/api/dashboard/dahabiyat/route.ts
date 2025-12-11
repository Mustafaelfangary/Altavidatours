import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') as 'LUXURY' | 'STANDARD' | undefined;

    const where: Prisma.DahabiyaWhereInput = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        } : {},
        type ? { type } : {},
      ],
    };

    const [dahabiyat, total] = await Promise.all([
      prisma.dahabiya.findMany({
        where,
        include: {
          images: true,
          cabins: true,
          itinerary: {
            include: {
              days: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dahabiya.count({ where }),
    ]);

    return NextResponse.json({
      dahabiyat,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch dahabiyat:', error);
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
    const {
      name,
      description,
      shortDescription,
      pricePerDay,
      capacity,
      features,
      type,
      category,
      amenities,
      shipId,
      itineraryId,
      advantages,
      meaning,
      cabins,
      images,
    } = body;

    // Create a ship if not provided
    const ship = shipId ? { connect: { id: shipId } } : {
      create: {
        name: `${name} Ship`,
        capacity: capacity,
      }
    };

    // Create an itinerary if not provided
    const itinerary = itineraryId ? { connect: { id: itineraryId } } : {
      create: {
        name: `${name} Itinerary`,
        description: "Default itinerary",
        durationDays: 7,
        days: {
          create: [
            {
              dayNumber: 1,
              title: "Day 1",
              description: "Welcome aboard",
              activities: ["Check-in", "Welcome dinner"],
              meals: ["DINNER" as any],
            }
          ]
        }
      }
    };

    const dahabiya = await prisma.dahabiya.create({
      data: {
        name,
        description,
        shortDescription,
        pricePerDay,
        capacity,
        features,
        type,
        category,
        amenities,
        advantages,
        meaning,
        ship,
        itinerary,
        cabins: cabins ? {
          create: cabins.map((cabin: any) => ({
            name: cabin.name,
            description: cabin.description,
            capacity: cabin.capacity,
            price: cabin.price,
            features: cabin.features,
            size: cabin.size,
            bedType: cabin.bedType,
            view: cabin.view,
            deck: cabin.deck,
            cabinTypeId: cabin.cabinTypeId,
            images: {
              create: cabin.images.map((image: any) => ({
                url: image.url,
                alt: image.alt,
                featured: image.featured,
                order: image.order,
              })),
            },
          })),
        } : undefined,
        images: {
          create: images.map((image: any) => ({
            url: image.url,
            alt: image.alt,
            featured: image.featured,
            order: image.order,
            category: image.category,
          })),
        },
      },
      include: {
        images: true,
        cabins: true,
        itinerary: {
          include: {
            days: true,
          },
        },
      },
    });

    return NextResponse.json(dahabiya);
  } catch (error) {
    console.error('Failed to create dahabiya:', error);
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
    const {
      id,
      name,
      description,
      shortDescription,
      pricePerDay,
      capacity,
      features,
      type,
      category,
      amenities,
      shipId,
      itineraryId,
      cabins,
      images,
    } = body;

    if (!id) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // First, delete existing related records
    await prisma.$transaction([
      prisma.dahabiyaCabin.deleteMany({ where: { dahabiyaId: id } }),
      prisma.dahabiyaImage.deleteMany({ where: { dahabiyaId: id } }),
    ]);

    // Then update the dahabiya with new data
    const dahabiya = await prisma.dahabiya.update({
      where: { id },
      data: {
        name,
        description,
        shortDescription,
        pricePerDay,
        capacity,
        features,
        type,
        category,
        amenities,
        shipId,
        itineraryId,
        cabins: {
          create: cabins.map((cabin: any) => ({
            name: cabin.name,
            description: cabin.description,
            capacity: cabin.capacity,
            price: cabin.price,
            features: cabin.features,
            size: cabin.size,
            bedType: cabin.bedType,
            view: cabin.view,
            deck: cabin.deck,
            cabinTypeId: cabin.cabinTypeId,
            images: {
              create: cabin.images.map((image: any) => ({
                url: image.url,
                alt: image.alt,
                featured: image.featured,
                order: image.order,
              })),
            },
          })),
        },
        images: {
          create: images.map((image: any) => ({
            url: image.url,
            alt: image.alt,
            featured: image.featured,
            order: image.order,
          })),
        },
      },
      include: {
        images: true,
        cabins: true,
        itinerary: {
          include: {
            days: true,
          },
        },
      },
    });

    return NextResponse.json(dahabiya);
  } catch (error) {
    console.error('Failed to update dahabiya:', error);
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

    await prisma.dahabiya.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete dahabiya:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

