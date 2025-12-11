import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all navigation items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.navigationItem.findMany({
      orderBy: [{ menuLocation: 'asc' }, { order: 'asc' }],
      include: { children: true },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch navigation:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}

// POST create navigation item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const item = await prisma.navigationItem.create({
      data: {
        title: data.title,
        url: data.url,
        target: data.target || '_self',
        icon: data.icon || null,
        parentId: data.parentId || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
        menuLocation: data.menuLocation || 'header',
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to create navigation item:', error);
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 });
  }
}



