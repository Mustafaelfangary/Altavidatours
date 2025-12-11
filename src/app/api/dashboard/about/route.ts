import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// About page content structure definition
const ABOUT_CONTENT_STRUCTURE = {
  hero: {
    title: { key: 'about_hero_title', type: 'TEXT', order: 1 },
    subtitle: { key: 'about_hero_subtitle', type: 'TEXTAREA', order: 2 },
  },
  dahabiya_section: {
    title: { key: 'about_dahabiya_title', type: 'TEXT', order: 3 },
    content: { key: 'about_dahabiya_content', type: 'TEXTAREA', order: 4 },
    image: { key: 'about_dahabiya_image', type: 'IMAGE', order: 5 },
  },
  why_section: {
    title: { key: 'about_why_title', type: 'TEXT', order: 6 },
    content: { key: 'about_why_content', type: 'TEXTAREA', order: 7 },
    image: { key: 'about_why_image', type: 'IMAGE', order: 8 },
  },
  founder: {
    name: { key: 'about_founder_name', type: 'TEXT', order: 9 },
    title: { key: 'about_founder_title', type: 'TEXT', order: 10 },
    image: { key: 'about_founder_image', type: 'IMAGE', order: 11 },
    bio: { key: 'about_founder_bio', type: 'TEXTAREA', order: 12 },
  },
  team: {
    title: { key: 'about_team_title', type: 'TEXT', order: 13 },
    subtitle: { key: 'about_team_subtitle', type: 'TEXTAREA', order: 14 },
    member_1_name: { key: 'about_team_member_1_name', type: 'TEXT', order: 15 },
    member_1_title: { key: 'about_team_member_1_title', type: 'TEXT', order: 16 },
    member_1_image: { key: 'about_team_member_1_image', type: 'IMAGE', order: 17 },
    member_1_bio: { key: 'about_team_member_1_bio', type: 'TEXTAREA', order: 18 },
    member_2_name: { key: 'about_team_member_2_name', type: 'TEXT', order: 19 },
    member_2_title: { key: 'about_team_member_2_title', type: 'TEXT', order: 20 },
    member_2_image: { key: 'about_team_member_2_image', type: 'IMAGE', order: 21 },
    member_2_bio: { key: 'about_team_member_2_bio', type: 'TEXTAREA', order: 22 },
    member_3_name: { key: 'about_team_member_3_name', type: 'TEXT', order: 23 },
    member_3_title: { key: 'about_team_member_3_title', type: 'TEXT', order: 24 },
    member_3_image: { key: 'about_team_member_3_image', type: 'IMAGE', order: 25 },
    member_3_bio: { key: 'about_team_member_3_bio', type: 'TEXTAREA', order: 26 },
    member_4_name: { key: 'about_team_member_4_name', type: 'TEXT', order: 27 },
    member_4_title: { key: 'about_team_member_4_title', type: 'TEXT', order: 28 },
    member_4_image: { key: 'about_team_member_4_image', type: 'IMAGE', order: 29 },
    member_4_bio: { key: 'about_team_member_4_bio', type: 'TEXTAREA', order: 30 },
    member_5_name: { key: 'about_team_member_5_name', type: 'TEXT', order: 31 },
    member_5_title: { key: 'about_team_member_5_title', type: 'TEXT', order: 32 },
    member_5_image: { key: 'about_team_member_5_image', type: 'IMAGE', order: 33 },
    member_5_bio: { key: 'about_team_member_5_bio', type: 'TEXTAREA', order: 34 },
    member_6_name: { key: 'about_team_member_6_name', type: 'TEXT', order: 35 },
    member_6_title: { key: 'about_team_member_6_title', type: 'TEXT', order: 36 },
    member_6_image: { key: 'about_team_member_6_image', type: 'IMAGE', order: 37 },
    member_6_bio: { key: 'about_team_member_6_bio', type: 'TEXTAREA', order: 38 },
    member_7_name: { key: 'about_team_member_7_name', type: 'TEXT', order: 39 },
    member_7_title: { key: 'about_team_member_7_title', type: 'TEXT', order: 40 },
    member_7_image: { key: 'about_team_member_7_image', type: 'IMAGE', order: 41 },
    member_7_bio: { key: 'about_team_member_7_bio', type: 'TEXTAREA', order: 42 },
  },
};

// Content validation schema
const contentUpdateSchema = z.record(z.object({
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
}));

// Helper function to get all content keys
function getAllContentKeys() {
  const keys: Array<{key: string, type: string, section: string, order: number}> = [];
  
  Object.entries(ABOUT_CONTENT_STRUCTURE).forEach(([section, fields]) => {
    Object.entries(fields).forEach(([fieldName, config]) => {
      keys.push({
        key: config.key,
        type: config.type,
        section,
        order: config.order
      });
    });
  });
  
  return keys;
}

// Helper function to initialize content structure
async function initializeAboutContent() {
  const allKeys = getAllContentKeys();
  const existingContent = await prisma.websiteContent.findMany({
    where: { page: 'about' }
  });
  
  const existingKeys = new Set(existingContent.map(c => c.key));
  const missingKeys = allKeys.filter(k => !existingKeys.has(k.key));
  
  if (missingKeys.length > 0) {
    await prisma.websiteContent.createMany({
      data: missingKeys.map(k => ({
        key: k.key,
        title: k.key.replace('about_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        content: '',
        contentType: k.type as any,
        page: 'about',
        section: k.section,
        order: k.order,
        isActive: true,
      })),
      skipDuplicates: true,
    });
  }
}

export async function GET() {
  try {
    // Initialize content structure if needed
    await initializeAboutContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'about',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    // Group content by sections
    const groupedContent = content.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      content: groupedContent,
      structure: ABOUT_CONTENT_STRUCTURE,
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to fetch about content:', error);
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize content structure
    await initializeAboutContent();

    const content = await prisma.websiteContent.findMany({
      where: {
        page: 'about',
        isActive: true
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({
      message: 'About content initialized successfully',
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to initialize about content:', error);
    return NextResponse.json({ error: 'Failed to initialize about content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = contentUpdateSchema.parse(body);

    // Update content blocks
    const updatePromises = Object.entries(validatedData).map(([key, data]) => {
      return prisma.websiteContent.upsert({
        where: { key },
        update: {
          content: data.content,
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          updatedAt: new Date(),
        },
        create: {
          key,
          title: key.replace('about_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          content: data.content || '',
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          contentType: data.mediaUrl ? (data.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE') : 'TEXT',
          page: 'about',
          section: key.split('_')[1] || 'general',
          order: 0,
          isActive: true,
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: 'About content updated successfully',
      updatedKeys: Object.keys(validatedData)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update about content:', error);
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}


