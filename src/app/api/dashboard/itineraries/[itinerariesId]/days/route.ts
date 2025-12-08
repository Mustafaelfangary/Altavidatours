import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all itinerary days for an itinerary
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ itinerariesId: string }> }
) {
  const { itinerariesId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const itineraryDays = await prisma.itineraryDay.findMany({
      where: { itineraryId: itinerariesId },
      orderBy: { dayNumber: 'asc' },
    });
    return NextResponse.json(itineraryDays);
  } catch (error) {
    console.error('Error fetching itinerary days:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// CREATE a new itinerary day for an itinerary
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ itinerariesId: string }> }
) {
  const { itinerariesId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { dayNumber, title, description } = await req.json();

    const newItineraryDay = await prisma.itineraryDay.create({
      data: {
        itineraryId: itinerariesId,
        dayNumber,
        title,
        description,
      },
    });

    return NextResponse.json(newItineraryDay, { status: 201 });
  } catch (error) {
    console.error('Error creating itinerary day:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// REORDER itinerary days
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { dayIds }: { dayIds: string[] } = await req.json();

    if (!Array.isArray(dayIds)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const transactions = dayIds.map((id, index) =>
      prisma.itineraryDay.update({
        where: { id },
        data: { dayNumber: index + 1 },
      })
    );

    await prisma.$transaction(transactions);

    return NextResponse.json({ message: 'Itinerary days reordered successfully' });
  } catch (error) {
    console.error('Error reordering itinerary days:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}