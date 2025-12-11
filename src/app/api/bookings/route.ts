import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { Status } from "@prisma/client";

const bookingSchema = z.object({
  dailyTourId: z.string().min(1, "Daily tour ID is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  guests: z.number().min(1, "At least 1 guest is required"),
  specialRequests: z.string().optional(),
  totalPrice: z.number({
    required_error: "Total price is required",
    invalid_type_error: "Total price must be a number"
  }).min(0, "Total price must be positive")
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to make a booking" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Received booking request:", body);

    // Validate the request body
    const validatedBooking = bookingSchema.parse({
      ...body,
      totalPrice: Number(body.totalPrice) || 0
    });
    console.log("Validated booking data:", validatedBooking);

    // Check if daily tour exists
    const dailyTour = await prisma.dailyTour.findUnique({
      where: { id: validatedBooking.dailyTourId },
    });

    if (!dailyTour) {
      return NextResponse.json({ error: "Daily tour not found" }, { status: 404 });
    }

    // Check availability
    const existingBookings = await prisma.booking.count({
      where: {
        dailyTourId: validatedBooking.dailyTourId,
        status: "CONFIRMED",
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(validatedBooking.startDate) } },
              { endDate: { gte: new Date(validatedBooking.startDate) } },
            ],
          },
          {
            AND: [
              { startDate: { lte: new Date(validatedBooking.endDate) } },
              { endDate: { gte: new Date(validatedBooking.endDate) } },
            ],
          },
        ],
      },
    });

    if (existingBookings > 0) {
      return NextResponse.json(
        { error: "Selected dates are not available" },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        ...validatedBooking,
        dailyTourId: validatedBooking.dailyTourId,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const allBookings = searchParams.get('all') === 'true';

    // If requesting all bookings (admin only)
    if (allBookings) {
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Not authorized' },
          { status: 403 }
        );
      }
      
      const bookings = await prisma.booking.findMany({
        include: {
          dailyTour: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return NextResponse.json(bookings);
    }

    // Get bookings for the current user
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        dailyTour: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}



