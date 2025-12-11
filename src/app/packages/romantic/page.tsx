'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Users, Clock, DollarSign } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Package {
  id: string;
  name: string;
  description: string;
  image?: string;
  price?: number;
  duration?: string;
  category?: string;
}

export default function RomanticPackagesPage() {
  const t = useTranslation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages?category=romantic');
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            {t('romanticPackages') || 'Romantic Packages'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create unforgettable memories with your loved one on our romantic getaways.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Link key={pkg.id} href={`/packages/${pkg.id}`}>
                <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full">
                  {pkg.image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-300 mb-2 group-hover:text-amber-200">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">{pkg.description}</p>
                    
                    {pkg.price && (
                      <div className="flex items-center text-amber-300 mb-3">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="font-semibold">${pkg.price}</span>
                      </div>
                    )}

                    {pkg.duration && (
                      <div className="flex items-center text-gray-300 text-sm mb-3">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{pkg.duration}</span>
                      </div>
                    )}

                    <button className="w-full mt-4 bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium py-2 rounded-lg hover:from-amber-300 hover:to-yellow-200 transition-all flex items-center justify-center">
                      {t('learnMore')} <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">No romantic packages available at the moment.</p>
            <Link href="/packages">
              <button className="bg-linear-to-r from-amber-400 to-yellow-300 text-gray-900 font-medium py-2 px-6 rounded-lg hover:from-amber-300 hover:to-yellow-200">
                {t('allPackages')}
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
