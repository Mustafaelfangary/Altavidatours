import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current date for monthly calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all statistics in parallel
    const [
      totalBookings,
      totalUsers,
      totalDahabiyat,
      totalPackages,
      totalContacts,
      totalMediaAssets,
      totalReviews,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      currentMonthBookings,
      lastMonthBookings,
      totalRevenue,
      currentMonthRevenue,
      lastMonthRevenue,
      averageRating,
      recentBookings
    ] = await Promise.all([
      // Total counts
      prisma.booking.count(),
      prisma.user.count({ where: { role: { not: "ADMIN" } } }),
      prisma.dahabiya.count(),
      prisma.package.count(),
      prisma.contact.count(),
      prisma.mediaAsset.count(),
      prisma.review.count(),

      // Booking status counts
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),

      // Monthly booking counts for growth calculation
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),

      // Revenue calculations
      prisma.booking.aggregate({
        _sum: {
          totalPrice: true
        },
        where: {
          status: { in: ["CONFIRMED", "COMPLETED"] }
        }
      }),
      prisma.booking.aggregate({
        _sum: {
          totalPrice: true
        },
        where: {
          status: { in: ["CONFIRMED", "COMPLETED"] },
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      prisma.booking.aggregate({
        _sum: {
          totalPrice: true
        },
        where: {
          status: { in: ["CONFIRMED", "COMPLETED"] },
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),

      // Average rating
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      }),

      // Recent bookings with user and dahabiya details
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
          },
          dahabiya: {
            select: {
              name: true
            }
          }
        }
      })
    ]);

    // Calculate growth percentages
    const bookingGrowth = lastMonthBookings > 0 
      ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 
      : currentMonthBookings > 0 ? 100 : 0;

    const revenueGrowth = lastMonthRevenue._sum.totalPrice && Number(lastMonthRevenue._sum.totalPrice) > 0
      ? ((Number(currentMonthRevenue._sum.totalPrice || 0) - Number(lastMonthRevenue._sum.totalPrice)) / Number(lastMonthRevenue._sum.totalPrice)) * 100
      : currentMonthRevenue._sum.totalPrice && Number(currentMonthRevenue._sum.totalPrice) > 0 ? 100 : 0;

    // Format recent bookings
    const formattedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      customer: booking.user.name || booking.user.email || 'Unknown Customer',
      dahabiya: booking.dahabiya?.name || 'No Dahabiya',
      date: booking.startDate.toISOString().split('T')[0],
      amount: `$${Number(booking.totalPrice).toLocaleString()}`,
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()
    }));

    // Prepare response data
    const stats = {
      totalBookings,
      totalRevenue: Number(totalRevenue._sum.totalPrice || 0),
      totalUsers,
      totalDahabiyat,
      totalPackages,
      totalContacts,
      totalMediaAssets,
      totalReviews,
      averageRating: Number(averageRating._avg.rating || 0),
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      bookingGrowth: Math.round(bookingGrowth * 10) / 10, // Round to 1 decimal
      revenueGrowth: Math.round(revenueGrowth * 10) / 10, // Round to 1 decimal
      currentMonthBookings,
      lastMonthBookings,
      currentMonthRevenue: Number(currentMonthRevenue._sum.totalPrice || 0),
      lastMonthRevenue: Number(lastMonthRevenue._sum.totalPrice || 0),
      recentBookings: formattedRecentBookings
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}


