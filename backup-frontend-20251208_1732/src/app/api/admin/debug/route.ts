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

    // Collect debug information
    const debugInfo = {
      timestamp: new Date().toISOString(),
      session: {
        user: session.user,
        role: session.user.role,
        authenticated: !!session
      },
      database: {
        status: 'checking...'
      },
      counts: {},
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
        hasNextAuth: !!process.env.NEXTAUTH_SECRET
      },
      adminRoutes: [
        '/admin',
        '/admin/itineraries',
        '/admin/itineraries/new',
        '/admin/packages',
        '/admin/website',
        '/admin/website/itineraries',
        '/admin/users',
        '/admin/bookings',
        '/admin/gallery',
        '/admin/media',
        '/admin/settings'
      ],
      apiRoutes: [
        '/api/admin/itineraries',
        '/api/admin/page-content/itineraries',
        '/api/admin/users',
        '/api/admin/bookings',
        '/api/website-content'
      ]
    };

    try {
      // Test database connection and get counts
      const [
        itinerariesCount,
        usersCount,
        bookingsCount,
        pageContentCount
      ] = await Promise.all([
        prisma.itinerary.count().catch(() => 0),
        prisma.user.count().catch(() => 0),
        prisma.booking.count().catch(() => 0),
        prisma.pageContent.count().catch(() => 0)
      ]);

      debugInfo.database.status = 'connected';
      debugInfo.counts = {
        itineraries: itinerariesCount,
        users: usersCount,
        bookings: bookingsCount,
        pageContent: pageContentCount
      };

    } catch (dbError) {
      debugInfo.database.status = 'error';
      debugInfo.database.error = dbError instanceof Error ? dbError.message : 'Unknown database error';
    }

    return NextResponse.json(debugInfo, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}