import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema for dahabiya creation/update
const dahabiyaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  pricePerDay: z.number().positive("Price must be positive"),
  capacity: z.number().positive("Capacity must be positive"),
  cabins: z.number().optional(),
  crew: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  yearBuilt: z.number().optional(),
  mainImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  specificationsImage: z.string().optional(),
  videoUrl: z.string().optional(),
  virtualTourUrl: z.string().optional(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  diningOptions: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  routes: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  category: z.enum(['LUXURY', 'PREMIUM']).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
  itineraryIds: z.array(z.string()).optional(),
});

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/dahabiyas - List all dahabiyas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const activeOnly = searchParams.get("active") === "true";

    const skip = (page - 1) * limit;

    const where = activeOnly ? { isActive: true } : {};

    const [dahabiyas, total] = await Promise.all([
      prisma.dahabiya.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.dahabiya.count({ where }),
    ]);

    return NextResponse.json({
      dahabiyas,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching dahabiyas:", error);
    return NextResponse.json(
      { error: "Failed to fetch dahabiyas" },
      { status: 500 }
    );
  }
}

// POST /api/dahabiyas - Create new dahabiya
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    console.log('POST /api/dahabiyas - Received body:', JSON.stringify(body, null, 2));

    // Convert string numbers to actual numbers
    const processedBody = {
      ...body,
      pricePerDay: body.pricePerDay ? Number(body.pricePerDay) : undefined,
      capacity: body.capacity ? Number(body.capacity) : undefined,
      cabins: body.cabins ? Number(body.cabins) : undefined,
      crew: body.crew ? Number(body.crew) : undefined,
      length: body.length ? Number(body.length) : undefined,
      width: body.width ? Number(body.width) : undefined,
      yearBuilt: body.yearBuilt ? Number(body.yearBuilt) : undefined,
      rating: body.rating ? Number(body.rating) : undefined,
      reviewCount: body.reviewCount ? Number(body.reviewCount) : undefined,
    };

    console.log('POST /api/dahabiyas - Processed body:', JSON.stringify(processedBody, null, 2));

    const validatedData = dahabiyaSchema.parse(processedBody);

    // Generate unique slug
    const baseSlug = generateSlug(validatedData.name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.dahabiya.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Determine if provided amenity identifiers look like IDs (cuid)
    const amenityIds = (validatedData.amenities || []).filter((a) => /^c[a-z0-9]{24,25}$/i.test(a));
    const amenityNames = (validatedData.amenities || []).filter((a) => !/^c[a-z0-9]{24,25}$/i.test(a));

    // Prepare creation data for Dahabiya model
    const createData: any = {
      name: validatedData.name,
      description: validatedData.description,
      summary: validatedData.shortDescription ?? null,
      capacity: validatedData.capacity,
      cabins: validatedData.cabins ?? 0,
      crew: validatedData.crew ?? null,
      length: validatedData.length ?? null,
      imageCover: validatedData.mainImage ?? null,
      images: validatedData.gallery || [],
      amenities: amenityNames, // keep non-ID amenities as free-form list
      isActive: validatedData.isActive ?? true,
      isFeatured: validatedData.isFeatured ?? false,
      slug,
    };

    // Optionally connect Amenity items if IDs are provided
    if (amenityIds.length > 0) {
      createData.amenityItems = {
        connect: amenityIds.map((id: string) => ({ id }))
      };
    }

    const created = await prisma.dahabiya.create({
      data: createData,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating dahabiya:", error);
    return NextResponse.json(
      { error: "Failed to create dahabiya" },
      { status: 500 }
    );
  }
}
