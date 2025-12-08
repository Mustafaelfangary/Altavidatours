'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Users, Ship, Calendar, DollarSign, Package, User } from 'lucide-react';
import { RecentBookings } from './RecentBookings';

type MetricCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  loading?: boolean;
};

function MetricCard({ title, value, description, icon, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-20 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    activeCruises: 0,
    upcomingDepartures: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    totalCruises: 0,
    totalPackages: 0,
    recentBookings: [],
    revenueData: [],
    bookingData: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, revenueRes, bookingsRes] = await Promise.all([
        fetch('/api/dashboard/metrics'),
        fetch('/api/dashboard/revenue'),
        fetch('/api/dashboard/bookings'),
      ]);

      const [metricsData, revenueData, bookingsData] = await Promise.all([
        metricsRes.json(),
        revenueRes.json(),
        bookingsRes.json(),
      ]);

      setMetrics({
        ...metricsData,
        revenueData,
        bookingData: bookingsData,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      } as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.monthlyRevenue?.toLocaleString() ?? '0'}`}
          description="Revenue this month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
        />
        <MetricCard
          title="Total Bookings"
          value={metrics.totalBookings}
          description="Total bookings this month"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
        />
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          description="Total registered users"
          icon={<User className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
        />
        <MetricCard
          title="Total Cruises"
          value={metrics.totalCruises}
          description="Total available cruises"
          icon={<Ship className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
        />
        <MetricCard
          title="Total Packages"
          value={metrics.totalPackages}
          description="Total tour packages"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue" className="space-y-4">
              <div className="h-[300px]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            <TabsContent value="bookings" className="space-y-4">
              <div className="h-[300px]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.bookingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
        <div className="col-span-3">
          <RecentBookings bookings={metrics.recentBookings} />
        </div>
      </div>
    </div>
  );
}