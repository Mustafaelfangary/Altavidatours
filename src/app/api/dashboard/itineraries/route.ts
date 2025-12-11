import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const itineraries = await prisma.itinerary.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, durationDays } = body;

    if (!name || !description || !durationDays) {
      return NextResponse.json({ error: 'Name, description, and duration are required' }, { status: 400 });
    }

    const newItinerary = await prisma.itinerary.create({
      data: {
        name,
        description,
        durationDays,
      },
    });

    return NextResponse.json(newItinerary, { status: 201 });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json({ error: 'Failed to create itinerary' }, { status: 500 });
  }
}

