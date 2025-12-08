'use client';

import { useEffect } from 'react';

export default function LogoAutoRefresh() {
  useEffect(() => {
    // Disabled auto-refresh to prevent looping requests
    // Logo updates will be handled by manual refresh or page reload
    console.log('LogoAutoRefresh: Auto-refresh disabled');
    
    // If you need to manually refresh logos, dispatch this event:
    // window.dispatchEvent(new Event('logo-updated'));
  }, []);

  return null; // This component doesn't render anything
}