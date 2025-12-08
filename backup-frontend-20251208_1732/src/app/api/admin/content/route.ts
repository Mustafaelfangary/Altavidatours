import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/content - Get all content
// GET /api/admin/content?page=home - Get content for specific page
// GET /api/admin/content?key=hero.title - Get content by key
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const key = searchParams.get('key');
    const section = searchParams.get('section');

    let where: any = {};
    
    if (key) {
      where.key = key;
    }
    
    if (page) {
      where.page = page;
    }
    
    if (section) {
      where.section = section;
    }

    const contents = await prisma.pageContent.findMany({
      where,
      orderBy: [
        { page: 'asc' },
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/content - Create new content
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    
    // Check if content with this key already exists
    const existingContent = await prisma.pageContent.findUnique({
      where: { key: data.key },
    });

    if (existingContent) {
      return new NextResponse(
        JSON.stringify({ 
          message: 'Content with this key already exists',
          existingContent,
        }), 
        { status: 400 }
      );
    }

    const content = await prisma.pageContent.create({
      data: {
        key: data.key,
        title: data.title,
        content: data.content,
        contentType: data.contentType || 'TEXT',
        page: data.page,
        section: data.section,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        metadata: data.metadata || {},
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
