import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Ensure dynamic behavior and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const itineraries = await prisma.itinerary.findMany({
      where: { isActive: true },
      orderBy: [{ createdAt: 'desc' }]
    });

    const res = NextResponse.json(itineraries);
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    res.headers.set('Surrogate-Control', 'no-store');
    res.headers.set('ETag', `"${Date.now()}"`);
    res.headers.set('Last-Modified', new Date().toUTCString());
    return res;
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Generate slug from name if not provided
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const itinerary = await prisma.itinerary.create({
      data: {
        title: data.name,
        slug: slug,
        description: data.description,
        duration: parseInt(data.durationDays),
        days: Array.isArray(data.days) ? data.days : [],
        tourType: data.tourType || null,
        destination: data.destination || null,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        days: true,
        tourType: true,
        destination: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json({ error: 'Failed to create itinerary' }, { status: 500 });
  }
}