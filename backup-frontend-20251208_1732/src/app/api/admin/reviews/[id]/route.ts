import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/reviews/[id] - Update review status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const { status } = data;

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status',
        message: 'Status must be one of: PENDING, APPROVED, REJECTED' 
      }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
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
      }
    });

    return NextResponse.json({ 
      review: {
        id: updatedReview.id,
        customerName: updatedReview.user?.name || updatedReview.customerName || 'Anonymous',
        customerEmail: updatedReview.user?.email || updatedReview.customerEmail || '',
        rating: updatedReview.rating,
        title: updatedReview.title || 'No Title',
        content: updatedReview.content,
        status: updatedReview.status,
        packageName: updatedReview.package?.name,
        itineraryName: updatedReview.itinerary?.name,
        dahabiyaName: updatedReview.dahabiya?.name,
        createdAt: updatedReview.createdAt.toISOString(),
        updatedAt: updatedReview.updatedAt.toISOString()
      },
      message: 'Review updated successfully' 
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ 
      error: 'Failed to update review',
      message: 'An error occurred while updating the review' 
    }, { status: 500 });
  }
}

// DELETE /api/admin/reviews/[id] - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ 
      error: 'Failed to delete review',
      message: 'An error occurred while deleting the review' 
    }, { status: 500 });
  }
}