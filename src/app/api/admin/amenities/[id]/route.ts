import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/amenities/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = params;
    const amenity = await prisma.amenity.findUnique({ where: { id } as any });
    if (!amenity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(amenity);
  } catch (error) {
    console.error('Error fetching amenity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/amenities/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = params;
    const data = await request.json();
    const updated = await prisma.amenity.update({
      where: { id } as any,
      data: {
        name: data.name,
        icon: data.icon ?? null,
        isActive: data.isActive !== undefined ? !!data.isActive : undefined,
      } as any,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating amenity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/amenities/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = params;
    await prisma.amenity.delete({ where: { id } as any });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting amenity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
