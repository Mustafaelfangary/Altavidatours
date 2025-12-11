"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Package {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  mainImage: string | null;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  imageCover: string | null;
}

interface DynamicNavMenuProps {
  type: 'packages' | 'destinations';
  label: string;
}

export default function DynamicNavMenu({ type, label }: DynamicNavMenuProps) {
  const [items, setItems] = useState<Package[] | Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const endpoint = type === 'packages' ? '/api/packages-list' : '/api/destinations-list';
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setItems(data.slice(0, 5)); // Show only top 5
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  if (loading) return null;

  // Render only the inner content — positioning/visibility is handled by the parent `Navbar`.
  return (
    <div className="space-y-2">
      {items.map((item: any) => (
        <Link
          key={item.id}
          href={type === 'packages' ? `/packages/${item.id}` : `/destinations/${item.slug}`}
          className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group/item"
        >
          <div className="flex items-start space-x-3">
            {(item.mainImage || item.imageCover) && (
              <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={item.mainImage || item.imageCover || '/placeholder.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white group-hover/item:text-red-600">{item.name}</p>
              {(item.category || item.region) && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(item as Package).category || (item as Destination).region}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
      <Link
        href={type === 'packages' ? '/packages' : '/destinations'}
        className="block p-3 text-center text-red-600 font-semibold hover:text-red-700 border-t border-gray-200 dark:border-gray-600"
      >
        View All {label} →
      </Link>
    </div>
  );
}


