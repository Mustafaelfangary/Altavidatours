'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Prisma, Status } from '@prisma/client';

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  status: Status;
  totalPrice: number;
  guests: number;
  user: {
    name: string;
    email: string;
  };
  cruise?: {
    name: string;
  };
  package?: {
    name: string;
  };
  payment?: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  };
};

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const router = useRouter();

  const searchQuery: Prisma.BookingWhereInput = {
    OR: [
      {
        user: {
          name: {
            contains: searchTerm,
            mode: 'insensitive' as Prisma.QueryMode
          }
        }
      },
      {
        user: {
          email: {
            contains: searchTerm,
            mode: 'insensitive' as Prisma.QueryMode
          }
        }
      },
      {
        id: {
          contains: searchTerm,
          mode: 'insensitive' as Prisma.QueryMode
        }
      }
    ],
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {})
  };
  
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/bookings');
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    // Add status change logic here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-x-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Booking Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, email, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as Status | 'ALL')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {booking.cruise?.name || booking.package?.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Booking ID: {booking.id}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(booking.startDate), 'PP')} -{' '}
                      {format(new Date(booking.endDate), 'PP')}
                    </span>
                    <span>•</span>
                    <span>{booking.guests} guests</span>
                    <span>•</span>
                    <span>${booking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">{booking.user.name}</span> •{' '}
                    <span className="text-muted-foreground">{booking.user.email}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={getStatusColor(booking.status)}
                    variant="secondary"
                  >
                    {booking.status}
                  </Badge>
                  {booking.payment && (
                    <Badge variant="outline">
                      Payment: {booking.payment.status}
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {booking.status === 'PENDING' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {bookings.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No bookings found matching your criteria.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

