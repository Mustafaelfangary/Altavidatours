"use client";

import { useEffect, useRef, useState } from 'react';
import LogoLoader from './LogoLoader';
import { createPortal } from 'react-dom';

export default function GlobalLoadingInterceptor() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const showDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let activeRequests = 0;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;
    const armSafetyTimer = () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      // Force hide after 2 seconds if overlay is still visible (shorter to avoid long overlays)
      safetyTimer = setTimeout(() => {
        activeRequests = 0;
        setIsLoading(false);
      }, 2000);
    };

    // Override fetch to show loading
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // Only show loading for API calls that might take time
      const url = (typeof input === 'string' ? input : input.toString()) || '';
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      const shouldShowLoading = !isAdminRoute && url.includes('/api/') && 
        !url.includes('/api/logo') && // Don't show loading for logo API
        !url.includes('/api/auth/') && // Don't show loading for auth
        !url.includes('/api/website-content') && // Skip content sync updates to avoid double overlays
        !url.includes('?t=') // Don't show for cache busting requests from navigation
      ;

      if (shouldShowLoading) {
        activeRequests++;
        // Small delay (200ms) to avoid flashing on super-fast requests
        if (showDelayTimerRef.current) clearTimeout(showDelayTimerRef.current);
        showDelayTimerRef.current = setTimeout(() => {
          if (activeRequests > 0) {
            setIsLoading(true);
            armSafetyTimer();
          }
        }, 200);
      }

      try {
        const response = await originalFetch(input as any, init as any);
        return response;
      } finally {
        if (shouldShowLoading) {
          activeRequests--;
          if (activeRequests === 0) {
            // Add small delay to prevent flashing
            setTimeout(() => {
              if (activeRequests === 0) {
                setIsLoading(false);
              }
            }, 120);
          }
        }
      }
    };

    return () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      if (showDelayTimerRef.current) clearTimeout(showDelayTimerRef.current);
      window.fetch = originalFetch;
    };
  }, [mounted]);

  if (!mounted || !isLoading) {
    return null;
  }

  const loaderElement = (
    <div 
      className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[10000]"
      style={{ transition: 'opacity 0.2s ease-in-out' }}
    >
      <LogoLoader
        size="lg"
        variant="minimal"
        fullScreen={false}
        className="drop-shadow-lg"
      />
    </div>
  );

  return createPortal(loaderElement, document.body);
}
