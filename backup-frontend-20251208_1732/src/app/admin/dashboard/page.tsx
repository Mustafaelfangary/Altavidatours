"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Package, 
  CreditCard, 
  ArrowUp, 
  ArrowDown,
  Loader2,
  AlertCircle,
  Plus,
  Settings,
  UserPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

// Utility function to combine class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface RecentBooking {
  id: string;
  bookingNumber: string;
  startDate: string;
  totalPrice: number;
  status: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeTours: number;
  upcomingTours: number;
  recentBookings: RecentBooking[];
  recentUsers: RecentUser[];
  success: boolean;
  error?: string;
}

const StatCard = ({ title, value, change, changeType, icon: Icon, href }: StatCardProps) => (
  <a href={href} className="group block">
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
            {changeType === 'increase' ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  </a>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stats');
        }
        
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    { 
      title: 'Total Bookings', 
      value: stats?.totalBookings?.toLocaleString() || '0', 
      change: '+12%',
      changeType: 'increase' as const,
      icon: Calendar,
      href: '/admin/bookings'
    },
    { 
      title: 'Total Revenue', 
      value: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(stats?.totalRevenue || 0), 
      change: '+19%',
      changeType: 'increase' as const,
      icon: CreditCard,
      href: '/admin/revenue'
    },
    { 
      title: 'Active Tours', 
      value: stats?.activeTours?.toString() || '0',
      change: stats?.upcomingTours ? `${stats.upcomingTours} upcoming` : undefined,
      changeType: 'increase' as const,
      icon: Package,
      href: '/admin/tours'
    },
    { 
      title: 'Total Users', 
      value: stats?.totalUsers?.toLocaleString() || '0', 
      change: stats?.recentUsers ? `${stats.recentUsers.length} new this week` : undefined,
      changeType: 'increase' as const,
      icon: Users,
      href: '/admin/users'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-red-500">Error loading dashboard: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest bookings from your customers</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/bookings')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{booking.bookingNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.user?.name || 'Guest'} • {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent bookings</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Newly registered users</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-medium text-primary">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name || user.email}</p>
                      {user.name && (
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent users</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/admin/bookings/new')}
              >
                <Plus className="h-6 w-6" />
                <span>New Booking</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/admin/tours/new')}
              >
                <Package className="h-6 w-6" />
                <span>Add Tour</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/admin/users/new')}
              >
                <UserPlus className="h-6 w-6" />
                <span>Add User</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/admin/settings')}
              >
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
