import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { 
      name, 
      description, 
      shortDescription, 
      pricePerDay, 
      capacity, 
      features, 
      type, 
      category, 
      amenities, 
      images = [] 
    } = data;

    const cruise = await prisma.dahabiya.update({
      where: { id: params.id },
      data: {
        name,
        description,
        shortDescription,
        pricePerDay,
        capacity,
        features,
        type,
        category,
        amenities,
        images: {
          deleteMany: {},
          create: images.map((img: { url: string; alt: string }) => ({
            url: img.url,
            alt: img.alt,
            category: 'INDOOR',
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(cruise, { status: 200 });
  } catch (error) {
    console.error("Error updating cruise:", error);
    return NextResponse.json(
      { 
        error: "Failed to update cruise",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}