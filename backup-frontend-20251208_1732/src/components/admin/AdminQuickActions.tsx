'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Users,
  Calendar,
  Star,
  Image,
  Settings,
  FileText,
  MessageSquare,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface QuickStats {
  pendingReviews: number;
  pendingBookings: number;
  totalUsers: number;
  totalItineraries: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }>;
}

export default function AdminQuickActions() {
  const [stats, setStats] = useState<QuickStats>({
    pendingReviews: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalItineraries: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/quick-stats', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading quick stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'New Itinerary',
      description: 'Create a new journey',
      icon: Plus,
      href: '/admin/itineraries/new',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Manage Users',
      description: 'View and edit users',
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white'
    },
    {
      title: 'View Bookings',
      description: 'Check reservations',
      icon: Calendar,
      href: '/admin/bookings',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Reviews',
      description: 'Moderate reviews',
      icon: Star,
      href: '/admin/reviews',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      textColor: 'text-white',
      badge: stats.pendingReviews > 0 ? stats.pendingReviews : undefined
    },
    {
      title: 'Gallery',
      description: 'Manage images',
      icon: Image,
      href: '/admin/gallery',
      color: 'bg-pink-500 hover:bg-pink-600',
      textColor: 'text-white'
    },
    {
      title: 'Media Library',
      description: 'Upload files',
      icon: Upload,
      href: '/admin/media',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-white'
    },
    {
      title: 'Website Content',
      description: 'Edit site content',
      icon: FileText,
      href: '/admin/website',
      color: 'bg-teal-500 hover:bg-teal-600',
      textColor: 'text-white'
    },
    {
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-white'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'review': return Star;
      case 'user': return Users;
      case 'itinerary': return FileText;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Itineraries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItineraries}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <div className={`${action.color} ${action.textColor} p-4 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer relative`}>
                    <div className="flex flex-col items-center text-center">
                      <Icon className="w-8 h-8 mb-2" />
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs opacity-90 mt-1">{action.description}</p>
                    </div>
                    {action.badge && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <Button
            onClick={loadQuickStats}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 5).map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      <ActivityIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}