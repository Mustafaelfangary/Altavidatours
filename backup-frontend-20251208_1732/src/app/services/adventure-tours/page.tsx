'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mountain, Users, Calendar, Star, ArrowLeft, Shield, Compass, Camera } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const adventureTours = [
  {
    id: 'desert-safari',
    name: 'Desert Safari Adventures',
    image: '/images/Royal Cleopatra/DSC_8750.jpg',
    description: 'Experience the thrill of desert exploration with camel trekking, sandboarding, and Bedouin camping.',
    duration: '3-7 days',
    difficulty: 'Moderate',
    maxGuests: 12,
    pricing: 'From $450',
    highlights: ['Camel Trekking', 'Sandboarding', 'Desert Camping', 'Stargazing', 'Bedouin Culture']
  },
  {
    id: 'mountain-expedition',
    name: 'Mountain Expeditions',
    image: '/images/Royal Cleopatra/DSC_8568.jpg', 
    description: 'Conquer peaks and explore rugged terrains with expert guides and professional equipment.',
    duration: '5-14 days',
    difficulty: 'Challenging',
    maxGuests: 8,
    pricing: 'From $850',
    highlights: ['Rock Climbing', 'Mountain Hiking', 'Base Camping', 'Alpine Views', 'Professional Guides']
  },
  {
    id: 'wildlife-safari',
    name: 'Wildlife Safari',
    image: '/images/Royal Cleopatra/DSC_8581.jpg',
    description: 'Get close to nature with wildlife photography tours and conservation experiences.',
    duration: '4-10 days',
    difficulty: 'Easy-Moderate',
    maxGuests: 15,
    pricing: 'From $650',
    highlights: ['Game Drives', 'Photography Tours', 'Conservation Centers', 'Expert Naturalists', 'Luxury Lodges']
  }
];

export default function AdventureToursPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    { src: '/images/Royal Cleopatra/DSC_8593.jpg', alt: 'Adventure Activities', title: 'Extreme Adventures' },
    { src: '/images/Royal Cleopatra/DSC_8608.jpg', alt: 'Mountain Views', title: 'Scenic Mountains' },
    { src: '/images/Royal Cleopatra/DSC_8614.jpg', alt: 'Desert Landscapes', title: 'Desert Expeditions' },
    { src: '/images/Royal Cleopatra/DSC_8620.jpg', alt: 'Wildlife Safari', title: 'Wildlife Encounters' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8750.jpg"
        title="Adventure Tours"
        subtitle="Heart-Pumping Adventures for the Bold and Adventurous"
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
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Push your limits and discover your adventurous spirit with our expertly guided tours that combine 
            adrenaline-pumping activities with breathtaking natural landscapes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Compass className="w-5 h-5 mr-2" />
              Book Adventure
            </Button>
            <Link href="/services">
              <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                All Services
              </Button>
            </Link>
          </div>
        </div>
      </UnifiedHero>

      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Adventure <span className="text-orange-600">Tours</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose from our collection of thrilling adventure tours designed for different experience levels and interests.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {adventureTours.map((tour, index) => (
              <AnimatedSection key={tour.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200">
                  <div className="relative h-64">
                    <Image src={tour.image} alt={tour.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {tour.difficulty}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black bg-opacity-70 rounded-lg p-3">
                        <h3 className="text-lg font-bold">{tour.name}</h3>
                        <p className="text-sm opacity-90">{tour.pricing}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{tour.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Duration: {tour.duration}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        Max {tour.maxGuests} guests
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Highlights:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tour.highlights.slice(0, 3).map((highlight, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      <Mountain className="w-4 h-4 mr-2" />
                      Book {tour.name}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-8 pb-8 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5">
              Ready for Your Adventure?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of adventurers who have experienced the thrill of our expertly guided tours.
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
    </div>
  );
}
