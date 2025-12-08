import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!dahabiya) {
      return new NextResponse("Dahabiya not found", { status: 404 });
    }

    return NextResponse.json(dahabiya);
  } catch (error) {
    console.error("[DAHABIYA_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    console.log('[DAHABIYA_PUT] Id:', id);
    console.log('[DAHABIYA_PUT] Body:', body);
    const {
      name,
      description,
      shortDescription,
      pricePerDay,
      capacity,
      features,
      type,
      category,
      amenities,
      images,
      itineraryDays,
    } = body;

    // Clean up image URLs
    const cleanedImages = body.images.map((image: any) => {
      let cleanUrl = image.url.trim();
      
      // If it's a local path, ensure it starts with /images/
      if (!cleanUrl.startsWith('http')) {
        // Remove any leading slashes
        cleanUrl = cleanUrl.replace(/^\/+/, '');
        
        // If it doesn't start with images/, add it
        if (!cleanUrl.startsWith('images/')) {
          cleanUrl = `images/${cleanUrl}`;
        }
        
        // Add leading slash for absolute path
        cleanUrl = `/${cleanUrl}`;
        
        // Replace spaces with hyphens
        cleanUrl = cleanUrl.replace(/\s+/g, '-');
        
        // Ensure it has a valid image extension
        if (!cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          cleanUrl = `${cleanUrl}.jpg`;
        }
      }
      
      return {
        url: cleanUrl,
        alt: image.alt,
        category: image.category || 'INDOOR' // Default to INDOOR if category is not provided
      };
    });

    // Fetch the current itineraryId for this Dahabiya
    const dahabiya = await prisma.dahabiya.findUnique({
      where: { id },
      select: { itineraryId: true },
    });
    let itineraryId = dahabiya?.itineraryId;

    // If no itinerary exists, create one
    if (!itineraryId) {
      const newItinerary = await prisma.itinerary.create({
        data: {
          name: `${name} Itinerary`,
          description: `Itinerary for ${name}`,
          durationDays: itineraryDays?.length || 1,
        },
      });
      itineraryId = newItinerary.id;
      await prisma.dahabiya.update({ where: { id }, data: { itineraryId } });
    }

    // Remove all existing days and their images for this itinerary
    if (itineraryId) {
      const existingDays = await prisma.itineraryDay.findMany({ where: { itineraryId } });
      for (const day of existingDays) {
        await prisma.image.deleteMany({ where: { itineraryDayId: day.id } });
      }
      await prisma.itineraryDay.deleteMany({ where: { itineraryId } });
    }

    // Create new itinerary days and their images
    if (itineraryDays && itineraryId) {
      for (const [idx, day] of itineraryDays.entries()) {
        const createdDay = await prisma.itineraryDay.create({
          data: {
            dayNumber: idx + 1,
            title: day.title,
            description: day.description,
            itineraryId,
            images: {
              create: (day.images || []).map((img: any) => ({ 
                url: img.url, 
                alt: img.alt || '',
                category: 'INDOOR', // Default category for itinerary day images
              })),
            },
          },
        });
      }
    }

    // Update the dahabiya
    const updatedDahabiya = await prisma.dahabiya.update({
      where: { id },
      data: {
        name,
        description,
        shortDescription,
        pricePerDay,
        capacity,
        features,
        type,
        category,
        amenities,
        images: {
          deleteMany: {},
          create: cleanedImages,
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedDahabiya);
  } catch (error) {
    console.error("[DAHABIYA_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.dahabiya.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DAHABIYA_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 