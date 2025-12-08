import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packageData = await prisma.package.findUnique({
      where: { id },
      include: {
        itineraryDays: {
          include: {
            images: true,
          },
          orderBy: { dayNumber: 'asc' },
        },
        selectedDahabiya: {
          select: {
            id: true,
            name: true,
            pricePerDay: true,
          },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      shortDescription,
      price,
      durationDays,
      mainImageUrl,
      itineraryDays,
      packageType,
      selectedDahabiyaId,
      cairoNights,
      dahabiyaNights,
      maxGuests,
      highlights,
    } = body;

    // First, delete existing itinerary days
    await prisma.packageItineraryDay.deleteMany({
      where: { packageId: id },
    });

    // Update the package with new data
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        shortDescription,
        price,
        durationDays,
        mainImageUrl,
        packageType: packageType || 'CAIRO_DAHABIYA',
        selectedDahabiyaId,
        cairoNights: cairoNights || 0,
        dahabiyaNights: dahabiyaNights || 0,
        maxGuests: maxGuests || 12,
        highlights: highlights || [],
        itineraryDays: {
          create: (itineraryDays || []).map((day: any, idx: number) => ({
            dayNumber: idx + 1,
            title: day.title,
            description: day.description,
            location: day.location || '',
            activities: day.activities || [],
            images: {
              create: (day.images || []).map((img: any) => ({ 
                url: img.url, 
                alt: img.alt || '',
              })),
            },
          })),
        },
      },
      include: {
        itineraryDays: { 
          include: { images: true },
          orderBy: { dayNumber: 'asc' },
        },
        selectedDahabiya: {
          select: {
            id: true,
            name: true,
            pricePerDay: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
