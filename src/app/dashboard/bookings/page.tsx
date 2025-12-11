"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { exportBookingsToExcel } from "@/lib/excel";
import { Download } from "lucide-react";

interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string | null;
  dailyTour?: {
    name: string;
    images?: { url: string }[];
  } | null;
  dahabiya?: {
    name: string;
    images?: { url: string }[];
  } | null;
  cabin?: {
    name: string;
    images?: { url: string }[];
  } | null;
  user: {
    name: string | null;
    email: string;
    phoneNumber?: string | null;
  } | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const fetchBookings = async () => {
      try {
        // Use admin endpoint for dashboard
        const res = await fetch("/api/dashboard/bookings/manage");
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        // Handle paginated response
        setBookings(data.bookings || data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, router]);

  const handleExport = async () => {
    try {
      await exportBookingsToExcel(bookings);
    } catch (error) {
      console.error('Error exporting bookings:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {booking.dailyTour?.name || booking.dahabiya?.name || 'Unknown Tour'}
                    {booking.cabin && <span className="text-sm font-normal text-gray-500 ml-2">({booking.cabin.name})</span>}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    booking.status === "CONFIRMED"
                      ? "default"
                      : booking.status === "PENDING"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p>{booking.user?.name || booking.user?.email || 'Unknown Customer'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Guests</p>
                  <p>{booking.guests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Price</p>
                  <p>${Number(booking.totalPrice).toFixed(2)}</p>
                </div>
                {booking.specialRequests && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Special Requests</p>
                    <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}


