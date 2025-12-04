'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Compass, Star, Calendar, Users, ArrowRight, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const destinationCategories = [
  {
    id: 'europe',
    name: 'Europe',
    icon: '🇪🇺',
    description: 'Discover the rich history, stunning architecture, and diverse cultures of Europe. From ancient ruins to modern cities.',
    image: '/Princess Cleopatra/DSC_8233.jpg',
    countries: ['France', 'Italy', 'Greece', 'Spain', 'Germany', 'UK'],
    highlights: ['Historic Cities', 'Cultural Heritage', 'Renaissance Art', 'Mediterranean Coast'],
    color: 'blue'
  },
  {
    id: 'asia',
    name: 'Asia',
    icon: '🌏',
    description: 'Experience the mystique of Asia with its ancient traditions, spiritual sites, and breathtaking landscapes.',
    image: '/Princess Cleopatra/DSC_8240.jpg',
    countries: ['Japan', 'China', 'Thailand', 'India', 'Indonesia', 'Vietnam'],
    highlights: ['Ancient Temples', 'Traditional Culture', 'Exotic Cuisine', 'Tropical Paradise'],
    color: 'green'
  },
  {
    id: 'americas',
    name: 'Americas',
    icon: '🌎',
    description: 'From vibrant cities to pristine wilderness, explore the diverse wonders of North and South America.',
    image: '/Princess Cleopatra/DSC_8250.jpg',
    countries: ['USA', 'Canada', 'Brazil', 'Peru', 'Mexico', 'Argentina'],
    highlights: ['Natural Wonders', 'Modern Cities', 'Ancient Civilizations', 'Wildlife'],
    color: 'orange'
  },
  {
    id: 'africa',
    name: 'Africa',
    icon: '🌍',
    description: 'Discover the cradle of civilization with incredible wildlife, ancient wonders, and vibrant cultures.',
    image: '/Princess Cleopatra/DSC_8260.jpg',
    countries: ['Egypt', 'Kenya', 'Tanzania', 'Morocco', 'South Africa', 'Ethiopia'],
    highlights: ['Safari Adventures', 'Ancient Wonders', 'Desert Landscapes', 'Cultural Diversity'],
    color: 'red'
  }
];

const featuredDestinations = [
  {
    name: 'Luxor, Egypt',
    image: '/Princess Cleopatra/DSC_8270.jpg',
    description: 'Ancient temples and pharaonic treasures',
    category: 'Africa',
    rating: 4.9
  },
  {
    name: 'Santorini, Greece',
    image: '/Princess Cleopatra/DSC_8285.jpg',
    description: 'Stunning sunsets and white-washed villages',
    category: 'Europe',
    rating: 4.8
  },
  {
    name: 'Kyoto, Japan',
    image: '/Princess Cleopatra/DSC_8290.jpg',
    description: 'Traditional temples and bamboo forests',
    category: 'Asia',
    rating: 4.9
  },
  {
    name: 'Machu Picchu, Peru',
    image: '/Princess Cleopatra/DSC_8338.jpg',
    description: 'Ancient Incan citadel in the clouds',
    category: 'Americas',
    rating: 4.9
  }
];

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        border: 'border-blue-200',
        text: 'text-blue-600',
        buttonBg: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        border: 'border-green-200',
        text: 'text-green-600',
        buttonBg: 'bg-green-600 hover:bg-green-700'
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        border: 'border-orange-200',
        text: 'text-orange-600',
        buttonBg: 'bg-orange-600 hover:bg-orange-700'
      },
      red: {
        bg: 'from-red-500 to-red-600',
        border: 'border-red-200',
        text: 'text-red-600',
        buttonBg: 'bg-red-600 hover:bg-red-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-blue-50">
      {/* Hero Section */}
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8568.jpg"
        title="Destinations"
        subtitle="Explore the World's Most Incredible Places with Expert Guided Tours"
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
            <Globe className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            From ancient wonders to modern marvels, discover carefully curated destinations that offer 
            authentic cultural experiences, breathtaking landscapes, and unforgettable adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg min-h-[48px]">
              <Compass className="w-5 h-5 mr-2" />
              Explore Destinations
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-800 hover:bg-blue-50 px-6 py-3 rounded-lg min-h-[48px]">
              <Map className="w-5 h-5 mr-2" />
              View World Map
            </Button>
          </div>
        </div>
      </UnifiedHero>

      {/* Destination Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Travel <span className="text-blue-600">Destinations</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose your next adventure from our carefully selected destinations across four continents.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {destinationCategories.map((category, index) => {
              const colors = getColorClasses(category.color);
              return (
                <AnimatedSection key={category.id} delay={index * 100}>
                  <Card 
                    className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${colors.border} cursor-pointer`}
                    onMouseEnter={() => setHoveredCard(category.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative h-64">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${colors.bg} opacity-70`}></div>
                      <div className="absolute top-4 left-4 text-4xl">
                        {category.icon}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.countries.length} Countries Available</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Popular Countries:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.countries.slice(0, 4).map((country, idx) => (
                            <span key={idx} className={`${colors.text} text-xs px-3 py-1 rounded-full border ${colors.border} bg-gray-50`}>
                              {country}
                            </span>
                          ))}
                          {category.countries.length > 4 && (
                            <span className="text-gray-500 text-xs px-3 py-1">
                              +{category.countries.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-1">
                          {category.highlights.map((highlight, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Link href={`/destinations/${category.id}`}>
                        <Button 
                          className={`w-full ${colors.buttonBg} text-white transition-all duration-300 ${
                            hoveredCard === category.id ? 'transform scale-105' : ''
                          }`}
                        >
                          <span>Explore {category.name}</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured <span className="text-blue-600">Destinations</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Discover our most popular destinations that offer exceptional experiences and unforgettable memories.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination, index) => (
              <AnimatedSection key={destination.name} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold ml-1">{destination.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {destination.category}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{destination.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Let us help you plan the perfect trip to your dream destination with our expert guidance and local insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg min-h-[48px]">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg min-h-[48px]">
                <Users className="w-5 h-5 mr-2" />
                Contact Expert
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
