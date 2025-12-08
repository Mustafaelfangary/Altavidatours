'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Star, Users, Calendar, ArrowLeft, MapPin, Sparkles, Wine, Bed } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const luxuryPackages = [
  {
    id: 'royal-nile-cruise',
    name: 'Royal Nile Cruise',
    image: '/images/Royal Cleopatra/DSC_8740.jpg',
    description: 'Ultimate luxury on the Nile with presidential suite accommodations, private butler service, and exclusive dining experiences.',
    duration: '12 days',
    maxGuests: 16,
    rating: 4.9,
    reviews: 147,
    price: 'From $3,200',
    highlights: ['Presidential Suite', 'Private Butler', 'Michelin-Star Dining', 'Helicopter Tours', 'Private Guides']
  },
  {
    id: 'pharaohs-palace-experience',
    name: 'Pharaohs Palace Experience',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    description: 'Stay in luxury palace hotels with royal treatment, private archaeological tours, and exclusive access to restricted areas.',
    duration: '10 days',
    maxGuests: 12,
    rating: 4.8,
    reviews: 98,
    price: 'From $2,850',
    highlights: ['Palace Hotels', 'Royal Treatment', 'Private Tours', 'Exclusive Access', 'Luxury Transportation']
  },
  {
    id: 'diamond-desert-safari',
    name: 'Diamond Desert Safari',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    description: 'Luxury desert adventure with premium glamping, private camel expeditions, and world-class spa treatments.',
    duration: '7 days',
    maxGuests: 8,
    rating: 4.9,
    reviews: 76,
    price: 'From $2,400',
    highlights: ['Premium Glamping', 'Private Expeditions', 'Spa Treatments', 'Gourmet Desert Dining', 'Star Gazing']
  },
  {
    id: 'cleopatra-luxury-collection',
    name: 'Cleopatra Luxury Collection',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    description: 'Comprehensive luxury tour combining the finest accommodations, exclusive experiences, and personalized service.',
    duration: '15 days',
    maxGuests: 20,
    rating: 4.9,
    reviews: 203,
    price: 'From $4,500',
    highlights: ['Multiple Luxury Hotels', 'Private Jet Transfers', 'VIP Experiences', 'Personal Concierge', 'Cultural Immersion']
  }
];

const luxuryFeatures = [
  {
    icon: <Crown className="w-8 h-8 text-orange-600" />,
    title: '5-Star Accommodations',
    description: 'Stay in the finest luxury hotels and resorts with world-class amenities'
  },
  {
    icon: <Wine className="w-8 h-8 text-orange-600" />,
    title: 'Gourmet Dining',
    description: 'Michelin-starred restaurants and exclusive culinary experiences'
  },
  {
    icon: <Sparkles className="w-8 h-8 text-orange-600" />,
    title: 'VIP Access',
    description: 'Exclusive entry to restricted areas and private viewing experiences'
  },
  {
    icon: <Bed className="w-8 h-8 text-orange-600" />,
    title: 'Premium Service',
    description: 'Personal butler service and 24/7 luxury concierge assistance'
  }
];

export default function LuxuryEscapesPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8740.jpg"
        title="Luxury Escapes"
        subtitle="Indulge in Opulent Egyptian Adventures with Unmatched Elegance"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <Crown className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Experience Egypt in unparalleled luxury with our premium collection of opulent tours, 
            featuring the finest accommodations, exclusive access, and personalized service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Crown className="w-5 h-5 mr-2" />
              Book Luxury
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
                Luxury <span className="text-orange-600">Features</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                Every aspect of our luxury escapes is designed to provide an exceptional and unforgettable experience.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {luxuryFeatures.map((feature, index) => (
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
                Premium <span className="text-orange-600">Packages</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose from our collection of luxury packages, each carefully crafted to provide the ultimate Egyptian experience.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {luxuryPackages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200">
                  <div className="relative h-72">
                    <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Luxury
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
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">{pkg.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Luxury Includes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pkg.highlights.slice(0, 4).map((highlight, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                        <Crown className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-orange-600 text-orange-800 hover:bg-orange-50"
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        View Details
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
              Experience Royal Treatment
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our luxury escapes offer the finest accommodations, exclusive experiences, and personalized service 
              that rival the treatment of ancient pharaohs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Reserve Luxury
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                VIP Services
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 text-center border border-orange-200">
              <Crown className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Bespoke Luxury Experiences
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Looking for something truly unique? Our luxury travel specialists can create a completely 
                personalized itinerary tailored to your preferences and desires.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                    <Crown className="w-5 h-5 mr-2" />
                    Plan Bespoke Tour
                  </Button>
                </Link>
                <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
                  <Wine className="w-5 h-5 mr-2" />
                  Luxury Brochure
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
