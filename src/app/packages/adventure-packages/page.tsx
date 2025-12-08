'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mountain, Star, Users, Calendar, ArrowLeft, MapPin, Compass, Zap, Shield } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const adventurePackages = [
  {
    id: 'extreme-egypt-circuit',
    name: 'Extreme Egypt Circuit',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    description: 'Ultimate adventure combining desert expeditions, mountain climbing, diving in the Red Sea, and ancient site exploration.',
    duration: '14 days',
    maxGuests: 12,
    difficulty: 'Challenging',
    rating: 4.8,
    reviews: 134,
    price: 'From $1,850',
    highlights: ['Desert Trekking', 'Mountain Climbing', 'Red Sea Diving', 'Sandboarding', 'Camel Expeditions']
  },
  {
    id: 'desert-mountains-adventure',
    name: 'Desert & Mountains Adventure',
    image: '/images/Royal Cleopatra/DSC_8750.jpg',
    description: 'Epic journey through Egypt\'s diverse landscapes from Sahara dunes to Sinai peaks with camping and extreme sports.',
    duration: '10 days',
    maxGuests: 8,
    difficulty: 'High',
    rating: 4.9,
    reviews: 87,
    price: 'From $1,450',
    highlights: ['Sinai Hiking', 'Desert Camping', 'Rock Climbing', 'Star Gazing', 'Bedouin Culture']
  },
  {
    id: 'nile-adventure-combo',
    name: 'Nile Adventure Combo',
    image: '/images/Royal Cleopatra/DSC_8581.jpg',
    description: 'Unique blend of river adventures, archaeological exploration, and adrenaline activities along the Nile.',
    duration: '12 days',
    maxGuests: 16,
    difficulty: 'Moderate',
    rating: 4.7,
    reviews: 156,
    price: 'From $1,650',
    highlights: ['River Rafting', 'Temple Exploration', 'Hot Air Balloon', 'Quad Biking', 'Felucca Sailing']
  },
  {
    id: 'red-sea-explorer',
    name: 'Red Sea Explorer Package',
    image: '/images/Royal Cleopatra/DSC_8593.jpg',
    description: 'Marine adventure package featuring world-class diving, snorkeling, and coastal exploration activities.',
    duration: '8 days',
    maxGuests: 14,
    difficulty: 'Moderate',
    rating: 4.8,
    reviews: 203,
    price: 'From $1,200',
    highlights: ['Scuba Diving', 'Coral Reefs', 'Dolphin Watching', 'Beach Activities', 'Marine Photography']
  }
];

const adventureFeatures = [
  {
    icon: <Mountain className="w-8 h-8 text-orange-600" />,
    title: 'Expert Guides',
    description: 'Certified adventure guides with extensive local knowledge and safety training'
  },
  {
    icon: <Shield className="w-8 h-8 text-orange-600" />,
    title: 'Safety First',
    description: 'Top-quality equipment and comprehensive safety protocols for all activities'
  },
  {
    icon: <Zap className="w-8 h-8 text-orange-600" />,
    title: 'Multi-Activity',
    description: 'Diverse adventure combinations for the ultimate adrenaline experience'
  },
  {
    icon: <Compass className="w-8 h-8 text-orange-600" />,
    title: 'Remote Access',
    description: 'Exclusive access to remote locations and off-the-beaten-path adventures'
  }
];

export default function AdventurePackagesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'moderate': return 'bg-yellow-500';
      case 'challenging': case 'high': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8568.jpg"
        title="Adventure Packages"
        subtitle="Multi-Activity Adventures for the Ultimate Thrill Seekers"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <Mountain className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0 text-justify">
            Combine multiple extreme activities into comprehensive adventure packages that showcase 
            Egypt's diverse landscapes and provide non-stop excitement for adrenaline junkies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Mountain className="w-5 h-5 mr-2" />
              Book Adventure
            </Button>
            <Link href="/packages">
              <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                All Packages
              </Button>
            </Link>
          </div>
        </div>
      </UnifiedHero>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Adventure <span className="text-orange-600">Features</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                Our adventure packages are designed with safety, excitement, and authentic experiences in mind.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {adventureFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Adventure <span className="text-orange-600">Packages</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose from our thrilling multi-activity packages designed for different skill levels and adventure preferences.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {adventurePackages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 100}>
                <Card className="egypt-card border-orange-200">
                  <div className="relative h-72">
                    <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                    <div className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(pkg.difficulty)}`}>
                      {pkg.difficulty}
                    </div>
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {pkg.rating} ({pkg.reviews})
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black bg-opacity-70 rounded-lg p-4">
                        <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                        <p className="text-sm opacity-90 mb-2">{pkg.price}</p>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {pkg.duration}
                          <span className="mx-2">•</span>
                          <Users className="w-4 h-4 mr-1" />
                          Max {pkg.maxGuests}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="egypt-card-body">
                    <p className="text-gray-600 mb-6 leading-relaxed text-justify">{pkg.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Adventure Activities:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.highlights.slice(0, 4).map((highlight, idx) => (
                          <span key={idx} className="egypt-pill">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 egypt-cta">
                        <Mountain className="w-4 h-4 mr-2" />
                        Book Package
                      </Button>
                      <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50">
                        <Compass className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready for the Ultimate Adventure?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our multi-activity adventure packages combine the best of Egypt's extreme sports and outdoor activities 
              for an unforgettable adrenaline-packed experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Book Adventure
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Shield className="w-5 h-5 mr-2" />
                Safety Info
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 text-center border border-orange-200">
              <Mountain className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Custom Adventure Packages
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Want to create your own adventure combination? Our team can design a custom package 
                tailored to your preferred activities, skill level, and duration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                    <Compass className="w-5 h-5 mr-2" />
                    Plan Custom Adventure
                  </Button>
                </Link>
                <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Adventure Guide
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
