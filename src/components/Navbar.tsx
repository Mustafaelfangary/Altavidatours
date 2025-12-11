"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, Suspense } from 'react';
import type { ChangeEvent } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import DynamicNavMenu from '@/components/navbar/DynamicNavMenu';
import { LogOut, User, LayoutDashboard, UserCircle, Menu, X, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'ru', label: 'Русский' },
  { code: 'it', label: 'Italiano' },
];

interface NavLinkProps {
  href: string;
  label: string;
  special?: boolean;
  hasSubmenu?: boolean;
  isActive?: boolean;
}

const NavLink = ({ 
  href, 
  label, 
  special = false, 
  hasSubmenu = false, 
  isActive = false 
}: NavLinkProps) => (
  <Link
    href={href}
    className={`flex items-center space-x-1 py-2 px-4 rounded-md transition-all duration-300 ${
      isActive
        ? 'text-amber-300 font-medium bg-red-800/50 shadow-inner'
        : 'text-gray-100 hover:text-amber-200 hover:bg-red-800/30'
    } ${special ? 'bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 hover:from-amber-300 hover:to-yellow-200' : ''}`}
  >
    <span className="relative group-hover:scale-105 transition-transform">
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-300 transition-all duration-300 group-hover:w-full"></span>
    </span>
    {hasSubmenu && (
      <svg
        className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    )}
  </Link>
);

interface NavItem {
  href: string;
  label: string;
  key: string;
  special?: boolean;
  submenu?: { href: string; label: string; desc?: string; image?: string }[][];
}

function NavbarInner() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ 
    siteName: 'AltaVida Tours', 
    logoUrl: '/icons/altavida-logo-1.svg' 
  });
  const [megaOpen, setMegaOpen] = useState<string | false>(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getNavbarStyle = () => {
    if (scrolled || !isHomepage) {
      return {
        background: 'rgba(185, 28, 28, 0.9)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      };
    }
    return {
      background: 'transparent',
      boxShadow: 'none'
    };
  };

  // Check if we're on the homepage
  const isHomepage = pathname === '/' || pathname === `/${language}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings?group=general');
        const data = await res.json();
        
        let siteName = 'AltaVida Tours';
        let logoUrl = '/icons/altavida-logo-1.svg';
        
        if (Array.isArray(data)) {
          siteName = data.find((s: any) => s.settingKey === 'site_name')?.settingValue || siteName;
          const settingLogo = data.find((s: any) => s.settingKey === 'site_logo')?.settingValue;
          logoUrl = settingLogo && settingLogo !== '/logo.png' ? settingLogo : '/icons/altavida-logo-1.svg';
        } else if (data && typeof data === 'object') {
          siteName = data.site_name || siteName;
          logoUrl = (data.site_logo && data.site_logo !== '/logo.png') ? data.site_logo : '/icons/altavida-logo-1.svg';
        }
        
        setSettings({ siteName, logoUrl });
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Show loading state while session is being fetched
    if (status === 'loading') {
    return (
      <header 
        className="fixed w-full z-50 transition-all duration-300"
        style={getNavbarStyle()}
      >
        <div className="container mx-auto px-4 py-0">
          <div className="flex items-center h-24">
            <Link href="/" className="flex items-center shrink-0 group mr-3 h-full">
              <div className="relative w-24 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                  loader={({ src, width, quality = 75 }) => `${src}?w=${width}&q=${quality}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/icons/altavida-logo-1.png';
                  }}
                />
              </div>
            </Link>

            <div className="hidden md:flex space-x-8 items-center flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-2 w-10 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    // Update the URL with the new locale
    const newPath = pathname.replace(/^\/(en|es|ar|pt|fr|ru|it)/, `/${newLang}`) || `/${newLang}`;
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
  const navItems: NavItem[] = [
    { href: '/destinations', label: t('destinations'), key: 'destinations', special: false, submenu: [
      [
        { href: '/destinations/egypt', label: t('egypt') },
        { href: '/destinations/jordan', label: t('jordan') },
        { href: '/destinations/dubai', label: t('dubai') },
        { href: '/destinations/turkey', label: t('turkey') },
        { href: '/destinations/saudi-arabia', label: 'Saudi Arabia' },
        { href: '/destinations/morocco', label: 'Morocco' },
        { href: '/destinations/greece', label: 'Greek Islands' }
      ]
    ] },
    { 
      href: '/packages', 
      label: t('packages'), 
      key: 'packages',
      submenu: [
        [
          { href: '/packages/all', label: t('allPackages') },
          { href: '/packages/dahabiya', label: t('dahabiyaCruises') },
          { href: '/packages/family', label: t('familyPackages') }
        ],
        [
          { href: '/packages/popular', label: t('popularTours') },
          { href: '/packages/experiences', label: t('experiences') },
          { href: '/packages/classics', label: t('egyptClassics') }
        ],
        [
          { href: '/packages/luxury', label: 'Luxury & Exclusive' },
          { href: '/packages/groups', label: 'Group Packages' },
          { href: '/packages/honeymoon', label: 'Honeymoon' }
        ]
      ]
    },
    { href: '/tailor-made', label: t('tailorMade'), key: 'tailorMade' },
    { href: '/about', label: t('about'), key: 'about' },
    { href: '/contact', label: t('contact'), key: 'contact' },
    { href: '/blog', label: t('blog'), key: 'blog' }
  ];

  const servicesLinks = [
    { href: "/excursions", label: t('allExcursions') },
    { href: "/excursions/historical", label: t('historicalCultural') },
    { href: "/excursions/desert", label: t('desertRedSea') },
    { href: "/excursions/other", label: t('uniqueExperiences') },
    { href: "/daily-tours", label: t('dailyTours') },
    { href: "/packages", label: t('tourPackages') },
  ];

  const megaMenuMap: Record<string, { title: string; items: { href: string; label: string; desc?: string; image?: string }[] }[]> = {
    destinations: [
      {
        title: t('destinations'),
        items: [
          { href: '/destinations/egypt', label: t('egypt'), desc: t('egyptDesc'), image: '/Destinations/Egypt.webp' },
          { href: '/destinations/jordan', label: t('jordan'), desc: t('jordanDesc'), image: '/Destinations/Jordon.jpg' },
        ],
      },
      {
        title: t('destinations'),
        items: [
          { href: '/destinations/dubai', label: t('dubai'), desc: t('dubaiDesc'), image: '/Destinations/Dubai.webp' },
          { href: '/destinations/turkey', label: t('turkey'), desc: t('turkeyDesc'), image: '/Destinations/Turkey.jpg' },
        ],
      },
    ],
    packages: [
      { 
        title: t('egyptClassics'), 
        items: [
          { href: '/packages', label: t('allPackages'), desc: t('multiDayItineraries') },
          { href: '/dahabiyat', label: t('dahabiyaCruises'), desc: t('nileUnderSail') },
          { href: '/packages?type=family', label: t('familyPackages'), desc: t('kidFriendly') },
        ]
      }
    ]
  };

  return (
    <header 
      className="fixed w-full z-50 transition-all duration-300"
      style={getNavbarStyle()}
    >
      <div className="container mx-auto px-4 py-0">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group mr-3 h-full">
            <div className="relative w-24 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={settings.logoUrl}
                alt=""
                width={96}
                height={96}
                className="object-contain"
                priority
                loader={({ src, width, quality = 75 }) => `${src}?w=${width}&q=${quality}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/icons/altavida-logo-1.png';
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation with mega menus */}
          <nav className="hidden md:flex items-center space-x-6 flex-1">
            {navItems.map((link) => (
              <div
                key={link.key}
                className="relative group"
                onMouseEnter={() => setMegaOpen(link.submenu ? link.key : false)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <NavLink href={link.href} label={link.label} special={link.special} hasSubmenu={!!link.submenu} isActive={pathname === link.href} />

                {link.submenu && (
                  <div
                    className={`absolute left-0 top-full mt-2 w-[680px] bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transform scale-95 opacity-0 transition-all duration-150 ${megaOpen === link.key ? 'scale-100 opacity-100' : 'pointer-events-none'}`}
                    onFocus={() => setMegaOpen(link.key)}
                    onBlur={() => setMegaOpen(false)}
                    aria-hidden={megaOpen !== link.key}
                  >
                    <div className="p-4 grid grid-cols-2 gap-4">
                      {/* Destinations CTA grid */}
                      {link.key === 'destinations' && (
                        <div className="col-span-2 grid grid-cols-4 gap-3">
                          <Link href="/destinations/egypt" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200 text-sm">{t('egypt')}</Link>
                          <Link href="/destinations/jordan" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200 text-sm">{t('jordan')}</Link>
                          <Link href="/destinations/dubai" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200 text-sm">{t('dubai')}</Link>
                          <Link href="/destinations/turkey" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200 text-sm">{t('turkey')}</Link>
                          <Link href="/destinations/saudi-arabia" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200 text-sm">Saudi Arabia</Link>
                          <Link href="/destinations/morocco" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200 text-sm">Morocco</Link>
                          <Link href="/destinations/greece" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200 text-sm">Greek Islands</Link>
                        </div>
                      )}

                      {/* Packages CTA + dynamic list */}
                      {link.key === 'packages' && (
                        <div className="col-span-2">
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <Link href="/packages/cultural" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200">{t('culturalHistorical') || 'Cultural & Historical'}</Link>
                            <Link href="/packages/adventures" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200">{t('safariSnorkeling') || 'Adventures'}</Link>
                            <Link href="/packages/romantic" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200">{t('romanticPackages') || 'Romantic Packages'}</Link>
                            <Link href="/packages/beaches" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200">{t('beachesAndSeas') || 'Beaches & Seas'}</Link>
                            <Link href="/packages/family" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200">{t('familyPackages') || 'Family Packages'}</Link>
                          </div>
                          <div>
                            <DynamicNavMenu type="packages" label={link.label} />
                          </div>
                        </div>
                      )}

                      {/* Default grouped submenu */}
                      {link.key !== 'packages' && link.key !== 'destinations' && (
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                          {link.submenu?.map((group, gi) => (
                            <div key={gi} className="space-y-2">
                              {group.map((item) => (
                                <Link key={item.href} href={item.href} className="block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                  <div className="flex items-start space-x-3">
                                    {item.image && (
                                      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-md">
                                        <Image src={item.image} alt={item.label} width={48} height={48} className="object-cover w-full h-full" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                      {item.desc && <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Menu and Language Selector */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-transparent border border-amber-300/30 text-amber-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
              >
                {LANGUAGES.map((lang) => (
                  <option 
                    key={lang.code} 
                    value={lang.code}
                    className="bg-gray-900 text-white"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Globe className="h-4 w-4 text-amber-300" />
              </div>
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <UserCircle className="h-6 w-6 text-amber-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/auth/signin">
                  <Button variant="outline" className="text-amber-300 border-amber-300 hover:bg-amber-900/30 text-sm py-1 h-8">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 hover:from-amber-300 hover:to-yellow-200 text-sm py-1 h-8">
                    {t('signUp')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-1 rounded-md text-amber-300 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-red-900/95">
          {navItems.map((link) => (
            <div key={link.key} className="relative">
              <div className="flex items-center justify-between">
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? 'bg-red-800 text-amber-300'
                      : 'text-gray-200 hover:bg-red-800 hover:text-amber-200'
                  } ${link.special ? 'bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <button
                    type="button"
                    aria-expanded={mobileSubOpen === link.key}
                    onClick={() => setMobileSubOpen(mobileSubOpen === link.key ? null : link.key)}
                    className="p-2 text-amber-300 hover:bg-red-800/40 rounded-md"
                  >
                    {mobileSubOpen === link.key ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>

              {link.submenu && mobileSubOpen === link.key && (
                <div className="pl-4 pb-2 mt-1 space-y-1">
                  {link.submenu.map((group, gi) => (
                    <div key={gi} className="space-y-1">
                      {group.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-red-800 hover:text-amber-200"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {!user && (
            <div className="pt-4 pb-2 border-t border-red-800">
              <Link
                href="/auth/signin"
                className="block w-full text-center px-4 py-2 text-base font-medium text-amber-300 hover:bg-red-800 rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                {t('signIn')}
              </Link>
                <Link
                href="/auth/signup"
                className="mt-2 block w-full text-center px-4 py-2 rounded-md bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium hover:from-amber-300 hover:to-yellow-200"
                onClick={() => setMobileOpen(false)}
              >
                {t('signUp')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  );
}


