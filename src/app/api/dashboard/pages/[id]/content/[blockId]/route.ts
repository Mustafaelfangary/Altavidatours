import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// UPDATE a content block
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  const { id: pageId, blockId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    const updatedContentBlock = await prisma.contentBlock.update({
      where: { id: blockId },
      data: {
        content,
      },
    });

    return NextResponse.json(updatedContentBlock);
  } catch (error) {
    console.error('Error updating content block:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE a content block
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  const { id: pageId, blockId } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.contentBlock.delete({
      where: { id: blockId },
    });

    // After deleting, we need to re-order the remaining blocks
    const remainingBlocks = await prisma.contentBlock.findMany({
        where: { pageId },
        orderBy: { order: 'asc' },
    });

    const transactions = remainingBlocks.map((block, index) =>
        prisma.contentBlock.update({
            where: { id: block.id },
            data: { order: index },
        })
    );

    await prisma.$transaction(transactions);


    return NextResponse.json({ message: 'Content block deleted successfully' });
  } catch (error) {
    console.error('Error deleting content block:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}