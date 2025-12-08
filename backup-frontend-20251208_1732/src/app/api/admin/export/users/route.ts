import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Create CSV content
    const csvHeader = 'ID,Name,Email,Role,Created At,Updated At,Email Verified\n';
    const csvRows = users.map(user => {
      return [
        user.id,
        `"${user.name || ''}"`,
        user.email,
        user.role,
        user.createdAt.toISOString(),
        user.updatedAt.toISOString(),
        user.emailVerified ? 'Yes' : 'No'
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting users:', error);
    return NextResponse.json({ error: 'Failed to export users' }, { status: 500 });
  }
}