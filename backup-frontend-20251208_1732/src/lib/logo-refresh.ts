// Global logo refresh utility
// Ensures all logos across the website update when changed in admin panel

export function refreshAllLogos() {
  // Dispatch events to all components listening for logo updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('logo-updated'));
    window.dispatchEvent(new Event('content-updated'));
    
    // Force reload all images with logo in src
    const logoImages = document.querySelectorAll('img[src*="logo"]');
    logoImages.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      const src = htmlImg.src;
      // Add/update timestamp parameter
      const url = new URL(src, window.location.origin);
      url.searchParams.set('t', Date.now().toString());
      htmlImg.src = url.toString();
    });
    
    console.log('✅ All logos refreshed');
  }
}

// Auto-refresh logos every 30 seconds to catch admin changes
export function startLogoAutoRefresh(intervalMs: number = 30000) {
  if (typeof window === 'undefined') return () => {};
  
  // Disabled to prevent excessive API calls and looping
  // Logo updates will be handled by manual refresh or page reload
  console.log('Logo auto-refresh is disabled. Use manual refresh to update logos.');
  
  return () => {};
}

// Call this after uploading a new logo in admin
export async function notifyLogoUpdate() {
  if (typeof window === 'undefined') return;
  
  try {
    // Fetch the new logo to get timestamp
    const response = await fetch('/api/logo', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const data = await response.json();
    
    // Update localStorage
    localStorage.setItem('logo-timestamp', data.timestamp.toString());
    localStorage.setItem('logo-url', data.logoUrl);
    
    // Refresh all logos
    refreshAllLogos();
    
    return data;
  } catch (error) {
    console.error('Failed to notify logo update:', error);
  }
}
