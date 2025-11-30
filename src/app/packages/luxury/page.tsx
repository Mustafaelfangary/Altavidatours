'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Star, Users, Calendar, MapPin, Sparkles, Award, Ship } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';
import { useContent } from '@/hooks/useContent';

interface LuxuryPackage {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  maxGuests?: number;
  highlights: string[];
  mainImageUrl?: string;
  featured: boolean;
  category: string;
}

const luxuryGalleryImages = [
  {
    src: '/Royal Cleopatra/DSC_8502.jpg',
    alt: 'Luxury Dahabiya Royal Suite',
    title: 'Presidential Suite'
  },
  {
    src: '/Royal Cleopatra/DSC_8568.jpg',
    alt: 'Premium Dining Experience',
    title: 'Gourmet Dining'
  },
  {
    src: '/Royal Cleopatra/DSC_8628.jpg',
    alt: 'Luxury Deck Experience',
    title: 'Exclusive Deck'
  },
  {
    src: '/Royal Cleopatra/DSC_8735.jpg',
    alt: 'Private Spa Services',
    title: 'Spa & Wellness'
  },
  {
    src: '/Royal Cleopatra/DSC_8848.jpg',
    alt: 'VIP Lounge Area',
    title: 'VIP Experience'
  },
  {
    src: '/Royal Cleopatra/DSC_8653.jpg',
    alt: 'Luxury Temple Tour',
    title: 'Private Tours'
  },
  {
    src: '/Royal Cleopatra/DSC_8666.jpg',
    alt: 'Premium Excursions',
    title: 'Exclusive Access'
  },
  {
    src: '/Royal Cleopatra/DSC_8675.jpg',
    alt: 'Luxury Amenities',
    title: '5-Star Amenities'
  }
];

export default function LuxuryPackagesPage() {
  const { getContent } = useContent({ page: 'packages_luxury' });
  const [packages, setPackages] = useState<LuxuryPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchLuxuryPackages = async () => {
      try {
        const response = await fetch('/api/packages?category=luxury&featured=true');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || []);
        }
      } catch (error) {
        console.error('Error fetching luxury packages:', error);
        // Fallback luxury packages
        const fallbackPackages: LuxuryPackage[] = [
          {
            id: '1',
            name: 'Royal Egyptian Experience',
            description: 'Ultimate luxury journey with presidential suite, personal butler, private chef, and exclusive temple access after hours.',
            price: 4850,
            durationDays: 7,
            maxGuests: 2,
            highlights: ['Presidential Suite', 'Personal Butler', 'Private Chef', 'Exclusive Temple Access', '5-Star Amenities'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8502.jpg',
            featured: true,
            category: 'luxury'
          },
          {
            id: '2',
            name: 'Pharaoh\'s Palace Cruise',
            description: 'Regal luxury dahabiya experience with spa services, gourmet dining, and private Egyptologist guide.',
            price: 3950,
            durationDays: 5,
            maxGuests: 4,
            highlights: ['Spa Services', 'Gourmet Dining', 'Private Egyptologist', 'Premium Suite', 'Concierge Service'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8568.jpg',
            featured: true,
            category: 'luxury'
          },
          {
            id: '3',
            name: 'Cleopatra\'s Crown Luxury',
            description: 'Opulent journey featuring helicopter tours, private museum access, and world-class accommodations.',
            price: 6200,
            durationDays: 10,
            maxGuests: 6,
            highlights: ['Helicopter Tours', 'Private Museum Access', 'World-Class Dining', 'Luxury Transportation', 'VIP Treatment'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8628.jpg',
            featured: true,
            category: 'luxury'
          }
        ];
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchLuxuryPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <div className="text-amber-800 text-xl font-bold">{getContent('luxury_loading', 'Loading Luxury Experiences...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <UnifiedHero
        imageSrc={getContent('luxury_hero_image', '/Royal Cleopatra/DSC_8502.jpg')}
        title={getContent('luxury_hero_title', 'Luxury Packages')}
        subtitle={getContent('luxury_hero_subtitle', 'Experience Egypt in Ultimate Elegance & Comfort')}
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={false}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
        mobileMinHeight="60vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <Crown className="w-12 h-12 text-amber-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            {getContent('luxury_hero_desc', "Indulge in the finest Egyptian experiences with our luxury packages featuring presidential suites, private chefs, personal butlers, and exclusive access to Egypt's most treasured sites.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg min-h-[48px]">
              <Star className="w-5 h-5 mr-2" />
              {getContent('luxury_view_btn', 'View Luxury Packages')}
            </Button>
            <Button variant="outline" className="border-amber-600 text-amber-800 hover:bg-amber-50 px-6 py-3 rounded-lg min-h-[48px]">
              <Award className="w-5 h-5 mr-2" />
              {getContent('luxury_quote_btn', 'Request Custom Quote')}
            </Button>
          </div>
        </div>
      </UnifiedHero>

      {/* Luxury Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getContent('luxury_amenities_title', 'Luxury')} <span className="text-amber-600">{getContent('luxury_amenities_highlight', 'Amenities')}</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {getContent('luxury_amenities_desc', 'Every detail crafted for the discerning traveler seeking the pinnacle of Egyptian hospitality.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            {[
              { icon: Crown, title: getContent('luxury_feature_1_title', 'Presidential Suites'), desc: getContent('luxury_feature_1_desc', 'Spacious accommodations with premium furnishings') },
              { icon: Star, title: getContent('luxury_feature_2_title', 'Personal Butler'), desc: getContent('luxury_feature_2_desc', '24/7 dedicated service for your every need') },
              { icon: Award, title: getContent('luxury_feature_3_title', 'Gourmet Dining'), desc: getContent('luxury_feature_3_desc', 'World-class cuisine prepared by master chefs') },
              { icon: Sparkles, title: getContent('luxury_feature_4_title', 'Exclusive Access'), desc: getContent('luxury_feature_4_desc', 'Private tours of temples and monuments') }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-amber-200">
                  <CardContent className="pt-6">
                    <feature.icon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-yellow-100">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getContent('luxury_gallery_title', 'Luxury')} <span className="text-amber-600">{getContent('luxury_gallery_highlight', 'Gallery')}</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {getContent('luxury_gallery_desc', 'A glimpse into the opulent world of our luxury Egyptian experiences.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {luxuryGalleryImages.map((image, index) => (
              <AnimatedSection key={index} delay={index * 50}>
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Crown className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">{image.title}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Gallery Modal */}
          {selectedImage !== null && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-full">
                <Image
                  src={luxuryGalleryImages[selectedImage].src}
                  alt={luxuryGalleryImages[selectedImage].alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <h3 className="text-xl font-bold">{luxuryGalleryImages[selectedImage].title}</h3>
                </div>
                <Button
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Luxury Packages Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getContent('luxury_packages_title', 'Featured')} <span className="text-amber-600">{getContent('luxury_packages_highlight', 'Luxury Packages')}</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-amber-200">
                  <div className="relative h-64">
                    <Image
                      src={pkg.mainImageUrl || '/Royal Cleopatra/DSC_8507.jpg'}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <Crown className="w-4 h-4 inline mr-1" />
                      Luxury
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pkg.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pkg.durationDays} Days
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Up to {pkg.maxGuests} Guests
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                          <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-amber-600">
                        From ${pkg.price.toLocaleString()}
                      </div>
                      <Link href={`/packages/${pkg.slug || pkg.id}`}>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
