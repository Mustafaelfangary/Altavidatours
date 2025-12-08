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

// Minimal API types used in mapping


function TravelOKNavbarLegacy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openViaClick, setOpenViaClick] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({});
  // Use Altavida logo by default instead of TreasureEgypt logo
  const [logoUrl, setLogoUrl] = useState('/altavida-logo-1.svg');
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { locale, setLocale } = useLanguage();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [panelPos, setPanelPos] = useState<Record<string, { top: number; left: number; width: number }>>({});
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [navReady, setNavReady] = useState(false);

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

  // Optionally fetch logo from API, but keep Altavida default if not found
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
            const normalizedUrl = result.logoUrl.startsWith('/')
              ? result.logoUrl
              : `/images/${result.logoUrl}`;
            setLogoUrl(normalizedUrl);
          }
        }
      } catch {
        // keep default Altavida logo
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
            icon: ['✨', '🏔️', '🏖️', '🏛️', '👨‍👩‍👧‍👦', '💕'][index % 6]
          }));
          setPackagesItems(items);
        }
      })
      .catch(() => {});
  }, []);

  // TreasureEgypt main nav structure (DAHABIYAS / ITINERARIES / PACKAGES)
  const mainNavItems = [
    {
      id: "dahabiyas",
      label: "DAHABIYAS",
      mainHref: "/dahabiyas",
      icon: Ship,
      description: "Luxury Nile Cruises",
      items: dahabiyasItems.length > 0 ? dahabiyasItems : [
        { label: "Royal Cleopatra", href: "/dahabiyas/royal-cleopatra", description: "Ultimate luxury experience", icon: "👑" },
        { label: "Princess Cleopatra", href: "/dahabiyas/princess-cleopatra", description: "Elegant comfort on the Nile", icon: "💎" },
        { label: "Queen Cleopatra", href: "/dahabiyas/queen-cleopatra", description: "Regal sailing experience", icon: "⭐" },
        { label: "AZHAR I", href: "/dahabiyas/azhar-i", description: "Traditional charm meets modern luxury", icon: "🌟" },
        { label: "AZHAR II", href: "/dahabiyas/azhar-ii", description: "Contemporary elegance on water", icon: "🛥️" },
      ],
      featured: [
        { label: "All Dahabiyas", href: "/dahabiyas", icon: Ship },
        { label: "Compare Vessels", href: "/dahabiyas/compare", icon: Users },
        { label: "Virtual Tours", href: "/dahabiyas/virtual-tours", icon: Camera }
      ]
    },
    {
      id: "itineraries",
      label: "ITINERARIES",
      mainHref: "/itineraries",
      icon: MapPin,
      description: "Nile Cruise Routes",
      items: itinerariesItems.length > 0 ? itinerariesItems : [
        { label: "Luxor to Aswan", href: "/itineraries/luxor-aswan", description: "Classic downstream journey", icon: "🏛️" },
        { label: "Aswan to Luxor", href: "/itineraries/aswan-luxor", description: "Upstream adventure", icon: "🌅" },
        { label: "3-Day Short Cruise", href: "/itineraries/short-cruise", description: "Perfect weekend getaway", icon: "⛵" },
        { label: "7-Day Extended Cruise", href: "/itineraries/extended-cruise", description: "Complete Nile experience", icon: "🏺" },
        { label: "Temples & Tombs Tour", href: "/itineraries/temples-tour", description: "Archaeological exploration", icon: "🕌" },
        { label: "Cultural Immersion", href: "/itineraries/cultural-immersion", description: "Authentic local experiences", icon: "🎭" },
      ],
      featured: [
        { label: "All Itineraries", href: "/itineraries", icon: MapPin },
        { label: "Route Map", href: "/itineraries/map", icon: Globe },
        { label: "Best Time to Travel", href: "/itineraries/best-time", icon: Calendar }
      ]
    },
    {
      id: "packages",
      label: "PACKAGES",
      mainHref: "/packages",
      icon: Package,
      description: "Complete Travel Solutions",
      items: packagesItems.length > 0 ? packagesItems : [
        { label: "Luxury Escapes", href: "/packages/luxury", description: "Premium all-inclusive experiences", icon: "✨" },
        { label: "Family Vacations", href: "/packages/family", description: "Fun-filled family adventures", icon: "👨‍👩‍👧‍👦" },
        { label: "Cultural Journeys", href: "/packages/cultural", description: "Deep dive into Egyptian culture", icon: "🏛️" },
        { label: "Adventure Tours", href: "/packages/adventure", description: "Thrilling exploration experiences", icon: "🏔️" },
        { label: "Romantic Getaways", href: "/packages/romantic", description: "Perfect couples retreat", icon: "💕" },
        { label: "Beach Extensions", href: "/packages/beach", description: "Red Sea relaxation", icon: "🏖️" },
      ],
      featured: [
        { label: "All Packages", href: "/packages", icon: Package },
        { label: "Custom Tours", href: "/custom-tours", icon: Heart },
        { label: "Group Bookings", href: "/packages/groups", icon: Users }
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
      setActiveDropdown(itemId);
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
      {/* Modern Top Bar with Language Selector */}
      <div className={`brand-topbar text-white hidden lg:block transition-all duration-300 ${scrolled ? 'py-0.5' : 'py-1'}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-[13px] font-medium hover:text-orange-300 transition-colors duration-200">
                  <Image
                    src={LANGUAGES.find(l => l.code === locale)?.flagSvg || '/images/flags/us.svg'}
                    alt="Language"
                    width={20}
                    height={14}
                    className="rounded-sm shadow-sm"
                  />
                  <span>{LANGUAGES.find(l => l.code === locale)?.label || 'English'}</span>
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code as unknown as Parameters<typeof setLocale>[0])}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-150 text-[13px]"
                    >
                      <Image src={lang.flagSvg} alt={lang.name} width={20} height={14} className="rounded-sm" />
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Quick Links */}
              <div className="flex items-center space-x-5 text-[13px]">
                <Link href="/contact" className="hover:text-orange-300 transition-colors duration-200 font-medium">
                  Contact Us
                </Link>
                <Link href="/about" className="hover:text-orange-300 transition-colors duration-200 font-medium">
                  About Us
                </Link>
                <Link href="/blog" className="hover:text-orange-300 transition-colors duration-200 font-medium">
                  Travel Blog
                </Link>
              </div>
            </div>
            {/* Right side info */}
            <div className="flex items-center space-x-5 text-[13px]">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="font-medium">01002588564</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Main Navigation */}
      <nav
        className={`navbar-glass text-white relative z-40 transition-all duration-500 ${scrolled ? 'shadow-xl' : 'shadow-md'} ${navReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
        ref={containerRef}
        style={{ overflow: 'visible' }}
      >
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-start" style={{ overflow: 'visible' }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-4 text-white hover:bg-white/10 transition-colors duration-200 mobile-menu-button"
              data-testid="mobile-menu-button"
              aria-label={mobileMenuOpen ? 'close menu' : 'open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Home Link */}
            <Link 
              href="/" 
              className="hidden lg:block px-4 py-3.5 text-[13px] font-bold text-white hover:text-travelok-gold transition-colors duration-200 border-r border-white/20"
            >
              HOME
            </Link>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex items-center flex-1 justify-start flex-wrap overflow-visible whitespace-normal pr-1 gap-x-1" style={{ overflow: 'visible' }}>
              {mainNavItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative dropdown-container"
                  style={{ overflow: 'visible' }}
                  onPointerEnter={() => openDropdown(item.id)}
                  onPointerLeave={() => {
                    if (openViaClick === item.id) return;
                    scheduleCloseDropdown(300);
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
                    className={`px-2.5 py-2 text-[11px] font-semibold transition-all duration-200 border-r border-white/20 flex items-center space-x-1.5 hover:-translate-y-0.5 ${
                      activeDropdown === item.id || isActive(item.mainHref)
                        ? 'text-travelok-gold' 
                        : 'text-white hover:text-travelok-gold'
                    }`}
                  >
                    <item.icon size={14} />
                    <span>{item.label}</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Enhanced Mega Dropdown Menu via Portal */}
                  {activeDropdown === item.id && item.items.length > 0 && panelPos[item.id] && (
                    <Portal>
                      <div
                        ref={portalRef}
                        className="pointer-events-auto"
                        style={{ position: 'absolute', top: panelPos[item.id].top, left: panelPos[item.id].left, zIndex: 1000 }}
                        onPointerEnter={() => openDropdown(item.id)}
                        onPointerLeave={() => {
                          if (openViaClick === item.id) return;
                          scheduleCloseDropdown(300);
                        }}
                      >
                        {/* Hover bridge under trigger */}
                        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: panelPos[item.id].width, height: 10 }} />
                        <div 
                          id={`mega-${item.id}`}
                          role="menu"
                          className="bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden"
                          style={{ position: 'absolute', top: 10, left: 0, minWidth: 'min(92vw, 560px)' }}
                        >
                          <div className="p-3">
                            {/* Header */}
                            <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-gray-100">
                              <div className="p-1 bg-blue-100 rounded-lg">
                                <item.icon size={18} className="text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-[12px] font-bold text-gray-900 leading-tight">{item.label}</h3>
                                <p className="text-[11px] text-gray-600 leading-snug">{item.description}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              {/* Main Items */}
                              <div className="col-span-2">
                                <h4 className="text-[11px] font-semibold text-gray-900 mb-1.5 uppercase tracking-wide">Popular Options</h4>
                                <div className="space-y-1.5">
                                  {item.items.slice(0, 6).map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="group flex items-start space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                    >
                                      <span className="text-sm mt-0.5">{subItem.icon}</span>
                                      <div className="flex-1">
                                        <div className="font-medium text-[12px] leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                          {subItem.label}
                                        </div>
                                        <div className="text-[11px] leading-snug text-gray-600 mt-0.5">
                                          {subItem.description}
                                        </div>
                                      </div>
                                      <ArrowRight size={12} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200 mt-1" />
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* Featured Links */}
                              <div className="col-span-1">
                                <h4 className="text-[11px] font-semibold text-gray-900 mb-1.5 uppercase tracking-wide">Quick Access</h4>
                                <div className="space-y-1.5">
                                  {item.featured.map((featured) => (
                                    <Link
                                      key={featured.href}
                                      href={featured.href}
                                      className="group flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                                    >
                                      <featured.icon size={14} className="text-orange-500" />
                                      <span className="font-medium text-[12px] leading-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                                        {featured.label}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                                {/* View All Link */}
                                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                                  <Link
                                    href={item.mainHref}
                                    className="flex items-center justify-center space-x-2 w-full py-1.5 px-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-[12px]"
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setOpenViaClick(null);
                                    }}
                                  >
                                    <span>View All {item.label}</span>
                                    <ArrowRight size={12} />
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
                className="ml-2 mr-1 flex items-center bg-white/10 rounded-md border border-white/20 px-2.5 py-1.5"
                role="search"
                aria-label="Site search"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search destinations, tours..."
                  className="bg-transparent outline-none text-[12px] placeholder:text-white/60 text-white w-36"
                />
              </form>

              {/* Additional Links */}
              <Link
                href="/gallery"
                className="px-3 py-2.5 text-[12px] font-semibold text-white hover:text-travelok-gold transition-colors duration-200 border-r border-white/20 flex items-center space-x-2"
              >
                <Camera size={14} />
                <span>GALLERY</span>
              </Link>
            </div>

            {/* Center Logo */}
            <div className="flex-shrink-0 px-4 lg:px-6 py-2 lg:border-x border-gray-200">
              <Link href="/" className="flex items-center">
                <OptimizedImage 
                  src={logoUrl} 
                  alt="Altavida Tours" 
                  width={120}
                  height={38}
                  className="h-9 lg:h-10 w-auto transition-all duration-300"
                  priority={true}
                  quality={90}
                />
              </Link>
            </div>

            {/* Right Side Links - Desktop */}
            <div className="hidden lg:flex items-center flex-shrink-0 ml-auto">
              <Link
                href="/blog"
                className="px-4 py-3.5 text-[13px] font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200 border-l border-gray-200 flex items-center space-x-2"
              >
                <BookOpen size={16} />
                <span>BLOG</span>
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3.5 text-[13px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Phone size={16} />
                <span>CONTACT</span>
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
                    className="flex items-center space-x-2 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                    type="button"
                  >
                    <UserCircle size={20} />
                    <span className="hidden xl:inline">{session.user?.name || 'Account'}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileMenuOpen && (
                    <div 
                      data-dropdown="profile-menu"
                      role="menu"
                      className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[200px] z-[9999] pointer-events-auto"
                      style={{ position: 'absolute' }}
                    >
                      <Link 
                        href="/profile" 
                        className="flex items-center space-x-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 transition-colors duration-150 cursor-pointer no-underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileMenuOpen(false);
                        }}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      {/* Show admin button if user has ADMIN role */}
                      {session.user?.role === 'ADMIN' && (
                        <Link 
                          href="/admin" 
                          className="flex items-center space-x-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 transition-colors duration-150 cursor-pointer no-underline"
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
                        className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-150 cursor-pointer border-0 bg-transparent"
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
                  className="px-4 py-3.5 text-[13px] font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200 border-l border-gray-200 flex items-center space-x-2"
                >
                  <User size={18} />
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
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 w-full max-w-sm bg-white shadow-2xl h-full overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="py-2">
              <div className="px-4 pt-3 pb-2 border-b">
                <form
                  onSubmit={(e) => { e.preventDefault(); setMobileMenuOpen(false); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                  role="search"
                  aria-label="Site search"
                >
                  <div className="flex items-center bg-gray-100 rounded-md border border-gray-200 px-3 py-2">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="search"
                      placeholder="Search destinations, tours..."
                      className="bg-transparent outline-none text-[14px] placeholder:text-gray-400 w-full"
                    />
                  </div>
                </form>
              </div>

              {/* Mobile main links */}
              <Link href="/" className="block px-4 py-3 text-[14px] font-semibold text-blue-700 hover:bg-blue-50" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>

              {mainNavItems.map((item) => (
                <div key={item.id} className="border-t border-gray-100">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-blue-700 hover:bg-blue-50"
                    onClick={() => toggleMobileSection(item.id)}
                  >
                    <span className="flex items-center space-x-2">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${expandedMobileSections[item.id] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedMobileSections[item.id] && (
                    <div className="bg-gray-50">
                      {item.items.slice(0, 6).map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="flex items-start space-x-3 px-6 py-2 text-[13px] text-gray-800 hover:bg-white"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="mt-0.5">{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                      <Link
                        href={item.mainHref}
                        className="block px-6 py-2 text-[13px] font-semibold text-blue-700 hover:bg-white border-t border-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View All {item.label}
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              {/* Blog & Contact */}
              <Link
                href="/blog"
                className="block px-4 py-3 text-[14px] font-semibold text-blue-700 hover:bg-blue-50 border-t border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Travel Blog
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-[14px] font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 mt-2 mx-4 rounded-md text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Auth Links */}
              <div className="mt-2 border-t border-gray-100">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-[14px] text-gray-800 hover:bg-blue-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-3 text-[14px] text-gray-800 hover:bg-blue-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full text-left flex items-center space-x-2 px-4 py-3 text-[14px] text-gray-800 hover:bg-red-50 border-t border-gray-100 bg-transparent"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center space-x-2 px-4 py-3 text-[14px] text-blue-700 hover:bg-blue-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



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
  const [logoUrl, setLogoUrl] = useState('/altavida-logo-1.svg');
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
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
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Logo is hardcoded to use the SVG file directly
  useEffect(() => {
    // Verify logo exists, fallback to PNG if SVG fails
    const img = new window.Image();
    img.src = '/altavida-logo-1.svg';
    img.onerror = () => setLogoUrl('/altavida-logo-1.png');
  }, []);

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
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
    { href: '/experiences/food', label: 'Egyptian Cuisine', description: 'Food tours & tastings', icon: '🍽️' }
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

  const onKeyDownTopItem = (e: KeyboardEvent, itemId: string) => {
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
        <div className="max-w-5xl mx-auto px-4">
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
      <nav className={`modern-nav sticky top-0 z-[200] transition-all duration-500 ${navReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'} ${scrolled ? 'backdrop-blur bg-[#0b2e4f]/95 shadow-sm' : 'backdrop-blur bg-[#0b2e4f]/90'} border-b border-white/10`} ref={containerRef as any} style={{ overflow: 'visible' }}>
        <div className="max-w-6xl mx-auto px-2 lg:px-3" style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-start gap-1" style={{ overflow: 'visible' }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-4 text-white hover:bg-white/10 transition-colors mobile-menu-button"
              data-testid="mobile-menu-button"
              aria-label={mobileMenuOpen ? 'close menu' : 'open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Home Link */}
            <Link
              href="/"
              className="hidden lg:block px-2 py-3 text-[13px] tracking-[0.12em] font-semibold nav-link border-r border-transparent text-white hover:text-[#c7a15a]"
              style={{ display: isDesktop ? 'block' : 'none' }}
            >
              HOME
            </Link>

            {/* Navigation Items - Desktop */}
            <div className="relative hidden lg:flex items-center flex-1" style={{ overflow: 'visible', display: isDesktop ? 'flex' : 'none' }}>
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
                    className={`px-2 py-2.5 text-[11px] tracking-[0.12em] font-semibold nav-link border-r border-transparent flex items-center gap-1.5 ${activeDropdown === item.id || isActive(item.mainHref) ? 'text-travelok-gold' : 'text-white hover:text-travelok-gold'}`}
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
                          className="bg-[#fffaf0] border border-slate-200/80 shadow-md w-[min(90vw,320px)] rounded-2xl overflow-hidden"
                          style={{ position: 'absolute', top: 10, left: -16 }}
                        >
                          <div className="px-3.5 py-2.5">
                            <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-200/80">
                              <div className="p-1.5 bg-white rounded-lg border border-slate-200/70">
                                <item.icon size={18} className="text-[#c7a15a]" />
                              </div>
                              <div className="leading-tight">
                                <h3 className="text-[11px] font-semibold tracking-[0.22em] text-slate-900 uppercase">{item.label}</h3>
                                <p className="text-[11px] text-slate-600">{item.description}</p>
                              </div>
                            </div>

                            <div className="space-y-1.25">
                              <div>
                                <h4 className="text-[10px] font-semibold text-slate-700 mb-1 tracking-[0.24em] uppercase">Popular Options</h4>
                                <div className="space-y-0.5">
                                  {item.items.slice(0, 6).map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="block px-3 py-1.25 rounded-lg hover:bg-white hover:shadow-sm transition-colors text-left"
                                    >
                                      <div className="text-[12px] font-semibold text-slate-900 leading-snug">{subItem.label}</div>
                                      <div className="text-[11px] text-slate-600 leading-snug">{subItem.description}</div>
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-1 border-top border-slate-200/80 mt-1.5 space-y-1.25">
                                <h4 className="text-[10px] font-semibold text-slate-700 tracking-[0.24em] uppercase">Quick Access</h4>
                                <div className="space-y-0.5">
                                  {item.featured.map((featured) => (
                                    <Link
                                      key={featured.href}
                                      href={featured.href}
                                      className="flex items-center justify-between px-3 py-1.25 rounded-lg hover:bg-white hover:shadow-sm transition-colors"
                                    >
                                      <span className="text-[12px] font-semibold text-slate-900">{featured.label}</span>
                                      <featured.icon size={15} className="text-[#c7a15a]" />
                                    </Link>
                                  ))}
                                </div>
                                <Link
                                  href={item.mainHref}
                                  className="mt-1.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c7a15a] px-4 py-1.75 text-[11px] font-semibold text-white hover:bg-[#b38b49] transition-colors"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    setOpenViaClick(null);
                                  }}
                                >
                                  <span>View All {item.label}</span>
                                  <ArrowRight size={14} />
                                </Link>
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
                className="ml-3 mr-1 flex items-center bg-white/10 rounded-full border border-white/20 px-3 py-1.5 text-sm"
                role="search"
                aria-label="Site search"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search destinations, tours..."
                  className="bg-transparent outline-none text-[13px] placeholder:text-white/50 text-white w-44"
                />
              </form>

              {/* Additional Links */}
              <Link
                href="/gallery"
                className="px-3 py-3 text-[12px] tracking-[0.12em] font-semibold text-white hover:text-[#c7a15a] transition-colors border-r border-transparent flex items-center gap-2"
                style={{ marginLeft: 8 }}
              >
                <Camera size={14} />
                <span>GALLERY</span>
              </Link>
              </div>
            </div>

            {/* Compact Brand at Left (reduce width) */}
            <div className="flex-shrink-0 px-1 lg:px-2 py-0.5 order-first">
              <Link href="/" className="relative block">
                <div className="relative mx-auto flex items-center justify-center">
                  <div className="bg-white rounded-full border border-yellow-500 shadow p-0.5">
                    <Image
                      src={logoUrl}
                      alt="Altavida Tours.com"
                      width={36}
                      height={36}
                      className="w-8 h-8 lg:w-9 lg:h-9 object-contain rounded-full"
                      onError={() => setLogoUrl('/altavida-logo-1.png')}
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Side Links - Desktop */}
            <div className="hidden lg:flex items-center flex-shrink-0 justify-end">
              <Link
                href="/blog"
                className="px-3 py-3 text-[12px] tracking-[0.12em] font-semibold text-white hover:text-[#c7a15a] transition-colors border-l border-white/10 flex items-center gap-2"
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
                    className="flex items-center gap-2 text-[12px] tracking-[0.12em] font-semibold text-white hover:text-[#c7a15a] transition-colors cursor-pointer"
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
                  className="px-4 py-3 text-[12px] tracking-[0.12em] font-bold text-white hover:text-[#c7a15a] hover:bg-white/10 transition-colors border-l border-white/10 flex items-center gap-2"
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
                <Image src={logoUrl} alt="Altavida" width={28} height={28} className="rounded-full" onError={() => setLogoUrl('/altavida-logo-1.png')} unoptimized />
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
