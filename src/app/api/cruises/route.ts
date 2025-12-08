import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cruises = await prisma.cruise.findMany({
      include: {
        images: true,
      },
    });
    return NextResponse.json(cruises);
  } catch (error) {
    console.error('Error fetching cruises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cruises' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const duration = parseInt(formData.get('duration') as string);
    const capacity = parseInt(formData.get('capacity') as string);
    const itinerary = formData.get('itinerary') as string;
    const images = formData.getAll('images') as File[];

    const cruise = await prisma.cruise.create({
      data: {
        name,
        description,
        price,
        duration,
        capacity,
        itinerary,
        images: {
          create: images.map(image => ({
            url: image.name, // In a real app, you'd upload this to storage
            alt: name,
            category: 'INDOOR', // Default category for cruise images
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(cruise);
  } catch (error) {
    console.error('Error creating cruise:', error);
    return NextResponse.json(
      { error: 'Failed to create cruise' },
      { status: 500 }
    );
  }
} 