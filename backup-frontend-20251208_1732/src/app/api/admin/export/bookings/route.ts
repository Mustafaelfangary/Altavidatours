import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
            name: true,
            email: true,
            phone: true
          }
        },
        package: {
          select: {
            name: true
          }
        },
        itinerary: {
          select: {
            name: true
          }
        },
        dahabiya: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Create CSV content
    const csvHeader = 'Booking ID,Customer Name,Customer Email,Customer Phone,Status,Total Amount,Travel Date,Guests,Package,Itinerary,Dahabiya,Booking Date\n';
    const csvRows = bookings.map(booking => {
      return [
        booking.id,
        `"${booking.user?.name || booking.customerName || 'Unknown'}"`,
        booking.user?.email || booking.customerEmail || '',
        booking.user?.phone || booking.customerPhone || '',
        booking.status,
        booking.totalAmount || 0,
        booking.travelDate?.toISOString().split('T')[0] || '',
        booking.numberOfGuests || 1,
        `"${booking.package?.name || ''}"`,
        `"${booking.itinerary?.name || ''}"`,
        `"${booking.dahabiya?.name || ''}"`,
        booking.createdAt.toISOString().split('T')[0]
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bookings-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting bookings:', error);
    return NextResponse.json({ error: 'Failed to export bookings' }, { status: 500 });
  }
}