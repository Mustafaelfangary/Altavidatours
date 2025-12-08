'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, Star, Baby, Shield, Gamepad2, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';
import { useContent } from '@/hooks/useContent';

interface FamilyPackage {
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

const familyGalleryImages = [
  {
    src: '/images/Royal Cleopatra/DSC_8625.jpg',
    alt: 'Family Nile Cruise Activities',
    title: 'Family Fun'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8631.jpg',
    alt: 'Children Educational Tours',
    title: 'Kids Learning'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8633.jpg',
    alt: 'Family Dining Experience',
    title: 'Family Dining'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8634.jpg',
    alt: 'Safe Family Exploration',
    title: 'Safe Exploration'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8635.jpg',
    alt: 'Multi-Generation Travel',
    title: 'All Ages Welcome'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8638.jpg',
    alt: 'Family Photo Opportunities',
    title: 'Memory Making'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8640.jpg',
    alt: 'Interactive Family Tours',
    title: 'Interactive Tours'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8641.jpg',
    alt: 'Family Recreation Time',
    title: 'Recreation'
  }
];

export default function FamilyPackagesPage() {
  const { getContent } = useContent({ page: 'packages_family' });
  const [packages, setPackages] = useState<FamilyPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchFamilyPackages = async () => {
      try {
        const response = await fetch('/api/packages?category=family&featured=true');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || []);
        }
      } catch (error) {
        console.error('Error fetching family packages:', error);
        // Fallback family packages
        const fallbackPackages: FamilyPackage[] = [
          {
            id: '1',
            name: 'Family Egyptian Adventure',
            description: 'Perfect family journey with child-friendly activities, educational experiences, and comfortable accommodations designed for all ages.',
            price: 2250,
            durationDays: 7,
            maxGuests: 6,
            highlights: ['Kids Activities', 'Educational Tours', 'Family Rooms', 'Safe Environment', 'Interactive Learning'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8625.jpg',
            featured: true,
            category: 'family'
          },
          {
            id: '2',
            name: 'Multi-Generation Nile Journey',
            description: 'Specially designed for grandparents, parents, and children traveling together with flexible itineraries and comfort amenities.',
            price: 2850,
            durationDays: 9,
            maxGuests: 8,
            highlights: ['All Ages Welcome', 'Flexible Schedule', 'Accessible Tours', 'Family Bonding', 'Comfortable Pace'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8635.jpg',
            featured: true,
            category: 'family'
          },
          {
            id: '3',
            name: 'Educational Family Explorer',
            description: 'Learning-focused family adventure with interactive workshops, treasure hunts, and hands-on archaeological experiences for children.',
            price: 2650,
            durationDays: 8,
            maxGuests: 5,
            highlights: ['Interactive Learning', 'Treasure Hunts', 'Kids Workshops', 'Educational Games', 'STEM Activities'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8631.jpg',
            featured: true,
            category: 'family'
          }
        ];
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-600 mx-auto mb-4 animate-pulse" />
          <div className="text-pink-800 text-xl font-bold">{getContent('family_loading', 'Loading Family Experiences...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-purple-50">
      {/* Hero Section */}
      <UnifiedHero
        imageSrc={getContent('family_hero_image', '/images/Royal Cleopatra/DSC_8625.jpg')}
        title={getContent('family_hero_title', 'Family Packages')}
        subtitle={getContent('family_hero_subtitle', 'Create Unforgettable Memories with Multi-Generational Egyptian Adventures')}
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={false}
        showHieroglyphics={false}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
        mobileMinHeight="60vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <Heart className="w-12 h-12 text-pink-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            {getContent('family_hero_desc', 'Discover Egypt together as a family with specially crafted experiences that delight both children and adults. Safe, educational, and fun adventures perfect for creating lifelong memories.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg min-h-[48px]">
              <Users className="w-5 h-5 mr-2" />
              {getContent('family_adventures_btn', 'Family Adventures')}
            </Button>
            <Button variant="outline" className="border-pink-600 text-pink-800 hover:bg-pink-50 px-6 py-3 rounded-lg min-h-[48px]">
              <Gift className="w-5 h-5 mr-2" />
              {getContent('family_custom_btn', 'Custom Family Trip')}
            </Button>
          </div>
        </div>
      </UnifiedHero>

      {/* Family Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getContent('family_experience_title', 'Family')} <span className="text-pink-600">{getContent('family_experience_highlight', 'Experience')}</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {getContent('family_experience_desc', 'Every aspect of our family packages is designed with safety, education, and fun in mind for all family members.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            {[
              { icon: Baby, title: getContent('family_feature_1_title', 'All Ages Welcome'), desc: getContent('family_feature_1_desc', 'Programs suitable for children, teens, and grandparents') },
              { icon: Shield, title: getContent('family_feature_2_title', 'Safety First'), desc: getContent('family_feature_2_desc', 'Comprehensive safety measures and child-friendly environments') },
              { icon: Gamepad2, title: getContent('family_feature_3_title', 'Interactive Learning'), desc: getContent('family_feature_3_desc', 'Educational games, treasure hunts, and hands-on activities') },
              { icon: Gift, title: getContent('family_feature_4_title', 'Family Bonding'), desc: getContent('family_feature_4_desc', 'Shared experiences that bring families closer together') }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-pink-200">
                  <CardContent className="pt-6">
                    <feature.icon className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Family Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-purple-100">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getContent('family_gallery_title', 'Family')} <span className="text-pink-600">{getContent('family_gallery_highlight', 'Gallery')}</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {getContent('family_gallery_desc', 'See families enjoying Egypt together through safe, fun, and educational experiences designed for all ages.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {familyGalleryImages.map((image, index) => (
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
                  <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-[#0b2e4f] text-center">
                      <Heart className="w-8 h-8 mx-auto mb-2" />
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
              className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-full">
                <Image
                  src={familyGalleryImages[selectedImage].src}
                  alt={familyGalleryImages[selectedImage].alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4 text-[#0b2e4f] text-center">
                  <h3 className="text-xl font-bold">{familyGalleryImages[selectedImage].title}</h3>
                </div>
                <Button
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#0b2e4f] border border-gray-300"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Family Packages Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getContent('family_packages_title', 'Featured')} <span className="text-pink-600">{getContent('family_packages_highlight', 'Family Packages')}</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-pink-200">
                  <div className="relative h-64">
                    <Image
                      src={pkg.mainImageUrl || '/images/placeholder-family.jpg'}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <Heart className="w-4 h-4 inline mr-1" />
                      Family
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
                          <span key={idx} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-pink-600">
                        From ${pkg.price.toLocaleString()}
                      </div>
                      <Link href={`/packages/${pkg.slug || pkg.id}`}>
                        <Button className="bg-pink-600 hover:bg-pink-700 text-white">
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
