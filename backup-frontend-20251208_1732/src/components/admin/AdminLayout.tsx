'use client';

import { useState, type ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Anchor, // Alternative to ShipWheel
  MapPin, 
  Image as ImageIcon, 
  FileText as Newspaper, 
  Star, 
  Handshake, 
  Globe, 
  FileText, 
  Menu as MenuSquare, 
  Palette 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  roles?: string[];
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: 'Dahabiyas',
    href: '/admin/dahabiyas',
    icon: <Anchor className="h-4 w-4" />,
  },
  {
    title: 'Packages',
    href: '/admin/packages',
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: 'Itineraries',
    href: '/admin/itineraries',
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: <CalendarIcon className="h-4 w-4" />,
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    title: 'Gallery',
    href: '/admin/gallery',
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    title: 'Blog',
    href: '/admin/blogs',
    icon: <Newspaper className="h-4 w-4" />,
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: <Star className="h-4 w-4" />,
  },
  {
    title: 'Partners',
    href: '/admin/partners',
    icon: <Handshake className="h-4 w-4" />,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: <Users className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: 'Website',
    href: '/admin/website',
    icon: <Globe className="h-4 w-4" />,
    children: [
      {
        title: 'Pages',
        href: '/admin/website/pages',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: 'Navigation',
        href: '/admin/website/navigation',
        icon: <Menu className="h-4 w-4" />,
      },
      {
        title: 'Theme',
        href: '/admin/website/theme',
        icon: <Palette className="h-4 w-4" />,
      },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to sign-in page if not authenticated
      window.location.href = '/auth/signin?callbackUrl=/admin';
    },
  });
  const pathname = usePathname();

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <button
              type="button"
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email || ''}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center p-2 rounded-md ${
                    pathname === item.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow-sm">
          <button
            type="button"
            className="px-4 text-gray-500 hover:text-gray-600 focus:outline-none lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {navItems.find((item) => pathname.startsWith(item.href))?.title || 'Dashboard'}
              </h2>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-gray-50">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
