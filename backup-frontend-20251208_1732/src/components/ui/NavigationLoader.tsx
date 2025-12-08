"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import LogoLoader from './LogoLoader';
import { createPortal } from 'react-dom';

export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip initial mount to avoid an initial flash
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Delay showing to avoid flash on very fast navigations
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;

    showTimer = setTimeout(() => {
      setIsLoading(true);
      // safety: force hide after 2 seconds in case something goes wrong
      safetyTimer = setTimeout(() => setIsLoading(false), 2000);
    }, 250);

    // Hide shortly after route settles for smooth transition
    hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (safetyTimer) clearTimeout(safetyTimer);
      setIsLoading(false);
    };
  }, [pathname]);

  // Handle link clicks to show loading, but only if navigation likely takes time
  useEffect(() => {
    if (!mounted) return;

    const handleLinkClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
        // Check if it's an internal link
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          // Small delayed show to avoid flicker on super fast client transitions
          const delayed = setTimeout(() => setIsLoading(true), 200);
          // safety hide in case navigation stalls
          const safety = setTimeout(() => setIsLoading(false), 2000);
          // Cleanup these timers if navigation completes quickly
          setTimeout(() => {
            clearTimeout(delayed);
            clearTimeout(safety);
          }, 500);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [mounted]);

  if (!mounted || !isLoading) {
    return null;
  }

  const loaderElement = (
    <div 
      className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]"
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
