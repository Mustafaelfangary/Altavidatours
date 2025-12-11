"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "./dashboard/NotificationCenter";
import {
  Home as HomeIcon,
  Ship as ShipIcon,
  Package as PackageIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  MessageSquare as MessageIcon,
  HelpCircle as HelpIcon,
  Gift as GiftIcon,
  Shield as ShieldIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  Image as ImageIcon,
  LogOut,
  User,
  ChevronDown,
  FileText,
  BarChart3,
  Palette,
  Globe,
  Compass,
  Anchor,
  MapPin,
  Menu,
  Search,
  Quote
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

// Enhanced navigation structure with dropdowns
const navItems = [
  { href: "/dashboard", label: "Overview", icon: HomeIcon },
  {
    label: "Content",
    icon: ShipIcon,
    dropdown: [
      { href: "/dashboard/dahabiyat", label: "Dahabiyat", icon: ShipIcon },
      { href: "/dashboard/packages", label: "Packages", icon: PackageIcon },
      { href: "/dashboard/cruises", label: "Cruises", icon: Anchor },
      { href: "/dashboard/daily-tours", label: "Daily Tours", icon: Compass },
      { href: "/dashboard/excursions", label: "Excursions", icon: MapPin },
      { href: "/dashboard/media", label: "Media Library", icon: ImageIcon },
    ]
  },
  {
    label: "Management",
    icon: UsersIcon,
    dropdown: [
      { href: "/dashboard/bookings", label: "Bookings", icon: CalendarIcon },
      { href: "/dashboard/contacts", label: "Contacts", icon: MessageIcon },
      { href: "/dashboard/users", label: "Users", icon: UsersIcon },
    ]
  },
  {
    label: "Website",
    icon: Globe,
    dropdown: [
      { href: "/dashboard/settings", label: "Content Settings", icon: SettingsIcon },
      { href: "/dashboard/site-settings", label: "Site Settings", icon: Globe },
      { href: "/dashboard/navigation", label: "Navigation", icon: Menu },
      { href: "/dashboard/seo", label: "SEO Settings", icon: Search },
      { href: "/dashboard/testimonials", label: "Testimonials", icon: Quote },
      { href: "/dashboard/settings/homepage", label: "Homepage", icon: FileText },
      { href: "/dashboard/settings/about", label: "About Page", icon: FileText },
      { href: "/dashboard/settings/contact", label: "Contact Page", icon: FileText },
      { href: "/dashboard/settings/excursions", label: "Excursions & Tours", icon: FileText },
      { href: "/dashboard/settings/daily-tours", label: "Daily Tours", icon: FileText },
      { href: "/dashboard/settings/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/dashboard/settings/dahabiyat", label: "Dahabiyat", icon: ShipIcon },
      { href: "/dashboard/settings/footer", label: "Footer", icon: FileText },
      { href: "/dashboard/settings/tailor-made", label: "Tailor-Made", icon: FileText },
    ]
  },
  {
    label: "Support",
    icon: HelpIcon,
    dropdown: [
      { href: "/dashboard/faqs", label: "FAQs", icon: HelpIcon },
      { href: "/dashboard/promotions", label: "Promotions", icon: GiftIcon },
      { href: "/dashboard/policies", label: "Policies", icon: ShieldIcon },
      { href: "/dashboard/notifications", label: "Notifications", icon: BellIcon },
    ]
  },
];

// Single navigation items (no dropdown)
const singleNavItems = navItems.filter(item => item.href);
// Dropdown navigation items
const dropdownNavItems = navItems.filter(item => item.dropdown);

export default function DashboardNav() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if current path matches any dropdown item
  const isDropdownActive = (dropdown: any[]) => {
    return dropdown.some(item => pathname === item.href);
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg border-b-2 border-pharaoh-gold/20"
         style={{
           background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(210, 85%, 30%) 50%, hsl(43, 85%, 58%) 100%)',
           backdropFilter: 'blur(20px)',
           boxShadow: '0 8px 32px rgba(33, 82, 135, 0.15)'
         }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Enhanced Logo and Home Link */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-3 text-white/90 hover:text-white transition-all duration-300 group"
              onMouseEnter={() => setHoveredItem('home')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative">
                <HomeIcon className="w-6 h-6 group-hover:scale-110 transition-all duration-300" />
                {hoveredItem === 'home' && (
                  <div className="absolute -inset-2 bg-white/10 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="font-semibold text-lg tracking-wide">Home</span>
            </Link>

            {/* Enhanced Navigation Items */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Single Navigation Items */}
              {singleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href ?? '#'}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 relative group",
                      isActive
                        ? "text-white bg-white/20 border border-white/30 shadow-lg backdrop-blur-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                    )}
                    onMouseEnter={() => setHoveredItem(item.href ?? '')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive ? "text-white scale-110" : "text-white/70 group-hover:text-white group-hover:scale-105"
                    )} />
                    <span className="tracking-wide">{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pharaoh-gold rounded-full animate-pulse"></div>
                    )}
                    {hoveredItem === item.href && !isActive && (
                      <div className="absolute inset-0 bg-linear-to-r from-white/5 to-pharaoh-gold/10 rounded-xl animate-pulse"></div>
                    )}
                  </Link>
                );
              })}

              {/* Dropdown Navigation Items */}
              {dropdownNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isDropdownActive(item.dropdown ?? []);
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 relative group",
                          isActive
                            ? "text-white bg-white/20 border border-white/30 shadow-lg backdrop-blur-sm"
                            : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                        )}
                        onMouseEnter={() => setHoveredItem(item.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Icon className={cn(
                          "w-5 h-5 transition-all duration-300",
                          isActive ? "text-white scale-110" : "text-white/70 group-hover:text-white group-hover:scale-105"
                        )} />
                        <span className="tracking-wide">{item.label}</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-all duration-300",
                          isActive ? "text-white rotate-180" : "text-white/70 group-hover:text-white group-hover:rotate-180"
                        )} />
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pharaoh-gold rounded-full animate-pulse"></div>
                        )}
                        {hoveredItem === item.label && !isActive && (
                          <div className="absolute inset-0 bg-linear-to-r from-white/5 to-pharaoh-gold/10 rounded-xl animate-pulse"></div>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 bg-white/95 backdrop-blur-md border border-pharaoh-gold/20 shadow-2xl rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                        boxShadow: '0 20px 40px rgba(33, 82, 135, 0.15)'
                      }}
                    >
                      <DropdownMenuLabel className="text-deep-nile-blue font-bold text-sm uppercase tracking-wider border-b border-pharaoh-gold/20 pb-2">
                        {item.label}
                      </DropdownMenuLabel>
                      {(item.dropdown ?? []).map((dropdownItem) => {
                        const DropdownIcon = dropdownItem.icon;
                        const isDropdownItemActive = pathname === dropdownItem.href;
                        return (
                          <DropdownMenuItem key={dropdownItem.href} asChild>
                            <Link
                              href={dropdownItem.href ?? '#'}
                              className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                                isDropdownItemActive
                                  ? "bg-pharaoh-gold/20 text-deep-nile-blue font-semibold"
                                  : "text-deep-nile-blue/80 hover:bg-pharaoh-gold/10 hover:text-deep-nile-blue"
                              )}
                            >
                              <DropdownIcon className={cn(
                                "w-4 h-4 transition-all duration-200",
                                isDropdownItemActive ? "text-pharaoh-gold scale-110" : "text-deep-nile-blue/60"
                              )} />
                              <span className="tracking-wide">{dropdownItem.label}</span>
                              {isDropdownItemActive && (
                                <div className="ml-auto w-2 h-2 bg-pharaoh-gold rounded-full animate-pulse"></div>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
            </div>
          </div>

          {/* Enhanced Right Side */}
          <div className="flex items-center space-x-6">
            {/* Enhanced Notification Center */}
            <div className="hidden md:block">
              <div className="relative">
                <NotificationCenter />
              </div>
            </div>

            {/* Enhanced User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="relative">
                  <User className="w-5 h-5 text-white/90" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-pharaoh-gold rounded-full animate-pulse"></div>
                </div>
                <span className="text-white font-semibold tracking-wide">Admin</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-red-500/20 hover:border-red-400/30 border border-white/20 rounded-xl px-4 py-2 transition-all duration-300 backdrop-blur-sm group"
                onMouseEnter={() => setHoveredItem('signout')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline font-semibold tracking-wide">Sign Out</span>
                {hoveredItem === 'signout' && (
                  <div className="absolute inset-0 bg-linear-to-r from-red-500/10 to-red-400/20 rounded-xl animate-pulse"></div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className="lg:hidden border-t border-white/20 py-4 bg-linear-to-r from-white/5 to-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="relative">
                <User className="w-4 h-4 text-white/90" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pharaoh-gold rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm text-white font-semibold">Admin</span>
            </div>

            <div className="flex items-center space-x-3">
              <NotificationCenter />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-red-500/20 border border-white/20 rounded-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Nav Items */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Single items for mobile */}
            {singleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href ?? '#'}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm",
                    isActive
                      ? "text-white bg-white/20 border border-white/30 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 border border-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              );
            })}

            {/* Dropdown items flattened for mobile */}
            {dropdownNavItems.map((category) =>
              (category.dropdown ?? []).slice(0, 3).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href ?? '#'}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm",
                      isActive
                        ? "text-white bg-white/20 border border-white/30 shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10 border border-white/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="tracking-wide text-xs">{item.label}</span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


