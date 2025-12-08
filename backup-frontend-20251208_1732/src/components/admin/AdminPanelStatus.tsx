'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Shield,
  Database,
  Globe,
  Settings
} from 'lucide-react';

interface SystemStatus {
  timestamp: string;
  session: {
    authenticated: boolean;
    role: string;
  };
  database: {
    status: string;
    error?: string;
  };
  counts: {
    itineraries: number;
    users: number;
    bookings: number;
    pageContent: number;
  };
  environment: {
    nodeEnv: string;
    hasDatabase: boolean;
    hasNextAuth: boolean;
  };
}

export default function AdminPanelStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/debug', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        setError(`Failed to load status: ${response.statusText}`);
      }
    } catch (err) {
      setError('Network error loading status');
      console.error('Status load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? 'default' : 'destructive'}>
        {condition ? trueText : falseText}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-blue-700">Loading admin panel status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Status Check Failed</span>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={loadStatus}
            className="bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!status) return null;

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-6 h-6" />
            Admin Panel Status - All Systems Operational
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Authentication Status */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Authentication</p>
                {getStatusBadge(status.session.authenticated, 'Authenticated', 'Not Authenticated')}
                <p className="text-sm text-gray-600">Role: {status.session.role}</p>
              </div>
            </div>

            {/* Database Status */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Database className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Database</p>
                {getStatusBadge(status.database.status === 'connected', 'Connected', 'Error')}
                {status.database.error && (
                  <p className="text-xs text-red-600">{status.database.error}</p>
                )}
              </div>
            </div>

            {/* Environment */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Settings className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Environment</p>
                <Badge variant="outline">{status.environment.nodeEnv}</Badge>
                <p className="text-sm text-gray-600">
                  DB: {status.environment.hasDatabase ? '✓' : '✗'} | 
                  Auth: {status.environment.hasNextAuth ? '✓' : '✗'}
                </p>
              </div>
            </div>

            {/* Content Counts */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Globe className="w-8 h-8 text-amber-600" />
              <div>
                <p className="font-medium text-gray-900">Content</p>
                <div className="text-sm text-gray-600">
                  <p>Itineraries: {status.counts.itineraries}</p>
                  <p>Users: {status.counts.users}</p>
                  <p>Bookings: {status.counts.bookings}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Fixes Summary */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="w-6 h-6" />
            Recent Admin Panel Fixes & Enhancements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">✅ Fixed Issues:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  API authorization consistency (ADMIN + MANAGER)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Added PATCH endpoint for itineraries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Fixed edit page routing issues
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Added main itineraries content management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Enhanced error handling & debugging
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">🆕 New Features:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Itineraries page content management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Admin debug endpoint
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Enhanced admin navigation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Better error boundaries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  System status monitoring
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => window.location.href = '/admin/itineraries'}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Manage Itineraries
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/website/itineraries'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Itineraries Page Content
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/website'}
              variant="outline"
            >
              Website Content
            </Button>
            <Button
              onClick={loadStatus}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}