import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for packages page content validation
const packagesContentSchema = z.object({
  key: z.string().min(1),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
});

const updatePackagesContentSchema = z.object({
  updates: z.array(packagesContentSchema),
});

// Define packages page content structure
const PACKAGES_CONTENT_STRUCTURE = [
  // Hero Section
  { key: 'packages_hero_title', title: 'Hero Title', contentType: 'TEXT', section: 'hero', order: 1 },
  { key: 'packages_hero_subtitle', title: 'Hero Subtitle', contentType: 'TEXT', section: 'hero', order: 2 },
  { key: 'packages_hero_description', title: 'Hero Description', contentType: 'TEXTAREA', section: 'hero', order: 3 },
  { key: 'packages_hero_badge', title: 'Hero Badge', contentType: 'TEXT', section: 'hero', order: 4 },
  { key: 'packages_hero_image_1', title: 'Hero Image 1', contentType: 'IMAGE', section: 'hero', order: 5 },
  { key: 'packages_hero_image_2', title: 'Hero Image 2', contentType: 'IMAGE', section: 'hero', order: 6 },
  { key: 'packages_hero_image_3', title: 'Hero Image 3', contentType: 'IMAGE', section: 'hero', order: 7 },

  // List / main section
  { key: 'packages_list_title', title: 'Packages List Title', contentType: 'TEXT', section: 'list', order: 1 },
  { key: 'packages_list_subtitle', title: 'Packages List Subtitle', contentType: 'TEXT', section: 'list', order: 2 },

  // Filters (e.g. family type)
  { key: 'packages_filter_family_title', title: 'Family Packages Title', contentType: 'TEXT', section: 'filters', order: 1 },
  { key: 'packages_filter_family_description', title: 'Family Packages Description', contentType: 'TEXTAREA', section: 'filters', order: 2 },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const contentBlocks = await prisma.websiteContent.findMany({
      where: {
        page: 'packages',
        isActive: true,
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      blocks: contentBlocks,
      structure: PACKAGES_CONTENT_STRUCTURE,
    });
  } catch (error) {
    console.error('Error fetching packages page content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingBlocks = await prisma.websiteContent.findMany({
      where: { page: 'packages' },
    });

    const existingKeys = new Set(existingBlocks.map((block) => block.key));
    const blocksToCreate = PACKAGES_CONTENT_STRUCTURE.filter(
      (block) => !existingKeys.has(block.key),
    );

    if (blocksToCreate.length > 0) {
      await prisma.websiteContent.createMany({
        data: blocksToCreate.map((block) => ({
          key: block.key,
          title: block.title,
          content: getDefaultContent(block.key),
          contentType: block.contentType as any,
          page: 'packages',
          section: block.section,
          order: block.order,
          isActive: true,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${blocksToCreate.length} packages content blocks`,
    });
  } catch (error) {
    console.error('Error initializing packages content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { updates } = updatePackagesContentSchema.parse(body);

    const updatePromises = updates.map(async (update) => {
      const updateData: any = {};

      if (update.content !== undefined) updateData.content = update.content;
      if (update.mediaUrl !== undefined) updateData.mediaUrl = update.mediaUrl;
      if (update.mediaType !== undefined) updateData.mediaType = update.mediaType;

      return prisma.websiteContent.upsert({
        where: { key: update.key },
        update: updateData,
        create: {
          key: update.key,
          title: getContentTitle(update.key),
          content: update.content || '',
          mediaUrl: update.mediaUrl,
          mediaType: update.mediaType,
          contentType: getContentType(update.key) as any,
          page: 'packages',
          section: getContentSection(update.key),
          order: getContentOrder(update.key),
          isActive: true,
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} packages content blocks`,
    });
  } catch (error) {
    console.error('Error updating packages content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function getDefaultContent(key: string): string {
  const defaults: Record<string, string> = {
    packages_hero_title: 'Egypt Tour Packages',
    packages_hero_subtitle:
      'Discover the perfect blend of ancient wonders and modern comfort with our carefully curated multi-day tour packages',
    packages_hero_description:
      'From Cairo to Luxor and Aswan, our Egypt tour packages combine iconic sites with comfortable stays and expert guides.',
    packages_hero_badge: 'Multi-Day Egypt Tours',
    packages_list_title: 'Our Egypt Tour Packages',
    packages_list_subtitle: 'Choose from our selection of carefully crafted Egypt experiences',
    packages_filter_family_title: 'Family Packages',
    packages_filter_family_description:
      'Specially designed itineraries for families, with kid-friendly activities and comfortable schedules.',
  };
  return defaults[key] || '';
}

function getContentTitle(key: string): string {
  const structure = PACKAGES_CONTENT_STRUCTURE.find((item) => item.key === key);
  return structure?.title || key.replace('packages_', '').replace(/_/g, ' ');
}

function getContentType(key: string): string {
  const structure = PACKAGES_CONTENT_STRUCTURE.find((item) => item.key === key);
  return structure?.contentType || 'TEXT';
}

function getContentSection(key: string): string {
  const structure = PACKAGES_CONTENT_STRUCTURE.find((item) => item.key === key);
  return structure?.section || 'general';
}

function getContentOrder(key: string): number {
  const structure = PACKAGES_CONTENT_STRUCTURE.find((item) => item.key === key);
  return structure?.order || 1;
}

