"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Settings, 
  LayoutDashboard, 
  Globe, 
  LogOut, 
  Home, 
  BookOpen, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  Bell, 
  Search, 
  MessageSquare, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dahabiyas', label: 'Dahabiyas', icon: BookOpen },
  { href: '/admin/packages', label: 'Packages', icon: Calendar },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
];

const websiteDropdownItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dahabiyas', label: 'Dahabiyas', icon: BookOpen },
  { href: '/packages', label: 'Packages', icon: Calendar },
  { href: '/about', label: 'About', icon: UserIcon },
  { href: '/contact', label: 'Contact', icon: Mail },
];

interface AdminHeaderProps {
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/signin';
    },
  });
  
  const [notifications] = useState([
    { id: 1, title: 'New booking received', time: '2 hours ago', read: false },
    { id: 2, title: 'New message from customer', time: '5 hours ago', read: false },
  ]);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && 
          !profileMenuRef.current.contains(event.target as Node) && 
          profileButtonRef.current && 
          !profileButtonRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await signOut({ callbackUrl: '/' });
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/admin/profile');
    setIsProfileMenuOpen(false);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/admin/settings');
    setIsProfileMenuOpen(false);
  };

  const handleViewSiteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open('/', '_blank');
    setIsProfileMenuOpen(false);
  };

  // Don't render anything until we have a session
  if (!session) {
    return null;
  }

  if (status === 'loading') {
    return (
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-egyptian-blue-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <Link href="/admin" className="flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-egyptian-blue to-egyptian-blue-600 bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
              <span className="sr-only">View notifications</span>
              <div className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {notifications.length}
                  </span>
                )}
              </div>
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
              <span className="sr-only">View messages</span>
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
              <span className="sr-only">Help</span>
              <HelpCircle className="h-5 w-5" />
            </Button>

            <Link href="/" className="hidden md:block">
              <Button variant="outline" size="sm" className="ml-2">
                <Globe className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>

            <div className="relative ml-2" ref={profileMenuRef}>
              <Button
                ref={profileButtonRef}
                variant="ghost"
                className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100"
                onClick={toggleProfileMenu}
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={session?.user?.image || ''} 
                    alt={session?.user?.name || 'User'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <AvatarFallback className="bg-egyptian-blue-100 text-egyptian-blue-800">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={session?.user?.image || ''} 
                          alt={session?.user?.name || 'User'}
                        />
                        <AvatarFallback className="bg-egyptian-blue-100 text-egyptian-blue-800">
                          {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {session?.user?.name || 'User'}
                        </p>
                        {session?.user?.email && (
                          <p className="truncate text-xs text-gray-500">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleProfileClick}
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Your Profile</span>
                    </button>
                    
                    <button
                      onClick={handleSettingsClick}
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Settings</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleViewSiteClick}
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Globe className="mr-3 h-5 w-5 text-gray-400" />
                      <span>View Site</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-red-400" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {websiteDropdownItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={onMenuClick}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}

          <div className="border-t border-gray-200 mt-2 pt-2">
            <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Admin
            </div>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={onMenuClick}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
