import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/admin/amenities/seed
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const provided: { name: string; icon?: string; isActive?: boolean }[] = Array.isArray(body?.amenities) ? body.amenities : [];

    const defaults = [
      { name: 'Wi‑Fi', icon: 'wifi' },
      { name: 'Air Conditioning', icon: 'air' },
      { name: 'Private Bathroom', icon: 'bath' },
      { name: 'Onboard Chef', icon: 'chef' },
      { name: 'Sun Deck', icon: 'sun' },
    ];

    const items = provided.length > 0 ? provided : defaults;

    const results = [] as any[];
    for (const item of items) {
      const upserted = await prisma.amenity.upsert({
        where: { name: item.name },
        update: { icon: item.icon ?? null, isActive: item.isActive ?? true },
        create: { name: item.name, icon: item.icon ?? null, isActive: item.isActive ?? true },
      } as any);
      results.push(upserted);
    }

    return NextResponse.json({ inserted: results.length, amenities: results });
  } catch (error) {
    console.error('Error seeding amenities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
