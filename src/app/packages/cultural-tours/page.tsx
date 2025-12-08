'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Users, Calendar, ArrowLeft, Camera, Palette, Music, Building } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const culturalPackages = [
  {
    id: 'ancient-egypt-discovery',
    name: 'Ancient Egypt Discovery',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    description: 'Comprehensive cultural journey through Egypt\'s most significant historical sites with expert Egyptologists.',
    duration: '12 days',
    maxGuests: 16,
    difficulty: 'Easy',
    rating: 4.9,
    reviews: 187,
    price: 'From $1,850',
    highlights: ['Expert Egyptologists', 'Private Museum Tours', 'Hieroglyph Workshops', 'Temple Ceremonies', 'Archaeological Sites']
  },
  {
    id: 'cultural-heritage-trail',
    name: 'Cultural Heritage Trail',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    description: 'Immersive experience in Egyptian culture, traditions, and local communities with authentic interactions.',
    duration: '10 days',
    maxGuests: 12,
    difficulty: 'Easy',
    rating: 4.8,
    reviews: 143,
    price: 'From $1,450',
    highlights: ['Village Visits', 'Traditional Crafts', 'Local Families', 'Cultural Workshops', 'Authentic Cuisine']
  },
  {
    id: 'artisan-experience',
    name: 'Artisan Experience Package',
    image: '/images/Royal Cleopatra/DSC_8635.jpg',
    description: 'Hands-on cultural package focusing on traditional Egyptian crafts and artistic heritage.',
    duration: '8 days',
    maxGuests: 10,
    difficulty: 'Easy',
    rating: 4.7,
    reviews: 98,
    price: 'From $1,200',
    highlights: ['Pottery Making', 'Carpet Weaving', 'Jewelry Crafting', 'Master Artisans', 'Take Home Creations']
  },
  {
    id: 'pharaonic-civilization',
    name: 'Pharaonic Civilization Journey',
    image: '/images/Royal Cleopatra/DSC_8740.jpg',
    description: 'Deep dive into ancient Egyptian civilization with archaeological tours and historical insights.',
    duration: '14 days',
    maxGuests: 18,
    difficulty: 'Moderate',
    rating: 4.9,
    reviews: 234,
    price: 'From $2,200',
    highlights: ['All Major Sites', 'Archaeological Lectures', 'Tomb Explorations', 'Museum Collections', 'Expert Historians']
  }
];

const culturalFeatures = [
  {
    icon: <BookOpen className="w-8 h-8 text-orange-600" />,
    title: 'Expert Historians',
    description: 'Learn from certified Egyptologists and cultural historians with decades of experience'
  },
  {
    icon: <Palette className="w-8 h-8 text-orange-600" />,
    title: 'Traditional Arts',
    description: 'Hands-on workshops with master craftsmen in traditional Egyptian arts and crafts'
  },
  {
    icon: <Music className="w-8 h-8 text-orange-600" />,
    title: 'Living Culture',
    description: 'Experience authentic Egyptian culture through music, dance, and local traditions'
  },
  {
    icon: <Building className="w-8 h-8 text-orange-600" />,
    title: 'Heritage Sites',
    description: 'Comprehensive visits to UNESCO World Heritage sites and hidden cultural gems'
  }
];

const culturalHighlights = [
  {
    title: 'Temple of Karnak',
    description: 'Explore the largest religious complex ever built with detailed historical context.',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    duration: 'Half day'
  },
  {
    title: 'Coptic Cairo',
    description: 'Discover Egypt\'s Christian heritage in historic Old Cairo with local guides.',
    image: '/images/Royal Cleopatra/DSC_8630.jpg',
    duration: 'Full day'
  },
  {
    title: 'Nubian Villages',
    description: 'Experience authentic Nubian culture, traditions, and hospitality.',
    image: '/images/Royal Cleopatra/DSC_8635.jpg',
    duration: 'Full day'
  }
];

export default function CulturalToursPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const difficulties = ['All', 'Easy', 'Moderate', 'Challenging'];

  const filteredPackages = culturalPackages.filter(pkg => 
    selectedDifficulty === 'All' || pkg.difficulty === selectedDifficulty
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'challenging': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-red-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8625.jpg"
        title="Cultural Tours"
        subtitle="Immerse Yourself in Egypt's Rich Cultural Heritage"
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
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0 text-justify">
            Journey through thousands of years of Egyptian civilization with our comprehensive cultural 
            tour packages that bring ancient history to life through authentic experiences and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Culture
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

      {/* Cultural Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Cultural <span className="text-orange-600">Excellence</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-12">
                Our cultural tour packages are designed to provide deep, authentic insights into Egyptian heritage and traditions.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {culturalFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="egypt-card text-center">
                  <div className="egypt-card-body">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Difficulty Filter */}
      <section className="py-8 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Filter by Difficulty</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`text-sm px-4 py-2 ${
                    selectedDifficulty === difficulty 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'border-orange-600 text-orange-800 hover:bg-orange-50'
                  }`}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Packages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Cultural <span className="text-orange-600">Packages</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose from our collection of cultural tour packages designed to provide comprehensive insights into Egyptian civilization.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPackages.map((pkg, index) => (
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
                      <h4 className="font-semibold text-gray-900 mb-3">Cultural Highlights:</h4>
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
                        <BookOpen className="w-4 h-4 mr-2" />
                        Book Package
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-orange-600 text-orange-800 hover:bg-orange-50"
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        <Camera className="w-4 h-4 mr-2" />
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

      {/* Cultural Highlights */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Must-Visit <span className="text-orange-600">Cultural Sites</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Explore Egypt's most significant cultural and historical landmarks with expert interpretation.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {culturalHighlights.map((highlight, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-orange-200 bg-white">
                  <div className="relative h-48">
                    <Image src={highlight.image} alt={highlight.title} fill className="object-cover" />
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {highlight.duration}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Learning */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src="/images/images/Royal Cleopatra/DSC_8625.jpg"
                  alt="Cultural Learning"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Learn from <span className="text-orange-600">the Experts</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our cultural tours are led by certified Egyptologists, archaeologists, and cultural historians 
                  who bring decades of research and passion to every experience. Learn not just the facts, 
                  but the stories, legends, and insights that make Egyptian culture truly come alive.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">PhD-level Egyptologists and historians</span>
                  </div>
                  <div className="flex items-center">
                    <Palette className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Hands-on cultural workshops and experiences</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Access to restricted archaeological areas</span>
                  </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Cultural Journey
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
              Ready to Explore Egyptian Culture?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join us on a transformative journey through Egypt's rich cultural heritage. 
              Experience the civilization that has fascinated the world for millennia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Book Cultural Tour
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg">
                <Music className="w-5 h-5 mr-2" />
                Cultural Calendar
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Custom Cultural Tours */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 text-center border border-orange-200">
              <BookOpen className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Custom Cultural Experiences
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Have specific cultural interests? Our experts can design a personalized cultural tour 
                focusing on your areas of interest, from ancient religions to modern Egyptian society.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">
                    <Palette className="w-5 h-5 mr-2" />
                    Design Custom Tour
                  </Button>
                </Link>
                <Button variant="outline" className="border-orange-600 text-orange-800 hover:bg-orange-50 px-6 py-3 rounded-lg">
                  <Building className="w-5 h-5 mr-2" />
                  Cultural Brochure
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
