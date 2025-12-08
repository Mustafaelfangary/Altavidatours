import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { DailyTourType, DailyTourCategory } from "@prisma/client";

const dailyTourSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  pricePerDay: z.number().positive(),
  capacity: z.number().positive(),
  type: z.enum(["STANDARD", "LUXURY", "PREMIUM", "BUDGET"]),
  category: z.enum(["DELUXE", "PREMIUM", "STANDARD", "LUXURY"]),
  images: z.array(z.string()).optional(),
  shipId: z.string().optional(),
  itineraryId: z.string(),
  advantages: z.string().optional(),
  meaning: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const dailyTour = await prisma.dailyTour.create({
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
        shipId: data.shipId,
        advantages: data.advantages || 'Comprehensive Egypt tour experience',
        meaning: data.meaning || 'Daily tour package in Egypt',
      },
      include: {
        images: true,
        itinerary: true,
      },
    });

    return NextResponse.json(dailyTour);
  } catch (error) {
    console.error('Error creating daily tour:', error);
    return NextResponse.json({ error: 'Failed to create daily tour' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") as DailyTourType | null;
    const category = searchParams.get("category") as DailyTourCategory | null;

    const skip = (page - 1) * limit;

    const where = {
      ...(type ? { type } : {}),
      ...(category ? { category } : {}),
    };

    const [dailyTours, total] = await Promise.all([
      prisma.dailyTour.findMany({
        where,
        include: {
          images: true,
          ship: true,
          itinerary: true,
          reviews: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.dailyTour.count({ where }),
    ]);

    const formattedDailyTours = dailyTours.map((d) => ({
      ...d,
      averageRating:
        d.reviews.length > 0
          ? d.reviews.reduce((acc, r) => acc + r.rating, 0) / d.reviews.length
          : 0,
    }));

    return NextResponse.json({
      dailyTours: formattedDailyTours,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching daily tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily tours' },
      { status: 500 }
    );
  }
}
