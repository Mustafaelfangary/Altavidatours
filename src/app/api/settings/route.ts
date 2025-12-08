import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from 'next/cache';

const contentBlockSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["IMAGE", "VIDEO", "DOCUMENT"]).optional(),
  contentType: z.enum([
    "TEXT",
    "TEXTAREA",
    "RICH_TEXT",
    "IMAGE",
    "VIDEO",
    "GALLERY",
    "TESTIMONIAL",
    "FEATURE",
    "CTA"
  ]),
  page: z.string().min(1),
  section: z.string().min(1),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    let whereClause: any = { isActive: true };
    if (page) whereClause.page = page;
    if (section) whereClause.section = section;

    const contentBlocks = await prisma.websiteContent.findMany({
      where: whereClause,
      orderBy: [
        { page: 'asc' },
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    // For backward compatibility, also return as key-value object
    const contentObject = contentBlocks.reduce((acc, block) => {
      acc[block.key] = block.content || block.mediaUrl || '';
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      blocks: contentBlocks, // For ContentManager component
      contentBlocks, // For backward compatibility
      settings: contentObject // For backward compatibility
    });
  } catch (error) {
    console.error('Failed to fetch content blocks:', error);
    return NextResponse.json({ error: "Failed to fetch content blocks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = contentBlockSchema.parse(body);

    const contentBlock = await prisma.websiteContent.create({
      data: {
        key: validated.key,
        title: validated.title,
        content: validated.content,
        mediaUrl: validated.mediaUrl,
        mediaType: validated.mediaType,
        contentType: validated.contentType,
        page: validated.page,
        section: validated.section,
        order: validated.order,
        isActive: validated.isActive,
      },
    });

    revalidatePath('/');
    return NextResponse.json(contentBlock);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to create content block:', error);
    return NextResponse.json({ error: "Failed to create content block" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = contentBlockSchema.parse(body);

    const updatedContentBlock = await prisma.websiteContent.upsert({
      where: { key: validated.key },
      update: {
        title: validated.title,
        content: validated.content,
        mediaUrl: validated.mediaUrl,
        mediaType: validated.mediaType,
        contentType: validated.contentType,
        page: validated.page,
        section: validated.section,
        order: validated.order,
        isActive: validated.isActive,
      },
      create: {
        key: validated.key,
        title: validated.title,
        content: validated.content,
        mediaUrl: validated.mediaUrl,
        mediaType: validated.mediaType,
        contentType: validated.contentType,
        page: validated.page,
        section: validated.section,
        order: validated.order,
        isActive: validated.isActive,
      }
    });

    revalidatePath('/');
    return NextResponse.json(updatedContentBlock);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update content block:', error);
    return NextResponse.json({ error: "Failed to update content block" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Content block key is required" }, { status: 400 });
    }

    await prisma.websiteContent.delete({
      where: { key }
    });

    revalidatePath('/');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete content block:', error);
    return NextResponse.json({ error: "Failed to delete content block" }, { status: 500 });
  }
}