import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BlockType } from '@prisma/client';

// GET all content blocks for a page
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: pageId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentBlocks = await prisma.contentBlock.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(contentBlocks);
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// CREATE a new content block for a page
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: pageId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { type, content } = await req.json();

    if (!Object.values(BlockType).includes(type)) {
      return NextResponse.json({ error: 'Invalid block type' }, { status: 400 });
    }

    const lastBlock = await prisma.contentBlock.findFirst({
      where: { pageId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastBlock ? lastBlock.order + 1 : 0;

    const newContentBlock = await prisma.contentBlock.create({
      data: {
        pageId,
        type,
        content: content || {},
        order: newOrder,
      },
    });

    return NextResponse.json(newContentBlock, { status: 201 });
  } catch (error) {
    console.error('Error creating content block:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// REORDER content blocks
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { blockIds }: { blockIds: string[] } = await req.json();

    if (!Array.isArray(blockIds)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const transactions = blockIds.map((id, index) =>
      prisma.contentBlock.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(transactions);

    return NextResponse.json({ message: 'Content blocks reordered successfully' });
  } catch (error) {
    console.error('Error reordering content blocks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}