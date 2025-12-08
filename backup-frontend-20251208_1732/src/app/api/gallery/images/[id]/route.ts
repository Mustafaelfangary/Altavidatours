import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return !!(session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!image) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const updated = await prisma.galleryImage.update({
      where: { id: params.id },
      data: {
        url: data.url ?? undefined,
        alt: data.alt ?? undefined,
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        categoryId: data.categoryId ?? undefined,
        order: typeof data.order === 'number' ? data.order : undefined,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : undefined,
        isFeatured: typeof data.isFeatured === 'boolean' ? data.isFeatured : undefined,
        tags: Array.isArray(data.tags) ? data.tags : undefined,
      },
      include: { category: true },
    });

    return NextResponse.json({ image: updated });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.galleryImage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
