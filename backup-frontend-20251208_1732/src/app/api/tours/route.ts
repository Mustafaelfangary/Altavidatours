// src/app/api/tours/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/tours - Get all tours with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        skip,
        take: limit,
        include: {
          categories: true,
          tags: true,
          guides: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tour.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tours,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

// POST /api/tours - Create a new tour
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate input with Zod
    const tourSchema = z.object({
      title: z.string().min(3).max(100),
      slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
      duration: z.number().min(1),
      maxGroupSize: z.number().min(1),
      difficulty: z.enum(['EASY', 'MEDIUM', 'DIFFICULT']),
      price: z.number().min(0),
      priceDiscount: z.number().min(0).optional(),
      summary: z.string().min(10),
      description: z.string().min(50),
      startLocation: z.object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]),
        address: z.string().min(3),
        description: z.string().min(3),
      }),
      locations: z.array(
        z.object({
          type: z.literal('Point'),
          coordinates: z.tuple([z.number(), z.number()]),
          address: z.string().min(3),
          description: z.string().min(3),
          day: z.number().min(1),
        })
      ),
      startDates: z.array(z.date().or(z.string())),
      images: z.array(z.string().url()),
      imageCover: z.string().url(),
      isActive: z.boolean().default(true),
      categoryIds: z.array(z.string().uuid()),
      tagNames: z.array(z.string().min(1)).optional(),
      guideIds: z.array(z.string().uuid()).optional(),
    });

    const validation = tourSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const {
      categoryIds,
      tagNames = [],
      guideIds = [],
      ...tourData
    } = validation.data;

    // Create tour with relations
    const tour = await prisma.$transaction(async (prisma) => {
      // Create or connect tags
      const tags = await Promise.all(
        tagNames.map((name) =>
          prisma.tag.upsert({
            where: { name },
            create: { name },
            update: {},
          })
        )
      );

      // Create tour
      const newTour = await prisma.tour.create({
        data: {
          ...tourData,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })),
          },
          guides: guideIds.length > 0 ? {
            connect: guideIds.map((id) => ({ id })),
          } : undefined,
        },
      });

      return newTour;
    });

    return NextResponse.json({ success: true, data: tour }, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}