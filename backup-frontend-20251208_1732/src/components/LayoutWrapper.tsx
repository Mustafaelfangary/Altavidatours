"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TravelOKNavbar from '@/components/TravelOKNavbar';
import TravelOKFooter from '@/components/TravelOKFooter';
import SocialSidebar from '@/components/SocialSidebar';
import TripPlannerWidget from '@/components/TripPlannerWidget';
import AutoZoomProvider from '@/components/ui/AutoZoomProvider';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if we're on an admin page
  const isAdmin = pathname.startsWith('/admin');
  const showNavbar = !isAdmin;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll for navbar height changes
  useEffect(() => {
    if (!showNavbar) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNavbar]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <AutoZoomProvider enabled={!isAdmin}>
      {showNavbar && (
        <TravelOKNavbar />
      )}
      <main
        className="transition-all duration-300"
        style={{
          paddingTop: showNavbar
            ? '0' // TravelOK navbar handles its own spacing
            : isAdmin
              ? '0' // Admin pages: no navbar
              : '0' // Non-admin pages without navbar
        }}
      >
        {children}
      </main>
      {showNavbar && <TravelOKFooter />}
      
      {/* Fixed Position Widgets */}
      {showNavbar && (
        <>
          <SocialSidebar />
          <TripPlannerWidget />
        </>
      )}
    </AutoZoomProvider>
  );
}
