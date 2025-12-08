import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Tailor-Made page content structure definition
const TAILOR_MADE_CONTENT_STRUCTURE = {
  hero: {
    title: { key: 'tailor-made_hero_title', type: 'TEXT', order: 1 },
    subtitle: { key: 'tailor-made_hero_subtitle', type: 'TEXTAREA', order: 2 },
    button: { key: 'tailor-made_hero_button', type: 'TEXT', order: 3 },
  },
  features: {
    title: { key: 'tailor-made_features_title', type: 'TEXT', order: 4 },
    feature_1_title: { key: 'tailor-made_feature_1_title', type: 'TEXT', order: 5 },
    feature_1_description: { key: 'tailor-made_feature_1_description', type: 'TEXTAREA', order: 6 },
    feature_2_title: { key: 'tailor-made_feature_2_title', type: 'TEXT', order: 7 },
    feature_2_description: { key: 'tailor-made_feature_2_description', type: 'TEXTAREA', order: 8 },
    feature_3_title: { key: 'tailor-made_feature_3_title', type: 'TEXT', order: 9 },
    feature_3_description: { key: 'tailor-made_feature_3_description', type: 'TEXTAREA', order: 10 },
    feature_4_title: { key: 'tailor-made_feature_4_title', type: 'TEXT', order: 11 },
    feature_4_description: { key: 'tailor-made_feature_4_description', type: 'TEXTAREA', order: 12 },
    feature_5_title: { key: 'tailor-made_feature_5_title', type: 'TEXT', order: 13 },
    feature_5_description: { key: 'tailor-made_feature_5_description', type: 'TEXTAREA', order: 14 },
    feature_6_title: { key: 'tailor-made_feature_6_title', type: 'TEXT', order: 15 },
    feature_6_description: { key: 'tailor-made_feature_6_description', type: 'TEXTAREA', order: 16 },
  },
  process: {
    title: { key: 'tailor-made_process_title', type: 'TEXT', order: 17 },
    step_1_title: { key: 'tailor-made_step_1_title', type: 'TEXT', order: 18 },
    step_1_description: { key: 'tailor-made_step_1_description', type: 'TEXTAREA', order: 19 },
    step_2_title: { key: 'tailor-made_step_2_title', type: 'TEXT', order: 20 },
    step_2_description: { key: 'tailor-made_step_2_description', type: 'TEXTAREA', order: 21 },
    step_3_title: { key: 'tailor-made_step_3_title', type: 'TEXT', order: 22 },
    step_3_description: { key: 'tailor-made_step_3_description', type: 'TEXTAREA', order: 23 },
    step_4_title: { key: 'tailor-made_step_4_title', type: 'TEXT', order: 24 },
    step_4_description: { key: 'tailor-made_step_4_description', type: 'TEXTAREA', order: 25 },
  },
  cta: {
    title: { key: 'tailor-made_cta_title', type: 'TEXT', order: 26 },
    description: { key: 'tailor-made_cta_description', type: 'TEXTAREA', order: 27 },
    button: { key: 'tailor-made_cta_button', type: 'TEXT', order: 28 },
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
  
  Object.entries(TAILOR_MADE_CONTENT_STRUCTURE).forEach(([section, fields]) => {
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
async function initializeTailorMadeContent() {
  const allKeys = getAllContentKeys();
  const existingContent = await prisma.websiteContent.findMany({
    where: { page: 'tailor-made' }
  });
  
  const existingKeys = new Set(existingContent.map(c => c.key));
  const missingKeys = allKeys.filter(k => !existingKeys.has(k.key));
  
  if (missingKeys.length > 0) {
    await prisma.websiteContent.createMany({
      data: missingKeys.map(k => ({
        key: k.key,
        title: k.key.replace('tailor-made_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        content: '',
        contentType: k.type as any,
        page: 'tailor-made',
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
    await initializeTailorMadeContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'tailor-made',
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
      structure: TAILOR_MADE_CONTENT_STRUCTURE,
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to fetch tailor-made content:', error);
    return NextResponse.json({ error: 'Failed to fetch tailor-made content' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize content structure
    await initializeTailorMadeContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'tailor-made',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ 
      message: 'Tailor-made content initialized successfully',
      totalItems: content.length 
    });
  } catch (error) {
    console.error('Failed to initialize tailor-made content:', error);
    return NextResponse.json({ error: 'Failed to initialize tailor-made content' }, { status: 500 });
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
          title: key.replace('tailor-made_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          content: data.content || '',
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          contentType: data.mediaUrl ? (data.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE') : 'TEXT',
          page: 'tailor-made',
          section: key.split('_')[1] || 'general',
          order: 0,
          isActive: true,
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: 'Tailor-made content updated successfully',
      updatedKeys: Object.keys(validatedData)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update tailor-made content:', error);
    return NextResponse.json({ error: 'Failed to update tailor-made content' }, { status: 500 });
  }
}
