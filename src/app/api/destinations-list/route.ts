import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
        region: true,
        imageCover: true,
      },
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 20,
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}


