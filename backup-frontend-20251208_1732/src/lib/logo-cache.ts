/**
 * Logo cache busting utilities
 * 
 * This module provides utilities to ensure logos are properly refreshed
 * across all components when they are updated in the admin panel.
 */

export interface LogoCacheConfig {
  timestamp?: number;
  forceRefresh?: boolean;
}

/**
 * Creates a cache-busted URL by appending a timestamp
 * @param url - The original URL
 * @param timestamp - The timestamp to use for cache busting (defaults to current time)
 * @returns Cache-busted URL
 */
export function createCacheBustUrl(url: string, timestamp?: number): string {
  if (!url) return url;
  
  const cacheBustParam = `t=${timestamp || Date.now()}`;
  
  // If URL already has query parameters, append with &
  if (url.includes('?')) {
    return `${url}&${cacheBustParam}`;
  }
  
  // Otherwise add as first query parameter
  return `${url}?${cacheBustParam}`;
}

/**
 * Triggers a logo update event across all components
 */
export function triggerLogoUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('logo-updated', {
      detail: { timestamp: Date.now() }
    }));
  }
}

/**
 * Triggers a general content update event
 */
export function triggerContentUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('content-updated', {
      detail: { timestamp: Date.now() }
    }));
  }
}

/**
 * Hook-like function to manage logo cache state
 * @returns Object with cache management functions
 */
export function createLogoCacheManager() {
  let timestamp = Date.now();
  
  return {
    getTimestamp: () => timestamp,
    refresh: () => {
      timestamp = Date.now();
      return timestamp;
    },
    createUrl: (url: string) => createCacheBustUrl(url, timestamp)
  };
}

/**
 * Default logo paths for fallbacks
 */
export const DEFAULT_LOGOS = {
  navbar: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png',
  footer: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png',
  admin: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png',
  mobile: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png',
  site: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png'
} as const;

/**
 * Logo cache storage keys for localStorage
 */
export const LOGO_CACHE_KEYS = {
  navbar: 'navbar_logo_cache',
  footer: 'footer_logo_cache', 
  admin: 'admin_logo_cache',
  mobile: 'mobile_logo_cache'
} as const;

/**
 * Clears all logo caches from localStorage
 */
export function clearLogoCache(): void {
  if (typeof window !== 'undefined') {
    Object.values(LOGO_CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    triggerLogoUpdate();
  }
}
