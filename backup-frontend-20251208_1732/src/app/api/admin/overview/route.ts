import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication and authorization
    if (!session?.user || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current date for "today" calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch last logins for users (recent 10)
    const recentUsers = await prisma.user.findMany({
      where: {
        role: 'USER',
        updatedAt: { not: null }
      },
      select: {
        name: true,
        email: true,
        updatedAt: true,
        role: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    });

    // Fetch last logins for admins/managers
    const recentAdmins = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'MANAGER']
        },
        updatedAt: { not: null }
      },
      select: {
        name: true,
        email: true,
        updatedAt: true,
        role: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });

    // Fetch last booking
    const lastBooking = await prisma.booking.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        bookingReference: true,
        createdAt: true,
        totalPrice: true,
        status: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Fetch last signup
    const lastSignup = await prisma.user.findFirst({
      where: {
        role: 'USER'
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Fetch last content edit
    let lastContentEdit = null;
    try {
      const lastContent = await prisma.pageContent.findFirst({
        orderBy: {
          updatedAt: 'desc'
        },
        select: {
          page: true,
          section: true,
          updatedAt: true
        }
      });

      if (lastContent) {
        lastContentEdit = {
          page: lastContent.page,
          section: lastContent.section || 'General',
          updatedAt: lastContent.updatedAt,
          updatedBy: 'Admin'
        };
      }
    } catch (error) {
      console.log('PageContent table may not exist');
    }

    // Fetch last memory share
    let lastMemoryShare = null;
    try {
      const lastMemory = await prisma.userMemory.findFirst({
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          title: true,
          createdAt: true,
          userId: true
        },
        take: 1
      });

      if (lastMemory) {
        const memoryUser = await prisma.user.findUnique({
          where: { id: lastMemory.userId },
          select: { name: true }
        });
        
        lastMemoryShare = {
          title: lastMemory.title,
          sharedBy: memoryUser?.name || 'Anonymous',
          createdAt: lastMemory.createdAt
        };
      }
    } catch (error) {
      console.log('UserMemory table may not exist');
    }

    // Fetch today's bookings count
    const totalBookingsToday = await prisma.booking.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Fetch today's signups count
    const totalSignupsToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: today
        },
        role: 'USER'
      }
    });

    // Fetch pending bookings count
    const pendingBookings = await prisma.booking.count({
      where: {
        status: 'PENDING'
      }
    });

    // Fetch active users (users who logged in within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: sevenDaysAgo
        },
        role: 'USER'
      }
    });

    // Fetch chatbot stats
    let chatbotStats = {
      conversationsToday: 0,
      totalConversations: 0
    };

    try {
      const conversationsToday = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM "ChatConversation"
        WHERE "createdAt" >= ${today}
      `;

      const totalConversations = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM "ChatConversation"
      `;

      chatbotStats = {
        conversationsToday: Number(conversationsToday[0]?.count || 0),
        totalConversations: Number(totalConversations[0]?.count || 0)
      };
    } catch (error) {
      console.log('ChatConversation table may not exist yet');
    }

    // Prepare response data
    const overviewData = {
      lastLogins: {
        users: recentUsers.map(u => ({
          name: u.name || 'Unknown',
          email: u.email || '',
          lastLogin: u.updatedAt,
          role: u.role
        })),
        admins: recentAdmins.map(a => ({
          name: a.name || 'Unknown',
          email: a.email || '',
          lastLogin: a.updatedAt,
          role: a.role
        }))
      },
      lastBooking: lastBooking ? {
        bookingReference: lastBooking.bookingReference,
        guestName: lastBooking.user?.name || 'Guest',
        createdAt: lastBooking.createdAt,
        totalPrice: Number(lastBooking.totalPrice),
        status: lastBooking.status
      } : null,
      lastSignup: lastSignup ? {
        name: lastSignup.name || 'Unknown',
        email: lastSignup.email || '',
        createdAt: lastSignup.createdAt
      } : null,
      lastContentEdit,
      lastMemoryShare,
      recentActivity: {
        totalBookingsToday,
        totalSignupsToday,
        pendingBookings,
        activeUsers
      },
      chatbotStats
    };

    return NextResponse.json(overviewData);

  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview data' },
      { status: 500 }
    );
  }
}
