import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all SEO settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seoItems = await prisma.seoMeta.findMany({
      orderBy: { pageSlug: 'asc' },
    });

    return NextResponse.json(seoItems);
  } catch (error) {
    console.error('Failed to fetch SEO:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

// POST create or update SEO
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const seo = await prisma.seoMeta.upsert({
      where: { pageSlug: data.pageSlug },
      create: {
        pageSlug: data.pageSlug,
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
      update: {
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
    console.error('Failed to save SEO:', error);
    return NextResponse.json({ error: 'Failed to save SEO settings' }, { status: 500 });
  }
}



