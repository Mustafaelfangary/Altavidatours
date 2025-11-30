import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json(
        {
          logoUrl: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png',
          key: 'default',
          timestamp: Date.now(),
          error: 'Database not available',
        },
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );
    }

    // Fetch both possible logo entries and choose the most recently updated one
    const logos = await prisma.websiteContent.findMany({
      where: {
        key: { in: ['navbar_logo', 'site_logo'] },
        isActive: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 2,
    });

    let chosen = logos.find(l => l.content && !l.content.startsWith('blob:')) || null;

    // Fallback to default logo if nothing valid found
    const logoUrl = chosen?.content && !chosen.content.startsWith('blob:')
      ? chosen.content
      : '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png';

    const updatedAt = chosen?.updatedAt ? new Date(chosen.updatedAt).getTime() : Date.now();

    // Return the logo URL with strong no-cache headers + timestamp for cache-busting
    return NextResponse.json(
      {
        logoUrl,
        key: chosen?.key || 'default',
        timestamp: updatedAt,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching logo:', error);
    // Always return the default logo on error
    return NextResponse.json(
      {
        logoUrl: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png',
        key: 'default',
        timestamp: Date.now(),
        error: 'Failed to fetch from database',
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );
  }
}
