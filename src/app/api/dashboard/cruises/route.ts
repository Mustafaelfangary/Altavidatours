import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cruises = await prisma.cruise.findMany({
      include: {
        images: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cruises);
  } catch (error) {
    console.error("Failed to fetch cruises:", error);
    return NextResponse.json({ error: "Failed to fetch cruises" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    const cruise = await prisma.cruise.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        capacity: data.capacity,
        itinerary: data.itinerary || "",
      },
    });

    return NextResponse.json(cruise, { status: 201 });
  } catch (error) {
    console.error("Failed to create cruise:", error);
    return NextResponse.json({ error: "Failed to create cruise" }, { status: 500 });
  }
}

