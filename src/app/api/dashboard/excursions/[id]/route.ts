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

    const excursion = await prisma.excursion.findUnique({
      where: { id },
    });

    if (!excursion) {
      return NextResponse.json({ error: "Excursion not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...excursion,
      price: Number(excursion.price),
    });
  } catch (error) {
    console.error("Failed to fetch excursion:", error);
    return NextResponse.json({ error: "Failed to fetch excursion" }, { status: 500 });
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

    const excursion = await prisma.excursion.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type,
      },
    });

    return NextResponse.json(excursion);
  } catch (error) {
    console.error("Failed to update excursion:", error);
    return NextResponse.json({ error: "Failed to update excursion" }, { status: 500 });
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

    await prisma.excursion.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete excursion:", error);
    return NextResponse.json({ error: "Failed to delete excursion" }, { status: 500 });
  }
}

