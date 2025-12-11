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

    const [
      totalBookings,
      totalRevenue,
      totalUsers,
      totalDahabiyat,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.user.count(),
      prisma.dahabiya.count(),
    ]);

    return NextResponse.json({
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalUsers,
      totalDahabiyat,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

