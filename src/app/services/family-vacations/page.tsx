'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, Star, Users, Calendar, ArrowLeft, Baby, 
  Shield, BookOpen, Gamepad2 as GameController2, Camera 
} from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const familyServices = [
  {
    id: 'educational-adventures',
    name: 'Educational Adventures',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    description: 'Interactive learning experiences that bring history to life for children and adults alike with hands-on activities.',
    ageGroups: ['3-8 years', '9-15 years', 'Adults'],
    activities: ['Treasure Hunts', 'Junior Archaeologist', 'Ancient Crafts', 'Storytelling', 'Interactive Exhibits'],
    duration: '2-4 hours',
    pricing: 'From $45/child'
  },
  {
    id: 'family-friendly-tours',
    name: 'Family-Friendly Tours',
    image: '/images/Royal Cleopatra/DSC_8740.jpg',
    description: 'Specially designed tours with shorter walking distances, frequent breaks, and engaging activities for all ages.',
    ageGroups: ['All ages', 'Wheelchair accessible'],
    activities: ['Gentle Walking', 'Photo Opportunities', 'Snack Breaks', 'Games', 'Family Bonding'],
    duration: '3-6 hours',
    pricing: 'From $85/person'
  },
  {
    id: 'kids-entertainment',
    name: 'Kids Entertainment Programs',
    image: '/images/Royal Cleopatra/DSC_8848.jpg',
    description: 'Professional childcare and entertainment services while parents enjoy adult-only activities or relaxation time.',
    ageGroups: ['2-12 years', 'Supervised activities'],
    activities: ['Arts & Crafts', 'Games', 'Movies', 'Educational Play', 'Outdoor Activities'],
    duration: '2-8 hours',
    pricing: 'From $25/hour/child'
  },
  {
    id: 'family-accommodations',
    name: 'Family Accommodations',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    description: 'Spacious family suites and connecting rooms with child-friendly amenities and safety features.',
    ageGroups: ['All ages', 'Baby-friendly'],
    activities: ['Cribs Available', 'Child-proofing', 'Mini Fridge', 'Play Areas', 'Family Bathrooms'],
    duration: 'Per night',
    pricing: 'From $150/night'
  }
];

const familyFeatures = [
  {
    icon: <Shield className="w-8 h-8 text-orange-600" />,
    title: 'Safety First',
    description: 'All our family tours prioritize safety with experienced guides trained in child care and emergency procedures.'
  },
  {
    icon: <BookOpen className="w-8 h-8 text-orange-600" />,
    title: 'Educational Fun',
    description: 'Learning experiences designed to engage children while providing valuable cultural and historical education.'
  },
  {
    icon: <GameController2 className="w-8 h-8 text-orange-600" />,
    title: 'Age-Appropriate Activities',
    description: 'Carefully curated activities and experiences suitable for different age groups and developmental stages.'
  },
  {
    icon: <Baby className="w-8 h-8 text-orange-600" />,
    title: 'Baby-Friendly Services',
    description: 'Special provisions for traveling with infants including strollers, high chairs, and baby-changing facilities.'
  }
];

const familyTips = [
  {
    title: 'Best Time to Visit',
    content: 'October to April offers pleasant weather for families. Avoid peak summer months for comfort.',
    icon: <Calendar className="w-6 h-6 text-orange-600" />
  },
  {
    title: 'Packing Essentials',
    content: 'Sunscreen, hats, comfortable shoes, snacks, and entertainment for travel times.',
    icon: <Shield className="w-6 h-6 text-orange-600" />
  },
  {
    title: 'Cultural Preparation',
    content: 'Read age-appropriate books about Egypt and watch family movies to build excitement.',
    icon: <BookOpen className="w-6 h-6 text-orange-600" />
  },
  {
    title: 'Health & Safety',
    content: 'Consult your pediatrician, bring basic medications, and stay hydrated.',
    icon: <Heart className="w-6 h-6 text-orange-600" />
  }
];

export default function FamilyVacationsPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('All');

  const ageGroups = ['All', '0-2 years', '3-8 years', '9-15 years', '16+ years'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8848.jpg"
        title="Family Vacations"
        subtitle="Creating Magical Memories for the Whole Family"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <Heart className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Discover Egypt as a family with our specially designed tours and services that cater to travelers 
            of all ages, creating unforgettable memories and educational experiences for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Heart className="w-5 h-5 mr-2" />
              Plan Family Trip
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

      {/* Family Features */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Family <span className="text-orange-600">Focused</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                Our family vacation services are designed with parents and children in mind, ensuring safe, 
                educational, and enjoyable experiences for all family members.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {familyFeatures.map((feature, index) => (
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

      {/* Age Group Filter */}
      <section className="py-8 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Filter by Age Group</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {ageGroups.map((group) => (
                <Button
                  key={group}
                  variant={selectedAgeGroup === group ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAgeGroup(group)}
                  className={`text-sm px-4 py-2 ${
                    selectedAgeGroup === group 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'border-orange-600 text-orange-800 hover:bg-orange-50'
                  }`}
                >
                  {group}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Family Services */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Family <span className="text-orange-600">Services</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Comprehensive family services designed to make your Egyptian adventure both memorable and stress-free.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {familyServices.map((service, index) => (
              <AnimatedSection key={service.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 bg-white">
                  <div className="relative h-64">
                    <Image src={service.image} alt={service.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      Family
                    </div>
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                      {service.pricing}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black bg-opacity-70 rounded-lg p-4">
                        <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Age Groups:</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.ageGroups.map((age, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {age}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Activities Include:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.activities.slice(0, 4).map((activity, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                        <Heart className="w-4 h-4 mr-2" />
                        Book Service
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-orange-600 text-orange-800 hover:bg-orange-50"
                        onClick={() => setSelectedService(service.id)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
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

      {/* Family Travel Tips */}
      <section className="pt-8 pb-8 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Family Travel <span className="text-orange-600">Tips</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Expert advice to help you prepare for a successful and enjoyable family trip to Egypt.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {familyTips.map((tip, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="p-6 bg-white border-orange-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-start mb-4">
                      <div className="mr-4 mt-1">
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{tip.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Family Itinerary */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Sample <span className="text-orange-600">Family Itinerary</span>
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  A 7-day family-friendly adventure through Egypt's most fascinating destinations.
                </p>
              </div>
            </AnimatedSection>

            <div className="space-y-6">
              {[
                { day: 1, title: 'Arrival & Giza Pyramids', activities: 'Family-friendly pyramid tour, camel rides, Sphinx visit' },
                { day: 2, title: 'Cairo Exploration', activities: 'Egyptian Museum kids tour, Khan el-Khalili bazaar, traditional lunch' },
                { day: 3, title: 'Flight to Luxor', activities: 'Family Nile cruise boarding, pool time, evening entertainment' },
                { day: 4, title: 'Valley of the Kings', activities: 'Tomb exploration, treasure hunt activities, pharaoh dress-up' },
                { day: 5, title: 'Karnak Temple', activities: 'Interactive temple tour, ancient games, craft workshops' },
                { day: 6, title: 'Aswan Adventures', activities: 'Philae Temple visit, Nubian village tour, felucca sailing' },
                { day: 7, title: 'Departure', activities: 'Souvenir shopping, airport transfer, memory sharing' }
              ].map((day, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                          {day.day}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{day.title}</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed ml-14">{day.activities}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pt-8 pb-8 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5">
              Ready for a Family Adventure?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Create lasting memories with your family while exploring the wonders of ancient Egypt. 
              Our family-focused approach ensures everyone has an amazing time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Plan Family Trip
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Camera className="w-5 h-5 mr-2" />
                Family Gallery
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Family Testimonial */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 text-center border border-orange-200">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <Image
                    src="/images/images/Royal Cleopatra/DSC_8848.jpg"
                    alt="Family testimonial"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <blockquote className="text-xl text-gray-700 italic mb-4">
                  "Our family trip to Egypt was absolutely magical! The kids were engaged throughout, 
                  and the guides made history come alive. We created memories that will last a lifetime."
                </blockquote>
                <div className="text-center">
                  <p className="font-bold text-gray-900">The Johnson Family</p>
                  <p className="text-gray-600">California, USA</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
