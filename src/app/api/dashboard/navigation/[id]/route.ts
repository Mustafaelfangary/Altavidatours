import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PUT update navigation item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const item = await prisma.navigationItem.update({
      where: { id },
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
    console.error('Failed to update navigation item:', error);
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 });
  }
}

// DELETE navigation item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.navigationItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete navigation item:', error);
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 });
  }
}

