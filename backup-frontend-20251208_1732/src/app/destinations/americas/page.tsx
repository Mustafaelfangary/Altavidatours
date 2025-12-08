'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Star, Users, Calendar, ArrowLeft, Filter, 
  Camera, Mountain, Building, Waves, TreePine 
} from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const americasDestinations = [
  {
    id: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    capital: 'Washington, D.C.',
    image: '/images/Royal Cleopatra/DSC_8740.jpg',
    description: 'From the bustling cities of New York and Los Angeles to the natural wonders of the Grand Canyon and Yellowstone National Park.',
    highlights: ['Statue of Liberty', 'Grand Canyon', 'Times Square', 'Golden Gate Bridge', 'Yellowstone'],
    tours: 15,
    rating: 4.8,
    category: ['Cultural', 'Nature', 'Adventure'],
    climate: 'Varied - temperate to tropical',
    bestTime: 'April-October',
    languages: ['English', 'Spanish']
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    capital: 'Ottawa',
    image: '/images/Royal Cleopatra/DSC_8568.jpg',
    description: 'Vast wilderness, cosmopolitan cities, and friendly locals make Canada a perfect destination for nature lovers and urban explorers.',
    highlights: ['Niagara Falls', 'Rocky Mountains', 'Toronto', 'Vancouver', 'Quebec City'],
    tours: 12,
    rating: 4.7,
    category: ['Nature', 'Adventure', 'Cultural'],
    climate: 'Continental - cold winters, warm summers',
    bestTime: 'May-September',
    languages: ['English', 'French']
  },
  {
    id: 'mexico',
    name: 'Mexico',
    flag: '🇲🇽',
    capital: 'Mexico City',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    description: 'Rich cultural heritage, ancient ruins, beautiful beaches, and vibrant cities filled with art, music, and incredible cuisine.',
    highlights: ['Chichen Itza', 'Cancun Beaches', 'Mexico City', 'Tulum', 'Oaxaca'],
    tours: 18,
    rating: 4.6,
    category: ['Cultural', 'Beach', 'Historical'],
    climate: 'Tropical to desert - varies by region',
    bestTime: 'November-April',
    languages: ['Spanish', 'Indigenous languages']
  },
  {
    id: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    capital: 'Brasília',
    image: '/images/Royal Cleopatra/DSC_8750.jpg',
    description: 'From the Amazon rainforest to the beaches of Rio de Janeiro, Brazil offers incredible biodiversity and vibrant culture.',
    highlights: ['Christ the Redeemer', 'Amazon Rainforest', 'Iguazu Falls', 'Copacabana', 'Carnival'],
    tours: 14,
    rating: 4.5,
    category: ['Nature', 'Adventure', 'Cultural'],
    climate: 'Tropical - hot and humid',
    bestTime: 'May-September',
    languages: ['Portuguese']
  },
  {
    id: 'argentina',
    name: 'Argentina',
    flag: '🇦🇷',
    capital: 'Buenos Aires',
    image: '/images/Royal Cleopatra/DSC_8581.jpg',
    description: 'Land of tango, wine, and stunning landscapes from the pampas to Patagonia, offering diverse experiences for every traveler.',
    highlights: ['Buenos Aires', 'Patagonia', 'Mendoza Wine Region', 'Ushuaia', 'Bariloche'],
    tours: 10,
    rating: 4.7,
    category: ['Cultural', 'Nature', 'Wine'],
    climate: 'Temperate - opposite seasons to North',
    bestTime: 'October-April',
    languages: ['Spanish']
  },
  {
    id: 'peru',
    name: 'Peru',
    flag: '🇵🇪',
    capital: 'Lima',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    description: 'Ancient Incan heritage meets modern culture, with Machu Picchu being just one of many incredible archaeological treasures.',
    highlights: ['Machu Picchu', 'Cusco', 'Sacred Valley', 'Lima', 'Nazca Lines'],
    tours: 16,
    rating: 4.8,
    category: ['Historical', 'Adventure', 'Cultural'],
    climate: 'Varied - coastal desert, highland, jungle',
    bestTime: 'May-September',
    languages: ['Spanish', 'Quechua']
  }
];

const categories = ['All', 'Cultural', 'Nature', 'Adventure', 'Historical', 'Beach', 'Wine'];

export default function AmericasPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const filteredDestinations = americasDestinations.filter(destination => 
    selectedCategory === 'All' || destination.category.includes(selectedCategory)
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cultural': return <Building className="w-4 h-4" />;
      case 'Nature': return <TreePine className="w-4 h-4" />;
      case 'Adventure': return <Mountain className="w-4 h-4" />;
      case 'Beach': return <Waves className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8740.jpg"
        title="Americas"
        subtitle="Discover the Wonders of North and South America"
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
            Explore the diverse landscapes and rich cultures of the Americas, from ancient civilizations 
            to modern metropolises, stunning natural wonders to vibrant cultural experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <Camera className="w-5 h-5 mr-2" />
              Explore Americas
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
                  alt="Americas Adventure"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Americas <span className="text-orange-600">Adventure</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  From the ancient ruins of Machu Picchu to the modern skylines of New York City, 
                  the Americas offer an incredible diversity of experiences. Discover pristine 
                  natural wonders, vibrant cultures, and historical treasures across two continents.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <Mountain className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Adventure tours through stunning landscapes</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Cultural immersion in diverse societies</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Small group and private tour options</span>
                  </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Plan Americas Tour
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
              Ready to Explore the Americas?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              From North to South America, discover diverse landscapes, rich cultures, 
              and unforgettable experiences across these incredible continents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Camera className="w-5 h-5 mr-2" />
                View Tours
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Users className="w-5 h-5 mr-2" />
                Custom Itinerary
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
