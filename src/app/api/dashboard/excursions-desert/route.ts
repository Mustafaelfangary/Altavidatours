import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Desert Excursions page content structure definition
const DESERT_EXCURSIONS_CONTENT_STRUCTURE = {
  hero: {
    badge: { key: 'excursions_desert_hero_badge', type: 'TEXT', order: 1 },
    title: { key: 'excursions_desert_hero_title', type: 'TEXT', order: 2 },
    subtitle: { key: 'excursions_desert_hero_subtitle', type: 'TEXTAREA', order: 3 },
  },
  featured: {
    badge: { key: 'excursions_desert_featured_badge', type: 'TEXT', order: 4 },
    title: { key: 'excursions_desert_featured_title', type: 'TEXT', order: 5 },
    subtitle: { key: 'excursions_desert_featured_subtitle', type: 'TEXTAREA', order: 6 },
  },
  cta: {
    title: { key: 'excursions_desert_cta_title', type: 'TEXT', order: 7 },
    subtitle: { key: 'excursions_desert_cta_subtitle', type: 'TEXTAREA', order: 8 },
    button_text: { key: 'excursions_desert_cta_button', type: 'TEXT', order: 9 },
  },
};

// Helper function to get all content keys
function getAllContentKeys() {
  const keys: Array<{key: string, type: string, section: string, order: number}> = [];
  
  Object.entries(DESERT_EXCURSIONS_CONTENT_STRUCTURE).forEach(([section, fields]) => {
    Object.entries(fields).forEach(([fieldName, config]) => {
      keys.push({
        key: config.key,
        type: config.type,
        section,
        order: config.order,
      });
    });
  });
  
  return keys;
}

// Initialize desert excursions content in database
async function initializeDesertExcursionsContent() {
  const contentKeys = getAllContentKeys();
  
  for (const { key, type, section, order } of contentKeys) {
    const existing = await prisma.websiteContent.findFirst({
      where: { key, page: 'excursions_desert' }
    });
    
    if (!existing) {
      await prisma.websiteContent.create({
        data: {
          key,
          title: key.replace(/_/g, ' '),
          content: '',
          contentType: type as any,
          page: 'excursions_desert',
          section,
          order,
          isActive: true,
        }
      });
    }
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initializeDesertExcursionsContent();

    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'excursions_desert',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch desert excursions content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { key, content, contentType } = body;

    const updated = await prisma.websiteContent.upsert({
      where: { key },
      update: { content, contentType },
      create: {
        key,
        title: key.replace(/_/g, ' '),
        content,
        contentType,
        page: 'excursions_desert',
        section: key.split('_')[2] || 'general',
        order: 0,
        isActive: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update desert excursions content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}


