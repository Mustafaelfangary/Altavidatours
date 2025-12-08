import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma'; // Uncomment when database is ready

// Types matching the frontend
interface ScheduleEntry {
  id: string;
  month: string;
  year: string;
  startDate: string;
  endDate: string;
  nights: number;
  startPoint: string;
  endPoint: string;
  doublePrice: string;
  singleSupplement: string;
  detailedItinerary: string;
  notes: string;
  isActive: boolean;
  sortOrder: number;
}

// GET - Fetch all schedule entries
export async function GET() {
  try {
    // For now, return empty array to use fallback data
    // TODO: Implement database retrieval when schema is ready
    return NextResponse.json({ 
      entries: [],
      success: true 
    });
  } catch (error) {
    console.error('Failed to fetch schedule entries:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch schedule entries',
      entries: []
    }, { status: 500 });
  }
}

// Proper authentication check using NextAuth
async function checkAuth(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  // Only allow ADMIN and MANAGER roles to edit schedule entries
  return !!(session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role));
}

// POST - Create a new schedule entry
export async function POST(request: NextRequest) {
  try {
    // Check authentication for admin access
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['month', 'year', 'startDate', 'endDate', 'nights', 'startPoint', 'endPoint', 'doublePrice', 'singleSupplement'];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // TODO: Implement database creation when schema is ready
    const newEntry: ScheduleEntry = {
      id: Date.now().toString(), // Temporary ID generation
      month: data.month,
      year: data.year,
      startDate: data.startDate,
      endDate: data.endDate,
      nights: parseInt(data.nights),
      startPoint: data.startPoint,
      endPoint: data.endPoint,
      doublePrice: data.doublePrice,
      singleSupplement: data.singleSupplement,
      detailedItinerary: data.detailedItinerary || 'Detailed Itinerary for this Tour',
      notes: data.notes || '',
      isActive: data.isActive !== false,
      sortOrder: data.sortOrder || 999
    };

    return NextResponse.json({ 
      entry: newEntry,
      success: true 
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create schedule entry:', error);
    return NextResponse.json({ 
      error: 'Failed to create schedule entry' 
    }, { status: 500 });
  }
}

// PUT - Update an existing schedule entry
export async function PUT(request: NextRequest) {
  try {
    // Check authentication for admin access
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    // TODO: Implement database update when schema is ready
    const updatedEntry: ScheduleEntry = {
      id: data.id,
      month: data.month,
      year: data.year,
      startDate: data.startDate,
      endDate: data.endDate,
      nights: parseInt(data.nights) || 0,
      startPoint: data.startPoint,
      endPoint: data.endPoint,
      doublePrice: data.doublePrice,
      singleSupplement: data.singleSupplement,
      detailedItinerary: data.detailedItinerary || 'Detailed Itinerary for this Tour',
      notes: data.notes || '',
      isActive: data.isActive !== false,
      sortOrder: data.sortOrder || 999
    };

    return NextResponse.json({ 
      entry: updatedEntry,
      success: true 
    });
  } catch (error) {
    console.error('Failed to update schedule entry:', error);
    return NextResponse.json({ 
      error: 'Failed to update schedule entry' 
    }, { status: 500 });
  }
}

// DELETE - Delete a schedule entry
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication for admin access
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    // TODO: Implement database deletion when schema is ready
    // For now, just return success
    return NextResponse.json({ 
      success: true,
      message: 'Schedule entry deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete schedule entry:', error);
    return NextResponse.json({ 
      error: 'Failed to delete schedule entry' 
    }, { status: 500 });
  }
}
