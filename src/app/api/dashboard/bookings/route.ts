import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        dailyTour: {
          include: {
            ship: true,
            itinerary: true,
          },
        },
        cabin: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map for backward compatibility
    const mappedBookings = bookings.map(booking => ({
      ...booking,
      dahabiya: booking.dailyTour,
    }));

    return NextResponse.json(mappedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

