import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | undefined;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    const where = {
      OR: search ? [
        { user: { is: { name: { contains: search, mode: 'insensitive' as const } } } },
        { user: { is: { email: { contains: search, mode: 'insensitive' as const } } } },
        { bookingReference: { contains: search, mode: 'insensitive' as const } },
      ] : undefined,
      status,
      startDate: startDate ? {
        gte: new Date(startDate),
      } : undefined,
      endDate: endDate ? {
        lte: new Date(endDate),
      } : undefined,
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          dailyTour: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
          cabin: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
          bookedExcursions: {
            include: {
              excursion: true,
            },
          },
          payment: true,
          guestDetails: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.count({ where }),
    ]);

    // Map for backward compatibility
    const mappedBookings = bookings.map(booking => ({
      ...booking,
      dahabiya: booking.dailyTour, // Alias for backward compatibility
    }));

    return NextResponse.json({
      bookings: mappedBookings,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        specialRequests: adminNotes || undefined,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dailyTour: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        cabin: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        bookedExcursions: {
          include: {
            excursion: true,
          },
        },
        payment: true,
        guestDetails: true,
      },
    });

    // Add backward compatibility alias
    const mappedBooking = {
      ...booking,
      dahabiya: booking.dailyTour,
    };

    return NextResponse.json(mappedBooking);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}