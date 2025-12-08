import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch statistics in parallel
    const [
      totalUsers,
      totalBookings,
      activeTours,
      upcomingTours,
      recentBookings,
      recentUsers
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total bookings
      prisma.booking.count(),
      
      // Active tours (bookings with start date in the future and status not cancelled)
      prisma.booking.count({
        where: {
          startDate: {
            gte: new Date()
          },
          status: {
            not: 'CANCELLED'
          }
        }
      }),
      
      // Upcoming tours (bookings in the next 30 days)
      prisma.booking.count({
        where: {
          startDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
          },
          status: {
            not: 'CANCELLED'
          }
        }
      }),
      
      // Recent bookings (last 5)
      prisma.booking.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      
      // Recent users (last 5)
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      })
    ]);

    // Calculate total revenue
    const revenueResult = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        status: 'CONFIRMED'
      }
    });

    const totalRevenue = revenueResult._sum.totalPrice || 0;

    return NextResponse.json({
      totalUsers,
      totalBookings,
      totalRevenue,
      activeTours,
      upcomingTours,
      recentBookings,
      recentUsers,
      success: true
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
