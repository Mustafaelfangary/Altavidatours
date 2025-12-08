'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MapPin, Star, ArrowLeft, BookOpen, Palette, Music } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const culturalExperiences = [
  {
    id: 'ancient-egypt-immersion',
    name: 'Ancient Egypt Immersion',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    description: 'Dive deep into ancient Egyptian history with expert Egyptologists and hands-on archaeological experiences.',
    duration: '5-10 days',
    groupSize: '8-15 people',
    location: 'Cairo, Luxor, Aswan',
    pricing: 'From $750',
    highlights: ['Egyptologist Guides', 'Temple Ceremonies', 'Hieroglyph Workshops', 'Museum Private Tours', 'Archaeological Sites']
  },
  {
    id: 'local-artisan-workshops',
    name: 'Local Artisan Workshops',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    description: 'Learn traditional crafts from master artisans including pottery, weaving, and jewelry making.',
    duration: '3-7 days',
    groupSize: '6-12 people',
    location: 'Various Villages',
    pricing: 'From $420',
    highlights: ['Pottery Making', 'Traditional Weaving', 'Jewelry Crafting', 'Local Materials', 'Master Artisans']
  },
  {
    id: 'culinary-heritage',
    name: 'Culinary Heritage Tours',
    image: '/images/Royal Cleopatra/DSC_8635.jpg',
    description: 'Explore Egyptian cuisine through cooking classes, market visits, and family dining experiences.',
    duration: '4-8 days',
    groupSize: '10-16 people',
    location: 'Cairo, Alexandria',
    pricing: 'From $550',
    highlights: ['Cooking Classes', 'Market Tours', 'Family Dinners', 'Traditional Recipes', 'Spice Workshops']
  }
];

export default function CulturalExperiencesPage() {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);

  const culturalHighlights = [
    {
      icon: <BookOpen className="w-8 h-8 text-orange-600" />,
      title: 'Historical Immersion',
      description: 'Expert-guided exploration of ancient sites with authentic storytelling'
    },
    {
      icon: <Palette className="w-8 h-8 text-orange-600" />,
      title: 'Artisan Crafts',
      description: 'Hands-on learning of traditional crafts from master artisans'
    },
    {
      icon: <Music className="w-8 h-8 text-orange-600" />,
      title: 'Living Traditions',
      description: 'Experience local customs, music, dance, and cultural practices'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8625.jpg"
        title="Cultural Experiences"
        subtitle="Authentic Cultural Immersion in the Heart of Egypt"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Connect with Egypt's rich cultural heritage through immersive experiences that bring history to life 
            and create meaningful connections with local communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Palette className="w-5 h-5 mr-2" />
              Explore Culture
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
                Cultural <span className="text-orange-600">Highlights</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                Our cultural experiences are designed to provide authentic insights into Egyptian heritage and traditions.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {culturalHighlights.map((highlight, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    {highlight.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Featured <span className="text-orange-600">Experiences</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose from our carefully curated cultural experiences that offer deep insights into Egyptian traditions.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {culturalExperiences.map((experience, index) => (
              <AnimatedSection key={experience.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200">
                  <div className="relative h-64">
                    <Image src={experience.image} alt={experience.name} fill className="object-cover" />
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {experience.pricing}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black bg-opacity-70 rounded-lg p-3">
                        <h3 className="text-lg font-bold">{experience.name}</h3>
                        <p className="text-sm opacity-90 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {experience.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{experience.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Duration: {experience.duration}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        Group: {experience.groupSize}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Experience Includes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {experience.highlights.slice(0, 3).map((highlight, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => setSelectedExperience(experience.id)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
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
              Immerse Yourself in Ancient Culture
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join us for authentic cultural experiences that connect you with Egypt's timeless traditions and heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Book Experience
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Music className="w-5 h-5 mr-2" />
                Cultural Calendar
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Create Your Custom Cultural Journey
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Looking for a specific cultural experience? Our team can create a personalized itinerary 
                tailored to your interests and schedule.
              </p>
              <Link href="/contact">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                  <Palette className="w-5 h-5 mr-2" />
                  Plan Custom Experience
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
