import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Gallery page content structure definition
const GALLERY_CONTENT_STRUCTURE = {
  hero: {
    title: { key: 'gallery_hero_title', type: 'TEXT', order: 1 },
    subtitle: { key: 'gallery_hero_subtitle', type: 'TEXTAREA', order: 2 },
  },
  categories: {
    all_label: { key: 'gallery_cat_all', type: 'TEXT', order: 3 },
    whatsapp_label: { key: 'gallery_cat_whatsapp', type: 'TEXT', order: 4 },
    cultural_label: { key: 'gallery_cat_cultural', type: 'TEXT', order: 5 },
    alexandria_label: { key: 'gallery_cat_alexandria', type: 'TEXT', order: 6 },
    adventure_label: { key: 'gallery_cat_adventure', type: 'TEXT', order: 7 },
    desert_label: { key: 'gallery_cat_desert', type: 'TEXT', order: 8 },
    redsea_label: { key: 'gallery_cat_redsea', type: 'TEXT', order: 9 },
    religious_label: { key: 'gallery_cat_religious', type: 'TEXT', order: 10 },
  },
  cta: {
    title: { key: 'gallery_cta_title', type: 'TEXT', order: 11 },
    subtitle: { key: 'gallery_cta_subtitle', type: 'TEXTAREA', order: 12 },
    tours_button: { key: 'gallery_cta_tours_button', type: 'TEXT', order: 13 },
    packages_button: { key: 'gallery_cta_packages_button', type: 'TEXT', order: 14 },
  },
};

// Helper function to get all content keys
function getAllContentKeys() {
  const keys: Array<{key: string, type: string, section: string, order: number}> = [];
  
  Object.entries(GALLERY_CONTENT_STRUCTURE).forEach(([section, fields]) => {
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

// Initialize gallery content in database
async function initializeGalleryContent() {
  const contentKeys = getAllContentKeys();
  
  for (const { key, type, section, order } of contentKeys) {
    const existing = await prisma.websiteContent.findFirst({
      where: { key, page: 'gallery' }
    });
    
    if (!existing) {
      await prisma.websiteContent.create({
        data: {
          key,
          title: key.replace(/_/g, ' ').replace(/gallery /i, ''),
          content: '',
          contentType: type as any,
          page: 'gallery',
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
    await initializeGalleryContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'gallery',
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
      structure: GALLERY_CONTENT_STRUCTURE,
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to fetch gallery content:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery content' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize content structure
    await initializeGalleryContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'gallery',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ 
      message: 'Gallery content initialized successfully',
      totalItems: content.length 
    });
  } catch (error) {
    console.error('Failed to initialize gallery content:', error);
    return NextResponse.json({ error: 'Failed to initialize gallery content' }, { status: 500 });
  }
}

