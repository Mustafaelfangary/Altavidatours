import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/travel-services
// Supports: page, limit, active=true|false, type=all|tours|cruises|experiences|packages (free-form string), featured=true|false (optional; ignored if field not present)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const activeOnly = searchParams.get('active') === 'true';
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const skip = (Number.isNaN(page) ? 1 : page - 1) * (Number.isNaN(limit) ? 12 : limit);

    const where: any = {};
    if (activeOnly) where.isActive = true;
    if (type && type !== 'all') {
      // Map known aliases to serviceType if needed; otherwise use provided type as-is
      where.serviceType = type;
    }
    // featured parameter currently ignored as TravelService model has no isFeatured field in schema

    const [services, total] = await Promise.all([
      prisma.travelService.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number.isNaN(limit) ? 12 : limit,
      }),
      prisma.travelService.count({ where }),
    ]);

    return NextResponse.json({
      services,
      total,
      pages: Math.ceil(total / (Number.isNaN(limit) ? 12 : limit)) || 1,
      currentPage: Number.isNaN(page) ? 1 : page,
    });
  } catch (error) {
    console.error('Error fetching travel services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch travel services' },
      { status: 500 }
    );
  }
}
