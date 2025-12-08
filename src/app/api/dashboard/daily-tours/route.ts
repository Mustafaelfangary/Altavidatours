import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Daily Tours page content structure definition
const DAILY_TOURS_CONTENT_STRUCTURE = {
  hero: {
    title: { key: 'daily-tours_hero_title', type: 'TEXT', order: 1 },
    subtitle: { key: 'daily-tours_hero_subtitle', type: 'TEXTAREA', order: 2 },
  },
  categories: {
    all_label: { key: 'daily-tours_cat_all', type: 'TEXT', order: 3 },
    deluxe_label: { key: 'daily-tours_cat_deluxe', type: 'TEXT', order: 4 },
    luxury_label: { key: 'daily-tours_cat_luxury', type: 'TEXT', order: 5 },
    premium_label: { key: 'daily-tours_cat_premium', type: 'TEXT', order: 6 },
    standard_label: { key: 'daily-tours_cat_standard', type: 'TEXT', order: 7 },
  },
  empty: {
    title: { key: 'daily-tours_empty_title', type: 'TEXT', order: 8 },
    message: { key: 'daily-tours_empty_message', type: 'TEXTAREA', order: 9 },
  },
};

// Helper function to get all content keys
function getAllContentKeys() {
  const keys: Array<{key: string, type: string, section: string, order: number}> = [];
  
  Object.entries(DAILY_TOURS_CONTENT_STRUCTURE).forEach(([section, fields]) => {
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

// Initialize daily tours content in database
async function initializeDailyToursContent() {
  const contentKeys = getAllContentKeys();
  
  for (const { key, type, section, order } of contentKeys) {
    const existing = await prisma.websiteContent.findFirst({
      where: { key, page: 'daily-tours' }
    });
    
    if (!existing) {
      await prisma.websiteContent.create({
        data: {
          key,
          title: key.replace(/_/g, ' ').replace(/daily-tours /i, ''),
          content: '',
          contentType: type as any,
          page: 'daily-tours',
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
    await initializeDailyToursContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'daily-tours',
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
      structure: DAILY_TOURS_CONTENT_STRUCTURE,
      totalItems: content.length
    });
  } catch (error) {
    console.error('Failed to fetch daily tours content:', error);
    return NextResponse.json({ error: 'Failed to fetch daily tours content' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initializeDailyToursContent();
    
    const content = await prisma.websiteContent.findMany({
      where: { 
        page: 'daily-tours',
        isActive: true 
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ 
      message: 'Daily tours content initialized successfully',
      totalItems: content.length 
    });
  } catch (error) {
    console.error('Failed to initialize daily tours content:', error);
    return NextResponse.json({ error: 'Failed to initialize daily tours content' }, { status: 500 });
  }
}

