import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        itineraryDays: {
          include: {
            images: true,
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      shortDescription,
      price,
      durationDays,
      mainImageUrl,
      itineraryDays,
      packageType,
      selectedDahabiyaId,
      cairoNights,
      dahabiyaNights,
      maxGuests,
      highlights,
    } = body;

    const createdPackage = await prisma.package.create({
      data: {
        name,
        description,
        shortDescription,
        price,
        durationDays,
        mainImageUrl,
        packageType: packageType || 'CAIRO_DAHABIYA',
        selectedDahabiyaId,
        cairoNights: cairoNights || 0,
        dahabiyaNights: dahabiyaNights || 0,
        maxGuests: maxGuests || 12,
        highlights: highlights || [],
        itineraryDays: {
          create: (itineraryDays || []).map((day: any, idx: number) => ({
            dayNumber: idx + 1,
            title: day.title,
            description: day.description,
            location: day.location || '',
            activities: day.activities || [],
            images: {
              create: (day.images || []).map((img: any) => ({
                url: img.url,
                alt: img.alt || '',
                category: 'INDOOR', // Default category for package images
              })),
            },
          })),
        },
      },
      include: {
        itineraryDays: { include: { images: true } },
      },
    });
    return NextResponse.json(createdPackage);
  } catch (error) {
    console.error('Error creating package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return new NextResponse('Missing package id', { status: 400 });
    const updated = await prisma.dahabiya.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        pricePerDay: body.price,
        capacity: body.capacity,
        features: body.features,
        type: body.type,
        category: body.category,
        amenities: body.amenities,
        images: body.images ? { deleteMany: {}, create: body.images } : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}