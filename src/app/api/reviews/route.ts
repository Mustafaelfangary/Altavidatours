import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  dailyTourId: z.string().optional(),
  dahabiyaId: z.string().optional(), // Legacy support
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = reviewSchema.parse(body);

    // Support both legacy dahabiyaId and new dailyTourId
    const dailyTourId = validated.dailyTourId || validated.dahabiyaId;

    if (!dailyTourId) {
      return NextResponse.json(
        { error: "dailyTourId is required" },
        { status: 400 }
      );
    }

    // Check if user has a confirmed booking for this daily tour
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        dailyTourId: dailyTourId,
        status: "CONFIRMED",
      },
    });

    if (!hasBooking) {
      return NextResponse.json(
        { error: "You can only review tours you have booked" },
        { status: 403 }
      );
    }

    // Check if user has already reviewed this daily tour
    const existingReview = await prisma.review.findFirst({
      where: {
        dailyTourId: dailyTourId,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this tour" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        dailyTourId: dailyTourId,
        rating: validated.rating,
        comment: validated.comment,
        userId: session.user.id,
      },
    });

    // Update daily tour average rating
    const allReviews = await prisma.review.findMany({
      where: { dailyTourId: dailyTourId },
    });

    const averageRating =
      allReviews.reduce((sum, review) => sum + review.rating, 0) /
      allReviews.length;

    await prisma.dailyTour.update({
      where: { id: dailyTourId },
      data: { rating: averageRating },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


