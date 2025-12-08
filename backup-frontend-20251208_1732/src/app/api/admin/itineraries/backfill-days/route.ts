import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/admin/itineraries/backfill-days
// Migrates Itinerary.daysJson (if present) into relational ItineraryDay rows.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const limit = typeof body?.limit === 'number' ? Math.max(1, Math.min(200, body.limit)) : 100;

    // Find itineraries that have daysJson and 0 relational days
    const itineraries = await prisma.itinerary.findMany({
      where: {
        AND: [
          { NOT: { daysJson: null } },
        ],
      },
      include: { days: true },
      take: limit,
    } as any);

    let migrated = 0;
    for (const it of itineraries) {
      // Skip if already has relational days
      if (Array.isArray((it as any).days) && (it as any).days.length > 0) continue;

      const src = Array.isArray((it as any).daysJson) ? (it as any).daysJson : [];
      if (src.length === 0) continue;

      await prisma.itinerary.update({
        where: { id: it.id },
        data: {
          days: {
            create: src.map((d: any, idx: number) => ({
              dayNumber: d?.dayNumber ?? idx + 1,
              title: d?.title || `Day ${idx + 1}`,
              description: d?.description || '',
              location: d?.location || null,
              activities: Array.isArray(d?.activities) ? d.activities : [],
              meals: Array.isArray(d?.meals) ? d.meals : [],
              coordinates: d?.coordinates || null,
              images: Array.isArray(d?.images) ? d.images : [],
              videoUrl: d?.videoUrl || null,
              highlights: Array.isArray(d?.highlights) ? d.highlights : [],
              optionalTours: Array.isArray(d?.optionalTours) ? d.optionalTours : [],
            })),
          },
        },
      } as any);
      migrated += src.length;
    }

    return NextResponse.json({ processed: itineraries.length, migratedRows: migrated });
  } catch (error) {
    console.error('Error backfilling itinerary days:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
