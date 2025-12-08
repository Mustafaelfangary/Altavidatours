'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';
  totalPrice: number;
  guests: number;
  cruise?: {
    name: string;
    images: { url: string }[];
  };
  package?: {
    name: string;
  };
  cabin?: {
    name: string;
  };
  payment?: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  };
};

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast('Failed to load bookings. Please try again.', {
        style: { backgroundColor: 'red', color: 'white' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (response.ok) {
        toast('Booking cancelled successfully.');
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
      } else {
        toast('Failed to cancel booking. Please try again.', {
          style: { backgroundColor: 'red', color: 'white' }
        });
      }
    } catch (error) {
      toast('Failed to cancel booking. Please try again.', {
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[200px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">You haven&apos;t made any bookings yet.</p>
          <Button onClick={() => router.push('/cruises')}>Browse Cruises</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <CardTitle>
              {booking.cruise?.name || booking.package?.name || 'Booking'} - {booking.cabin?.name}
            </CardTitle>
            <CardDescription>
              {format(new Date(booking.startDate), 'PPP')} -{' '}
              {format(new Date(booking.endDate), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Guests: {booking.guests}</p>
                <p className="text-sm font-medium">
                  Total Price: ${booking.totalPrice.toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
                {booking.payment && (
                  <Badge variant="outline">
                    Payment: {booking.payment.status}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/bookings/${booking.id}`)}
            >
              View Details
            </Button>
            {booking.status === 'PENDING' && (
              <Button
                variant="destructive"
                onClick={() => handleCancelBooking(booking.id)}
              >
                Cancel Booking
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}