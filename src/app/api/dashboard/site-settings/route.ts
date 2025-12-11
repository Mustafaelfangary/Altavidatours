import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all site settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.setting.findMany({
      where: { group: 'site' },
    });

    // Convert to key-value object
    const settingsObj: Record<string, string> = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT update all site settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Upsert each setting
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        await prisma.setting.upsert({
          where: { key },
          create: { key, value, group: 'site' },
          update: { value },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update site settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}



