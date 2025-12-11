import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const itineraries = await prisma.itinerary.findMany();
    console.log('Found itineraries:', itineraries);
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
} 

