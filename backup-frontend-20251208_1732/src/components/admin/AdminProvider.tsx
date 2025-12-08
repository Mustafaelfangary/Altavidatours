'use client';

import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // While the session state is resolving, show a single loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-egyptian-blue-600" />
      </div>
    );
  }

  // If authenticated and has required role, render children
  if (status === 'authenticated' && session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return <>{children}</>;
  }

  // Otherwise, render null and let the admin layout handle redirects/denied states
  return null;
}
