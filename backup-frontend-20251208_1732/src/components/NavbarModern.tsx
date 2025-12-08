"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ReactNode, ChangeEvent } from 'react';
import Image from 'next/image';
import { LogOut, User, LayoutDashboard, UserCircle, Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { usePathname } from 'next/navigation';
import { useContent } from '@/hooks/useContent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interfaces for API responses
interface TravelServiceData {
  id: string;
  name: string;
  slug?: string;
  serviceType?: string;
}

interface DestinationData {
  id: string;
  name: string;
  slug?: string;
  country?: string;
}

interface PackageData {
  id: string;
  name: string;
  slug?: string;
}

interface AdminLogo {
  key: string;
  content?: string;
}

import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flagSvg: '/images/flags/us.svg', name: 'English' },
  { code: 'ar', label: 'العربية', flagSvg: '/images/flags/eg.svg', name: 'العربية' },
  { code: 'fr', label: 'Français', flagSvg: '/images/flags/fr.svg', name: 'Français' },
  { code: 'de', label: 'Deutsch', flagSvg: '/images/flags/de.svg', name: 'Deutsch' },
  { code: 'es', label: 'Español', flagSvg: '/images/flags/es.svg', name: 'Español' },
  { code: 'it', label: 'Italiano', flagSvg: '/images/flags/it.svg', name: 'Italiano' },
  { code: 'ru', label: 'Русский', flagSvg: '/images/flags/ru.svg', name: 'Русский' },
  { code: 'zh', label: '中文', flagSvg: '/images/flags/cn.svg', name: '中文' },
  { code: 'ja', label: '日本語', flagSvg: '/images/flags/jp.svg', name: '日本語' },
];

// Import translation files
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';
import frTranslations from '@/locales/fr.json';
import deTranslations from '@/locales/de.json';
import esTranslations from '@/locales/es.json';
import itTranslations from '@/locales/it.json';
import ruTranslations from '@/locales/ru.json';
import zhTranslations from '@/locales/zh.json';
import jaTranslations from '@/locales/ja.json';

const translations: Record<string, any> = {
  en: enTranslations,
  ar: arTranslations,
  fr: frTranslations,
  de: deTranslations,
  es: esTranslations,
  it: itTranslations,
  ru: ruTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
};

// Remove local LanguageProvider; use centralized provider mounted at app root
/*
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage;
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    setMounted(true);
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    window.dispatchEvent(new Event('languageChange'));
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language] || translations.en;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}
*/
// useLanguage comes from centralized LanguageContext

export default function NavbarModern() {
  const { data: session } = useSession();
  const { getContent } = useContent({ page: 'branding_settings' });
  const [logoUrl, setLogoUrl] = useState('/altavida-logo-1.png');
  const [logoTimestamp, setLogoTimestamp] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create a cache-busting URL by appending a stable timestamp from the API
  const getLogoCacheBustUrl = (url: string) => {
    if (!isClient) return url;
    if (!url) return url;
    if (!logoTimestamp) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}t=${logoTimestamp}`;
  };

  // Fetch logo from admin settings
  useEffect(() => {
    if (!isClient) return;
    
    const fetchLogo = async () => {
      try {
        const isDevelopment = process.env.NODE_ENV === 'development';
        const headers: HeadersInit = {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        };
        
        if (isDevelopment) {
          headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        
        const response = await fetch('/api/logo', { 
          cache: 'no-store',
          headers
        });
        
        if (response.ok) {
          const result = await response.json();
          const logoToUse = result.logoUrl || '/altavida-logo-1.png';
          setLogoUrl(logoToUse);
          setLogoTimestamp(result.timestamp || Date.now());
          
          if (isDevelopment) {
            console.log('Logo fetched from simplified API:', logoToUse, 'Key:', result.key, 'TS:', result.timestamp);
          }
        } else {
          console.warn('Logo API response not OK:', response.status);
          setLogoUrl('/altavida-logo-1.png');
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        setLogoUrl('/altavida-logo-1.png');
        if (process.env.NODE_ENV === 'development') {
          setLogoTimestamp(Date.now());
        }
      }
    };

    fetchLogo();
    
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    if (process.env.NODE_ENV === 'development') {
      pollInterval = setInterval(fetchLogo, 5000);
    }
    
    const handleContentUpdate = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Content update event received, refetching logo...');
      }
      fetchLogo();
    };
    
    window.addEventListener('content-updated', handleContentUpdate);
    window.addEventListener('logo-updated', handleContentUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'logo-updated') {
        handleContentUpdate();
      }
    });
    
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('content-updates');
      bc.addEventListener('message', (event) => {
        if (event.data.type === 'logo-updated') {
          if (process.env.NODE_ENV === 'development') {
            console.log('BroadcastChannel logo update received');
          }
          handleContentUpdate();
        }
      });
    } catch (err) {
      console.warn('BroadcastChannel not supported');
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      window.removeEventListener('content-updated', handleContentUpdate);
      window.removeEventListener('logo-updated', handleContentUpdate);
      if (bc) {
        bc.close();
      }
    };
  }, [isClient, getContent]);

  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ siteName: 'AltaVida Tours' });
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const pathname = usePathname();
  const { getContent: getHomepageContent } = useContent({ page: 'homepage' });

  // Check if we're on the homepage
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = () => {
      const dynamicSiteName = getHomepageContent('site_name', '');

      if (dynamicSiteName) {
        setSettings({ siteName: dynamicSiteName });
      } else {
        fetch('/api/settings?group=general', { cache: 'no-store' })
          .then(res => res.json())
          .then(settingsData => {
            const siteName = settingsData?.site_name || 'AltaVida Tours';
            setSettings({ siteName });
          })
          .catch(() => {
            setSettings({ siteName: 'AltaVida Tours' });
          });
      }
    };

    fetchSettings();

    const handleUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleUpdate);
    window.addEventListener('content-updated', handleUpdate);

    return () => {
      window.removeEventListener('settings-updated', handleUpdate);
      window.removeEventListener('content-updated', handleUpdate);
    };
  }, [getHomepageContent]);

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Helper function to generate slug from name as fallback
  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, ' ')
      .trim()
      .replace(/\\s/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Dynamic dahabiyas dropdown items
  const [dahabiyasItems, setDahabiyasItems] = useState([
    { href: "/dahabiyas/royal-cleopatra", label: "🛥️ Royal Cleopatra", icon: "🛥️" },
    { href: "/dahabiyas/princess-cleopatra", label: "👑 Princess Cleopatra", icon: "👑" },
    { href: "/dahabiyas/queen-cleopatra", label: "💎 Queen Cleopatra", icon: "💎" },
    { href: "/dahabiyas/azhar-i", label: "⭐ AZHAR I", icon: "⭐" },
    { href: "/dahabiyas/azhar-ii", label: "🌟 AZHAR II", icon: "🌟" },
  ]);

  const [itinerariesItems, setItinerariesItems] = useState([
    { href: "/itineraries/luxor-aswan", label: "🏛️ Luxor to Aswan", icon: "🏛️" },
    { href: "/itineraries/aswan-luxor", label: "🌅 Aswan to Luxor", icon: "🌅" },
    { href: "/itineraries/short-cruise", label: "⛵ 3-Day Short Cruise", icon: "⛵" },
    { href: "/itineraries/extended-cruise", label: "🏺 7-Day Extended Cruise", icon: "🏺" },
    { href: "/itineraries/temples-tour", label: "🕌 Temples & Tombs Tour", icon: "🕌" },
    { href: "/itineraries/cultural-immersion", label: "🎭 Cultural Experience", icon: "🎭" },
  ]);

  useEffect(() => {
    // Fetch dahabiyas from API
    fetch('/api/dahabiyas?limit=8&active=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.dahabiyas)) {
          const items = data.dahabiyas.map((dahabiya: any, index: number) => ({
            href: `/dahabiyas/${dahabiya.slug || generateSlugFromName(dahabiya.name)}`,
            label: `${['🛥️', '👑', '💎', '⭐', '🌟', '🏺', '🚢', '⛵'][index % 8]} ${dahabiya.name}`,
            icon: ['🛥️', '👑', '💎', '⭐', '🌟', '🏺', '🚢', '⛵'][index % 8],
            name: dahabiya.name
          }));
          setDahabiyasItems(items);
        }
      })
      .catch(err => console.log('Using fallback dahabiya items'));
  }, []);

  useEffect(() => {
    // Fetch itineraries from API
    fetch('/api/itineraries?limit=8')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const items = data.map((itinerary: any, index: number) => ({
            href: `/itineraries/${itinerary.slug || itinerary.id}`,
            label: `${['🏛️', '🌅', '⛵', '🏺', '🕌', '🎭', '🌊', '🏖️'][index % 8]} ${itinerary.name}`,
            icon: ['🏛️', '🌅', '⛵', '🏺', '🕌', '🎭', '🌊', '🏖️'][index % 8]
          }));
          setItinerariesItems(items);
        }
      })
      .catch(err => console.log('Using fallback itinerary items'));
  }, []);

  useEffect(() => {
    // Fetch actual packages from API
    fetch('/api/packages?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.packages)) {
          const items = data.packages.map((pkg: PackageData, index: number) => ({
            href: `/packages/${pkg.slug || pkg.id}`,
            label: `${['✨', '🏔️', '🏖️', '🏛️', '👨‍👩‍👧‍👦', '🌍'][index % 6]} ${pkg.name}`,
            icon: ['✨', '🏔️', '🏖️', '🏛️', '👨‍👩‍👧‍👦', '🌍'][index % 6]
          }));
          setPackagesItems(items);
        }
      })
      .catch(err => console.log('Using fallback package items'));
  }, []);

  // Dynamic packages dropdown items
  const [packagesItems, setPackagesItems] = useState([
    { href: "/packages/luxury-escapes", label: "✨ Luxury Escapes", icon: "✨" },
    { href: "/packages/adventure-tours", label: "🏔️ Adventure Tours", icon: "🏔️" },
    { href: "/packages/beach-getaways", label: "🏖️ Beach Getaways", icon: "🏖️" },
    { href: "/packages/cultural-journeys", label: "🏛️ Cultural Journeys", icon: "🏛️" },
    { href: "/packages/family-vacations", label: "👨‍👩‍👧‍👦 Family Vacations", icon: "👨‍👩‍👧‍👦" },
    { href: "/packages/romantic-getaways", label: "💕 Romantic Getaways", icon: "💕" },
  ]);

  const navLinks = [
    { href: "/dahabiyas", label: "Dahabiyas", icon: "🛥️", hasDropdown: true, dropdownItems: dahabiyasItems },
    { href: "/itineraries", label: "Itineraries", icon: "🗺️", hasDropdown: true, dropdownItems: itinerariesItems },
    { href: "/schedule-and-rates", label: "Schedule & Rates", icon: "📅", singleLine: true },
    { href: "/packages", label: "Packages", icon: "📦", hasDropdown: true, dropdownItems: packagesItems },
    { href: "/gallery", label: "Gallery", icon: "📸", singleLine: true },
    { href: "/about", label: "About", icon: "ℹ️" },
    { href: "/contact", label: "Contact", special: true, icon: "📞", singleLine: true },
    { href: "/blog", label: "Blog", icon: "📝" },
  ];

  // TravelOK-inspired navbar styling with blue and orange theme
  const getNavbarStyle = () => {
    return {
      background: scrolled
        ? 'rgba(255, 255, 255, 0.95)'
        : 'rgba(255, 255, 255, 0.90)',
      backdropFilter: scrolled ? 'blur(25px)' : 'blur(20px)',
      boxShadow: scrolled
        ? '0 4px 32px rgba(37, 99, 235, 0.15), 0 2px 16px rgba(249, 115, 22, 0.08)'
        : '0 2px 20px rgba(37, 99, 235, 0.10)',
      borderBottom: scrolled
        ? '1px solid rgba(37, 99, 235, 0.2)'
        : '1px solid rgba(37, 99, 235, 0.1)'
    };
  };

  // TravelOK-inspired text colors with blue theme
  const getTextColor = (isLogo = false) => {
    return 'hsl(221, 83%, 53%)'; // TravelOK blue
  };

  const getLinkColor = () => {
    return 'hsl(221, 83%, 53%)'; // TravelOK blue
  };

  const getHoverColor = () => {
    return 'hsl(24, 95%, 53%)'; // TravelOK orange for hover
  };

  const navbarStyle = getNavbarStyle();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
    <nav className="navbar-animate hidden lg:block" style={{
      position: 'fixed',
      top: '0', // stick to top so dropdowns are reachable
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: navbarStyle.background,
      backdropFilter: navbarStyle.backdropFilter,
      borderBottom: navbarStyle.borderBottom,
      boxShadow: navbarStyle.boxShadow
    }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: scrolled || !isHomepage ? '4.5rem' : '5rem',
          width: '100%',
          gap: '1.5rem',
          justifyContent: 'space-between',
          minWidth: 0,
          position: 'relative'
        }}>
          {/* Logo - Top Left */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'all 0.3s ease-in-out',
            minWidth: 'fit-content',
            flexShrink: 0,
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <Image
              src={getLogoCacheBustUrl(logoUrl)}
              alt={getHomepageContent('site_name', 'AltaVida Tours')}
              width={150}
              height={48}
              style={{ maxHeight: '48px', width: 'auto', objectFit: 'contain' }}
              priority
              fetchPriority="high"
              unoptimized={true}
              suppressHydrationWarning={true}
              onError={(e) => {
                console.warn('Logo failed to load, falling back to default:', logoUrl);
                setLogoUrl('/altavida-logo-1.png');
                if (isClient) {
                  if (process.env.NODE_ENV === 'development') {
                    setLogoTimestamp(Date.now());
                  }
                }
              }}
              onLoad={(e) => {
                if (process.env.NODE_ENV === 'development') {
                  console.log('Logo loaded successfully:', getLogoCacheBustUrl(logoUrl));
                }
              }}
              key={isClient && logoTimestamp ? `logo-${logoTimestamp}` : 'logo-ssr'}
            />
          </Link>

          {/* Navigation Links - Center, single line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            flex: 1,
            paddingLeft: '200px',
            overflow: 'visible',
            minWidth: 0
          }}>
            {navLinks.map((link, index) => (
              <div key={index} style={{ position: 'relative', flexShrink: 0 }}>
                {link.hasDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        style={{
                          color: getTextColor(),
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          padding: '0.6rem 0.9rem',
                          borderRadius: '0.75rem',
                          transition: 'all 0.3s ease',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          minWidth: 'fit-content',
                          maxWidth: 'none',
                          textAlign: 'center',
                          boxShadow: isActive(link.href) ? 'inset 0 -2px 0 #2563eb' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(249,115,22,0.15) 100%)';
                          e.currentTarget.style.color = getHoverColor();
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.25)';
                          // Programmatically open the dropdown on hover
                          e.currentTarget.setAttribute('data-open', 'true');
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = getTextColor();
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {link.label}
                        <ChevronDown size={12} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(37, 99, 235, 0.25)',
                        borderRadius: '12px',
                        padding: '8px',
                        minWidth: '260px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        zIndex: 1200,
                        pointerEvents: 'auto'
                      }}
                    >
                      {/* Main page link */}
                      <DropdownMenuItem asChild>
                        <Link href={link.href} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          color: '#333',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          border: '1px solid rgba(37, 99, 235, 0.25)'
                        }}>
                          <span style={{ fontSize: '16px' }}>
                            {link.href === '/dahabiyas' ? '🛥️' :
                             link.href === '/itineraries' ? '🗺️' :
                             link.href === '/packages' ? '📦' : '📋'}
                          </span>
                          {link.href === '/dahabiyas' ? 'View All Dahabiyas' :
                           link.href === '/itineraries' ? 'View All Itineraries' :
                           link.href === '/packages' ? 'View All Packages' : 'View All'}
                        </Link>
                      </DropdownMenuItem>

                      {/* Divider */}
                      <div style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.3), transparent)',
                        margin: '8px 0'
                      }} />

                      {/* Dropdown items */}
                      {link.dropdownItems?.map((item, itemIndex) => (
                        <DropdownMenuItem key={itemIndex} asChild>
                          <Link href={item.href} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease',
                            color: '#555',
                            textDecoration: 'none',
                            fontSize: '13px'
                          }}>
                            {item.icon && <span style={{ fontSize: '14px' }}>{item.icon}</span>}
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={link.href}
                    style={{
                      color: link.special ? 'white' : getTextColor(),
                      fontSize: link.special ? '0.85rem' : '0.85rem',
                      fontWeight: link.special ? 700 : 600,
                      padding: link.special ? '0.6rem 1.1rem' : '0.6rem 0.9rem',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      background: link.special ? 'linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(249,115,22,1) 100%)' : 'transparent',
                      boxShadow: link.special ? '0 6px 20px rgba(249,115,22,0.35)' : (isActive(link.href) ? 'inset 0 -2px 0 #2563eb' : 'none'),
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 'fit-content',
                      maxWidth: 'none',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!link.special) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(249,115,22,0.15) 100%)';
                        e.currentTarget.style.color = getHoverColor();
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.25)';
                      } else {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(249,115,22,0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!link.special) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = getTextColor();
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      } else {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.35)';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Language & Auth */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0
          }}>
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    border: '2px solid rgba(37, 99, 235, 0.3)',
                    borderRadius: '0.5rem',
                    padding: '0.35rem 0.5rem',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    backdropFilter: 'blur(15px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Image
                    src={LANGUAGES.find(l => l.code === language)?.flagSvg || '/images/flags/us.svg'}
                    alt={LANGUAGES.find(l => l.code === language)?.name || 'Language'}
                    width={24}
                    height={16}
                    style={{ borderRadius: '2px', objectFit: 'cover' }}
                  />
                  <ChevronDown size={12} style={{ color: 'hsl(221, 83%, 53%)' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderRadius: '12px',
                  padding: '8px',
                  minWidth: '180px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000
                }}
              >
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: language === lang.code ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Image
                      src={lang.flagSvg}
                      alt={lang.name}
                      width={24}
                      height={16}
                      style={{ borderRadius: '2px', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: language === lang.code ? 600 : 400 }}>
                      {lang.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Section */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(249, 115, 22, 0.9) 100%)',
                      backdropFilter: 'blur(15px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'white',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 16px rgba(249, 115, 22, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <UserCircle size={14} style={{ marginRight: '0.25rem' }} />
                    {session.user?.name || session.user?.email}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" style={{ background: "white" }}>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'hsl(222.2, 84%, 4.9%)',
                      textDecoration: 'none'
                    }}>
                      <User size={16} />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'hsl(222.2, 84%, 4.9%)',
                        textDecoration: 'none'
                      }}>
                        <LayoutDashboard size={16} />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'hsl(222.2, 84%, 4.9%)',
                    cursor: 'pointer'
                  }}>
                    <LogOut size={16} />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(249, 115, 22, 0.9) 100%)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'white',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)',
                textDecoration: 'none'
              }}>
                <User size={14} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

    </nav>
    </>
  );
}
