import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/page-content/itineraries - Get main itineraries page content
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const content = await prisma.pageContent.findFirst({
      where: { 
        page: 'ITINERARIES',
        section: 'MAIN'
      }
    });

    return NextResponse.json(content || {
      page: 'ITINERARIES',
      section: 'MAIN',
      title: 'Our Itineraries',
      subtitle: 'Discover Ancient Egypt',
      description: 'Explore our carefully crafted itineraries that take you through the wonders of ancient Egypt.',
      content: {},
      isActive: true
    });
  } catch (error) {
    console.error('Error fetching itineraries page content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// POST /api/admin/page-content/itineraries - Create/Update main itineraries page content
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const content = await prisma.pageContent.upsert({
      where: {
        page_section: {
          page: 'ITINERARIES',
          section: 'MAIN'
        }
      },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        content: data.content || {},
        isActive: data.isActive ?? true,
        updatedAt: new Date()
      },
      create: {
        page: 'ITINERARIES',
        section: 'MAIN',
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        content: data.content || {},
        isActive: data.isActive ?? true
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error saving itineraries page content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

// PUT /api/admin/page-content/itineraries - Update main itineraries page content
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const content = await prisma.pageContent.upsert({
      where: {
        page_section: {
          page: 'ITINERARIES',
          section: 'MAIN'
        }
      },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        content: data.content || {},
        isActive: data.isActive ?? true,
        updatedAt: new Date()
      },
      create: {
        page: 'ITINERARIES',
        section: 'MAIN',
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        content: data.content || {},
        isActive: data.isActive ?? true
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating itineraries page content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}