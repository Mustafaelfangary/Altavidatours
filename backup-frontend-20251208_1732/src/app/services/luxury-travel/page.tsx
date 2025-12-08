'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Star, Users, Calendar, ArrowLeft, Sparkles, Wine, Bed, Car } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const luxuryServices = [
  {
    id: 'presidential-suites',
    name: 'Presidential Suite Experiences',
    image: '/images/Royal Cleopatra/DSC_8740.jpg',
    description: 'Stay in the most exclusive accommodations with private butler service, panoramic views, and world-class amenities.',
    features: ['Private Butler', 'Panoramic Views', 'Premium Amenities', 'VIP Check-in', 'Exclusive Access'],
    pricing: 'From $800/night',
    capacity: '2-4 guests'
  },
  {
    id: 'private-transportation',
    name: 'Private Luxury Transportation',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    description: 'Travel in style with our fleet of luxury vehicles, private jets, and exclusive helicopter transfers.',
    features: ['Luxury Vehicles', 'Private Jets', 'Helicopter Transfers', 'Professional Chauffeurs', 'Custom Routes'],
    pricing: 'From $200/hour',
    capacity: '1-8 guests'
  },
  {
    id: 'exclusive-dining',
    name: 'Exclusive Dining Experiences',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    description: 'Private chef services, exclusive restaurant bookings, and unique dining venues in extraordinary locations.',
    features: ['Private Chefs', 'Exclusive Venues', 'Wine Pairings', 'Custom Menus', 'Unique Locations'],
    pricing: 'From $150/person',
    capacity: '2-20 guests'
  },
  {
    id: 'spa-wellness',
    name: 'Luxury Spa & Wellness',
    image: '/images/Royal Cleopatra/DSC_8635.jpg',
    description: 'Rejuvenating spa treatments, wellness retreats, and personalized health and beauty programs.',
    features: ['Private Spa Suites', 'Master Therapists', 'Wellness Programs', 'Organic Treatments', 'Health Consultations'],
    pricing: 'From $250/session',
    capacity: '1-2 guests'
  }
];

const luxuryFeatures = [
  {
    icon: <Crown className="w-8 h-8 text-orange-600" />,
    title: 'VIP Treatment',
    description: 'Receive royal treatment with personalized service and exclusive privileges at every destination.'
  },
  {
    icon: <Sparkles className="w-8 h-8 text-orange-600" />,
    title: 'Exclusive Access',
    description: 'Private tours of restricted areas, after-hours museum visits, and exclusive cultural experiences.'
  },
  {
    icon: <Wine className="w-8 h-8 text-orange-600" />,
    title: 'Fine Dining',
    description: 'Michelin-starred restaurants, private chef experiences, and exclusive culinary adventures.'
  },
  {
    icon: <Car className="w-8 h-8 text-orange-600" />,
    title: 'Luxury Transport',
    description: 'Private jets, luxury yachts, premium vehicles, and helicopter transfers for seamless travel.'
  }
];

const testimonials = [
  {
    name: 'Alexander Hamilton',
    title: 'CEO, Hamilton Group',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    text: 'The level of luxury and attention to detail exceeded all expectations. Every moment was perfectly orchestrated.',
    rating: 5
  },
  {
    name: 'Victoria Sterling',
    title: 'Art Collector',
    image: '/images/Royal Cleopatra/DSC_8740.jpg',
    text: 'Extraordinary experiences that money usually can\'t buy. The private museum tours were simply magnificent.',
    rating: 5
  }
];

export default function LuxuryTravelPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8740.jpg"
        title="Luxury Travel"
        subtitle="Unparalleled Luxury and Exclusive Experiences"
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
            Experience the pinnacle of luxury travel with our exclusive services designed for discerning 
            travelers who demand nothing but the finest in accommodations, dining, and experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Crown className="w-5 h-5 mr-2" />
              Experience Luxury
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

      {/* Luxury Features */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Luxury <span className="text-orange-600">Excellence</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                Every detail of our luxury service is crafted to exceed your highest expectations and create unforgettable memories.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {luxuryFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Services */}
      <section className="pt-8 pb-8 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Premium <span className="text-orange-600">Services</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Discover our collection of luxury services designed to provide the ultimate in comfort, style, and exclusivity.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {luxuryServices.map((service, index) => (
              <AnimatedSection key={service.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 bg-white">
                  <div className="relative h-64">
                    <Image src={service.image} alt={service.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Premium
                    </div>
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                      {service.pricing}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black bg-opacity-70 rounded-lg p-4">
                        <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          {service.capacity}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Service Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                        <Crown className="w-4 h-4 mr-2" />
                        Book Service
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-orange-600 text-orange-800 hover:bg-orange-50"
                        onClick={() => setSelectedService(service.id)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
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

      {/* Testimonials */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Client <span className="text-orange-600">Testimonials</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Hear from our satisfied clients who have experienced the pinnacle of luxury travel with us.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 mr-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.title}</p>
                        <div className="flex mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Guarantee */}
      <section className="pt-8 pb-8 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5">
              Our Luxury Guarantee
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              We guarantee the highest standards of luxury service. If any aspect of your experience 
              doesn't meet our premium standards, we'll make it right immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Book Luxury Experience
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Crown className="w-5 h-5 mr-2" />
                View Portfolio
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Concierge Services */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 text-center border border-orange-200">
              <Crown className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                24/7 Luxury Concierge
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our dedicated luxury concierge team is available around the clock to fulfill any request, 
                no matter how unique or last-minute. From securing impossible reservations to arranging 
                exclusive experiences, we make the extraordinary possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Contact Concierge
                </Button>
                <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
                  <Wine className="w-5 h-5 mr-2" />
                  Service Menu
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
