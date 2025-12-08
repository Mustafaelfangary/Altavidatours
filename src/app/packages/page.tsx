'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import { Star, Users, Calendar, MapPin, Ship, Sparkles } from 'lucide-react';
import imageLoader from '../../utils/imageLoader';

interface Package {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  packageType?: string;
  cairoNights?: number;
  dahabiyaNights?: number;
  maxGuests?: number;
  highlights?: string[];
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
      {/* Enhanced Hero Section with Slideshow */}
      <div className="relative h-[60vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={[
            '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.18.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.19.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.22.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
            '/cultural&historical/Saqqara pyramid.jpg',
            '/Alexandria/IMG_6198.JPG'
          ]}
          alt="Egypt Tour Packages"
          autoPlay={true}
          interval={5000}
          height="h-full"
          className="rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif drop-shadow-2xl headline-animated">
              Egypt Tour Packages
            </h1>
            <div className="mb-4">
              <PharaonicText className="text-white/90" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
              Discover the perfect blend of ancient wonders and modern comfort with our carefully curated multi-day tour packages
            </p>
            <div className="mt-4">
              <PharaonicDecoration variant="section" size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {Array.isArray(packages) && packages.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="group overflow-hidden bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                <Link href={`/packages/${pkg.id}`} className="block">
                  {/* Enhanced Package Image */}
                  <div className="relative h-80 w-full overflow-hidden image-frame">
                    <Image
                      src={pkg.mainImageUrl || '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg'}
                      alt={pkg.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      loader={imageLoader}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-pharaoh-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {/* Package Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-pharaoh-gold text-white font-bold px-3 py-2 text-sm">
                        {pkg.packageType?.replace('_', ' + ') || 'Premium Package'}
                      </Badge>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-nile-blue text-white font-bold px-3 py-2 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {pkg.durationDays} Days
                      </Badge>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                        <span className="text-2xl font-bold text-nile-blue">${pkg.price.toLocaleString()}</span>
                        <span className="text-sm text-ancient-stone block">per person</span>
                      </div>
                    </div>
                  </div>

                  {/* Package Content */}
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-4 text-nile-blue font-serif group-hover:text-pharaoh-gold transition-colors duration-300">
                      {pkg.name}
                    </h2>

                    <p className="text-ancient-stone mb-6 line-clamp-3 text-lg leading-relaxed">
                      {pkg.shortDescription}
                    </p>

                    {/* Package Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {pkg.cairoNights && (
                        <div className="flex items-center gap-2 text-nile-blue">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">{pkg.cairoNights} nights in Cairo</span>
                        </div>
                      )}
                      {pkg.dahabiyaNights && (
                        <div className="flex items-center gap-2 text-nile-blue">
                          <Ship className="w-4 h-4" />
                          <span className="text-sm font-medium">{pkg.dahabiyaNights} nights on Nile</span>
                        </div>
                      )}
                      {pkg.maxGuests && (
                        <div className="flex items-center gap-2 text-nile-blue">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">Max {pkg.maxGuests} guests</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-pharaoh-gold">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Premium Experience</span>
                      </div>
                    </div>

                    {/* Highlights Preview */}
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-nile-blue mb-2 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Package Highlights
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {pkg.highlights.slice(0, 3).map((highlight, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-pharaoh-gold/30 text-nile-blue">
                              {highlight}
                            </Badge>
                          ))}
                          {pkg.highlights.length > 3 && (
                            <Badge variant="outline" className="text-xs border-pharaoh-gold/30 text-ancient-stone">
                              +{pkg.highlights.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Call to Action */}
                    <div className="flex justify-between items-center pt-4 border-t border-pharaoh-gold/20">
                      <span className="text-ancient-stone font-medium">View Full Details</span>
                      <div className="text-pharaoh-gold group-hover:translate-x-2 transition-transform duration-300">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-xl border border-pharaoh-gold/30">
              <Ship className="w-16 h-16 text-pharaoh-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-nile-blue mb-4">No Packages Available</h3>
              <p className="text-ancient-stone">
                Our premium packages are being prepared. Please check back soon for amazing Egypt experiences.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}