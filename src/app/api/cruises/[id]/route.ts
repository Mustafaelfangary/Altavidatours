import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const cruise = await prisma.cruise.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!cruise) {
      return NextResponse.json(
        { error: 'Cruise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(cruise);
  } catch (error) {
    console.error('Error fetching cruise:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cruise' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;
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

    const cruise = await prisma.cruise.update({
      where: { id },
      data: {
        name,
        description,
        price,
        duration,
        capacity,
        itinerary,
        images: {
          deleteMany: {},
          create: images.map(image => ({
            url: image.name, // In a real app, you'd upload this to storage
            alt: name,
            category: 'INDOOR', // Default category, adjust as needed
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(cruise);
  } catch (error) {
    console.error('Error updating cruise:', error);
    return NextResponse.json(
      { error: 'Failed to update cruise' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.cruise.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cruise:', error);
    return NextResponse.json(
      { error: 'Failed to delete cruise' },
      { status: 500 }
    );
  }
}
