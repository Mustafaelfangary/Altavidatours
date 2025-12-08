import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, status } = createPageSchema.parse(body);

    const existingPage = await prisma.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        status,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}