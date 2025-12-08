'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Star, Users, Calendar, ArrowLeft, Filter, 
  Camera, Mountain, Building, Waves, TreePine, Sun 
} from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const africaDestinations = [
  {
    id: 'egypt',
    name: 'Egypt',
    flag: '🇪🇬',
    capital: 'Cairo',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    description: 'Land of pharaohs and ancient wonders, home to the Great Pyramids, Sphinx, and the legendary Nile River.',
    highlights: ['Great Pyramids', 'Valley of Kings', 'Nile River', 'Karnak Temple', 'Abu Simbel'],
    tours: 25,
    rating: 4.9,
    category: ['Historical', 'Cultural', 'Adventure'],
    climate: 'Desert - hot and dry',
    bestTime: 'October-April',
    languages: ['Arabic', 'English']
  },
  {
    id: 'morocco',
    name: 'Morocco',
    flag: '🇲🇦',
    capital: 'Rabat',
    image: '/images/Royal Cleopatra/DSC_8750.jpg',
    description: 'Exotic blend of African, Arab, and European cultures with stunning Atlas Mountains and Sahara Desert.',
    highlights: ['Marrakech', 'Sahara Desert', 'Atlas Mountains', 'Casablanca', 'Fez Medina'],
    tours: 18,
    rating: 4.7,
    category: ['Cultural', 'Adventure', 'Desert'],
    climate: 'Mediterranean to desert',
    bestTime: 'March-May, September-November',
    languages: ['Arabic', 'Berber', 'French']
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    flag: '🇿🇦',
    capital: 'Cape Town',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    description: 'Rainbow Nation offering incredible wildlife, wine regions, and the stunning Cape Peninsula.',
    highlights: ['Table Mountain', 'Kruger National Park', 'Cape Winelands', 'Garden Route', 'Robben Island'],
    tours: 20,
    rating: 4.8,
    category: ['Wildlife', 'Nature', 'Wine'],
    climate: 'Mediterranean to subtropical',
    bestTime: 'March-May, September-November',
    languages: ['English', 'Afrikaans', 'Zulu']
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    flag: '🇹🇿',
    capital: 'Dodoma',
    image: '/images/Royal Cleopatra/DSC_8581.jpg',
    description: 'Home to Mount Kilimanjaro, Serengeti National Park, and the incredible Great Migration.',
    highlights: ['Mount Kilimanjaro', 'Serengeti', 'Ngorongoro Crater', 'Zanzibar', 'Great Migration'],
    tours: 15,
    rating: 4.8,
    category: ['Wildlife', 'Adventure', 'Beach'],
    climate: 'Tropical savanna',
    bestTime: 'June-October, December-March',
    languages: ['Swahili', 'English']
  },
  {
    id: 'kenya',
    name: 'Kenya',
    flag: '🇰🇪',
    capital: 'Nairobi',
    image: '/images/Royal Cleopatra/DSC_8593.jpg',
    description: 'World-renowned safari destination with the Maasai Mara and stunning Indian Ocean coastline.',
    highlights: ['Maasai Mara', 'Amboseli National Park', 'Mount Kenya', 'Lamu Island', 'Great Rift Valley'],
    tours: 16,
    rating: 4.7,
    category: ['Wildlife', 'Cultural', 'Beach'],
    climate: 'Tropical to arid',
    bestTime: 'July-October, January-March',
    languages: ['Swahili', 'English']
  },
  {
    id: 'botswana',
    name: 'Botswana',
    flag: '🇧🇼',
    capital: 'Gaborone',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    description: 'Premium safari destination known for the Okavango Delta and exceptional wildlife experiences.',
    highlights: ['Okavango Delta', 'Chobe National Park', 'Kalahari Desert', 'Moremi Game Reserve', 'Victoria Falls'],
    tours: 12,
    rating: 4.9,
    category: ['Wildlife', 'Luxury', 'Nature'],
    climate: 'Semi-arid',
    bestTime: 'May-September',
    languages: ['English', 'Setswana']
  }
];

const categories = ['All', 'Historical', 'Cultural', 'Adventure', 'Wildlife', 'Nature', 'Desert', 'Beach', 'Wine', 'Luxury'];

export default function AfricaPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const filteredDestinations = africaDestinations.filter(destination => 
    selectedCategory === 'All' || destination.category.includes(selectedCategory)
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cultural': return <Building className="w-4 h-4" />;
      case 'Nature': case 'Wildlife': return <TreePine className="w-4 h-4" />;
      case 'Adventure': return <Mountain className="w-4 h-4" />;
      case 'Beach': return <Waves className="w-4 h-4" />;
      case 'Desert': return <Sun className="w-4 h-4" />;
      case 'Historical': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8625.jpg"
        title="Africa"
        subtitle="Discover the Heart of Africa - Land of Ancient Wonders and Wild Beauty"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <MapPin className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Experience the magic of Africa, from ancient Egyptian pyramids to the vast savannas of East Africa, 
            stunning coastlines, and the world's most spectacular wildlife encounters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Camera className="w-5 h-5 mr-2" />
              Explore Africa
            </Button>
            <Link href="/destinations">
              <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </UnifiedHero>

      {/* Filter Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Filter className="w-5 h-5 text-gray-500 my-auto mr-2" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-sm px-4 py-2 ${
                  selectedCategory === category 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'border-orange-600 text-orange-800 hover:bg-orange-50'
                }`}
              >
                {getCategoryIcon(category)}
                <span className="ml-1">{category}</span>
              </Button>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">
              Showing {filteredDestinations.length} destinations 
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <AnimatedSection key={destination.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-orange-200">
                  <div className="relative h-64">
                    <Image 
                      src={destination.image} 
                      alt={destination.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    
                    {/* Flag and Rating */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className="text-2xl">{destination.flag}</span>
                      <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-bold">{destination.rating}</span>
                      </div>
                    </div>

                    {/* Tours Count */}
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {destination.tours} Tours
                    </div>

                    {/* Country Info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                      <div className="flex items-center text-sm opacity-90">
                        <MapPin className="w-4 h-4 mr-1" />
                        Capital: {destination.capital}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {destination.description}
                    </p>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {destination.category.map((cat, idx) => (
                        <span 
                          key={idx} 
                          className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          {getCategoryIcon(cat)}
                          <span className="ml-1">{cat}</span>
                        </span>
                      ))}
                    </div>

                    {/* Key Info */}
                    <div className="space-y-2 mb-4 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Best Time:</span>
                        <span className="font-medium">{destination.bestTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Climate:</span>
                        <span className="font-medium">{destination.climate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Languages:</span>
                        <span className="font-medium">{destination.languages.join(', ')}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Top Highlights:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {destination.highlights.slice(0, 3).map((highlight, idx) => (
                          <li key={idx} className="flex items-center">
                            <Star className="w-3 h-3 text-orange-500 mr-2 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm">
                        <Camera className="w-4 h-4 mr-1" />
                        Explore
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-orange-600 text-orange-800 hover:bg-orange-50"
                        onClick={() => setSelectedDestination(destination.id)}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Plan Trip
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experience */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src="/images/images/Royal Cleopatra/DSC_8625.jpg"
                  alt="African Adventure"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  African <span className="text-orange-600">Adventure</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Africa is the cradle of civilization and home to some of the world's most incredible 
                  experiences. From the ancient wonders of Egypt to the Big Five safaris of East and 
                  Southern Africa, every journey here is transformational.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <TreePine className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">World-class wildlife safaris and game reserves</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Ancient historical sites and cultural heritage</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Expert local guides and authentic experiences</span>
                  </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Plan African Adventure
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Explore Africa?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              From the pyramids of Egypt to the savannas of Kenya, discover the continent 
              that offers the world's most diverse and spectacular travel experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Camera className="w-5 h-5 mr-2" />
                View Tours
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Users className="w-5 h-5 mr-2" />
                Custom Safari
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
