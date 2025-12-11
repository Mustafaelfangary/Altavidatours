import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        status,
      },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

