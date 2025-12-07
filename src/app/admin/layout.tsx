'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SessionProvider, useSession, signIn } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminProvider } from '@/components/admin/AdminProvider';
import AdminTextFixer from '@/components/admin/AdminTextFixer';
import { Loader2 } from 'lucide-react';
import '../globals.css';
import '../../styles/admin.minimal.css';
import '../../styles/admin-contrast-fix.minimal.css';

// Wrapper component to handle session and loading state
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    // Only act once client is mounted and status is resolved
    if (!isClient || status === 'loading') return;

    // Redirect to signin if not authenticated, but avoid loop if already on signin
    if (status === 'unauthenticated') {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/auth/signin')) {
        router.push('/auth/signin?callbackUrl=/admin');
      }
      return;
    }

    // Check if user is admin
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [status, session, router, isClient]);

  // Show loading state while checking session on the client
  if (!isClient || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-egyptian-blue-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    // Render nothing momentarily; useEffect will handle redirect without flicker
    return null;
  }
  
  // If not an admin but authenticated, show access denied
  if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-4">You don't have permission to access the admin panel.</p>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col admin-layout">
      <AdminTextFixer />
      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AdminProvider>
          <AdminLayoutContent>
            {children}
          </AdminLayoutContent>
        </AdminProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
