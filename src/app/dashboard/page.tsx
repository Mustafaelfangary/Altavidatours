"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  Ship,
  Package,
  MessageSquare,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react';
import { RevenueChart } from '@/components/RevenueChart';
import { BookingStats } from '@/components/BookingStats';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalDahabiyat: number;
  totalPackages: number;
  totalContacts: number;
  totalMediaAssets: number;
  totalReviews: number;
  averageRating: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  bookingGrowth: number;
  revenueGrowth: number;
  currentMonthBookings: number;
  lastMonthBookings: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  recentBookings: Array<{
    id: string;
    customer: string;
    dahabiya: string;
    date: string;
    amount: string;
    status: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalDahabiyat: 0,
    totalPackages: 0,
    totalContacts: 0,
    totalMediaAssets: 0,
    totalReviews: 0,
    averageRating: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    bookingGrowth: 0,
    revenueGrowth: 0,
    currentMonthBookings: 0,
    lastMonthBookings: 0,
    currentMonthRevenue: 0,
    lastMonthRevenue: 0,
    recentBookings: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: `${stats.bookingGrowth >= 0 ? '+' : ''}${stats.bookingGrowth.toFixed(1)}%`,
      trendUp: stats.bookingGrowth >= 0
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}%`,
      trendUp: stats.revenueGrowth >= 0
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: `${stats.totalUsers} registered`,
      trendUp: true
    },
    {
      title: "Average Rating",
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A',
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: `${stats.totalReviews} reviews`,
      trendUp: true
    }
  ];

  const quickActions = [
    {
      title: "Add Dahabiya",
      description: "Create a new dahabiya listing",
      icon: Ship,
      href: "/dashboard/dahabiyat/new",
      color: "bg-blue-500"
    },
    {
      title: "Create Package",
      description: "Design a new cruise package",
      icon: Package,
      href: "/dashboard/packages/new",
      color: "bg-green-500"
    },
    {
      title: "View Contacts",
      description: "Check customer inquiries",
      icon: MessageSquare,
      href: "/dashboard/contacts",
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "View detailed reports",
      icon: Eye,
      href: "/dashboard/analytics",
      color: "bg-orange-500"
    }
  ];

  // Recent bookings now come from the API via stats.recentBookings

  // Mock data for charts
  const monthlyRevenue = [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 78000, 85000];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-3">
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.trendUp ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dahabiyat</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDahabiyat}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-muted-foreground">Available vessels</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Packages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPackages}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-muted-foreground">Tour packages</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contacts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalContacts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-muted-foreground">Customer inquiries</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Media Assets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMediaAssets}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-muted-foreground">Images & videos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart monthlyRevenue={monthlyRevenue} months={months} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a key={index} href={action.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </Button>
                  </a>
                );
              })}
            </CardContent>
          </Card>

          {/* Booking Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingStats
                totalBookings={stats.totalBookings}
                confirmedBookings={stats.confirmedBookings}
                pendingBookings={stats.pendingBookings}
                cancelledBookings={stats.cancelledBookings}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <a href="/dashboard/bookings">
              <Button variant="ghost">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentBookings.length > 0 ? stats.recentBookings.map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground">{booking.dahabiya}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{booking.amount}</p>
                  <p className="text-sm text-muted-foreground">{booking.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent bookings found</p>
                <p className="text-sm">Bookings will appear here once customers start making reservations</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

