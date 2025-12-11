import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        UserWishlist: {
          include: {
            dailyTours: {
              include: {
                images: true,
                cabins: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Extract dailyTours from the UserWishlist relation
    const wishlist = user.UserWishlist.map(item => item.dailyTours);
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
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
    const { dailyTourId } = body;

    if (!dailyTourId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Check if dailyTour exists
    const dailyTour = await prisma.dailyTour.findUnique({
      where: { id: dailyTourId },
    });

    if (!dailyTour) {
      return new NextResponse('Daily tour not found', { status: 404 });
    }

    // Add dailyTour to user's wishlist
    await prisma.userWishlist.create({
      data: {
        A: dailyTourId,
        B: session.user.id,
      },
    });

    // Fetch updated wishlist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        UserWishlist: {
          include: {
            dailyTours: {
              include: {
                images: true,
                cabins: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract dailyTours from the UserWishlist relation
    const wishlist = user?.UserWishlist.map(item => item.dailyTours) || [];
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
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
    const dailyTourId = searchParams.get('dailyTourId');

    if (!dailyTourId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Remove dailyTour from user's wishlist
    await prisma.userWishlist.delete({
      where: {
        A_B: {
          A: dailyTourId,
          B: session.user.id,
        },
      },
    });

    // Fetch updated wishlist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        UserWishlist: {
          include: {
            dailyTours: {
              include: {
                images: true,
                cabins: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract dailyTours from the UserWishlist relation
    const wishlist = user?.UserWishlist.map(item => item.dailyTours) || [];
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

