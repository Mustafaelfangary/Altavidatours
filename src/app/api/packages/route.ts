import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
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
      duration,
      mainImage,
      category,
      destination,
      includes,
      excludes,
      itinerary,
      maxGroupSize,
      difficulty,
    } = body;

    const createdPackage = await prisma.package.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description,
        shortDescription,
        price,
        duration,
        mainImage,
        category: category || 'CAIRO_DAHABIYA',
        destination,
        includes,
        excludes,
        itinerary,
        maxGroupSize,
        difficulty,
        isActive: true,
        isFeatured: false,
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
    const updated = await prisma.package.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        price: body.price,
        duration: body.duration,
        mainImage: body.mainImage,
        category: body.category,
        destination: body.destination,
        includes: body.includes,
        excludes: body.excludes,
        itinerary: body.itinerary,
        maxGroupSize: body.maxGroupSize,
        difficulty: body.difficulty,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

