import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CleanBookingService } from "@/lib/services/unified-booking-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    console.log("📝 Received booking request:", body);

    // Check if this is a guest booking
    const isGuestBooking = body.isGuestBooking === true;
    
    // For authenticated bookings, require session
    if (!isGuestBooking && !session?.user) {
      return NextResponse.json(
        { error: "Please sign in to make a booking or continue as guest" },
        { status: 401 }
      );
    }

    // For guest bookings, validate guest information
    if (isGuestBooking) {
      if (!body.guestInfo?.name || !body.guestInfo?.email) {
        return NextResponse.json(
          { error: "Guest name and email are required" },
          { status: 400 }
        );
      }
    }

    // Determine booking type and prepare data
    const bookingType = body.packageId ? 'PACKAGE' : 'DAHABIYA';
    const itemId = body.packageId || body.dahabiyaId;
    
    if (!itemId) {
      return NextResponse.json(
        { error: "Missing dahabiya or package ID" },
        { status: 400 }
      );
    }

    const bookingData = {
      type: bookingType as 'DAHABIYA' | 'PACKAGE',
      dahabiyaId: body.dahabiyaId,
      packageId: body.packageId,
      startDate: body.startDate,
      endDate: body.endDate,
      guests: Number(body.guests) || 0,
      specialRequests: body.specialRequests || '',
      totalPrice: Number(body.totalPrice) || 0,
      guestDetails: body.guestDetails || [],
      guestInfo: isGuestBooking ? body.guestInfo : undefined,
      isGuestBooking
    };

    // Create the booking using clean booking service (includes atomic availability check)
    console.log("📝 Creating booking with atomic availability check...");
    const userId = isGuestBooking ? null : session!.user.id;
    const result = await CleanBookingService.createBooking(userId, bookingData);

    if (!result.success) {
      console.log("❌ Booking creation failed:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log("✅ Booking created successfully:", result.booking.bookingReference);
    return NextResponse.json(result.booking);

  } catch (error) {
    console.error("❌ Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to view bookings" },
        { status: 401 }
      );
    }

    // Check if admin is requesting all bookings
    const { searchParams } = new URL(request.url);
    const isAdmin = session.user.role === 'ADMIN';
    const getAllBookings = searchParams.get('all') === 'true';

    if (getAllBookings && isAdmin) {
      // Admin can get all bookings
      console.log("📋 Admin fetching all bookings");
      const bookings = await CleanBookingService.getAllBookings();
      return NextResponse.json({ bookings });
    } else {
      // Regular users get only their bookings
      console.log("📋 User fetching their bookings");
      const bookings = await CleanBookingService.getUserBookings(session.user.id);
      return NextResponse.json({ bookings });
    }
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
