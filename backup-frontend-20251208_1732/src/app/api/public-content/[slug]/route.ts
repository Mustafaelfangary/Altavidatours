import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function mapContentTypeToFieldType(contentType?: string): 'text' | 'textarea' | 'image' | 'video' {
  const ct = (contentType || 'TEXT').toUpperCase();
  if (ct.includes('IMAGE')) return 'image';
  if (ct.includes('VIDEO')) return 'video';
  if (ct.includes('RICH') || ct.includes('TEXTAREA')) return 'textarea';
  return 'text';
}

export async function GET(_req: NextRequest, context: { params: { slug: string } }) {
  try {
    const slug = context?.params?.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Fetch WebsiteContent rows for this page slug
    const rows = await prisma.websiteContent.findMany({
      where: {
        page: slug,
        isActive: true,
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    // Map to the shape expected by useContent's dahabiya branch
    const fields = rows.map((item) => {
      const type = mapContentTypeToFieldType(item.contentType || undefined);
      const value = item.content ?? item.mediaUrl ?? '';
      return {
        id: item.id,
        key: item.key,
        label: item.title,
        value,
        placeholder: value || undefined,
        type,
      };
    });

    const response = NextResponse.json({ section: 'main', fields });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('ETag', `"${Date.now()}"`);
    response.headers.set('Last-Modified', new Date().toUTCString());
    return response;
  } catch (error) {
    console.error('Error fetching public content:', error);
    return NextResponse.json({ section: 'main', fields: [] });
  }
}
