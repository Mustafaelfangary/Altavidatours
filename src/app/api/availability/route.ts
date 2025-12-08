import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityService } from '@/lib/services/availability-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Support both dailyTourId and legacy dahabiyaId
    const { dailyTourId, dahabiyaId, startDate, endDate, guests } = body;
    const tourId = dailyTourId || dahabiyaId;

    if (!tourId || !startDate || !endDate || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const availability = await AvailabilityService.checkAvailability({
      dailyTourId: tourId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guests: parseInt(guests),
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Error checking availability' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Support both dailyTourId and legacy dahabiyaId
    const dailyTourId = searchParams.get('dailyTourId') || searchParams.get('dahabiyaId');
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    if (!dailyTourId) {
      return NextResponse.json(
        { error: 'Missing dailyTourId or dahabiyaId' },
        { status: 400 }
      );
    }

    const calendar = await AvailabilityService.getAvailabilityCalendar(
      dailyTourId,
      month,
      year
    );

    return NextResponse.json(calendar);
  } catch (error) {
    console.error('Calendar fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching availability calendar' },
      { status: 500 }
    );
  }
}