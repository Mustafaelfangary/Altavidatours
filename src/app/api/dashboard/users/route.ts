import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || undefined;

    const skip = (page - 1) * limit;

    const where = {
      OR: search
        ? [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ]
        : undefined,
      role: role as 'USER' | 'ADMIN' | undefined,
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          emailVerified: true,
          image: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, role } = body;

    if (!id || !role || !['USER', 'ADMIN'].includes(role)) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

