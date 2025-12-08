import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST create testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        title: data.title || null,
        company: data.company || null,
        content: data.content,
        rating: data.rating || 5,
        avatarUrl: data.avatarUrl || null,
        featured: data.featured || false,
        isActive: data.isActive ?? true,
        tripType: data.tripType || null,
        order: data.order || 0,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

