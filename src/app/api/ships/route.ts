import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET /api/ships
export async function GET() {
  try {
    const ships = await prisma.ship.findMany();
    return NextResponse.json(ships);
  } catch (error) {
    console.error('Error fetching ships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ships' }, 
      { status: 500 }
    );
  }
}

// POST /api/ships
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const data = await request.json();
    
    if (!data.name || !data.imageUrl) {
      return NextResponse.json(
        { error: 'Name and imageUrl are required' },
        { status: 400 }
      );
    }

    const ship = await prisma.ship.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        capacity: data.capacity || 0,
        yearBuilt: data.yearBuilt || new Date().getFullYear(),
        specifications: data.specifications || {},
      },
    });

    return NextResponse.json(ship, { status: 201 });
  } catch (error) {
    console.error('Error creating ship:', error);
    return NextResponse.json(
      { error: 'Failed to create ship' },
      { status: 500 }
    );
  }
}

