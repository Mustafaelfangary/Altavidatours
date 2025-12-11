'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Clock, Tag, Search, Filter } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  duration: number;
  mainImage?: string;
  category?: string | null;
  maxGroupSize?: number | null;
  difficulty?: string | null;
  isFeatured?: boolean;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  duration: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 10000],
    duration: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages-list');
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
          setFilteredPackages(data);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = packages;

    if (filters.category !== 'all') {
      filtered = filtered.filter((pkg) => pkg.category === filters.category);
    }

    filtered = filtered.filter(
      (pkg) => pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1]
    );

    if (filters.duration !== 'all') {
      const [minDays, maxDays] = filters.duration.split('-').map(Number);
      filtered = filtered.filter(
        (pkg) => pkg.duration >= minDays && pkg.duration <= maxDays
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPackages(filtered);
  }, [filters, searchTerm, packages]);

  const categories = Array.from(
    new Set(packages.filter((p) => p.category).map((p) => p.category))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-linear-to-r from-red-600 to-red-700 text-white pt-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/placeholder.jpg"
            alt="Packages Hero"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">Egypt Tour Packages</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover carefully curated packages combining ancient wonders with modern comfort
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 bg-white p-6 rounded-xl shadow-lg">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat || ''}>
                {cat}
              </option>
            ))}
          </select>

          {/* Duration Filter */}
          <select
            value={filters.duration}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Durations</option>
            <option value="1-3">1-3 Days</option>
            <option value="4-7">4-7 Days</option>
            <option value="8-14">8-14 Days</option>
            <option value="15-99">15+ Days</option>
          </select>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPackages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <Image
                  src={pkg.mainImage || '/placeholder.jpg'}
                  alt={pkg.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                {/* Discount Badge */}
                {pkg.discountPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    Save{' '}
                    {Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100)}%
                  </div>
                )}

                {/* Category Badge */}
                {pkg.category && (
                  <div className="absolute top-4 left-4 bg-amber-400 text-gray-900 px-3 py-1 rounded-full font-semibold text-sm">
                    {pkg.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {pkg.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {pkg.shortDescription}
                </p>

                {/* Info Row */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span>{pkg.duration} Days</span>
                  </div>
                  {pkg.maxGroupSize && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-red-600" />
                      <span>Max {pkg.maxGroupSize}</span>
                    </div>
                  )}
                  {pkg.difficulty && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4 text-red-600" />
                      <span className="capitalize">{pkg.difficulty}</span>
                    </div>
                  )}
                </div>

                {/* Price Section */}
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    {pkg.discountPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${pkg.discountPrice.toLocaleString()}
                        </span>
                        <span className="text-sm line-through text-gray-500">
                          ${pkg.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        ${pkg.price.toLocaleString()}
                      </span>
                    )}
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No packages found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: 'all', priceRange: [0, 10000], duration: 'all' });
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-center text-gray-600 mt-8">
          <p>
            Showing <strong>{filteredPackages.length}</strong> of{' '}
            <strong>{packages.length}</strong> packages
          </p>
        </div>
      </div>
    </div>
  );
}


