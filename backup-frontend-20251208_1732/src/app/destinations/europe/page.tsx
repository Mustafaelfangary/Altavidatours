'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar, Users, ArrowLeft, Clock, Camera, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const europeCountries = [
  {
    id: 'france',
    name: 'France',
    capital: 'Paris',
    flag: '🇫🇷',
    image: '/images/Royal Cleopatra/DSC_8502.jpg',
    description: 'Experience the romance of Paris, the châteaux of Loire Valley, and the lavender fields of Provence.',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Palace of Versailles', 'French Riviera', 'Loire Valley'],
    bestTime: 'May - September',
    duration: '7-14 days',
    pricing: 'From €1,200',
    rating: 4.8,
    category: 'Cultural Heritage'
  },
  {
    id: 'italy',
    name: 'Italy',
    capital: 'Rome',
    flag: '🇮🇹',
    image: '/images/Royal Cleopatra/DSC_8507.jpg',
    description: 'Discover ancient Rome, Renaissance Florence, and the romantic canals of Venice.',
    highlights: ['Colosseum', 'Vatican City', 'Tuscany', 'Venice Canals', 'Amalfi Coast'],
    bestTime: 'April - October',
    duration: '10-14 days',
    pricing: 'From €1,400',
    rating: 4.9,
    category: 'Art & Architecture'
  },
  {
    id: 'greece',
    name: 'Greece',
    capital: 'Athens',
    flag: '🇬🇷',
    image: '/images/Royal Cleopatra/DSC_8559.jpg',
    description: 'Explore ancient mythology, stunning islands, and the cradle of Western civilization.',
    highlights: ['Acropolis', 'Santorini', 'Mykonos', 'Delphi', 'Meteora Monasteries'],
    bestTime: 'May - September',
    duration: '8-12 days',
    pricing: 'From €1,100',
    rating: 4.7,
    category: 'Islands & History'
  },
  {
    id: 'spain',
    name: 'Spain',
    capital: 'Madrid',
    flag: '🇪🇸',
    image: '/images/Royal Cleopatra/DSC_8581.jpg',
    description: 'Experience vibrant culture, stunning architecture, and passionate flamenco traditions.',
    highlights: ['Sagrada Familia', 'Alhambra', 'Prado Museum', 'Costa del Sol', 'Camino de Santiago'],
    bestTime: 'March - May, September - November',
    duration: '9-14 days',
    pricing: 'From €1,300',
    rating: 4.6,
    category: 'Culture & Coast'
  },
  {
    id: 'germany',
    name: 'Germany',
    capital: 'Berlin',
    flag: '🇩🇪',
    image: '/images/Royal Cleopatra/DSC_8593.jpg',
    description: 'Discover fairy-tale castles, historic cities, and the famous Oktoberfest celebrations.',
    highlights: ['Neuschwanstein Castle', 'Brandenburg Gate', 'Rhine Valley', 'Bavarian Alps', 'Cologne Cathedral'],
    bestTime: 'May - September',
    duration: '8-12 days',
    pricing: 'From €1,250',
    rating: 4.5,
    category: 'Castles & Culture'
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    capital: 'London',
    flag: '🇬🇧',
    image: '/images/Royal Cleopatra/DSC_8608.jpg',
    description: 'Explore royal palaces, ancient stone circles, and charming countryside villages.',
    highlights: ['Big Ben', 'Buckingham Palace', 'Stonehenge', 'Edinburgh Castle', 'Lake District'],
    bestTime: 'May - September',
    duration: '7-10 days',
    pricing: 'From £1,000',
    rating: 4.4,
    category: 'Royal Heritage'
  }
];

const galleryImages = [
  {
    src: '/images/Royal Cleopatra/DSC_8614.jpg',
    alt: 'European Architecture',
    title: 'Historic Architecture',
    location: 'Various European Cities'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8620.jpg',
    alt: 'European Landscapes',
    title: 'Scenic Landscapes',
    location: 'European Countryside'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8623.jpg',
    alt: 'Cultural Sites',
    title: 'Cultural Heritage',
    location: 'UNESCO World Sites'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8625.jpg',
    alt: 'European Cities',
    title: 'Vibrant Cities',
    location: 'Capital Cities'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8631.jpg',
    alt: 'European Museums',
    title: 'World-Class Museums',
    location: 'Art & History'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8633.jpg',
    alt: 'European Cuisine',
    title: 'Culinary Delights',
    location: 'Local Restaurants'
  }
];

export default function EuropePage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', 'Cultural Heritage', 'Art & Architecture', 'Islands & History', 'Culture & Coast', 'Castles & Culture', 'Royal Heritage'];

  const filteredCountries = selectedCategory && selectedCategory !== 'All' 
    ? europeCountries.filter(country => country.category === selectedCategory)
    : europeCountries;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8502.jpg"
        title="Europe Destinations"
        subtitle="Discover the Rich History, Culture, and Beauty of European Nations"
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
            <span className="text-6xl">🇪🇺</span>
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            From the romantic streets of Paris to the ancient ruins of Rome, Europe offers an unparalleled 
            tapestry of cultures, languages, and experiences waiting to be discovered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg min-h-[48px]">
              <Camera className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
            <Link href="/destinations">
              <Button variant="outline" className="border-blue-600 text-blue-800 hover:bg-blue-50 px-6 py-3 rounded-lg min-h-[48px]">
                <ArrowLeft className="w-5 h-5 mr-2" />
                All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </UnifiedHero>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className={`text-sm px-4 py-2 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                European <span className="text-blue-600">Countries</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Explore carefully curated destinations across Europe, each offering unique cultural experiences and unforgettable adventures.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCountries.map((country, index) => (
              <AnimatedSection key={country.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-blue-200">
                  <div className="relative h-64">
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
                      <span className="text-2xl">{country.flag}</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold ml-1">{country.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black bg-opacity-70 rounded-lg p-3">
                        <h3 className="text-xl font-bold">{country.name}</h3>
                        <p className="text-sm opacity-90">Capital: {country.capital}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        {country.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      {country.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        Best Time: {country.bestTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Duration: {country.duration}
                      </div>
                      <div className="flex items-center text-sm font-semibold text-blue-600">
                        <span className="mr-2">💰</span>
                        {country.pricing}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Top Attractions:</h4>
                      <div className="flex flex-wrap gap-1">
                        {country.highlights.slice(0, 3).map((highlight, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {highlight}
                          </span>
                        ))}
                        {country.highlights.length > 3 && (
                          <span className="text-gray-500 text-xs px-2 py-1">
                            +{country.highlights.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Explore {country.name}
                      </Button>
                      <Button variant="outline" className="px-3 border-blue-300 text-blue-700">
                        <Landmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Europe <span className="text-blue-600">Gallery</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Take a visual journey through Europe's most stunning destinations and cultural highlights.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
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
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">{image.title}</p>
                      <p className="text-xs opacity-90">{image.location}</p>
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
                  src={galleryImages[selectedImage].src}
                  alt={galleryImages[selectedImage].alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <h3 className="text-xl font-bold">{galleryImages[selectedImage].title}</h3>
                  <p className="text-sm opacity-90">{galleryImages[selectedImage].location}</p>
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

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Explore Europe?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Let our Europe specialists create your perfect European adventure with insider knowledge and local connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg min-h-[48px]">
                <Calendar className="w-5 h-5 mr-2" />
                Plan Europe Trip
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
