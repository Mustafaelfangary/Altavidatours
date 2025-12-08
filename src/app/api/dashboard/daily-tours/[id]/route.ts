import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tour = await prisma.dailyTour.findUnique({
      where: { id },
      include: {
        itinerary: true,
        ship: true,
        images: true,
        cabins: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...tour,
      pricePerDay: Number(tour.pricePerDay),
    });
  } catch (error) {
    console.error("Failed to fetch tour:", error);
    return NextResponse.json({ error: "Failed to fetch tour" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const tour = await prisma.dailyTour.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        pricePerDay: data.pricePerDay,
        capacity: data.capacity,
        features: data.features || [],
        amenities: data.amenities || [],
        type: data.type,
        category: data.category,
        mainImageUrl: data.mainImageUrl,
        videoUrl: data.videoUrl,
        advantages: data.advantages,
        meaning: data.meaning,
        itineraryId: data.itineraryId,
        shipId: data.shipId,
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Failed to update tour:", error);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.dailyTour.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete tour:", error);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}

