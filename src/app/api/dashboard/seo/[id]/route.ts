import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PUT update SEO
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

    const seo = await prisma.seoMeta.update({
      where: { id },
      data: {
        title: data.title || null,
        description: data.description || null,
        keywords: data.keywords || null,
        canonical: data.canonical || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null,
        noIndex: data.noIndex || false,
        noFollow: data.noFollow || false,
      },
    });

    return NextResponse.json(seo);
  } catch (error) {
    console.error('Failed to update SEO:', error);
    return NextResponse.json({ error: 'Failed to update SEO settings' }, { status: 500 });
  }
}

// DELETE SEO
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

    await prisma.seoMeta.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete SEO:', error);
    return NextResponse.json({ error: 'Failed to delete SEO settings' }, { status: 500 });
  }
}

