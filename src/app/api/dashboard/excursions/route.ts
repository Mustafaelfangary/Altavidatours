import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Excursions page content structure definition
const EXCURSIONS_CONTENT_STRUCTURE = {
  hero: {
    badge: { key: 'excursions_hero_badge', type: 'TEXT', order: 1 },
    title: { key: 'excursions_hero_title', type: 'TEXT', order: 2 },
    subtitle: { key: 'excursions_hero_subtitle', type: 'TEXTAREA', order: 3 },
    button: { key: 'excursions_hero_button', type: 'TEXT', order: 4 },
    contact_button: { key: 'excursions_hero_contact_button', type: 'TEXT', order: 5 },
  },
  featured: {
    badge: { key: 'excursions_featured_badge', type: 'TEXT', order: 6 },
    title: { key: 'excursions_featured_title', type: 'TEXT', order: 7 },
    subtitle: { key: 'excursions_featured_subtitle', type: 'TEXTAREA', order: 8 },
  },
  all: {
    title: { key: 'excursions_all_title', type: 'TEXT', order: 9 },
    subtitle: { key: 'excursions_all_subtitle', type: 'TEXTAREA', order: 10 },
    tab_all: { key: 'excursions_tab_all', type: 'TEXT', order: 11 },
    tab_historical: { key: 'excursions_tab_historical', type: 'TEXT', order: 12 },
    tab_desert: { key: 'excursions_tab_desert', type: 'TEXT', order: 13 },
    tab_other: { key: 'excursions_tab_other', type: 'TEXT', order: 14 },
  },
  gallery: {
    badge: { key: 'excursions_gallery_badge', type: 'TEXT', order: 15 },
    title: { key: 'excursions_gallery_title', type: 'TEXT', order: 16 },
    subtitle: { key: 'excursions_gallery_subtitle', type: 'TEXTAREA', order: 17 },
  },
  cta: {
    title: { key: 'excursions_cta_title', type: 'TEXT', order: 18 },
    subtitle: { key: 'excursions_cta_subtitle', type: 'TEXTAREA', order: 19 },
    button_text: { key: 'excursions_cta_button', type: 'TEXT', order: 20 },
    packages_button: { key: 'excursions_cta_packages_button', type: 'TEXT', order: 21 },
  },
};

// Helper function to get all content keys
function getAllContentKeys() {
  const keys: Array<{key: string, type: string, section: string, order: number}> = [];
  
  Object.entries(EXCURSIONS_CONTENT_STRUCTURE).forEach(([section, fields]) => {
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

// Initialize excursions content in database
async function initializeExcursionsContent() {
  const contentKeys = getAllContentKeys();
  
  for (const { key, type, section, order } of contentKeys) {
    const existing = await prisma.websiteContent.findFirst({
      where: { key, page: 'excursions' }
    });
    
    if (!existing) {
      await prisma.websiteContent.create({
        data: {
          key,
          title: key.replace(/_/g, ' ').replace(/excursions /i, ''),
          content: '',
          contentType: type as any,
          page: 'excursions',
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
    // Initialize content structure if needed
    await initializeExcursionsContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'excursions',
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
      structure: EXCURSIONS_CONTENT_STRUCTURE,
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to fetch excursions content:', error);
    return NextResponse.json({ error: 'Failed to fetch excursions content' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize content structure
    await initializeExcursionsContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'excursions',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ 
      message: 'Excursions content initialized successfully',
      totalItems: content.length 
    });
  } catch (error) {
    console.error('Failed to initialize excursions content:', error);
    return NextResponse.json({ error: 'Failed to initialize excursions content' }, { status: 500 });
  }
}



