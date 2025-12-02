"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect, ReactNode, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { LogOut, User, LayoutDashboard, UserCircle, Menu, X, Globe, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { usePathname } from 'next/navigation';
import { useContent } from '@/hooks/useContent';
import styles from './Navbar.module.css';
// Removed pharaonic UI imports for modern theme
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileNavigation from '@/components/mobile/MobileNavigation';

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

// Use centralized language context
import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flagSvg: '/flags/us.svg', name: 'English' },
  { code: 'ar', label: 'العربية', flagSvg: '/flags/eg.svg', name: 'العربية' },
  { code: 'fr', label: 'Français', flagSvg: '/flags/fr.svg', name: 'Français' },
  { code: 'de', label: 'Deutsch', flagSvg: '/flags/de.svg', name: 'Deutsch' },
  { code: 'es', label: 'Español', flagSvg: '/flags/es.svg', name: 'Español' },
  { code: 'it', label: 'Italiano', flagSvg: '/flags/it.svg', name: 'Italiano' },
  { code: 'ru', label: 'Русский', flagSvg: '/flags/ru.svg', name: 'Русский' },
  { code: 'zh', label: '中文', flagSvg: '/flags/cn.svg', name: '中文' },
  { code: 'ja', label: '日本語', flagSvg: '/flags/jp.svg', name: '日本語' },
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

// Remove local LanguageProvider/useLanguage in favor of centralized context

// Animation variants
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
};

export default function Navbar() {
  const { data: session } = useSession();
  const { getContent } = useContent({ page: 'branding_settings' });
  const [logoUrl, setLogoUrl] = useState('/AppIcons/android/mipmap-xxxhdpi/altavida.png');
  const [logoTimestamp, setLogoTimestamp] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize client-side rendering and scroll effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create a cache-busting URL by appending a stable timestamp from the API
  const getLogoCacheBustUrl = (url: string) => {
    if (!isClient) return url;
    if (!url) return url;
    if (!logoTimestamp) return url; // only bust when we have a known timestamp (e.g., when logo actually updated)
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}t=${logoTimestamp}`;
  };

  // Fetch logo from admin settings
  useEffect(() => {
    if (!isClient) return;
    
    const fetchLogo = async () => {
      try {
        // In development mode, add extra cache busting headers
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
          const logoToUse = result.logoUrl || '/AppIcons/android/mipmap-xxxhdpi/altavida.png';
          setLogoUrl(logoToUse);
          // Use server-provided timestamp to create a stable cache-busting key
          setLogoTimestamp(result.timestamp || Date.now());
          
          if (isDevelopment) {
            console.log('Logo fetched from simplified API:', logoToUse, 'Key:', result.key, 'TS:', result.timestamp);
          }
        } else {
          console.warn('Logo API response not OK:', response.status);
          setLogoUrl('/AppIcons/android/mipmap-xxxhdpi/altavida.png');
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Always fallback to default logo on error
        setLogoUrl('/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png');
        if (process.env.NODE_ENV === 'development') {
          setLogoTimestamp(Date.now());
        }
      }
    };

    // Initial fetch
    fetchLogo();
    
    // Set up polling for development mode to catch updates more reliably
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    if (process.env.NODE_ENV === 'development') {
      pollInterval = setInterval(fetchLogo, 5000); // Poll every 5 seconds in development
    }
    
    // Add event listener to update logo when content is updated
    const handleContentUpdate = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Content update event received, refetching logo...');
      }
      fetchLogo();
    };
    
    // Listen to multiple events to catch logo updates
    window.addEventListener('content-updated', handleContentUpdate);
    window.addEventListener('logo-updated', handleContentUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'logo-updated') {
        handleContentUpdate();
      }
    });
    
    // Listen to BroadcastChannel for cross-tab updates
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ siteName: 'Altavida Tours.com' });
  const { locale, setLocale } = useLanguage();
  const t = useTranslation();
  const pathname = usePathname();
  const { getContent: getHomepageContent } = useContent({ page: 'homepage' });

  // Get dynamic logo from database with fallback
  // const getNavbarLogo = () => {
  //   return getContent('navbar_logo') || '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png';
  // };

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
      // Get site name from homepage content (dynamic)
      const dynamicSiteName = getHomepageContent('site_name', '');

      if (dynamicSiteName) {
        setSettings({ siteName: dynamicSiteName });
      } else {
        // Fallback to settings API
        fetch('/api/settings?group=general', { cache: 'no-store' })
          .then(res => res.json())
          .then(settingsData => {
            const siteName = settingsData?.site_name || 'Altavida Tours.com';
            setSettings({ siteName });
          })
          .catch(() => {
            setSettings({ siteName: 'Altavida Tours.com' });
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

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLocale(lang as 'en' | 'ar');
    setIsLanguageDropdownOpen(false);
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
      .replace(/[𓇳𓈖𓂀𓏏𓆎𓅓𓊖𓋖]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Dynamic destinations dropdown items
  const [destinationItems, setDestinationItems] = useState([
    // Fallback items while loading
    { href: "/destinations/europe", label: "🇪🇺 Europe", hieroglyph: "🇪🇺" },
    { href: "/destinations/asia", label: "🌏 Asia", hieroglyph: "🌏" },
    { href: "/destinations/americas", label: "🌎 Americas", hieroglyph: "🌎" },
    { href: "/destinations/africa", label: "🌍 Africa", hieroglyph: "🌍" },
  ]);

  const [serviceItems, setServiceItems] = useState([
    // Fallback items while loading
    { href: "/services/adventure-tours", label: "🏔️ Adventure Tours", hieroglyph: "🏔️" },
    { href: "/services/cultural-experiences", label: "🏛️ Cultural Experiences", hieroglyph: "🏛️" },
    { href: "/services/luxury-travel", label: "✨ Luxury Travel", hieroglyph: "✨" },
    { href: "/services/family-vacations", label: "👨‍👩‍👧‍👦 Family Vacations", hieroglyph: "👨‍👩‍👧‍👦" },
  ]);

  useEffect(() => {
    // Fetch popular destinations from API
    fetch('/api/destinations?limit=8&featured=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.destinations)) {
          const items = data.destinations.map((destination: DestinationData, index: number) => ({
            href: `/destinations/${destination.slug || generateSlugFromName(destination.name)}`,
            label: `${['🌍', '🌎', '🌏', '🗺️', '🏖️', '🏔️', '🏛️', '🌴'][index % 8]} ${destination.name}`,
            hieroglyph: ['🌍', '🌎', '🌏', '🗺️', '🏖️', '🏔️', '🏛️', '🌴'][index % 8],
            name: destination.name
          }));
          setDestinationItems(items);
        }
      })
      .catch(err => console.log('Using fallback destination items'));
  }, []);

  useEffect(() => {
    // Fetch travel services from API
    fetch('/api/travel-services?limit=8&featured=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.services)) {
          const items = data.services.map((service: TravelServiceData, index: number) => ({
            href: `/services/${service.slug || service.id}`,
            label: `${['🏔️', '🏛️', '✨', '👨‍👩‍👧‍👦', '🎨', '🍽️', '🏄‍♂️', '🎭'][index % 8]} ${service.name}`,
            hieroglyph: ['🏔️', '🏛️', '✨', '👨‍👩‍👧‍👦', '🎨', '🍽️', '🏄‍♂️', '🎭'][index % 8]
          }));
          setServiceItems(items);
        }
      })
      .catch(err => console.log('Using fallback service items'));
  }, []);

  useEffect(() => {
    // Fetch actual packages from API
    fetch('/api/packages?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.packages)) {
          const items = data.packages.map((pkg: PackageData, index: number) => ({
            href: `/packages/${pkg.slug || pkg.id}`,
            label: `${['✨', '🏔️', '🏛️', '👨‍👩‍👧‍👦', '🌍', '🏖️'][index % 6]} ${pkg.name}`,
            hieroglyph: ['✨', '🏔️', '🏛️', '👨‍👩‍👧‍👦', '🌍', '🏖️'][index % 6]
          }));
          setPackagesItems(items);
        }
      })
      .catch(err => console.log('Using fallback package items'));
  }, []);

  // Dynamic packages dropdown items
  const [packagesItems, setPackagesItems] = useState([
    // Fallback items while loading
    { href: "/packages/luxury-escape", label: "✨ Luxury Escapes", hieroglyph: "✨" },
    { href: "/packages/adventure-package", label: "🏔️ Adventure Packages", hieroglyph: "🏔️" },
    { href: "/packages/cultural-tours", label: "🏛️ Cultural Tours", hieroglyph: "🏛️" },
    { href: "/packages/family-vacations", label: "👨‍👩‍👧‍👦 Family Vacations", hieroglyph: "👨‍👩‍👧‍👦" },
  ]);

  interface NavLink {
    href: string;
    label: string;
    hieroglyph: string;
    hasDropdown?: boolean;
    dropdownItems?: any[];
    special?: boolean;
    singleLine?: boolean;
  }

  const navLinks: NavLink[] = [
    { href: "/destinations", label: "Destinations", hieroglyph: "🌍", hasDropdown: true, dropdownItems: destinationItems },
    { href: "/services", label: "Services", hieroglyph: "🏛️", hasDropdown: true, dropdownItems: serviceItems },
    { href: "/packages", label: `${t('packages')}`, hieroglyph: "📦", hasDropdown: true, dropdownItems: packagesItems },
    { href: "/gallery", label: "Gallery", hieroglyph: "📸", singleLine: true },
    { href: "/custom-tours", label: "Custom Tours", special: true, hieroglyph: "✨", singleLine: true },
    { href: "/contact", label: `${t('contact')}`, hieroglyph: "📞" },
    { href: "/about", label: `${t('about')}`, hieroglyph: "ℹ️" },
    { href: "/blogs", label: "Travel Blog", hieroglyph: "📝" },
  ];

  // Pale navbar styling for all pages with dark text
  const getNavbarStyle = () => {
    // All pages: Pale background with dark text for clarity
    return {
      background: scrolled
        ? 'rgba(248, 249, 250, 0.98)'  // Very pale background
        : 'rgba(250, 251, 252, 0.95)',  // Even paler background
      backdropFilter: scrolled ? 'blur(25px)' : 'blur(20px)',
      boxShadow: scrolled
        ? '0 2px 20px rgba(0, 0, 0, 0.08)'  // Subtle shadow
        : '0 2px 15px rgba(0, 0, 0, 0.04)',
      borderBottom: scrolled
        ? '1px solid rgba(0, 0, 0, 0.08)'  // Subtle border
        : '1px solid rgba(0, 0, 0, 0.04)'
    };
  };

  // Black text colors for ocean blue background
  const getTextColor = (isLogo = false) => {
    // Black text on ocean blue background for best clarity
    return 'hsl(0, 0%, 0%)';  // Black
  };

  // Black link colors for ocean blue background
  const getLinkColor = () => {
    // Black for links with hover effect
    return 'hsl(0, 0%, 0%)';  // Black
  };

  // Dark blue hover colors for black text on ocean blue background
  const getHoverColor = () => {
    // Dark blue hover effect for better contrast with black text
    return 'hsl(220, 100%, 30%)';  // Dark blue for hover
  };

  const navbarStyle = getNavbarStyle();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
  
  // Calculate banner height based on variant - accurate measurements
  const getBannerHeight = () => {
    // Accurate banner heights including padding, text, and borders:
    // minimal: py-2 (16px) + text-2xl (~32px) + border (1px) = ~49px ≈ 3.1rem
    // default: py-3 (24px) + text-3xl (~36px) + border (2px) = ~62px ≈ 3.9rem
    // elegant: py-4 (32px) + text-4xl (~40px) + border (4px) = ~76px ≈ 4.8rem
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      const isAdmin = pathname.includes('/admin');

      if (isMobile) return '3.1rem'; // minimal variant
      if (isAdmin) return '4.8rem'; // elegant variant
      return '3.9rem'; // default variant
    }
    return '3.9rem'; // fallback
  };

  return (
    <>
    <nav className="navbar-animate hidden lg:block" style={{
      position: 'fixed',
      top: `calc(${getBannerHeight()} + 2px)`, // Dynamic position below HieroglyphicTopBanner with 2px buffer
      left: 0,
      right: 0,
      zIndex: 50,
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              border: '2px solid #e5e7eb',
              padding: '0.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out'
            }}>
              <Image
                src={getLogoCacheBustUrl(logoUrl)}
                alt={getHomepageContent('site_name', 'Altavida Tours.com')}
                width={120}
                height={56}
                className="h-14 w-auto object-contain"
                priority
                fetchPriority="high"
                unoptimized={true}
                suppressHydrationWarning={true}
                onError={(e) => {
                  console.warn('Logo failed to load, falling back to default:', logoUrl);
                  setLogoUrl('/AppIcons/android/mipmap-xxxhdpi/altavida.png');
                  if (isClient) {
                    if (process.env.NODE_ENV === 'development') {
                      setLogoTimestamp(Date.now());
                    }
                  }
                }}
                onLoad={(e) => {
                  // Debug log for development to confirm logo loaded
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Logo loaded successfully:', getLogoCacheBustUrl(logoUrl));
                  }
                }}
                key={isClient && logoTimestamp ? `logo-${logoTimestamp}` : 'logo-ssr'}
              />
            </div>
          </Link>

          {/* Navigation Links - Center, single line */}
          <motion.nav 
            className="hidden md:flex items-center justify-center flex-1 px-8"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div 
                  key={index} 
                  className="relative"
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {link.hasDropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "group relative overflow-hidden px-4 py-2 font-medium text-gray-700 transition-all duration-300 hover:bg-primary/5 hover:text-primary",
                            isActive(link.href) ? "text-primary font-semibold" : "text-gray-600 hover:text-primary"
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-1.5">
                            {link.label}
                            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </span>
                          <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-3/4" />
                        </Button>
                      >
                        {link.label}
                        <ChevronDown size={12} />
                      </button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="bg-white/95 backdrop-blur-xl rounded-xl border border-gray-100 shadow-xl overflow-hidden p-2 min-w-[280px]"
                        sideOffset={8}
                        asChild
                      >
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={dropdownVariants}
                        >
                          {/* Main page link */}
                          <DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
                            <Link 
                              href={link.href}
                              className="group flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-primary/5 hover:text-primary"
                            >
                              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                {link.href === '/destinations' ? '🌍' :
                                 link.href === '/packages' ? '📦' :
                                 link.href === '/services' ? '🏛️' : '📋'}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {link.href === '/destinations' ? 'View All Destinations' :
                                   link.href === '/packages' ? 'View All Packages' :
                                   link.href === '/services' ? 'View All Services' : 'View All'}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </DropdownMenuItem>

                          {/* Divider */}
                          <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                          {link.dropdownItems.map((item, index) => (
                            <DropdownMenuItem key={index} asChild>
                              <Link 
                                href={item.href}
                                className={cn(
                                  "group relative flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors",
                                  item.special 
                                    ? "bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                                )}
                              >
                                <span className={cn(
                                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                                  item.special 
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                  {index % 3 === 0 ? '✨' : index % 3 === 1 ? '🌟' : '⭐'}
                                </span>
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.special && (
                                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                                    Popular
                                  </span>
                                )}
                                <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                                
                                {/* Hover effect */}
                                <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </motion.div>
                      </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "group relative mx-1 inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive(link.href) 
                        ? "text-primary font-semibold" 
                        : "text-gray-600 hover:text-primary",
                      link.special && "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:from-primary/90 hover:to-primary/70"
                    )}
                  >
                    onMouseEnter={(e) => {
                      if (!link.special) {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!link.special) {
                        e.currentTarget.style.background = '';
                      }
                    }}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {!link.special && (
                      <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-3/4" />
                    )}
                    {link.special && (
                      <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary/90 to-primary/70 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </Link>
                )}
              </motion.div>
              ))}
            </div>
          </motion.nav>

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
                  className={styles.navButton}
                  style={{
                    border: isHomepage && !scrolled
                      ? '2px solid rgba(255, 255, 255, 0.4)'
                      : '2px solid transparent',
                    borderImage: !isHomepage || scrolled
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4)) 1'
                      : 'none',
                    background: isHomepage && !scrolled
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
                  }}
                >
                  <Image
                    src={LANGUAGES.find(l => l.code === locale)?.flagSvg || '/flags/us.svg'}
                    alt={LANGUAGES.find(l => l.code === locale)?.name || 'Language'}
                    width={24}
                    height={16}
                    style={{ borderRadius: '2px', objectFit: 'cover' }}
                  />
                  <ChevronDown size={12} style={{ color: 'hsl(222.2, 84%, 4.9%)' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
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
                    onClick={() => handleLanguageChange(lang.code)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Image 
                      src={lang.flagSvg} 
                      alt={lang.name} 
                      width={20} 
                      height={15}
                      className="rounded-sm"
                      style={{ borderRadius: '2px', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: locale === lang.code ? 600 : 400 }}>
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
                    onClick={(e) => e.stopPropagation()} // Prevent event propagation
                    className={styles.navButton}
                    style={{
                      background: isHomepage && !scrolled
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                      transition: 'background 0.3s ease',
                      ...(isHomepage && !scrolled 
                        ? { '&:hover': { background: 'rgba(255, 255, 255, 0.3)' } }
                        : { '&:hover': { background: 'rgba(0, 0, 0, 0.05)' } })
                    }}
                  >
                    <UserCircle size={18} />
                    <span style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '150px'
                    }}>
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(52, 211, 153, 0.25)',
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '220px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                  }}
                >
                  <div style={{ 
                    padding: '8px 12px',
                    marginBottom: '4px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: 'hsl(222.2, 84%, 4.9%)',
                      marginBottom: '4px'
                    }}>
                      {session.user?.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem',
                      color: 'hsl(215.4, 16.3%, 46.9%)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {session.user?.email}
                    </div>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/profile" 
                      onClick={(e) => e.stopPropagation()}
                      className={styles.dropdownItem}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin" 
                        onClick={(e) => e.stopPropagation()}
                        className={styles.dropdownItem}
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                  </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator style={{ margin: '4px 0', background: 'rgba(0, 0, 0, 0.05)' }} />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      signOut({ callbackUrl: '/' });
                    }}
                    className={styles.signOutButton}
                  >
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
                background: isHomepage && !scrolled
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(15px)',
                border: isHomepage && !scrolled
                  ? '2px solid rgba(255, 255, 255, 0.4)'
                  : '2px solid transparent',
                borderImage: !isHomepage || scrolled
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4)) 1'
                  : 'none',
                borderRadius: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'hsl(222.2, 84%, 4.9%)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                textDecoration: 'none'
              }}>
                <User size={14} />
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="space-y-1 border-t border-gray-100 bg-white/95 px-4 pb-3 pt-2 backdrop-blur-sm">
              {navLinks.map((link, index) => (
                <div key={index} className="border-b border-gray-50 last:border-0">
                  <Link
                    href={link.href}
                    className={`block px-3 py-3 text-base font-medium ${
                      isActive(link.href) 
                        ? 'text-primary' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                  
                  {link.hasDropdown && link.dropdownItems.length > 0 && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3 py-1">
                      {link.dropdownItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className={`block rounded-md px-3 py-2 text-sm ${
                            isActive(item.href)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {!session ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
                  <Link 
                    href="/auth/signin" 
                    className="w-full rounded-lg bg-gray-50 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm hover:from-primary/90 hover:to-primary/70"
                    onClick={() => setIsOpen(false)}
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 text-primary" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
              
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Language
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                        currentLanguage === lang.code
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Image 
                        src={lang.flagSvg} 
                        alt={lang.name} 
                        width={16} 
                        height={12} 
                        className="h-3 w-5 rounded-sm object-cover"
                      />
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    {/* Mobile Navigation Component */}
    <div className="lg:hidden">
      <MobileNavigation
        isOpen={mobileOpen}
        onToggle={() => setMobileOpen(!mobileOpen)}
      />
    </div>
  </>
  );
}
