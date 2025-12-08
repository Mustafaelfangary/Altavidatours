import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
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
    });

    if (!itinerary) {
      return new NextResponse(
        JSON.stringify({ error: 'Itinerary not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(itinerary));
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch itinerary' }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    if (!name || !description || !durationDays) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        name,
        description,
        durationDays,
        dahabiyat: dahabiyaIds ? { set: dahabiyaIds.map((id: string) => ({ id })) } : undefined,
        days: days ? { set: days } : undefined,
        contentBlocks: contentBlocks ? { set: contentBlocks } : undefined,
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
    console.error('Error updating itinerary:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update itinerary' }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    await prisma.itinerary.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete itinerary' }),
      { status: 500 }
    );
  }
}