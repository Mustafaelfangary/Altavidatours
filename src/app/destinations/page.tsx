'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region?: string | null;
  imageCover?: string | null;
  description?: string | null;
  highlights?: string[];
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations-list');
        if (response.ok) {
          const data = await response.json();
          setDestinations(data);
          setFilteredDestinations(data);
        }
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    let filtered = destinations;

    if (selectedCountry !== 'all') {
      filtered = filtered.filter((dest) => dest.country === selectedCountry);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, selectedCountry, destinations]);

  const countries = Array.from(
    new Set(destinations.map((d) => d.country))
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
            alt="Destinations Hero"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">Explore Destinations</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover the most breathtaking destinations across the Middle East and North Africa
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 bg-white p-6 rounded-xl shadow-lg">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations, regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredDestinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-300 h-96"
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <Image
                  src={dest.imageCover || '/placeholder.jpg'}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <div className="mb-2">
                  <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {dest.country}
                  </div>
                </div>

                <h3 className="text-3xl font-bold font-serif mb-2 group-hover:text-amber-300 transition-colors">
                  {dest.name}
                </h3>

                {dest.region && (
                  <p className="text-white/80 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {dest.region}
                  </p>
                )}

                {dest.description && (
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {dest.description}
                  </p>
                )}

                {/* Highlights Preview */}
                {dest.highlights && dest.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(dest.highlights as string[]).slice(0, 2).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full"
                      >
                        ✨ {highlight}
                      </span>
                    ))}
                    {(dest.highlights as string[]).length > 2 && (
                      <span className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                        +{(dest.highlights as string[]).length - 2} more
                      </span>
                    )}
                  </div>
                )}

                <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors w-full group-hover:shadow-lg">
                  Explore →
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No destinations found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('all');
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
            Showing <strong>{filteredDestinations.length}</strong> of{' '}
            <strong>{destinations.length}</strong> destinations
          </p>
        </div>
      </div>
    </div>
  );
}



