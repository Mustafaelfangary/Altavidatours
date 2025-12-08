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
    const dahabiyaId = searchParams.get('dahabiyaId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!dahabiyaId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const where = {
      dahabiyaId,
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    };

    const dates = await prisma.dahabiyaAvailabilityDate.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(dates);
  } catch (error) {
    console.error('Failed to fetch availability dates:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { dahabiyaId, dates } = body;

    if (!dahabiyaId || !dates || !Array.isArray(dates)) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Create availability dates in bulk
    const createdDates = await prisma.dahabiyaAvailabilityDate.createMany({
      data: dates.map((date: { date: string; price: number }) => ({
        dahabiyaId,
        date: new Date(date.date),
        available: true,
        price: date.price,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(createdDates);
  } catch (error) {
    console.error('Failed to create availability dates:', error);
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
    const { id, available } = body;

    if (!id || typeof available !== 'boolean') {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const date = await prisma.dahabiyaAvailabilityDate.update({
      where: { id },
      data: { available },
    });

    return NextResponse.json(date);
  } catch (error) {
    console.error('Failed to update availability date:', error);
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

    await prisma.dahabiyaAvailabilityDate.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete availability date:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}