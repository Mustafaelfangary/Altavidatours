'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mountain, Compass, Users, Calendar, MapPin, Zap, Plane, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

interface AdventurePackage {
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

const adventureGalleryImages = [
  {
    src: '/images/Royal Cleopatra/DSC_8750.jpg',
    alt: 'Desert Adventure Safari',
    title: 'Desert Safari'
  },
  {
    src: '/images/experiences/sunset-sailing.jpg',
    alt: 'Nile River Adventure',
    title: 'River Adventures'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8627.jpg',
    alt: 'Rock Climbing Exploration',
    title: 'Rock Climbing'
  },
  {
    src: '/images/destinations/karnak-temple.jpg',
    alt: 'Archaeological Adventure',
    title: 'Archaeological Tours'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8733.jpg',
    alt: 'Hot Air Balloon Adventure',
    title: 'Balloon Rides'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8502.jpg',
    alt: 'Camping Under Stars',
    title: 'Desert Camping'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8568.jpg',
    alt: 'Diving Adventures',
    title: 'Red Sea Diving'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8848.jpg',
    alt: 'Mountain Trekking',
    title: 'Mountain Treks'
  }
];

export default function AdventurePackagesPage() {
  const [packages, setPackages] = useState<AdventurePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchAdventurePackages = async () => {
      try {
        const response = await fetch('/api/packages?category=adventure&featured=true');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || []);
        }
      } catch (error) {
        console.error('Error fetching adventure packages:', error);
        // Fallback adventure packages
        const fallbackPackages: AdventurePackage[] = [
          {
            id: '1',
            name: 'Desert Explorer Adventure',
            description: 'Thrilling desert safari with camel trekking, sandboarding, Bedouin camping, and stargazing experiences.',
            price: 1850,
            durationDays: 6,
            maxGuests: 8,
            highlights: ['Desert Safari', 'Camel Trekking', 'Sandboarding', 'Bedouin Camping', 'Stargazing'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8750.jpg',
            featured: true,
            category: 'adventure'
          },
          {
            id: '2',
            name: 'Red Sea Diving Expedition',
            description: 'Epic diving adventure exploring coral reefs, underwater wrecks, and marine life in the Red Sea.',
            price: 2150,
            durationDays: 7,
            maxGuests: 12,
            highlights: ['Wreck Diving', 'Coral Reef Exploration', 'Marine Photography', 'Night Dives', 'PADI Certification'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8568.jpg',
            featured: true,
            category: 'adventure'
          },
          {
            id: '3',
            name: 'Sinai Mountain Trek',
            description: 'Challenging mountain expedition including Mount Sinai sunrise hike, rock climbing, and wilderness survival.',
            price: 1650,
            durationDays: 5,
            maxGuests: 10,
            highlights: ['Mount Sinai Hike', 'Rock Climbing', 'Wilderness Survival', 'Photography Workshop', 'Local Culture'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8627.jpg',
            featured: true,
            category: 'adventure'
          }
        ];
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchAdventurePackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-orange-600 mx-auto mb-4 animate-pulse" />
          <div className="text-orange-800 text-xl font-bold">Loading Adventure Experiences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      {/* Hero Section */}
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8750.jpg"
        title="Adventure Packages"
        subtitle="Discover Egypt Through Thrilling Expeditions & Outdoor Adventures"
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
            <Mountain className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Embark on heart-pounding adventures across Egypt&apos;s diverse landscapes. From desert safaris to underwater 
            expeditions, mountain treks to archaeological digs - experience Egypt like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg min-h-[48px]">
              <Compass className="w-5 h-5 mr-2" />
              Explore Adventures
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg min-h-[48px]">
              <Zap className="w-5 h-5 mr-2" />
              Custom Adventure
            </Button>
          </div>
        </div>
      </UnifiedHero>

      {/* Adventure Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Adventure <span className="text-orange-600">Experiences</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Push your limits and create unforgettable memories with our expertly guided adventure packages.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            {[
              { icon: Mountain, title: 'Desert Expeditions', desc: 'Explore vast deserts with expert Bedouin guides' },
              { icon: Plane, title: 'Aerial Adventures', desc: 'Hot air balloons and scenic helicopter flights' },
              { icon: Camera, title: 'Wildlife Safari', desc: 'Photograph rare desert and marine wildlife' },
              { icon: Compass, title: 'Archaeological Digs', desc: 'Participate in real archaeological discoveries' }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="egypt-card">
                  <CardContent className="egypt-card-body text-center">
                    <feature.icon className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Adventure Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-red-100">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Adventure <span className="text-orange-600">Gallery</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Witness the excitement and beauty of Egypt&apos;s most thrilling adventure destinations.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {adventureGalleryImages.map((image, index) => (
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
                      <Mountain className="w-8 h-8 mx-auto mb-2" />
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
                  src={adventureGalleryImages[selectedImage].src}
                  alt={adventureGalleryImages[selectedImage].alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <h3 className="text-xl font-bold">{adventureGalleryImages[selectedImage].title}</h3>
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

      {/* Adventure Packages Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured <span className="text-orange-600">Adventure Packages</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-orange-200">
                  <div className="relative h-64">
                    <Image
                      src={pkg.mainImageUrl || '/images/placeholder-adventure.jpg'}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <Mountain className="w-4 h-4 inline mr-1" />
                      Adventure
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
                          <span key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-orange-600">
                        From ${pkg.price.toLocaleString()}
                      </div>
                      <Link href={`/packages/${pkg.slug || pkg.id}`}>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
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
