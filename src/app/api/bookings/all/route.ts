import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') 
      ? JSON.parse(searchParams.get('search')!) as Prisma.BookingWhereInput
      : {};

    const bookings = await prisma.booking.findMany({
      where: searchQuery,
      include: {
        user: true,
        dailyTour: true,
      }
    });

    // Map for backward compatibility
    const mappedBookings = bookings.map(booking => ({
      ...booking,
      dahabiya: booking.dailyTour,
    }));

    return new Response(JSON.stringify(mappedBookings));
  } catch (error) {
    return new Response('Failed to fetch bookings', { status: 500 });
  }
}