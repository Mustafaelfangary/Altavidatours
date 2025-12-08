"use client";

import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function HomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show home button on the home page or admin dashboard
  if (pathname === '/' || pathname === '/admin') {
    return null;
  }

  const handleClick = () => {
    // Redirect admin users to admin panel, regular users to home
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-[240px] right-5 sm:bottom-[260px] sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label={session?.user?.role === 'ADMIN' ? 'Go to Admin Dashboard' : 'Go to Home'}
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(59, 130, 246, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.4)'
      }}
    >
      <Home className="w-5 h-5 sm:w-6 sm:h-6" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }} />
    </button>
  );
}
