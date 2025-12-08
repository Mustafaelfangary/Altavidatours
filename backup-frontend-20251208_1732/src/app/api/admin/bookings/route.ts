import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/bookings - Get all bookings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            mainImageUrl: true,
            price: true
          }
        },
        travelService: {
          select: {
            id: true,
            name: true,
            mainImage: true,
            pricePerDay: true
          }
        },
        payment: {
          select: {
            amount: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform bookings for frontend - return full booking objects with relations
    const transformedBookings = bookings.map(booking => ({
      ...booking,
      totalPrice: booking.totalPrice ? parseFloat(booking.totalPrice.toString()) : 0,
      user: booking.user || { id: 'guest', name: 'Guest', email: 'N/A', phone: null },
      bookingReference: booking.bookingReference || booking.id.slice(0, 8).toUpperCase(),
    }));

    return NextResponse.json({ 
      bookings: transformedBookings,
      total: transformedBookings.length 
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}