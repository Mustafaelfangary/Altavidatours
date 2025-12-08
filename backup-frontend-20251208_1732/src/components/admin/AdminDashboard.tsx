'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar as CalendarIcon, Package, Star, MessageSquare, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, href, trend }: StatCardProps) => {
  const content = (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

interface Booking {
  id: number;
  name: string;
  package: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalPackages: number;
  totalReviews: number;
  recentBookings: Booking[];
  recentMessages: Message[];
}

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalUsers: 0,
    totalPackages: 0,
    totalReviews: 0,
    recentBookings: [],
    recentMessages: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalBookings: 124,
          totalUsers: 89,
          totalPackages: 15,
          totalReviews: 42,
          recentBookings: [
            { id: 1, name: 'John Doe', package: 'Luxury Dahabiya Cruise', date: '2023-11-15', status: 'confirmed' },
            { id: 2, name: 'Jane Smith', package: 'Nile Explorer', date: '2023-11-10', status: 'pending' },
            { id: 3, name: 'Robert Johnson', package: 'Pharaohs Adventure', date: '2023-11-05', status: 'cancelled' },
          ],
          recentMessages: [
            { id: 1, name: 'Sarah Williams', email: 'sarah@example.com', message: 'I have a question about...', date: '2023-11-14' },
            { id: 2, name: 'Michael Brown', email: 'michael@example.com', message: 'Interested in group booking...', date: '2023-11-12' },
          ],
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export</Button>
          <Button>Create New</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<CalendarIcon className="h-4 w-4" />}
          href="/admin/bookings"
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-4 w-4" />}
          href="/admin/users"
          trend={{ value: '+5%', isPositive: true }}
        />
        <StatCard
          title="Packages"
          value={stats.totalPackages}
          icon={<Package className="h-4 w-4" />}
          href="/admin/packages"
        />
        <StatCard
          title="Reviews"
          value={stats.totalReviews}
          icon={<Star className="h-4 w-4" />}
          href="/admin/reviews"
          trend={{ value: '+8%', isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest bookings from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-gray-500">{booking.package}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{booking.date}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link href="/admin/bookings">
                <Button variant="outline">View all bookings</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentMessages.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium">{message.name}</p>
                    <p className="text-sm text-gray-500">{message.date}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                  <p className="text-sm text-blue-500 mt-2">{message.email}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Button variant="ghost">View all messages</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
