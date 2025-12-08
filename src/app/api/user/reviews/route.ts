import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId: session.user.id },
        include: {
          dailyTour: {
            select: {
              id: true,
              name: true,
              images: {
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { userId: session.user.id },
      }),
    ]);

    // Map for backward compatibility
    const mappedReviews = reviews.map(review => ({
      ...review,
      dahabiya: review.dailyTour,
    }));

    return NextResponse.json({
      reviews: mappedReviews,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { dahabiyaId, dailyTourId, rating, comment } = body;

    // Support both legacy dahabiyaId and new dailyTourId
    const tourId = dailyTourId || dahabiyaId;

    // Verify the user has booked this tour
    const booking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        dailyTourId: tourId,
        status: 'COMPLETED',
      },
    });

    if (!booking) {
      return new NextResponse(
        'You can only review tours you have completed',
        { status: 400 }
      );
    }

    // Check if user has already reviewed this tour
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        dailyTourId: tourId,
      },
    });

    if (existingReview) {
      return new NextResponse(
        'You have already reviewed this tour',
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        dailyTourId: tourId,
        rating,
        comment,
      },
      include: {
        dailyTour: {
          select: {
            id: true,
            name: true,
            images: {
              take: 1,
            },
          },
        },
      },
    });

    // Map for backward compatibility
    const mappedReview = {
      ...review,
      dahabiya: review.dailyTour,
    };

    return NextResponse.json(mappedReview);
  } catch (error) {
    console.error('Failed to create review:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, rating, comment } = body;

    if (!id) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Verify the review belongs to the user
    const review = await prisma.review.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!review) {
      return new NextResponse('Review not found', { status: 404 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
        updatedAt: new Date(),
      },
      include: {
        dailyTour: {
          select: {
            id: true,
            name: true,
            images: {
              take: 1,
            },
          },
        },
      },
    });

    // Map for backward compatibility
    const mappedReview = {
      ...updatedReview,
      dahabiya: updatedReview.dailyTour,
    };

    return NextResponse.json(mappedReview);
  } catch (error) {
    console.error('Failed to update review:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Verify the review belongs to the user
    const review = await prisma.review.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!review) {
      return new NextResponse('Review not found', { status: 404 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}