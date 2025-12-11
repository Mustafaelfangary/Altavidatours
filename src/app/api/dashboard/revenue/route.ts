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

    const revenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({
      totalRevenue: revenue._sum.amount || 0,
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

