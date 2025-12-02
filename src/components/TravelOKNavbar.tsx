"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import OptimizedImage from './OptimizedImage';
import Portal from './Portal';
import { 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  UserCircle,
  Globe,
  Ship,
  MapPin,
  Package,
  Calendar,
  Camera,
  BookOpen,
  Phone,
  Clock,
  Users,
  Heart,
  ArrowRight
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flagSvg: '/images/flags/us.svg', name: 'English' },
  { code: 'ar', label: 'العربية', flagSvg: '/images/flags/eg.svg', name: 'العربية' },
  { code: 'fr', label: 'Français', flagSvg: '/images/flags/fr.svg', name: 'Français' },
  { code: 'de', label: 'Deutsch', flagSvg: '/images/flags/de.svg', name: 'Deutsch' },
  { code: 'es', label: 'Español', flagSvg: '/images/flags/es.svg', name: 'Español' },
  { code: 'it', label: 'Italiano', flagSvg: '/images/flags/it.svg', name: 'Italiano' },
  { code: 'ru', label: 'Русский', flagSvg: '/images/flags/ru.svg', name: 'Русский' },
];

// Minimal API types used in mapping
interface ApiDahabiya { slug?: string; id?: string | number; name: string; description?: string }
interface ApiItinerary { slug?: string; id?: string | number; name: string; description?: string }
interface ApiPackage { slug?: string; id?: string | number; name: string; description?: string }

export default function TravelOKNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openViaClick, setOpenViaClick] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({});
  const [logoUrl, setLogoUrl] = useState('/altavida-logo-1.png');
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { locale, setLocale } = useLanguage();
  
  // Debug: Log session data
  useEffect(() => {
    console.log('Session data:', session);
    if (session?.user) {
      console.log('User role:', session.user.role);
      console.log('Is admin?', session.user.role === 'ADMIN');
    }
  }, [session]);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [panelPos, setPanelPos] = useState<Record<string, { top: number; left: number; width: number }>>({});
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [navReady, setNavReady] = useState(false);
  // Horizontal scroll indicators for nav row
  const navScrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setNavReady(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Update nav scroll indicators on scroll/resize
  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const update = () => {
      const canScroll = el.scrollWidth > el.clientWidth + 1;
      setShowLeft(canScroll && el.scrollLeft > 0);
      setShowRight(canScroll && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener('scroll', update, { passive: true } as any);
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', update as any);
      window.removeEventListener('resize', onResize);
    };
  }, [navReady]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileMenuOpen]);

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/logo', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const result = await response.json();
          if (result.logoUrl) {
          let normalizedUrl = '/altavida-logo-1.png';
          if (typeof result.logoUrl === 'string') {
          const val = result.logoUrl.trim();
          if (val.startsWith('http')) normalizedUrl = val;
          else if (val.startsWith('/')) normalizedUrl = val;
          else if (/^[\w.-]+\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(val)) normalizedUrl = '/' + val.replace(/^\/+/, '');
          else normalizedUrl = '/altavida-logo-1.png';
          }
          setLogoUrl(normalizedUrl);
          } else {
          setLogoUrl('/altavida-logo-1.png');
          }
        } else {
          setLogoUrl('/altavida-logo-1.png');
        }
      } catch (error) {
        setLogoUrl('/altavida-logo-1.png');
      }
    };
    fetchLogo();
  }, []);

  // Fetch dahabiyas and itineraries for dropdowns
  const [dahabiyasItems, setDahabiyasItems] = useState<Array<{href: string; label: string; description?: string; icon?: string}>>([]);
  const [itinerariesItems, setItinerariesItems] = useState<Array<{href: string; label: string; description?: string; icon?: string}>>([]);
  const [packagesItems, setPackagesItems] = useState<Array<{href: string; label: string; description?: string; icon?: string}>>([]);

  useEffect(() => {
    // Fetch dahabiyas
    fetch('/api/dahabiyas?limit=8&active=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.dahabiyas)) {
          const items = data.dahabiyas.map((d: ApiDahabiya, index: number) => ({
            href: `/dahabiyas/${d.slug || d.id}`,
            label: d.name,
            description: d.description || `Experience luxury aboard ${d.name}`,
            icon: ['🛥️', '👑', '💎', '⭐', '🌟', '🏺', '🚢', '⛵'][index % 8]
          }));
          setDahabiyasItems(items);
        }
      })
      .catch(() => {});

    // Fetch itineraries
    fetch('/api/itineraries?limit=8')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const items = data.map((i: ApiItinerary, index: number) => ({
            href: `/itineraries/${i.slug || i.id}`,
            label: i.name,
            description: i.description || `Discover ancient wonders on ${i.name}`,
            icon: ['🏛️', '🌅', '⛵', '🏺', '🕌', '🎭', '🌊', '🏖️'][index % 8]
          }));
          setItinerariesItems(items);
        }
      })
      .catch(() => {});

    // Fetch packages
    fetch('/api/packages?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.packages)) {
          const items = data.packages.map((p: ApiPackage, index: number) => ({
            href: `/packages/${p.slug || p.id}`,
            label: p.name,
            description: p.description || `Complete travel experience with ${p.name}`,
            icon: ['✨', '🏔️', '🏖️', '🏛️', '👨‍���‍👧‍👦', '💕'][index % 6]
          }));
          setPackagesItems(items);
        }
      })
      .catch(() => {});
  }, []);

   // Enhanced navigation structure with mega dropdown data (pale theme)
  const thingsToDoItems = [
    { href: '/attractions/pyramids', label: 'Pyramids & Sphinx', description: 'Giza plateau, Saqqara, Dahshur', icon: '🔺' },
    { href: '/attractions/temples', label: 'Ancient Temples', description: 'Karnak, Luxor, Philae, Abu Simbel', icon: '🏛️' },
    { href: '/attractions/museums', label: 'Museums & Artifacts', description: 'Egyptian Museum, GEM, NMEC', icon: '🏺' },
    { href: '/services/adventure-tours', label: 'Desert Safari', description: 'White Desert, Siwa, ATV, Camels', icon: '🐪' },
    { href: '/experiences/diving', label: 'Red Sea Diving', description: 'Hurghada, Sharm El Sheikh, Marsa Alam', icon: '🤿' },
    { href: '/hotels/nile-cruises', label: 'Nile Cruises', description: 'Aswan ⇄ Luxor, 3–7 nights', icon: '⛵' },
    { href: '/experiences/cultural', label: 'Cultural Tours', description: 'Markets, crafts, performances', icon: '🎭' },
    { href: '/experiences/food', label: 'Egyptian Cuisine', description: 'Street food, tastings, classes', icon: '🍽️' }
  ];

  const destinationItems = [
    { href: '/destinations/cairo', label: 'Cairo', description: 'Capital, pyramids, museums', icon: '🏙️' },
    { href: '/destinations/luxor', label: 'Luxor', description: 'Valley of the Kings & Karnak', icon: '🏛️' },
    { href: '/destinations/aswan', label: 'Aswan', description: 'Philae, Nubian culture', icon: '🌅' },
    { href: '/destinations/alexandria', label: 'Alexandria', description: 'Mediterranean jewel', icon: '🌊' },
    { href: '/destinations/siwa', label: 'Siwa Oasis', description: 'Desert paradise', icon: '🏜️' },
    { href: '/destinations/hurghada', label: 'Hurghada', description: 'Red Sea resorts', icon: '🏖️' },
    { href: '/destinations/sharm-el-sheikh', label: 'Sharm El Sheikh', description: 'Diving haven', icon: '🐠' },
    { href: '/destinations/abu-simbel', label: 'Abu Simbel', description: 'Colossal temples', icon: '🗿' },
  ];

  const staysItems = (dahabiyasItems.length > 0 ? dahabiyasItems : [
    { href: '/dahabiyas/royal-cleopatra', label: 'Royal Cleopatra', description: 'Ultimate luxury experience', icon: '👑' },
    { href: '/dahabiyas/princess-cleopatra', label: 'Princess Cleopatra', description: 'Elegant comfort on the Nile', icon: '💎' },
    { href: '/dahabiyas/queen-cleopatra', label: 'Queen Cleopatra', description: 'Regal sailing experience', icon: '⭐' },
  ]).concat([
    { href: '/hotels/nile-cruises', label: 'Nile Cruises', description: 'Modern cruise ships', icon: '🚢' },
    { href: '/accommodation', label: 'Hotels & Lodges', description: 'Stay across Egypt', icon: '🏨' },
  ]);

  const eventsItems = [
    { href: '/blog?tag=events', label: 'All Events', description: 'Festivals, culture, sports', icon: '🎉' },
    { href: '/blog?tag=festival', label: 'Festivals', description: 'Seasonal highlights', icon: '🎪' },
    { href: '/blog?tag=concert', label: 'Concerts', description: 'Music & nightlife', icon: '🎵' },
  ];

  const diningItems = [
    { href: '/experiences/food', label: 'Egyptian Cuisine', description: 'Food tours & tastings', icon: '🍲' },
    { href: '/blog?tag=dining', label: 'Dining Guides', description: 'Where to eat', icon: '🍽️' },
    { href: '/blog?tag=restaurants', label: 'Top Restaurants', description: 'Curated lists', icon: '⭐' },
  ];

  const shopItems = [
    { href: '/packages', label: 'All Packages', description: 'Popular & luxury trips', icon: '🧳' },
    { href: '/custom-tours', label: 'Tailor-made Tours', description: 'Plan your dream trip', icon: '❤️' },
    { href: '/book', label: 'Quick Booking', description: 'Reserve in minutes', icon: '⚡' },
  ];

  const mainNavItems = [
    {
      id: 'things',
      label: 'THINGS TO DO',
      mainHref: '/packages',
      icon: MapPin,
      description: 'Experiences and activities',
      items: thingsToDoItems,
      featured: [
        { label: 'All Packages', href: '/packages', icon: Package },
        { label: 'All Itineraries', href: '/itineraries', icon: MapPin }
      ]
    },
    {
      id: 'destinations',
      label: 'CITIES & REGIONS',
      mainHref: '/destinations',
      icon: Globe,
      description: 'Explore destinations',
      items: destinationItems,
      featured: [
        { label: 'View All Destinations', href: '/destinations', icon: MapPin }
      ]
    },
    {
      id: 'stays',
      label: 'PLACES TO STAY',
      mainHref: '/dahabiyas',
      icon: Ship,
      description: 'Luxury Nile cruises & stays',
      items: staysItems,
      featured: [
        { label: 'All Dahabiyas', href: '/dahabiyas', icon: Ship },
        { label: 'All Stays', href: '/accommodation', icon: Ship }
      ]
    },
    {
      id: 'events',
      label: 'FESTIVALS & EVENTS',
      mainHref: '/blog',
      icon: Calendar,
      description: 'What’s happening',
      items: eventsItems,
      featured: [
        { label: 'View Blog', href: '/blog', icon: BookOpen }
      ]
    },
    {
      id: 'dining',
      label: 'DINING',
      mainHref: '/blog?tag=dining',
      icon: BookOpen,
      description: 'Food and dining',
      items: diningItems,
      featured: [
        { label: 'Dining Guides', href: '/blog?tag=dining', icon: BookOpen }
      ]
    },
    {
      id: 'shop',
      label: 'SHOP ALTAVIDA',
      mainHref: '/custom-tours',
      icon: Heart,
      description: 'Tailor-made tours',
      items: shopItems,
      featured: [
        { label: 'Custom Tours', href: '/custom-tours', icon: Heart },
        { label: 'Book Now', href: '/book', icon: Heart }
      ]
    }
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updatePanelPosition = (itemId: string) => {
    const btn = triggerRefs.current[itemId];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const width = rect.width;
    setPanelPos(prev => ({ ...prev, [itemId]: { top, left, width } }));
  };

  const openDropdown = (itemId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    updatePanelPosition(itemId);
    setActiveDropdown(itemId);
  };

  const scheduleCloseDropdown = (delay = 250) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setOpenViaClick(null);
    }, delay);
  };

  const toggleDropdownClick = (itemId: string) => {
    if (activeDropdown === itemId && openViaClick === itemId) {
      setActiveDropdown(null);
      setOpenViaClick(null);
    } else {
      openDropdown(itemId);
      setOpenViaClick(itemId);
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inNavbar = !!containerRef.current && containerRef.current.contains(target);
      const inPortal = !!portalRef.current && portalRef.current.contains(target);
      if (!inNavbar && !inPortal) {
        setActiveDropdown(null);
        setOpenViaClick(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (activeDropdown) updatePanelPosition(activeDropdown);
    };
    window.addEventListener('resize', onResize);
    const scrollOpts: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', onResize, scrollOpts);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, scrollOpts);
    };
  }, [activeDropdown]);

  const onKeyDownTopItem = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdownClick(itemId);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      openDropdown(itemId);
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
      setOpenViaClick(null);
    }
  };

  const toggleMobileSection = (id: string) => {
    setExpandedMobileSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Pale utility bar */}
      <div className={`hidden lg:block transition-all duration-300 ${scrolled ? 'py-0.5' : 'py-1.5'} text-slate-700 bg-[#f7f7f2] border-b border-slate-200`}> 
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-[12px] tracking-wide font-semibold text-slate-700 hover:text-[#c7a15a] transition-colors">
                  <Image
                    src={LANGUAGES.find(l => l.code === locale)?.flagSvg || '/images/flags/us.svg'}
                    alt="Language"
                    width={18}
                    height={12}
                    className="rounded-sm"
                  />
                  <span>{LANGUAGES.find(l => l.code === locale)?.label || 'English'}</span>
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code as unknown as Parameters<typeof setLocale>[0])}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors text-[13px]"
                    >
                      <Image src={lang.flagSvg} alt={lang.name} width={20} height={14} className="rounded-sm" />
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Quick Links */}
              <div className="hidden xl:flex items-center gap-5 text-[12px] tracking-wide">
                <Link href="/contact" className="font-semibold text-slate-700 hover:text-[#c7a15a] transition-colors">Contact</Link>
                <Link href="/about" className="font-semibold text-slate-700 hover:text-[#c7a15a] transition-colors">About</Link>
                <Link href="/blog" className="font-semibold text-slate-700 hover:text-[#c7a15a] transition-colors">Blog</Link>
              </div>
            </div>
            {/* Right side info */}
            <div className="flex items-center gap-5 text-[12px] tracking-wide">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone size={14} />
                <span className="font-semibold">+20 10 02588564</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-700">
                <Clock size={14} />
                <span className="font-semibold">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - glass over white then solid on scroll */}
      <nav className={`sticky top-0 z-40 transition-all duration-500 ${navReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'} ${scrolled ? 'backdrop-blur bg-white/95 shadow-sm' : 'backdrop-blur bg-white/70'} border-b border-slate-200`} ref={containerRef as any} style={{ overflow: 'visible' }}>
        <div className="max-w-[1400px] mx-auto px-2 lg:px-3" style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-start gap-1" style={{ overflow: 'visible' }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-4 text-slate-800 hover:bg-slate-100 transition-colors mobile-menu-button"
              data-testid="mobile-menu-button"
              aria-label={mobileMenuOpen ? 'close menu' : 'open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Home Link */}
            <Link 
              href="/" 
              className="hidden lg:block px-2 py-3 text-[12px] tracking-[0.12em] font-semibold nav-link border-r border-transparent text-slate-800"
            >
              HOME
            </Link>

            {/* Navigation Items - Desktop */}
            <div className="relative hidden lg:flex items-center flex-1" style={{ overflow: 'visible' }}>
              {/* Left gradient + button indicator */}
              <div className={`pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent transition-opacity ${showLeft ? 'opacity-100' : 'opacity-0'}`} />
              <button
                type="button"
                aria-label="Scroll navigation left"
                onClick={() => { navScrollRef.current?.scrollBy({ left: -160, behavior: 'smooth' }); }}
                className={`absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white/90 border border-slate-200 shadow p-1 text-slate-700 hover:bg-white transition-opacity ${showLeft ? 'opacity-100' : 'opacity-0'}`}
              >
                ‹
              </button>

              {/* Scrollable row */}
              <div ref={navScrollRef} className="flex items-center flex-1 justify-start overflow-x-auto whitespace-nowrap pr-0 gap-0" style={{ overflowX: 'auto', overflowY: 'visible' }}>
              {mainNavItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative"
                  style={{ overflow: 'visible' }}
                  onPointerEnter={() => openDropdown(item.id)}
                  onPointerLeave={() => {
                    if (openViaClick === item.id) return;
                    scheduleCloseDropdown(250);
                  }}
                >
                  <button
                    ref={(el) => { triggerRefs.current[item.id] = el; }}
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.id}
                    aria-controls={`mega-${item.id}`}
                    onClick={() => toggleDropdownClick(item.id)}
                    onKeyDown={(e) => onKeyDownTopItem(e, item.id)}
                    className={`px-2 py-2.5 text-[11px] tracking-[0.12em] font-semibold nav-link border-r border-transparent flex items-center gap-1.5 ${activeDropdown === item.id || isActive(item.mainHref) ? 'text-[#0e2437]' : 'text-slate-800 hover:text[#c7a15a]'}`}
                  >
                    <span className="hidden xl:inline"><item.icon size={14} /></span>
                    <span>{item.label}</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Dropdown */}
                  {activeDropdown === item.id && item.items.length > 0 && panelPos[item.id] && (
                    <Portal>
                      <div
                        ref={portalRef}
                        className="pointer-events-auto"
                        style={{ position: 'absolute', top: panelPos[item.id].top, left: panelPos[item.id].left, zIndex: 1000 }}
                        onPointerEnter={() => openDropdown(item.id)}
                        onPointerLeave={() => {
                          if (openViaClick === item.id) return;
                          scheduleCloseDropdown(250);
                        }}
                      >
                        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: panelPos[item.id].width, height: 10 }} />
                        <div
                          id={`mega-${item.id}`}
                          role="menu"
                          className="bg-white/98 backdrop-blur border border-slate-200 shadow-xl min-w-[820px] rounded-xl overflow-hidden"
                          style={{ position: 'absolute', top: 10, left: 0 }}
                        >
                          <div className="p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                <item.icon size={22} className="text-[#c7a15a]" />
                              </div>
                              <div>
                                <h3 className="text-[14px] font-bold text-slate-900 leading-tight">{item.label}</h3>
                                <p className="text-[13px] text-slate-600">{item.description}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                              <div className="col-span-2">
                                <h4 className="text-[11px] font-semibold text-slate-900 mb-3 uppercase tracking-[0.14em]">Popular Options</h4>
                                <div className="space-y-2">
                                  {item.items.slice(0, 6).map((subItem) => (
                                    <Link key={subItem.href} href={subItem.href} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all">
                                      <span className="text-lg mt-0.5">{subItem.icon}</span>
                                      <div className="flex-1">
                                        <div className="font-medium text-[14px] text-slate-900 group-hover:text-[#0e2437]">{subItem.label}</div>
                                        <div className="text-[13px] text-slate-600 mt-1">{subItem.description}</div>
                                      </div>
                                      <ArrowRight size={16} className="text-slate-400 group-hover:text-[#0e2437] mt-1" />
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              <div className="col-span-1">
                                <h4 className="text-[11px] font-semibold text-slate-900 mb-3 uppercase tracking-[0.14em]">Quick Access</h4>
                                <div className="space-y-2">
                                  {item.featured.map((featured) => (
                                    <Link key={featured.href} href={featured.href} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
                                      <featured.icon size={18} className="text-[#c7a15a]" />
                                      <span className="font-medium text-[14px] text-slate-900 group-hover:text-[#c7a15a]">{featured.label}</span>
                                    </Link>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <Link
                                    href={item.mainHref}
                                    className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full bg-[#c7a15a] text-white font-semibold hover:bg-[#b38b49] transition-colors text-[13px]"
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setOpenViaClick(null);
                                    }}
                                  >
                                    <span>View All {item.label}</span>
                                    <ArrowRight size={16} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Portal>
                  )}
                </div>
              ))}

              {/* Desktop search */}
              <form
                onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                className="ml-3 mr-1 flex items-center bg-slate-100 rounded-full border border-slate-200 px-3 py-1.5 text-sm"
                role="search"
                aria-label="Site search"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search destinations, tours..."
                  className="bg-transparent outline-none text-[13px] placeholder:text-slate-400 w-44"
                />
              </form>

              {/* Additional Links */}
              <Link
                href="/gallery"
                className="px-3 py-3 text-[12px] tracking-[0.12em] font-semibold text-slate-800 hover:text-[#c7a15a] transition-colors border-r border-transparent flex items-center gap-2"
                style={{ marginLeft: 8 }}
              >
                <Camera size={14} />
                <span>GALLERY</span>
              </Link>
            </div>

            {/* Compact Brand at Left (reduce width) */}
            <div className="flex-shrink-0 px-1 lg:px-2 py-0.5 order-first">
              <Link href="/" className="relative block">
                <div className="relative mx-auto flex items-center justify-center">
                  <div className="bg-white rounded-full border border-yellow-500 shadow p-0.5">
                    <Image
                      src={logoUrl || '/altavida-logo-1.png'}
                      alt="Altavida Tours.com"
                      width={36}
                      height={36}
                      className="w-8 h-8 lg:w-9 lg:h-9 object-contain rounded-full"
                      onError={() => setLogoUrl('/altavida-logo-1.png')}
                      priority
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Side Links - Desktop */}
            <div className="hidden lg:flex items-center flex-shrink-0 justify-end">
              <Link
                href="/blog"
                className="px-3 py-3 text-[12px] tracking-[0.12em] font-semibold text-slate-800 hover:text-[#0e2437] transition-colors border-l border-transparent flex items-center gap-2"
              >
                <BookOpen size={14} />
                <span>BLOG</span>
              </Link>
              <Link
                href="/contact"
                className="ml-2 px-4 py-2 text-[12px] tracking-[0.12em] font-semibold rounded-full bg-[#c7a15a] text-white hover:bg-[#b38b49] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Phone size={14} />
                <span>ENQUIRE</span>
              </Link>

              {/* Auth Section */}
              {session ? (
                <div className="relative px-4" ref={profileMenuRef}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setProfileMenuOpen(!profileMenuOpen);
                    }}
                    className="flex items-center gap-2 text-[12px] tracking-[0.12em] font-semibold text-slate-800 hover:text-[#0e2437] transition-colors cursor-pointer"
                    type="button"
                  >
                    <UserCircle size={18} />
                    <span className="hidden xl:inline">{session.user?.name || 'Account'}</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileMenuOpen && (
                    <div 
                      data-dropdown="profile-menu"
                      role="menu"
                      className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl py-2 min-w-[220px] z-[9999] pointer-events-auto"
                      style={{ position: 'absolute' }}
                    >
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-[13px] text-slate-800 hover:bg-slate-50 cursor-pointer no-underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileMenuOpen(false);
                        }}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      {session.user?.role === 'ADMIN' && (
                        <Link 
                          href="/admin" 
                          className="flex items-center gap-2 px-4 py-2 text-[13px] text-slate-800 hover:bg-slate-50 cursor-pointer no-underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileMenuOpen(false);
                          }}
                        >
                          <LayoutDashboard size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setProfileMenuOpen(false);
                          handleSignOut();
                        }} 
                        className="w-full text-left px-4 py-2 text-[13px] text-slate-800 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-0 bg-transparent"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-3 text-[12px] tracking-[0.12em] font-bold text-slate-900 hover:bg-slate-100 transition-colors border-l border-slate-200 flex items-center gap-2"
                >
                  <User size={16} />
                  <span>SIGN IN</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-white opacity-80" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 w-full max-w-sm bg-white text-neutral-800 shadow-2xl h-full overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b topbar text-slate-800">
              <div className="flex items-center gap-3">
                <Image src={logoUrl || '/altavida-logo-1.png'} alt="Altavida" width={28} height={28} className="rounded-full" onError={() => setLogoUrl('/altavida-logo-1.png')} />
                <span className="font-extrabold tracking-wider">Altavida Tours</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="close menu">
                <X size={24} />
              </button>
            </div>
            <div className="py-2">
              <div className="px-4 pt-3 pb-2 border-b">
                <form
                  onSubmit={(e) => { e.preventDefault(); setMobileMenuOpen(false); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                  role="search"
                  aria-label="Site search"
                  className="flex items-center bg-gray-100 rounded-md border border-gray-200 px-3 py-2"
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="Search destinations, tours..."
                    className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-full"
                  />
                </form>
              </div>
              <Link href="/" className="block px-6 py-3 text-sm font-bold text-neutral-800 hover:bg-gray-50 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                HOME
              </Link>
              {mainNavItems.map((item) => (
                <div key={item.id} className="border-b">
                  <button
                    className="w-full flex items-center justify-between px-6 py-3 font-bold text-neutral-800 bg-gray-100"
                    onClick={() => toggleMobileSection(item.id)}
                  >
                    <span className="flex items-center space-x-2">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </span>
                    <ChevronDown size={18} className={`${expandedMobileSections[item.id] ? 'rotate-180' : ''} transition-transform`} />
                  </button>
                  {expandedMobileSections[item.id] && (
                    <div className="pb-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="flex items-center space-x-2 px-8 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                      <Link
                        href={item.mainHref}
                        className="flex items-center space-x-2 px-8 py-2 text-sm text-neutral-700 hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ArrowRight size={16} />
                        <span>View All {item.label}</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {/* Mobile Auth Section */}
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-bold text-neutral-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>MY PROFILE</span>
                  </Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 px-6 py-3 text-sm font-bold text-neutral-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      <span>ADMIN PANEL</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center space-x-2 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut size={18} />
                    <span>SIGN OUT</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block px-6 py-3 text-sm font-bold text-neutral-800 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SIGN IN
                </Link>
              )}
              
              <Link href="/gallery" className="block px-6 py-3 text-sm font-bold text-neutral-800 hover:bg-gray-50 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                GALLERY
              </Link>
              <Link href="/blog" className="block px-6 py-3 text-sm font-bold text-neutral-800 hover:bg-gray-50 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                BLOG
              </Link>
              <Link href="/contact" className="block px-6 py-3 text-sm font-bold btn-primary-gradient" onClick={() => setMobileMenuOpen(false)}>
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
