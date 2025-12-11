import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Booking {
  id: string;
  user: {
    name: string;
  };
  cruise: {
    name: string;
  };
  createdAt: string;
  status: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Cruise</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(bookings ?? []).map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>{booking.cruise.name}</TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge>{booking.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

