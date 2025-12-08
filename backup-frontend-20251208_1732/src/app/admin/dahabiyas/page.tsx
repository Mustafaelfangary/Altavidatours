"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, RefreshCw, Plus } from 'lucide-react';
import DahabiyaManagerWrapper from '@/components/admin/DahabiyaManagerWrapper';

export default function AdminDahabiyasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/admin/dahabiyas');
      return;
    }

    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [session, status, router]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-blue-50 to-navy-blue-100">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-blue-50 to-navy-blue-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have sufficient permissions to access the Dahabiyas management section.
              Please contact an administrator if you believe this is an error.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/admin')}
                className="w-full"
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-blue-50 to-navy-blue-100">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dahabiyas Management</h1>
            <p className="text-muted-foreground">Manage your dahabiya fleet and configurations</p>
          </div>
          <Button 
            onClick={() => {
              // This will be handled by the DahabiyaManager component's state
              const addButton = document.querySelector('button[aria-label="Add Dahabiya"]') as HTMLButtonElement;
              if (addButton) {
                addButton.click();
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Dahabiya
          </Button>
        </div>
        <DahabiyaManagerWrapper />
      </div>
    </div>
  );
}