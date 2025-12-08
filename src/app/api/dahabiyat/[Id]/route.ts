import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const dahabiyaSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  pricePerDay: z.number().positive(),
  capacity: z.number().positive(),
  type: z.enum(["STANDARD", "LUXURY", "PREMIUM", "BUDGET"]),
  category: z.enum(["DELUXE", "PREMIUM", "STANDARD", "LUXURY"]),
  images: z.array(z.string()).optional(),
  shipId: z.string().optional(),
  itineraryId: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { Id: id } = await params;
    const validated = dahabiyaSchema.parse(await request.json());

    const dahabiya = await prisma.$transaction(async (tx) => {
      if (validated.images) {
        await tx.dahabiyaImage.deleteMany({
          where: { dahabiyaId: id }
        });
      }

      return tx.dahabiya.update({
        where: { id },
        data: {
          name: validated.name,
          description: validated.description,
          pricePerDay: validated.pricePerDay,
          capacity: validated.capacity,
          type: validated.type as any,
          category: validated.category as any,
          shipId: validated.shipId,
          itineraryId: validated.itineraryId,
          images: validated.images
            ? {
                create: validated.images.map((url) => ({
                  url,
                  alt: validated.name,
                  category: 'INDOOR' as any,
                })),
              }
            : undefined,
        },
        include: {
          images: true,
          ship: true,
          itinerary: true,
        },
      });
    });

    return NextResponse.json(dahabiya);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update dahabiya" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    const { Id: id } = await params;
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id },
      include: {
        images: true,
        itinerary: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!dahabiya) {
      return NextResponse.json({ error: "Dahabiya not found" }, { status: 404 });
    }

    return NextResponse.json(dahabiya);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dahabiya" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { Id: id } = await params;
    const data = await request.json();
    const dahabiya = await prisma.dahabiya.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        pricePerDay: data.pricePerDay,
        capacity: data.capacity,
        features: data.features,
        type: data.type,
        category: data.category,
        amenities: data.amenities,
        itineraryId: data.itineraryId,
      },
      include: {
        images: true,
        itinerary: true,
      },
    });

    return NextResponse.json(dahabiya);
  } catch (error) {
    console.error('Error updating dahabiya:', error);
    return NextResponse.json({ error: 'Failed to update dahabiya' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    const { Id: id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for existing bookings
    const existingBookings = await prisma.booking.findMany({
      where: {
        dailyTourId: id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (existingBookings.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete dahabiya with active bookings. Please cancel or complete all bookings first.",
        },
        { status: 400 }
      );
    }

    // Delete the dahabiya
    await prisma.dahabiya.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dahabiya:', error);
    return NextResponse.json(
      { error: "Failed to delete dahabiya" },
      { status: 500 }
    );
  }
}
