import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { contentModels } from '@/lib/content-models';

// GET /api/admin/content-models - Get all content models
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(contentModels);
  } catch (error) {
    console.error('Error fetching content models:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/content-models - Create or update a content model
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    
    // In a real implementation, you would save this to a database
    // For now, we'll just return the updated model
    return NextResponse.json({
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving content model:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
