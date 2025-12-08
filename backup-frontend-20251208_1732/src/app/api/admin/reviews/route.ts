import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/reviews - Get all reviews
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        package: {
          select: {
            name: true
          }
        },
        itinerary: {
          select: {
            name: true
          }
        },
        dahabiya: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' }
      ]
    });

    // Transform reviews for frontend
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      customerName: review.user?.name || review.customerName || 'Anonymous',
      customerEmail: review.user?.email || review.customerEmail || '',
      rating: review.rating,
      title: review.title || 'No Title',
      content: review.content,
      status: review.status,
      packageName: review.package?.name,
      itineraryName: review.itinerary?.name,
      dahabiyaName: review.dahabiya?.name,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString()
    }));

    return NextResponse.json({ reviews: transformedReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}