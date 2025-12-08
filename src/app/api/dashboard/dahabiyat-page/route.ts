import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Dahabiyat page content structure definition
const DAHABIYAT_CONTENT_STRUCTURE = {
  hero: {
    title: { key: 'dahabiyat_hero_title', type: 'TEXT', order: 1 },
    subtitle: { key: 'dahabiyat_hero_subtitle', type: 'TEXT', order: 2 },
    description: { key: 'dahabiyat_hero_description', type: 'TEXTAREA', order: 3 },
  },
  fleet: {
    title: { key: 'dahabiyat_fleet_title', type: 'TEXT', order: 4 },
    description: { key: 'dahabiyat_fleet_description', type: 'TEXTAREA', order: 5 },
  },
  why_different: {
    title: { key: 'dahabiyat_why_different_title', type: 'TEXT', order: 6 },
    content: { key: 'dahabiyat_why_different_content', type: 'TEXTAREA', order: 7 },
    image: { key: 'dahabiyat_why_different_image', type: 'IMAGE', order: 8 },
  },
  experience: {
    title: { key: 'dahabiyat_experience_title', type: 'TEXT', order: 9 },
    description: { key: 'dahabiyat_experience_description', type: 'TEXTAREA', order: 10 },
  },
  available: {
    title: { key: 'dahabiyat_available_title', type: 'TEXT', order: 11 },
    description: { key: 'dahabiyat_available_description', type: 'TEXT', order: 12 },
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
  
  Object.entries(DAHABIYAT_CONTENT_STRUCTURE).forEach(([section, fields]) => {
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
async function initializeDahabiyatContent() {
  const allKeys = getAllContentKeys();
  const existingContent = await prisma.websiteContent.findMany({
    where: { page: 'dahabiyat' }
  });
  
  const existingKeys = new Set(existingContent.map(c => c.key));
  const missingKeys = allKeys.filter(k => !existingKeys.has(k.key));
  
  if (missingKeys.length > 0) {
    await prisma.websiteContent.createMany({
      data: missingKeys.map(k => ({
        key: k.key,
        title: k.key.replace('dahabiyat_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        content: '',
        contentType: k.type as any,
        page: 'dahabiyat',
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
    await initializeDahabiyatContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'dahabiyat',
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
      structure: DAHABIYAT_CONTENT_STRUCTURE,
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to fetch dahabiyat content:', error);
    return NextResponse.json({ error: 'Failed to fetch dahabiyat content' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize content structure
    await initializeDahabiyatContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'dahabiyat',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ 
      message: 'Dahabiyat content initialized successfully',
      totalItems: content.length 
    });
  } catch (error) {
    console.error('Failed to initialize dahabiyat content:', error);
    return NextResponse.json({ error: 'Failed to initialize dahabiyat content' }, { status: 500 });
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
          title: key.replace('dahabiyat_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          content: data.content || '',
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          contentType: data.mediaUrl ? (data.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE') : 'TEXT',
          page: 'dahabiyat',
          section: key.split('_')[1] || 'general',
          order: 0,
          isActive: true,
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: 'Dahabiyat content updated successfully',
      updatedKeys: Object.keys(validatedData)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update dahabiyat content:', error);
    return NextResponse.json({ error: 'Failed to update dahabiyat content' }, { status: 500 });
  }
}
