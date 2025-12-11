import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        mainImage: true,
        price: true,
        discountPrice: true,
      },
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 20,
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}


