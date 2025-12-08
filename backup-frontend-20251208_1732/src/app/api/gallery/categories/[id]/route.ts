import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return !!(session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role));
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

    const updated = await prisma.galleryCategory.update({
      where: { id: params.id },
      data: {
        name: data.name ?? undefined,
        slug: data.slug ?? undefined,
        description: data.description ?? undefined,
        order: typeof data.order === 'number' ? data.order : undefined,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error('Error updating gallery category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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

    await prisma.galleryCategory.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
