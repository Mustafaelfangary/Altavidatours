import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/quick-stats - Get quick dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts in parallel
    const [
      pendingReviews,
      pendingBookings,
      totalUsers,
      totalItineraries,
      recentBookings,
      recentReviews,
      recentUsers
    ] = await Promise.all([
      prisma.review.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.booking.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.itinerary.count().catch(() => 0),
      prisma.booking.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      }).catch(() => []),
      prisma.review.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      }).catch(() => []),
      prisma.user.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: { name: true, email: true, createdAt: true }
      }).catch(() => [])
    ]);

    // Create recent activity feed
    const recentActivity = [];

    // Add recent bookings
    recentBookings.forEach(booking => {
      recentActivity.push({
        id: `booking-${booking.id}`,
        type: 'booking',
        message: `New booking from ${booking.user?.name || 'Guest'}`,
        timestamp: booking.createdAt.toISOString(),
        status: booking.status === 'CONFIRMED' ? 'success' : 'info'
      });
    });

    // Add recent reviews
    recentReviews.forEach(review => {
      recentActivity.push({
        id: `review-${review.id}`,
        type: 'review',
        message: `New ${review.rating}-star review from ${review.user?.name || 'Guest'}`,
        timestamp: review.createdAt.toISOString(),
        status: review.status === 'APPROVED' ? 'success' : 'warning'
      });
    });

    // Add recent users
    recentUsers.forEach(user => {
      recentActivity.push({
        id: `user-${user.email}`,
        type: 'user',
        message: `New user registered: ${user.name || user.email}`,
        timestamp: user.createdAt.toISOString(),
        status: 'info'
      });
    });

    // Sort by timestamp (most recent first)
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      pendingReviews,
      pendingBookings,
      totalUsers,
      totalItineraries,
      recentActivity: recentActivity.slice(0, 10) // Limit to 10 most recent
    });
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    return NextResponse.json({ 
      pendingReviews: 0,
      pendingBookings: 0,
      totalUsers: 0,
      totalItineraries: 0,
      recentActivity: []
    });
  }
}