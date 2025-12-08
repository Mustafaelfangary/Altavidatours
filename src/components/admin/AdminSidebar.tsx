'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Ship, 
  Package, 
  Users, 
  Settings, 
  Mail, 
  Bell, 
  Home, 
  FileText, 
  Globe, 
  MapPin, 
  Building2, 
  Landmark, 
  Compass, 
  Waves, 
  Briefcase, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Content Manager', href: '/admin/content', icon: FileText },
    { name: 'Homepage', href: '/admin/content/homepage', icon: Home },
    { name: 'About Us', href: '/admin/content/about', icon: Globe },
    { name: 'Contact', href: '/admin/content/contact', icon: Mail },
    { name: 'Footer', href: '/admin/content/footer', icon: Bell },
    { name: 'Attractions', href: '/admin/content/attractions', icon: Landmark },
    { name: 'Destinations', href: '/admin/content/destinations', icon: MapPin },
    { name: 'Accommodations', href: '/admin/content/accommodations', icon: Building2 },
    { name: 'Packages', href: '/admin/content/packages', icon: Package },
    { name: 'Tours', href: '/admin/content/tours', icon: Compass },
    { name: 'Experiences', href: '/admin/content/experiences', icon: Waves },
    { name: 'Services', href: '/admin/content/services', icon: Briefcase },
    { name: 'Custom Tours', href: '/admin/content/custom-tours', icon: Sparkles },
    { name: 'Cards', href: '/admin/content/cards', icon: Layers },
    { name: 'Global Settings', href: '/admin/content/global', icon: Settings },
    { 
      name: 'Business Tools',
      divider: true
    },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { 
      name: 'Navigation',
      divider: true
    },
    { name: 'Back to Site', href: '/', icon: Home },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <h1 className="text-2xl font-bold text-egyptian-blue">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-2 space-y-1 bg-white">
            {navItems.map((item) => {
              if ((item as any).divider) {
                return (
                  <div key={item.name} className="px-4 py-3 mt-4 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.name}</h3>
                  </div>
                );
              }

              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon as React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-4 py-3 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-egyptian-blue/10 text-egyptian-blue border-r-4 border-egyptian-blue'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-egyptian-blue' : 'text-gray-400 group-hover:text-gray-500',
                    )}
                    aria-hidden={true}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

