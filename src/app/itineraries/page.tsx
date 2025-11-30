'use client';

import { useState, useEffect } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Star, Clock, ChevronRight, Play, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';
import UnifiedHero from '@/components/ui/UnifiedHero';

// Note: dynamic rendering and revalidation are configured at server components/routes only.
// This page is a Client Component and fetches data on the client with `cache: 'no-store'`.
// Server-only exports like `dynamic` or `revalidate` must not be exported here.

interface Itinerary {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  durationDays: number;
  mainImageUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  price?: number;
  maxGuests?: number;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

type PharaohButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; children: ReactNode };

const PharaohButton = ({ children, className = '', ...props }: PharaohButtonProps) => (
  <Button
    className={`relative overflow-hidden bg-gradient-to-r from-ocean-blue to-deep-blue hover:from-ocean-blue-dark hover:to-navy-blue text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
  </Button>
);

type AnimatedSectionProps = { children: ReactNode; animation?: 'fade-up' | 'fade-left' | 'fade-right'; delay?: number };

const AnimatedSection = ({ children, animation = 'fade-up', delay = 0 }: AnimatedSectionProps) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      y: animation === 'fade-up' ? 50 : 0,
      x: animation === 'fade-left' ? -50 : animation === 'fade-right' ? 50 : 0 
    }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    transition={{ duration: 0.8, delay: delay / 1000 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export default function ItinerariesPage() {
  const { getContent, loading: contentLoading } = useContent({ page: 'itineraries' });
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const getSettingValue = (key: string, defaultValue: string = '') => {
    return getContent(key, defaultValue);
  };

  useEffect(() => {
    // Prefer static hardcoded data (exported from /src/data/hardcodedItineraries.ts)
    // falling back to the existing API when available.
    import('@/data/hardcodedItineraries').then(mod => {
      if (Array.isArray(mod.hardcodedItineraries) && mod.hardcodedItineraries.length > 0) {
        // Convert minimal hardcoded items to the full Itinerary shape the UI expects
        const items = mod.hardcodedItineraries.map((h: any, idx: number) => ({
          id: h.id || `hc-${idx}`,
          name: h.title || h.file || `Itinerary ${idx + 1}`,
          slug: (h.id || h.file || `hc-${idx}`).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: h.shortDescription || '',
          shortDescription: h.shortDescription || '',
          durationDays: typeof h.duration === 'number' ? h.duration : (h.duration ? Number(h.duration) || 0 : 0),
          mainImageUrl: h.image || '/images/default-itinerary.jpg',
          heroImageUrl: h.image || '/images/default-itinerary.jpg',
          videoUrl: undefined,
          price: undefined,
          maxGuests: undefined,
          highlights: [],
          included: [],
          notIncluded: [],
          isActive: true,
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        setItineraries(items as any);
        setLoading(false);
        return;
      }

      // Fallback to remote API
      fetchItineraries();
    }).catch(() => fetchItineraries());
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch(`/api/itineraries?_t=${Date.now()}`, { cache: 'no-store' as RequestCache });
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItineraries = itineraries.filter(itinerary => {
    if (filter === 'all') return itinerary.isActive;
    if (filter === 'featured') return itinerary.featured && itinerary.isActive;
    if (filter === 'short') return itinerary.durationDays <= 5 && itinerary.isActive;
    if (filter === 'long') return itinerary.durationDays > 7 && itinerary.isActive;
    return itinerary.isActive;
  });

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-ocean-blue-lightest flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ocean-blue mx-auto mb-4"></div>
          <p className="text-ocean-blue text-lg">{getSettingValue('itineraries_loading_text', 'Loading Journeys...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 on-light">
      {/* Unified Hero Section */}
      <UnifiedHero
        videoSrc={getSettingValue('itineraries_hero_video', '/videos/itineraries-hero.mp4')}
        posterSrc={getSettingValue('itineraries_hero_image', '/images/Royal Cleopatra/DSC_8502.jpg')}
        title={getSettingValue('itineraries_hero_title', 'Itineraries')}
        subtitle={getSettingValue('itineraries_hero_subtitle', 'Discover Ancient Egypt Through Carefully Crafted Journeys')}
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={false}
        showHieroglyphics={false}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
        mobileMinHeight="60vh"
        mediaFit="contain"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <p className="text-lg mb-8 leading-relaxed max-w-3xl mx-auto text-gray-700">
            {getSettingValue('itineraries_hero_description', 'Explore our collection of meticulously planned itineraries, each designed to immerse you in the wonders of pharaonic Egypt while ensuring comfort and authenticity.')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <PharaohButton className="bg-blue-100 hover:bg-blue-200 text-gray-900 border border-blue-200 backdrop-blur-sm">
              <Play className="w-5 h-5 mr-2" />
              {getSettingValue('itineraries_hero_cta_text', 'Explore Journeys')}
            </PharaohButton>
            <PharaohButton className="bg-gradient-to-r from-ocean-blue-500 to-blue-600 text-black">
              <Download className="w-5 h-5 mr-2" />
              Download Brochure
            </PharaohButton>
          </div>
        </div>
      </UnifiedHero>

      {/* Filter Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-blue-200 on-light">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4 sm:px-0">
              {[
                { key: 'all', label: getSettingValue('itineraries_filter_all_text', 'All Journeys'), icon: MapPin },
                { key: 'featured', label: getSettingValue('itineraries_filter_featured_text', 'Featured'), icon: Star },
                { key: 'short', label: getSettingValue('itineraries_filter_short_text', 'Short (≤5 days)'), icon: Clock },
                { key: 'long', label: getSettingValue('itineraries_filter_long_text', 'Extended (7+ days)'), icon: Calendar }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'primary' : 'outline'}
                  onClick={() => setFilter(key)}
                  className={`${
                    filter === key
                      ? 'bg-gradient-to-r from-ocean-blue to-deep-blue text-white border-ocean-blue'
                      : 'border-blue-300 text-ocean-blue hover:bg-blue-50'
                  } font-semibold py-2 px-6 rounded-full transition-all duration-300`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Itineraries Grid */}
      <section className="py-16 on-light">
        <div className="container mx-auto px-4">
          {filteredItineraries.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">𓂀</div>
                {itineraries.length === 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-ocean-blue mb-4">
                      {getSettingValue('itineraries_no_itineraries_title', 'There are no itineraries yet')}
                    </h3>
                    <p className="text-ocean-blue-dark">
                      {getSettingValue('itineraries_no_itineraries_description', 'Our pharaonic scholars are crafting extraordinary journeys. Please check back soon for amazing adventures along the Nile.')}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-ocean-blue mb-4">
                      {getSettingValue('itineraries_empty_title', 'No Journeys Found')}
                    </h3>
                    <p className="text-ocean-blue-dark">
                      {getSettingValue('itineraries_empty_description', 'No active journeys match your current filter. Try selecting a different category or check back later.')}
                    </p>
                  </>
                )}
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredItineraries.map((itinerary, index) => (
                <AnimatedSection key={itinerary.id} animation="fade-up" delay={index * 100}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-2 border-ocean-blue/20 hover:border-ocean-blue/60 overflow-hidden rounded-2xl">
                    {/* Enhanced Image Section */}
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={itinerary.mainImageUrl || '/images/default-itinerary.jpg'}
                        alt={itinerary.name}
                        fill
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      {/* Pale Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-200/70 via-blue-100/30 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-blue-200/20"></div>

                      {/* Enhanced Featured Badge */}
                      {itinerary.featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          <Star className="w-4 h-4 inline mr-1 fill-current" />
                          Featured
                        </div>
                      )}

                      {/* Enhanced Duration Badge */}
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-ocean-blue to-deep-blue text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-white/20">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {itinerary.durationDays} Days Journey
                      </div>

                      {/* Price Badge */}
                      {itinerary.price && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          From ${itinerary.price}
                        </div>
                      )}

                      {/* Hover Overlay with Egyptian Symbol */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-100/40">
                        <div className="text-gray-800 text-6xl animate-pulse">𓇳</div>
                      </div>
                    </div>

                    <CardContent className="p-6 bg-gradient-to-b from-white to-blue-50/30">
                      {/* Decorative Divider */}
                      <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="w-8 h-0.5 bg-ocean-blue"></div>
                        <div className="text-ocean-blue text-lg">𓇳</div>
                        <div className="w-8 h-0.5 bg-ocean-blue"></div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-ocean-blue transition-colors text-center">
                        {itinerary.name}
                      </h3>

                      <p className="text-gray-700 mb-6 line-clamp-3 text-center leading-relaxed">
                        {itinerary.shortDescription || itinerary.description}
                      </p>

                      {/* Enhanced Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {itinerary.maxGuests && (
                          <div className="flex items-center justify-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <Users className="w-5 h-5 mr-2 text-ocean-blue" />
                            <span className="text-sm font-semibold text-gray-800">Up to {itinerary.maxGuests}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-center bg-amber-50 rounded-lg p-3 border border-amber-200">
                          <Clock className="w-5 h-5 mr-2 text-amber-600" />
                          <span className="text-sm font-semibold text-gray-800">{itinerary.durationDays} Days</span>
                        </div>
                      </div>

                      {/* Enhanced Highlights */}
                      {(itinerary.highlights || []).length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-ocean-blue mb-3 text-center">✨ Journey Highlights</h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {(itinerary.highlights || []).slice(0, 3).map((highlight, idx) => (
                              <span key={idx} className="bg-gradient-to-r from-ocean-blue/10 to-blue-100 text-ocean-blue text-xs px-3 py-1.5 rounded-full border border-ocean-blue/20 font-medium">
                                {highlight}
                              </span>
                            ))}
                            {(itinerary.highlights || []).length > 3 && (
                              <span className="text-ocean-blue text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">
                                +{(itinerary.highlights || []).length - 3} more wonders
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Enhanced Action Button */}
                      <div className="text-center">
                        <Link href={`/itineraries/${itinerary.slug || itinerary.id}`}>
                          <Button className="w-full bg-gradient-to-r from-ocean-blue to-deep-blue hover:from-ocean-blue-dark hover:to-navy-blue text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <span className="mr-2">𓊪</span>
                            Explore Sacred Journey
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-t border-gray-200 on-light">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 underline-accent">
              {getSettingValue('itineraries_cta_title', 'Start Your Journey')}
            </h2>
            <p className="text-xl mb-8 text-black max-w-2xl mx-auto">
              {getSettingValue('itineraries_cta_description', 'Choose from our blessed itineraries and embark on a transformative journey through the eternal wonders of ancient Egypt.')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PharaohButton className="bg-gray-900 text-white hover:bg-black">
                <Calendar className="w-5 h-5 mr-2" />
                {getSettingValue('itineraries_cta_primary_text', 'Book Journey')}
              </PharaohButton>
              <PharaohButton className="bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                <Users className="w-5 h-5 mr-2" />
                {getSettingValue('itineraries_cta_secondary_text', 'Custom Itinerary')}
              </PharaohButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
