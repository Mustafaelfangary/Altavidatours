'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Users, Clock, Star } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region?: string;
  imageCover?: string;
  description?: string;
}

export default function GreeceIslandsPage() {
  const t = useTranslation();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await fetch('/api/destinations-list');
        if (res.ok) {
          const data = await res.json();
          const greece = data.find((d: any) => d.country === 'Greece');
          setDestination(greece);
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 bg-black/50 pt-24 overflow-hidden">
        {destination?.imageCover && (
          <Image
            src={destination.imageCover}
            alt={destination.name}
            fill
            className="object-cover absolute inset-0 -z-10"
          />
        )}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            Greek Islands
          </h1>
          <p className="text-2xl text-gray-200">Island paradise in the Mediterranean</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Loading destination...</p>
          </div>
        ) : destination ? (
          <>
            <div className="max-w-4xl mx-auto mb-16">
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {destination.description || 'Experience the timeless beauty of the Greek Islands. Explore whitewashed villages perched on cliffs, swim in crystal-clear waters, and immerse yourself in the legendary hospitality of the Mediterranean.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-linear-to-br from-amber-900/50 to-gray-800 rounded-lg p-6">
                  <MapPin className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-amber-300 mb-2">Region</h3>
                  <p className="text-gray-300">{destination.region || 'Aegean Sea'}</p>
                </div>
                <div className="bg-linear-to-br from-amber-900/50 to-gray-800 rounded-lg p-6">
                  <Star className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-amber-300 mb-2">Best Time</h3>
                  <p className="text-gray-300">May - September</p>
                </div>
                <div className="bg-linear-to-br from-amber-900/50 to-gray-800 rounded-lg p-6">
                  <Clock className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-amber-300 mb-2">Duration</h3>
                  <p className="text-gray-300">7-10 Days</p>
                </div>
              </div>

              <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-lg p-8 mb-12">
                <h2 className="text-3xl font-bold text-amber-300 mb-6">Highlights</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3">•</span>
                    <span>Santorini - Iconic sunsets and volcanic beauty</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3">•</span>
                    <span>Mykonos - Vibrant nightlife and pristine beaches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3">•</span>
                    <span>Delos - Ancient archaeological site and mythology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3">•</span>
                    <span>Crete - Largest island with Minoan heritage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3">•</span>
                    <span>Water sports and Mediterranean gastronomy</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Link href="/packages">
                  <button className="bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-lg hover:from-amber-300 hover:to-yellow-200 transition-all flex items-center justify-center gap-2 mx-auto">
                    Book a Package <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">Destination not found</p>
            <Link href="/destinations">
              <button className="bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium py-2 px-6 rounded-lg hover:from-amber-300 hover:to-yellow-200">
                Back to Destinations
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
