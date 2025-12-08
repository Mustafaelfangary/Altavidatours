"use client";

import React, { useEffect } from 'react';
import { Home, MessageCircle, Bot } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useWhatsAppSettings } from '@/hooks/useWhatsAppSettings';

export default function FloatingDock() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { settings, loading } = useWhatsAppSettings();

  // Hide on some admin/login pages if desired
  const hidden = true; // Hide floating dock as requested

  const goHome = () => {
    if (session?.user?.role === 'ADMIN') router.push('/admin');
    else router.push('/');
  };

  const openWhatsApp = () => {
    if (!settings.enabled) return;
    const phone = (settings.phone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(settings.message || 'Hello!');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const toggleAssistant = () => {
    window.dispatchEvent(new CustomEvent('cleopatra-toggle'));
  };

  if (hidden) return null;

  return (
    <div className="fixed z-50 right-4 bottom-4 flex flex-col items-center space-y-3">
      {/* AI */}
      <button
        onClick={toggleAssistant}
        aria-label="Open AI Assistant"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white grid place-items-center shadow-xl hover:scale-105 transition-transform border border-white/50 overflow-hidden relative"
      >
        {/* Tiny 3D preview using model-viewer; fallback to crown emoji */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-transparent">
          {typeof window !== 'undefined' && (window as any).customElements?.get?.('model-viewer') ? (
            // @ts-ignore - model-viewer web component
            React.createElement('model-viewer', {
              src: '/images/cleopatra_-_egyptian_queen.glb',
              alt: 'AI',
              'auto-rotate': true,
              'rotation-per-second': '30deg',
              exposure: '1.1',
              style: { width: '100%', height: '100%', background: 'transparent' }
            })
          ) : (
            <div className="w-full h-full grid place-items-center">
              <div className="animate-pulse rounded-full w-4 h-4 bg-white/80" />
            </div>
          )}
        </div>
      </button>
      {/* WhatsApp */}
      {(!loading && settings.enabled) && (
        <button
          onClick={openWhatsApp}
          aria-label="WhatsApp"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white grid place-items-center shadow-xl hover:scale-105 transition-transform border border-white/50"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}
      {/* Home */}
      {!(pathname === '/' || pathname === '/admin') && (
        <button
          onClick={goHome}
          aria-label="Home"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-sky-600 to-sky-500 text-white grid place-items-center shadow-xl hover:scale-105 transition-transform border border-white/50"
        >
          <Home className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}
    </div>
  );
}