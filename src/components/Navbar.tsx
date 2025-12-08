"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, createContext, useContext, ReactNode, ChangeEvent } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { LogOut, User, LayoutDashboard, UserCircle, Menu, X, Globe } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PharaonicDecoration } from '@/components/ui/PharaonicDecoration';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import imageLoader from '@/utils/imageLoader';

export const dynamic = "force-dynamic";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({ language: 'en', setLanguage: () => {} });

export const useLanguage = () => useContext(LanguageContext);

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'ru', label: 'Русский' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (storedLang) setLanguage(storedLang);
  }, []);
  
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') localStorage.setItem('lang', lang);
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ siteName: 'AltaVida Tours', logoUrl: '/logos/altavida-logo.png' });
  const [megaOpen, setMegaOpen] = useState<string | false>(false);
  const { language, setLanguage } = useLanguage();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <header className="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="hidden md:flex space-x-8 items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }


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
    fetch('/api/settings?group=general')
      .then(res => res.json())
      .then(data => {
        let siteName = 'AltaVida Tours';
        let logoUrl = '/logos/altavida-logo.png';
        if (Array.isArray(data)) {
          siteName = data.find(s => s.settingKey === 'site_name')?.settingValue || siteName;
          const settingLogo = data.find(s => s.settingKey === 'site_logo')?.settingValue;
          logoUrl = settingLogo && settingLogo !== '/logo.png' ? settingLogo : '/logos/altavida-logo.png';
        } else if (data && typeof data === 'object') {
          siteName = data.site_name || siteName;
          logoUrl = (data.site_logo && data.site_logo !== '/logo.png') ? data.site_logo : '/logos/altavida-logo.png';
        }
        setSettings({ siteName, logoUrl });
      });
  }, []);

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    // Update the URL with the new locale
    const newPath = pathname.replace(/^\/(en|es|ar|pt|fr|ru)/, `/${newLang}`) || `/${newLang}`;
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    // Update the language in context and localStorage
    setLanguage(newLang);
    
    // Navigate to the new URL
    router.push(`${newPath}${queryString}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Navigation links with translation keys
  const navLinks = [
    { href: "/tours", label: t('tours'), key: 'tours' },
    { href: "/packages", label: t('packages'), key: 'packages' },
    { href: "/tailor-made", label: t('tailorMade'), special: true, key: 'tailor' },
    { href: "/about", label: t('about'), key: 'about' },
    { href: "/contact", label: t('contact'), key: 'contact' },
    { href: "/blog", label: t('blog'), key: 'blog' },
  ];

  const servicesLinks = [
    { href: "/excursions", label: t('allExcursions') },
    { href: "/excursions/historical", label: t('historicalCultural') },
    { href: "/excursions/desert", label: t('desertRedSea') },
    { href: "/excursions/other", label: t('uniqueExperiences') },
    { href: "/daily-tours", label: t('dailyTours') },
    { href: "/packages", label: t('tourPackages') },
  ];
  const megaMenuMap: Record<string, { title: string; items: { href: string; label: string; desc?: string }[] }[]> = {
    tours: [
      { title: t('popularTours'), items: [
        { href: '/daily-tours', label: t('allDailyTours'), desc: t('shortGuidedTrips') },
        { href: '/excursions/historical', label: t('culturalHistorical'), desc: t('cairoLuxorAswan') },
        { href: '/excursions/desert', label: t('desertRedSea'), desc: t('safariSnorkeling') },
      ]},
      { title: t('experiences'), items: [
        { href: '/excursions/other', label: t('uniqueExperiences'), desc: t('hotAirBalloon') },
        { href: '/gallery', label: t('gallery'), desc: t('photoInspiration') },
        { href: '/contact', label: t('askAnExpert'), desc: t('personalHelp') },
      ]}
    ],
    packages: [
      { title: t('egyptClassics'), items: [
        { href: '/packages', label: t('allPackages'), desc: t('multiDayItineraries') },
        { href: '/dahabiyat', label: t('dahabiyaCruises'), desc: t('nileUnderSail') },
        { href: '/packages?type=family', label: t('familyPackages'), desc: t('kidFriendly') },
      ]},
      { title: 'By Duration', items: [
        { href: '/packages?days=4-5', label: '4–5 Days' },
        { href: '/packages?days=6-8', label: '6–8 Days' },
        { href: '/packages?days=9+', label: '9+ Days' },
      ]}
    ],
    about: [
      { title: 'Company', items: [
        { href: '/about', label: 'About Us', desc: 'Our story and team' },
        { href: '/contact', label: 'Contact', desc: 'Reach our experts' },
        { href: '/faq', label: 'FAQ', desc: 'Answers to common questions' },
      ]}
    ],
    contact: [
      { title: 'Get in touch', items: [
        { href: '/contact', label: 'Contact Form', desc: 'Send us a message' },
        { href: '/tailor-made', label: 'Tailor-Made Request', desc: 'Design your dream trip' },
        { href: '/profile', label: 'My Account', desc: 'Manage bookings' },
      ]}
    ],
    blog: [
      { title: 'Resources', items: [
        { href: '/blog', label: 'All Articles', desc: 'Tips, guides, and news' },
        { href: '/gallery', label: 'Gallery', desc: 'Inspiration & ideas' },
        { href: '/daily-tours', label: 'Daily Tours', desc: 'Short experiences' },
      ]}
    ],
    tailor: [
      { title: 'Start Customizing', items: [
        { href: '/tailor-made', label: 'Tailor-Made', desc: 'Start with a blank canvas' },
        { href: '/packages', label: 'Use a Package', desc: 'Pick and customize' },
        { href: '/contact', label: 'Talk to a Planner', desc: 'We’ll craft it for you' },
      ]}
    ]
  };

  // Determine navbar styling based on page and scroll state
  const getNavbarStyle = () => {
    if (isHomepage) {
      // Homepage: Fixed with dynamic background based on scroll
      return {
        background: scrolled
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 240, 0.98) 50%, rgba(240, 248, 255, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 240, 0.98) 50%, rgba(240, 248, 255, 0.98) 100%)',
        backdropFilter: scrolled ? 'blur(30px)' : 'blur(20px)',
        boxShadow: scrolled
          ? '0 8px 32px rgba(212, 175, 55, 0.2), 0 4px 16px rgba(0, 119, 182, 0.15)'
          : '0 4px 16px rgba(0, 0, 0, 0.2)',
        borderBottom: scrolled
          ? '2px solid transparent'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderImage: scrolled
          ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.4), rgba(0, 119, 182, 0.4), rgba(16, 185, 129, 0.3)) 1'
          : 'none'
      };
    } else {
      // Other pages: Always vibrant gradient background
      return {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 240, 0.98) 30%, rgba(240, 248, 255, 0.98) 70%, rgba(236, 254, 255, 0.98) 100%)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2), 0 4px 16px rgba(0, 119, 182, 0.15)',
        borderBottom: '2px solid transparent',
        borderImage: 'linear-gradient(90deg, rgba(212, 175, 55, 0.4), rgba(0, 119, 182, 0.4), rgba(16, 185, 129, 0.3)) 1'
      };
    }
  };

  // Determine text colors based on page and scroll state
  const getTextColor = (isLogo = false) => {
    if (isHomepage) {
      // Homepage: Dynamic colors based on scroll
      return scrolled
        ? 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(43, 100%, 55%) 50%, hsl(147, 51%, 47%) 100%)'
        : 'white';
    } else {
      // Other pages: Always vibrant gradient colors
      return isLogo
        ? 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(43, 100%, 55%) 50%, hsl(147, 51%, 47%) 100%)'
        : 'hsl(222.2, 84%, 4.9%)';
    }
  };

  // Determine link colors based on page and scroll state
  const getLinkColor = () => {
    if (isHomepage) {
      return scrolled ? 'hsl(222.2, 84%, 4.9%)' : 'white';
    } else {
      return 'hsl(222.2, 84%, 4.9%)';
    }
  };

  // Determine hover colors based on page and scroll state
  const getHoverColor = () => {
    if (isHomepage) {
      return scrolled
        ? 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(43, 100%, 55%) 50%, hsl(147, 51%, 47%) 100%)'
        : 'linear-gradient(135deg, hsl(43, 100%, 55%) 0%, hsl(25, 90%, 60%) 100%)';
    } else {
      return 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(43, 100%, 55%) 50%, hsl(147, 51%, 47%) 100%)';
    }
  };

  return (
    <div className="navbar-animate" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      ...getNavbarStyle()
    }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '5rem',
          position: 'relative',
          transition: 'all 0.3s ease-in-out'
        }}>
            {/* Logo - Positioned absolutely on the left */}
          <Link href="/" style={{ 
            position: 'relative',
            left: '0',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            transition: 'all 0.3s ease-in-out',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          >
            <div className="logo-glow" style={{
              position: 'relative',
              width: '3rem',
              height: '3rem',
              transition: 'all 0.3s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image
                src="/logos/altavida-logo.png"
                alt="AltaVida Tours Logo"
                width={120}
                height={50}
                loader={imageLoader}
                className="object-contain"
                style={{
                  transition: 'all 0.3s ease-in-out',
                  filter: isHomepage && !scrolled ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' : 'none',
                  WebkitFilter: isHomepage && !scrolled ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' : 'none'
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  console.error('altavida logo not found, using fallback');
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/wordmark-favicon.webp';
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem' }}>
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                backgroundImage: getTextColor(true),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2
              }}>
                {settings.siteName}
              </span>
              <span style={{
                fontSize: '0.7rem',
                backgroundImage: 'linear-gradient(135deg, hsl(43, 100%, 55%) 0%, hsl(25, 90%, 60%) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'serif',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textShadow: isHomepage && !scrolled ? '0 2px 4px rgba(212, 175, 55, 0.3)' : 'none',
                transition: 'all 0.3s ease-in-out',
                filter: 'drop-shadow(0 1px 2px rgba(212, 175, 55, 0.4))'
              }}>
                𓎼𓇌𓊪𓏏 𓏏𓅲𓂋𓋴
              </span>
            </div>
            <PharaonicDecoration variant="header" size="sm" className="hidden md:flex ml-2" />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="desktop-nav" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem',
            margin: '0 auto',
            position: 'relative',
            justifyContent: 'center',
            flex: '1',
            maxWidth: 'max-content'
          }}>
            {/* Mega menus for all top-level items */}
            {navLinks.map((linkObj) => {
              const groups = megaMenuMap[linkObj.key || ''] || [];
              return (
                <div
                  key={linkObj.key}
                  onMouseEnter={() => setMegaOpen(linkObj.key !== 'tailor' ? linkObj.key : 'tailor')}
                  onMouseLeave={() => setMegaOpen(false)}
                  style={{ position: 'relative' }}
                >
                  {linkObj.special ? (
                    <Link
                      href={linkObj.href}
                      className="gradient-animate menu-item-animated sun-button"
                      style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '3.25rem', 
                        height: '3.25rem', 
                        borderRadius: '9999px',
                        background: 'radial-gradient(circle at 30% 30%, #ffe08a, #f8c735 60%, #e7a91a 100%)',
                        color: '#6b4e00', 
                        textDecoration: 'none', 
                        fontWeight: 800, 
                        fontSize: '0.7rem',
                        lineHeight: 1,
                        padding: 0,
                        letterSpacing: '0.01em', 
                        boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.15), 0 12px 30px rgba(231, 169, 26, 0.45)', 
                        position: 'relative',
                        textAlign: 'center',
                        textTransform: 'uppercase'
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.currentTarget.style.boxShadow = '0 0 0 6px rgba(255, 215, 0, 0.22), 0 18px 40px rgba(231, 169, 26, 0.6)';
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255, 215, 0, 0.15), 0 12px 30px rgba(231, 169, 26, 0.45)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      }}
                    >
                      Tailor-Made
                    </Link>
                  ) : (
                    <Link
                      href={linkObj.href}
                      className="nav-link-animate menu-item-animated nav-ray"
                      style={{
                        fontWeight: 700, 
                        fontSize: '0.97rem', 
                        letterSpacing: '0.01em',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                        color: isHomepage && !scrolled ? 'hsl(43, 100%, 30%)' : 'hsl(43, 100%, 35%)',
                        textDecoration: 'none', 
                        position: 'relative', 
                        padding: '0.5rem 0',
                        textShadow: isHomepage && !scrolled ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                      }}
                    >
                      {linkObj.label}
                    </Link>
                  )}
                  {groups.length > 0 && megaOpen === (linkObj.key as any) && (
                    <div
                      className="mega-panel"
                      style={{
                        position: 'absolute', top: '2.5rem', left: '-1rem', width: '56rem', maxWidth: '92vw',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.99) 0%, rgba(255,250,240,0.99) 100%)',
                        border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', borderRadius: '1rem',
                        padding: '1.25rem 1.5rem', backdropFilter: 'blur(12px)', animation: 'megaDrop 200ms ease-out'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`, gap: '1.25rem' }}>
                        {groups.map((group, gi) => (
                          <div key={gi}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'hsl(222.2, 84%, 4.9%)', fontWeight: 800 }}>
                              <span>𓂀</span>
                              <span>{group.title}</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link href={item.href} className="menu-item-animated" style={{
                                    display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'hsl(222, 65%, 15%)',
                                    padding: '0.5rem 0.75rem', borderRadius: '0.5rem', transition: 'all .2s ease'
                                  }}
                                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.035)'; }}
                                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                  >
                                    <span style={{ fontWeight: 650 }}>{item.label}</span>
                                    {item.desc && <span style={{ fontSize: '0.82rem', color: 'hsl(215.4, 16.3%, 30%)' }}>{item.desc}</span>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="pharaonic-text" style={{ fontSize: '0.9rem', color: 'hsl(43, 85%, 35%)' }}>𓇳 Plan with our Egypt experts</span>
                        <Link href="/tailor-made" className="sun-button" style={{ textDecoration: 'none' }}>
                          <span style={{ fontWeight: 800, color: '#6b4e00' }}>Tailor-Made</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Section: Language Switcher and Auth */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            marginLeft: 'auto',
            paddingLeft: '1rem'
          }} className="desktop-auth">
            {/* Language Switcher */}
            <div style={{
              position: 'relative',
              minWidth: '120px'
            }}>
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="bg-transparent border-none text-sm focus:ring-0 focus:ring-offset-0 cursor-pointer"
                aria-label="Select language"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: isHomepage && !scrolled ? 'hsl(43, 100%, 30%)' : 'hsl(43, 100%, 35%)',
                  background: isHomepage && !scrolled
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transform: 'scale(1)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  height: '2.75rem',
                  padding: '0.5rem 2rem 0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.25), 0 4px 12px rgba(147, 51, 234, 0.15)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.background = isHomepage && !scrolled
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(255, 255, 255, 0.95)';
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} style={{ 
                    color: 'hsl(222.2, 84%, 4.9%)',
                    backgroundColor: 'white'
                  }}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <Globe style={{
                position: 'absolute',
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.1rem',
                height: '1.1rem',
                color: isHomepage && !scrolled ? 'rgba(255, 255, 255, 0.9)' : 'hsl(210, 100%, 50%)',
                filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
                pointerEvents: 'none',
                transition: 'all 0.3s ease-in-out'
              }} />
            </div>

            {/* Auth Buttons */}
            {session ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                marginLeft: '0.5rem'
              }}>
                {session.user?.role === "ADMIN" && (
                  <Link href="/dashboard">
                    <Button variant="outline" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: isHomepage && !scrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                      backdropFilter: 'blur(12px)',
                      border: isHomepage && !scrolled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
                      color: isHomepage && !scrolled ? 'white' : 'hsl(210, 100%, 50%)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontWeight: 600,
                      borderRadius: '0.75rem',
                      height: '2.75rem',
                      padding: '0 1.25rem',
                      transform: 'scale(1)',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(210, 100%, 50%, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                    >
                      <LayoutDashboard size={18} />
                      <span>{t('dashboard')}</span>
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '0.75rem',
                        backgroundColor: isHomepage && !scrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                        backdropFilter: 'blur(12px)',
                        border: isHomepage && !scrolled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
                        color: isHomepage && !scrolled ? 'white' : 'hsl(210, 100%, 50%)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'scale(1)',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(210, 100%, 50%, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <UserCircle size={24} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" style={{ 
                    width: '14rem',
                    backgroundColor: 'white',
                    border: '1px solid rgba(210, 100%, 50%, 0.1)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    borderRadius: '1rem',
                    padding: '0.5rem',
                    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <DropdownMenuLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'hsl(222.2, 84%, 4.9%)' }}>{session.user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(215.4, 16.3%, 46.9%)' }}>{session.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} style={{ 
                      color: 'hsl(0, 84.2%, 60.2%)',
                      transition: 'all 0.2s ease-in-out',
                      borderRadius: '0.5rem',
                      marginTop: '0.25rem'
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 84.2%, 60.2%, 0.1)';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    >
                      <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button style={{
                  background: isHomepage && !scrolled 
                    ? 'linear-gradient(135deg, hsl(45, 100%, 51%) 0%, hsl(45, 100%, 41%) 100%)'
                    : 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(210, 100%, 40%) 100%)',
                  color: isHomepage && !scrolled ? 'hsl(222.2, 84%, 4.9%)' : 'white',
                  fontWeight: 600,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  boxShadow: isHomepage && !scrolled 
                    ? '0 4px 15px rgba(45, 100%, 51%, 0.3)'
                    : '0 4px 15px rgba(210, 100%, 50%, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: 'none',
                  fontSize: '0.95rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  transform: 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = isHomepage && !scrolled 
                    ? '0 8px 25px rgba(45, 100%, 51%, 0.4)'
                    : '0 8px 25px rgba(210, 100%, 50%, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = isHomepage && !scrolled 
                    ? '0 4px 15px rgba(45, 100%, 51%, 0.3)'
                    : '0 4px 15px rgba(210, 100%, 50%, 0.3)';
                }}
                >
                  <User size={18} style={{ marginRight: '0.5rem' }} />
                  {t('signIn')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              borderRadius: '0.75rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isHomepage && !scrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(210, 100%, 50%, 0.1)',
              backdropFilter: 'blur(10px)',
              color: isHomepage && !scrolled ? 'white' : 'hsl(210, 100%, 50%)',
              border: isHomepage && !scrolled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(210, 100%, 50%, 0.2)',
              cursor: 'pointer',
              transform: 'scale(1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(210, 100%, 50%, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Egyptian Themed */}
        {mobileOpen && (
        <div className="mobile-menu-container" style={{
          background: 'linear-gradient(180deg, rgba(255, 248, 235, 0.98) 0%, rgba(255, 243, 220, 0.98) 50%, rgba(248, 230, 195, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '2px solid',
          borderImage: 'linear-gradient(90deg, transparent, #d4af37, #c9a227, #d4af37, transparent) 1',
          boxShadow: '0 10px 40px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          animation: 'mobileMenuSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Egyptian Border Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 20px, #c9a227 20px, #c9a227 40px, #b8941f 40px, #b8941f 60px)',
            animation: 'shimmer 3s ease-in-out infinite'
          }} />

          {/* Hieroglyphic Header */}
          <div style={{
            textAlign: 'center',
            padding: '1rem 0 0.5rem',
            fontSize: '1.2rem',
            letterSpacing: '0.3em',
            color: '#c9a227',
            fontFamily: 'serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            𓂀 𓏃 𓃭 𓆓 𓇌 𓊪 𓏏 𓂀
          </div>

          <div style={{ padding: '1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#1a365d',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: '0.875rem 1.25rem',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 248, 235, 0.7) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '0.75rem',
                  transform: 'translateX(0)',
                  animation: `mobileNavItem 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s both`,
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = '#d4af37';
                  e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(255, 248, 235, 0.9) 100%)';
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.1)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = '#1a365d';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 248, 235, 0.7) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.1)';
                }}
              >
                <span style={{
                  fontSize: '1.1rem',
                  opacity: 0.7,
                  transition: 'all 0.3s ease'
                }}>
                  {index === 0 ? '𓂋' : index === 1 ? '𓊪' : index === 2 ? '𓏏' : index === 3 ? '𓃭' : index === 4 ? '𓇌' : '𓆓'}
                </span>
                {link.label}
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.9rem',
                  opacity: 0.5,
                  transition: 'all 0.3s ease'
                }}>→</span>
              </Link>
            ))}

            {/* Decorative Separator with Hieroglyphics */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 0',
              marginTop: '0.5rem',
              animation: 'fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
              <span style={{ color: '#c9a227', fontSize: '0.9rem', letterSpacing: '0.2em' }}>𓃀 𓏤 𓈖</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
            </div>

            {/* Mobile Language Switcher - Egyptian Styled */}
            <div style={{
              animation: 'mobileNavItem 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#c9a227',
                marginBottom: '0.75rem',
                letterSpacing: '0.05em'
              }}>
                <span>𓂝</span> Language / اللغة
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 235, 0.9) 100%)',
                  border: '2px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '0.75rem',
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1a365d',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23c9a227' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} style={{
                    color: '#1a365d',
                    backgroundColor: '#fff8eb',
                    padding: '0.5rem'
                  }}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Auth - Egyptian Styled */}
            {session ? (
              <div style={{
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                animation: 'mobileNavItem 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both'
              }}>
                {session.user?.role === "ADMIN" && (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 248, 235, 0.9) 100%)',
                      border: '2px solid rgba(212, 175, 55, 0.4)',
                      color: '#c9a227',
                      fontWeight: 600,
                      padding: '0.875rem 1.25rem',
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.15)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.3)';
                      e.currentTarget.style.borderColor = '#d4af37';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                    }}
                    >
                      <span style={{ marginRight: '0.5rem' }}>𓊵</span>
                      <LayoutDashboard size={18} style={{ marginRight: '0.5rem' }} />
                      {t('dashboard')}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    color: '#c53030',
                    fontWeight: 600,
                    padding: '0.875rem 1.25rem',
                    background: 'linear-gradient(135deg, rgba(197, 48, 48, 0.08) 0%, rgba(255, 248, 235, 0.9) 100%)',
                    border: '2px solid rgba(197, 48, 48, 0.3)',
                    borderRadius: '0.75rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 15px rgba(197, 48, 48, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(197, 48, 48, 0.2)';
                    e.currentTarget.style.borderColor = '#c53030';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(197, 48, 48, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(197, 48, 48, 0.3)';
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }}>𓂧</span>
                  <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                  Sign out
                </Button>
              </div>
            ) : (
              <div style={{
                paddingTop: '1rem',
                animation: 'mobileNavItem 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both'
              }}>
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                  <Button style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #b8941f 100%)',
                    color: '#1a365d',
                    fontWeight: 700,
                    padding: '1rem 1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 6px 25px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '1rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    letterSpacing: '0.02em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 35px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  }}
                  >
                    <span style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>𓀀</span>
                    <User size={18} style={{ marginRight: '0.5rem' }} />
                    {t('signIn')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Bottom Hieroglyphic Footer */}
            <div style={{
              textAlign: 'center',
              paddingTop: '1.5rem',
              marginTop: '0.5rem',
              fontSize: '1rem',
              letterSpacing: '0.25em',
              color: 'rgba(212, 175, 55, 0.6)',
              fontFamily: 'serif',
              animation: 'fadeInUp 0.5s ease-out 0.7s both'
            }}>
              𓋹 𓏏 𓍯 𓃭 𓇌 𓊪 𓏏 𓋹
            </div>
          </div>

          {/* Bottom Decorative Border */}
          <div style={{
            height: '4px',
            background: 'repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 20px, #c9a227 20px, #c9a227 40px, #b8941f 40px, #b8941f 60px)',
            animation: 'shimmer 3s ease-in-out infinite reverse'
          }} />
        </div>
        )}
      </div>
    </div>
  );
}
