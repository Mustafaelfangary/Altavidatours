'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar, Users, ArrowLeft, Clock, Camera, Landmark } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const asiaCountries = [
  {
    id: 'japan',
    name: 'Japan',
    capital: 'Tokyo',
    flag: '🇯🇵',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    description: 'Experience the perfect blend of ancient traditions and cutting-edge technology in the Land of the Rising Sun.',
    highlights: ['Mount Fuji', 'Kyoto Temples', 'Tokyo Skyline', 'Cherry Blossoms', 'Traditional Ryokans'],
    bestTime: 'March - May, September - November',
    duration: '10-14 days',
    pricing: 'From ¥180,000',
    rating: 4.9,
    category: 'Culture & Technology'
  },
  {
    id: 'thailand',
    name: 'Thailand',
    capital: 'Bangkok',
    flag: '🇹🇭',
    image: '/images/Royal Cleopatra/DSC_8581.jpg',
    description: 'Discover golden temples, pristine beaches, and world-renowned Thai hospitality in the Land of Smiles.',
    highlights: ['Grand Palace', 'Phuket Beaches', 'Floating Markets', 'Thai Cuisine', 'Elephant Sanctuaries'],
    bestTime: 'November - March',
    duration: '8-12 days',
    pricing: 'From ฿35,000',
    rating: 4.7,
    category: 'Beaches & Temples'
  },
  {
    id: 'china',
    name: 'China',
    capital: 'Beijing',
    flag: '🇨🇳',
    image: '/images/Royal Cleopatra/DSC_8593.jpg',
    description: 'Explore thousands of years of history from the Great Wall to modern Shanghai skylines.',
    highlights: ['Great Wall', 'Forbidden City', 'Terracotta Warriors', 'Li River', 'Shanghai Skyline'],
    bestTime: 'April - May, September - November',
    duration: '12-16 days',
    pricing: 'From ¥8,500',
    rating: 4.6,
    category: 'Ancient Wonders'
  },
  {
    id: 'india',
    name: 'India',
    capital: 'New Delhi',
    flag: '🇮🇳',
    image: '/images/Royal Cleopatra/DSC_8608.jpg',
    description: 'Immerse yourself in the incredible diversity of cultures, colors, and cuisines across the subcontinent.',
    highlights: ['Taj Mahal', 'Golden Triangle', 'Kerala Backwaters', 'Rajasthan Palaces', 'Himalayan Views'],
    bestTime: 'October - March',
    duration: '12-18 days',
    pricing: 'From ₹85,000',
    rating: 4.5,
    category: 'Spiritual Journey'
  }
];

export default function AsiaPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    { src: '/images/Royal Cleopatra/DSC_8614.jpg', alt: 'Asian Temples', title: 'Sacred Temples' },
    { src: '/images/Royal Cleopatra/DSC_8620.jpg', alt: 'Asian Landscapes', title: 'Natural Beauty' },
    { src: '/images/Royal Cleopatra/DSC_8623.jpg', alt: 'Asian Culture', title: 'Rich Culture' },
    { src: '/images/Royal Cleopatra/DSC_8625.jpg', alt: 'Asian Cities', title: 'Modern Cities' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-emerald-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8568.jpg"
        title="Asia Destinations"
        subtitle="Experience Ancient Traditions and Modern Marvels Across Asia"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <span className="text-6xl">🌏</span>
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            From ancient temples to modern metropolises, Asia offers an incredible journey through 
            diverse cultures, spiritual traditions, and breathtaking landscapes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              <Camera className="w-5 h-5 mr-2" />
              Explore Asia
            </Button>
            <Link href="/destinations">
              <Button variant="outline" className="border-green-600 text-green-800 hover:bg-green-50 px-6 py-3 rounded-lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </UnifiedHero>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {asiaCountries.map((country, index) => (
              <AnimatedSection key={country.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-green-200">
                  <div className="relative h-64">
                    <Image src={country.image} alt={country.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
                      <span className="text-2xl">{country.flag}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black bg-opacity-70 rounded-lg p-3">
                        <h3 className="text-xl font-bold">{country.name}</h3>
                        <p className="text-sm opacity-90">Capital: {country.capital}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{country.description}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        Explore {country.name}
                      </Button>
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
