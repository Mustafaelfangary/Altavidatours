import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test content to seed the database
    const testContent = [
      // Homepage content
      {
        key: 'hero_video_title',
        title: 'Hero Video Title',
        content: 'Experience the Magic of the Nile',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 1
      },
      {
        key: 'hero_video_subtitle', 
        title: 'Hero Video Subtitle',
        content: 'Sail Through Ancient Egypt on a Luxury Dahabiya',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 2
      },
      // Schedule and rates content
      {
        key: 'schedule_intro_text',
        title: 'Schedule Intro Text',
        content: 'Welcome to our schedule and rates page. Here you can find all available dates and pricing for our luxury Nile cruises.',
        contentType: 'TEXTAREA',
        page: 'schedule-and-rates',
        section: 'intro',
        order: 1
      },
      {
        key: 'page_title',
        title: 'Page Title',
        content: 'Schedule & Rates',
        contentType: 'TEXT',
        page: 'schedule-and-rates',
        section: 'hero',
        order: 1
      },
      // Footer content
      {
        key: 'footer_loading_text',
        title: 'Footer Loading Text',
        content: 'Loading...',
        contentType: 'TEXT',
        page: 'footer',
        section: 'general',
        order: 1
      },
      // Branding content
      {
        key: 'site_name',
        title: 'Site Name',
        content: 'Cleopatra Dahabiyat',
        contentType: 'TEXT',
        page: 'branding_settings',
        section: 'branding',
        order: 1
      },
      {
        key: 'navbar_logo',
        title: 'Navbar Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'branding_settings',
        section: 'branding',
        order: 2
      }
    ];

    // Upsert each content item
    const results = [];
    for (const item of testContent) {
      const result = await prisma.websiteContent.upsert({
        where: { key: item.key },
        update: {
          title: item.title,
          content: item.content,
          contentType: item.contentType as any,
          page: item.page,
          section: item.section,
          order: item.order,
          isActive: true
        },
        create: {
          key: item.key,
          title: item.title,
          content: item.content,
          contentType: item.contentType as any,
          page: item.page,
          section: item.section,
          order: item.order,
          isActive: true
        }
      });
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${results.length} content items`,
      items: results.map(r => ({ key: r.key, content: r.content }))
    });

  } catch (error) {
    console.error('Error seeding test content:', error);
    return NextResponse.json(
      { error: 'Failed to seed test content' },
      { status: 500 }
    );
  }
}
