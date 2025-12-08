'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  FileEdit,
  Brain,
  Clock,
  TrendingUp,
  Activity,
  Shield,
  MessageSquare,
  BookOpen,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdminOverviewData {
  lastLogins: {
    users: Array<{ name: string; email: string; lastLogin: Date; role: string }>;
    admins: Array<{ name: string; email: string; lastLogin: Date; role: string }>;
  };
  lastBooking: {
    bookingReference: string;
    guestName: string;
    createdAt: Date;
    totalPrice: number;
    status: string;
  } | null;
  lastSignup: {
    name: string;
    email: string;
    createdAt: Date;
  } | null;
  lastContentEdit: {
    page: string;
    section: string;
    updatedAt: Date;
    updatedBy: string;
  } | null;
  lastMemoryShare: {
    title: string;
    sharedBy: string;
    createdAt: Date;
  } | null;
  recentActivity: {
    totalBookingsToday: number;
    totalSignupsToday: number;
    pendingBookings: number;
    activeUsers: number;
  };
  chatbotStats: {
    conversationsToday: number;
    totalConversations: number;
  };
}

export default function AdminDataOverview() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOverviewData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOverviewData = async () => {
    try {
      const response = await fetch('/api/admin/overview', {
        cache: 'no-store'
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading dashboard overview...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Real-time Activity Overview */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Activity className="w-5 h-5" />
            Real-Time Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Today's Bookings */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-800">Today</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.recentActivity.totalBookingsToday}</p>
              <p className="text-sm text-gray-600">Bookings Today</p>
            </div>

            {/* Today's Signups */}
            <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <UserPlus className="w-8 h-8 text-green-600" />
                <Badge className="bg-green-100 text-green-800">New</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.recentActivity.totalSignupsToday}</p>
              <p className="text-sm text-gray-600">New Signups</p>
            </div>

            {/* Pending Bookings */}
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.recentActivity.pendingBookings}</p>
              <p className="text-sm text-gray-600">Awaiting Review</p>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-800">Active</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.recentActivity.activeUsers}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Grid - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Last Booking */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              Latest Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.lastBooking ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{data.lastBooking.bookingReference}</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">{data.lastBooking.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">{data.lastBooking.guestName}</p>
                <p className="text-lg font-bold text-green-600">${data.lastBooking.totalPrice}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(data.lastBooking.createdAt), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        {/* Last Signup */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Latest Signup
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.lastSignup ? (
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{data.lastSignup.name}</p>
                <p className="text-sm text-gray-600 truncate">{data.lastSignup.email}</p>
                <Badge className="bg-blue-100 text-blue-800 text-xs">New User</Badge>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(data.lastSignup.createdAt), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No signups yet</p>
            )}
          </CardContent>
        </Card>

        {/* Last Content Edit */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-purple-600" />
              Latest Content Edit
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.lastContentEdit ? (
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{data.lastContentEdit.page}</p>
                <p className="text-sm text-gray-600">{data.lastContentEdit.section}</p>
                <p className="text-xs text-gray-500">By: {data.lastContentEdit.updatedBy}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(data.lastContentEdit.updatedAt), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent edits</p>
            )}
          </CardContent>
        </Card>

        {/* Last Memory Share */}
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-pink-600" />
              Latest Memory Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.lastMemoryShare ? (
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 line-clamp-2">{data.lastMemoryShare.title}</p>
                <p className="text-sm text-gray-600">Shared by: {data.lastMemoryShare.sharedBy}</p>
                <Badge className="bg-pink-100 text-pink-800 text-xs">Memory</Badge>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(data.lastMemoryShare.createdAt), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No memories shared</p>
            )}
          </CardContent>
        </Card>

        {/* AI Chatbot Stats */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              AI Chatbot Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-indigo-600">{data.chatbotStats.conversationsToday}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">{data.chatbotStats.totalConversations}</p>
              </div>
              <Badge className="bg-indigo-100 text-indigo-800 text-xs">AI Powered</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Last Admin Login */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-600" />
              Recent Admin Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.lastLogins.admins.length > 0 ? (
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{data.lastLogins.admins[0].name}</p>
                <p className="text-sm text-gray-600 truncate">{data.lastLogins.admins[0].email}</p>
                <Badge className="bg-orange-100 text-orange-800 text-xs">{data.lastLogins.admins[0].role}</Badge>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(data.lastLogins.admins[0].lastLogin), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No admin activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent User Logins */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            Recent User Logins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.lastLogins.users.slice(0, 6).map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {data.lastLogins.users.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No recent user logins</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
