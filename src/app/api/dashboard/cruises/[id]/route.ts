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

    const cruise = await prisma.cruise.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!cruise) {
      return NextResponse.json({ error: "Cruise not found" }, { status: 404 });
    }

    return NextResponse.json(cruise);
  } catch (error) {
    console.error("Failed to fetch cruise:", error);
    return NextResponse.json({ error: "Failed to fetch cruise" }, { status: 500 });
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

    const cruise = await prisma.cruise.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        capacity: data.capacity,
        itinerary: data.itinerary,
      },
    });

    return NextResponse.json(cruise);
  } catch (error) {
    console.error("Failed to update cruise:", error);
    return NextResponse.json({ error: "Failed to update cruise" }, { status: 500 });
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

    await prisma.cruise.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete cruise:", error);
    return NextResponse.json({ error: "Failed to delete cruise" }, { status: 500 });
  }
}

