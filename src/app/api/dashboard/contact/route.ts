import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Contact page content structure definition
const CONTACT_CONTENT_STRUCTURE = {
  hero: {
    title: { key: 'contact_hero_title', type: 'TEXT', order: 1 },
    subtitle: { key: 'contact_hero_subtitle', type: 'TEXT', order: 2 },
  },
  contact_info: {
    title: { key: 'contact_info_title', type: 'TEXT', order: 3 },
    address_title: { key: 'contact_address_title', type: 'TEXT', order: 4 },
    address_content: { key: 'contact_address_content', type: 'TEXTAREA', order: 5 },
    phone_title: { key: 'contact_phone_title', type: 'TEXT', order: 6 },
    phone_content: { key: 'contact_phone_content', type: 'TEXTAREA', order: 7 },
    email_title: { key: 'contact_email_title', type: 'TEXT', order: 8 },
    email_content: { key: 'contact_email_content', type: 'TEXTAREA', order: 9 },
    hours_title: { key: 'contact_hours_title', type: 'TEXT', order: 10 },
    hours_content: { key: 'contact_hours_content', type: 'TEXTAREA', order: 11 },
  },
  contact_form: {
    title: { key: 'contact_form_title', type: 'TEXT', order: 12 },
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
  
  Object.entries(CONTACT_CONTENT_STRUCTURE).forEach(([section, fields]) => {
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
async function initializeContactContent() {
  const allKeys = getAllContentKeys();
  const existingContent = await prisma.websiteContent.findMany({
    where: { page: 'contact' }
  });
  
  const existingKeys = new Set(existingContent.map(c => c.key));
  const missingKeys = allKeys.filter(k => !existingKeys.has(k.key));
  
  if (missingKeys.length > 0) {
    await prisma.websiteContent.createMany({
      data: missingKeys.map(k => ({
        key: k.key,
        title: k.key.replace('contact_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        content: '',
        contentType: k.type as any,
        page: 'contact',
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
    await initializeContactContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'contact',
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
      structure: CONTACT_CONTENT_STRUCTURE,
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to fetch contact content:', error);
    return NextResponse.json({ error: 'Failed to fetch contact content' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize content structure
    await initializeContactContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'contact',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ 
      message: 'Contact content initialized successfully',
      totalItems: content.length 
    });
  } catch (error) {
    console.error('Failed to initialize contact content:', error);
    return NextResponse.json({ error: 'Failed to initialize contact content' }, { status: 500 });
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
          title: key.replace('contact_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          content: data.content || '',
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          contentType: data.mediaUrl ? (data.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE') : 'TEXT',
          page: 'contact',
          section: key.split('_')[1] || 'general',
          order: 0,
          isActive: true,
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: 'Contact content updated successfully',
      updatedKeys: Object.keys(validatedData)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update contact content:', error);
    return NextResponse.json({ error: 'Failed to update contact content' }, { status: 500 });
  }
}
