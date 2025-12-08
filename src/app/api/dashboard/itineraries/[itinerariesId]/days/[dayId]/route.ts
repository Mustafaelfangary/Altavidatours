import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// UPDATE an itinerary day
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itinerariesId: string; dayId: string }> }
) {
  const { itinerariesId, dayId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { dayNumber, title, description } = await req.json();

    const updatedItineraryDay = await prisma.itineraryDay.update({
      where: { id: dayId, itineraryId: itinerariesId },
      data: {
        dayNumber,
        title,
        description,
      },
    });

    return NextResponse.json(updatedItineraryDay);
  } catch (error) {
    console.error('Error updating itinerary day:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE an itinerary day
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itinerariesId: string; dayId: string }> }
) {
  const { itinerariesId, dayId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.itineraryDay.delete({
      where: { id: dayId, itineraryId: itinerariesId },
    });

    // After deleting, we need to re-order the remaining days
    const remainingDays = await prisma.itineraryDay.findMany({
        where: { itineraryId: itinerariesId },
        orderBy: { dayNumber: 'asc' },
    });

    const transactions = remainingDays.map((day, index) =>
        prisma.itineraryDay.update({
            where: { id: day.id },
            data: { dayNumber: index + 1 },
        })
    );

    await prisma.$transaction(transactions);


    return NextResponse.json({ message: 'Itinerary day deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary day:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}