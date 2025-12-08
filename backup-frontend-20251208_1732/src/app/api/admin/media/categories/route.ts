import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get actual counts from database
    const [imageCount, videoCount, documentCount] = await Promise.all([
      prisma.mediaAsset.count({ where: { type: 'IMAGE' } }),
      prisma.mediaAsset.count({ where: { type: 'VIDEO' } }),
      prisma.mediaAsset.count({ where: { type: 'DOCUMENT' } })
    ]);

    const categories = [
      { id: 'images', name: 'Images', slug: 'images', count: imageCount },
      { id: 'videos', name: 'Videos', slug: 'videos', count: videoCount },
      { id: 'documents', name: 'Documents', slug: 'documents', count: documentCount }
    ];

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching media categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
