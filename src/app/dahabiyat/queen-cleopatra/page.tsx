"use client";

import Image from 'next/image';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import imageLoader from '@/utils/imageLoader';
import { AnimatedSection, StaggeredAnimation, FloatingElement } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Crown, Sparkles, Wifi, Car, Utensils, Bed, Bath, Sun, Camera, Music, Shield, Heart, Gem } from 'lucide-react';
import Link from 'next/link';

export default function QueenCleopatraPage() {
  const dahabiya = {
    name: 'Queen Cleopatra Dahabiya',
    type: 'LUXURY',
    category: 'PREMIUM',
    shortDescription: 'Experience regal elegance aboard Queen Cleopatra, where immersion meets luxury comfort.',
    description: 'Experience regal elegance aboard Queen Cleopatra, where immersion meets luxury comfort in perfect harmony. This magnificent dahabiya combines traditional Egyptian hospitality with modern amenities, creating an atmosphere of refined elegance. Queen Cleopatra specializes in authentic experiences, offering guests deep insights into Egypt\'s rich heritage while maintaining the highest standards of comfort and service.',
    advantages: 'Queen Cleopatra offers the perfect balance of luxury and authenticity with 18 guests maximum, ensuring personalized attention while fostering meaningful connections. Our vessel features beautifully appointed cabins with traditional Egyptian décor, a dedicated program with expert guides, and exclusive access to local communities and artisans. The onboard workshops and premium services create a truly enriching experience that goes beyond typical tourism.',
    meaning: 'Dahabiya, meaning "the golden one" in Arabic, represents the traditional way Egyptian queens and nobility once traveled the Nile. These graceful vessels with their distinctive lateen sails have carried royalty for centuries. Queen Cleopatra honors this legacy by providing an authentic yet luxurious journey that connects guests with Egypt\'s timeless culture and natural beauty.',
    mainImageUrl: '/images/queen-cleopatra-dahabiya.jpg',
    videoUrl: '/videos/queen-cleopatra-cultural.mp4',
    capacity: 18,
    pricePerDay: 1950,
    rating: 4.8,
    features: ['Immersion Experience', 'Elegant Cabins', 'Expert Guides', 'Traditional Décor', 'Panoramic Views', 'Workshops', 'Authentic Experiences', 'Music Performances'],
    amenities: ['Elegant Cabins', 'Restaurant', 'Traditional Décor', 'Expert Guides', 'Workshops', 'Panoramic Deck', 'Music Performances', 'Art Gallery', 'Premium Service', 'Comfortable Lounges'],
    images: [
      { url: '/images/queen-cleopatra-indoor.jpg', alt: 'Elegant Lounge', category: 'INDOOR' },
      { url: '/images/queen-cleopatra-outdoor.jpg', alt: 'Outdoor Deck', category: 'OUTDOOR' },
      { url: '/images/queen-cleopatra-twin.jpg', alt: 'Traditional Twin Cabin', category: 'TWIN_CABIN' },
      { url: '/images/queen-cleopatra-double.jpg', alt: 'Queen Double Suite', category: 'DOUBLE_CABIN' },
      { url: '/images/queen-cleopatra-suite.jpg', alt: 'Royal Queen Suite', category: 'SUITE_CABIN' },
      { url: '/images/queen-cleopatra-bathroom.jpg', alt: 'Elegant Bathroom', category: 'BATHROOM' },
      { url: '/images/queen-cleopatra-restaurant.jpg', alt: 'Dining Experience', category: 'RESTAURANT_BAR' },
      { url: '/images/queen-cleopatra-deck.jpg', alt: 'Activities Deck', category: 'DECK' }
    ],
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Luxor - Welcome',
        description: 'Begin your journey with traditional welcome ceremony and guided tour of Luxor Temple at sunset. Board Queen Cleopatra with Egyptian music and orientation about your upcoming adventure.',
        images: ['/images/luxor-sunset.jpg', '/images/cultural-welcome.jpg']
      },
      {
        dayNumber: 2,
        title: 'Esna - Artisan Encounters',
        description: 'Visit local pottery workshops and traditional weaving centers in Esna. Participate in hands-on activities and enjoy traditional Egyptian cooking class on board with local ingredients.',
        images: ['/images/pottery-workshop.jpg', '/images/cooking-class.jpg']
      },
      {
        dayNumber: 3,
        title: 'Edfu - Temple & Traditions',
        description: 'Explore Edfu Temple with expert Egyptologist guide, followed by visit to local Nubian village. Experience traditional music and dance performance under the stars on deck.',
        images: ['/images/nubian-village.jpg', '/images/traditional-dance.jpg']
      },
      {
        dayNumber: 4,
        title: 'Aswan - Farewell',
        description: 'Visit traditional spice markets and meet local artisans in Aswan. Conclude with farewell ceremony featuring traditional Egyptian music and storytelling around Elephantine Island.',
        images: ['/images/spice-market.jpg', '/images/storytelling.jpg']
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/5">
      {/* Hero Section with Video/Image */}
      <section className="relative py-32 bg-gradient-to-br from-nile-blue via-pharaoh-gold/20 to-ancient-stone overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          {dahabiya.videoUrl ? (
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover opacity-30"
              poster={dahabiya.mainImageUrl}
            >
              <source src={dahabiya.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={dahabiya.mainImageUrl}
              alt={dahabiya.name}
              fill
              className="object-cover opacity-30"
              loader={imageLoader}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-nile-blue/80 via-pharaoh-gold/40 to-ancient-stone/80"></div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-26 h-26 text-pharaoh-gold animate-float">
            <Heart className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute bottom-20 right-20 w-22 h-22 text-pharaoh-gold animate-pulse">
            <Gem className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-18 h-18 text-pharaoh-gold animate-bounce">
            <Music className="w-full h-full drop-shadow-lg" />
          </div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white mb-12">
              <div className="inline-block p-5 rounded-full bg-pharaoh-gold/30 backdrop-blur-sm border-2 border-pharaoh-gold/50 mb-7">
                <Heart className="w-18 h-18 text-pharaoh-gold" />
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-pharaoh-gold via-white to-pharaoh-gold bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                <span className="inline-block animate-bounce hover:animate-spin transition-all duration-500 hover:scale-110">{dahabiya.name.split(' ')[0]}</span>{' '}
                <span className="inline-block animate-pulse delay-300 hover:animate-bounce hover:text-rose-400 transition-all duration-500">{dahabiya.name.split(' ')[1]}</span>
              </h1>
              
              {/* Type and Category Badges */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className="px-7 py-3 bg-pharaoh-gold/90 text-nile-blue rounded-full font-bold text-lg shadow-lg">
                  {dahabiya.type}
                </span>
                <span className="px-7 py-3 bg-nile-blue/90 text-pharaoh-gold rounded-full font-bold text-lg shadow-lg">
                  {dahabiya.category}
                </span>
              </div>

              <p className="text-2xl md:text-3xl font-light mb-8 bg-gradient-to-r from-pharaoh-gold via-white to-rose-400 bg-clip-text text-transparent max-w-4xl mx-auto animate-fade-in hover:animate-pulse hover:scale-105 transition-all duration-700">
                <span className="hover:bg-gradient-to-r hover:from-rose-400 hover:via-white hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent transition-all duration-500">
                  {dahabiya.shortDescription}
                </span>
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-pharaoh-gold/30">
                  <Users className="w-9 h-9 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{dahabiya.capacity}</div>
                  <div className="text-pharaoh-gold/90 text-sm">Max Guests</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-pharaoh-gold/30">
                  <Star className="w-9 h-9 text-pharaoh-gold fill-current mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{dahabiya.rating}</div>
                  <div className="text-pharaoh-gold/90 text-sm">Excellent</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-pharaoh-gold/30">
                  <Calendar className="w-9 h-9 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">${dahabiya.pricePerDay}</div>
                  <div className="text-pharaoh-gold/90 text-sm">Per Day</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-pharaoh-gold/30">
                  <Heart className="w-9 h-9 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">Elegant</div>
                  <div className="text-pharaoh-gold/90 text-sm">Experience</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Description Section */}
      <section className="py-20">
        <Container maxWidth="lg">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-heading font-bold bg-gradient-to-r from-rose-400 via-pharaoh-gold to-rose-400 bg-clip-text text-transparent mb-6 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-rose-400 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  👸 About Queen Cleopatra 👸
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 via-pharaoh-gold to-rose-400 mx-auto rounded-full mb-8 animate-shimmer hover:w-32 hover:h-2 transition-all duration-500"></div>
              <p className="text-xl bg-gradient-to-r from-ancient-stone via-rose-400/60 to-ancient-stone bg-clip-text text-transparent leading-relaxed max-w-4xl mx-auto hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-rose-400 hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent hover:animate-pulse transition-all duration-700">
                <span className="hover:scale-105 transition-all duration-500">{dahabiya.description}</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection animation="slide-up" delay={200}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-rose-400 via-pharaoh-gold to-rose-400 bg-clip-text text-transparent text-center mb-12 animate-bounce hover:animate-pulse hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-rose-400 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  🌹 Elegant Royal Features 🌹
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dahabiya.features.map((feature, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-gradient-to-br from-pharaoh-gold/12 via-white to-nile-blue/12 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/25 hover:border-pharaoh-gold/45 transition-all duration-500 group hover:scale-105">
                      <div className="w-13 h-13 bg-pharaoh-gold/22 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <Heart className="w-6 h-6 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="font-bold text-nile-blue text-sm">{feature}</h4>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Amenities Grid */}
          <AnimatedSection animation="slide-up" delay={400}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold text-nile-blue text-center mb-12">
                Elegant Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dahabiya.amenities.map((amenity, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-gradient-to-br from-white via-pharaoh-gold/6 to-nile-blue/6 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/25 hover:border-pharaoh-gold/45 transition-all duration-500 group hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-pharaoh-gold/12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <Gem className="w-8 h-8 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-lg font-heading font-bold text-nile-blue mb-2">{amenity}</h4>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
          {/* Image Gallery Section */}
          <AnimatedSection animation="fade-in" delay={600}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold text-nile-blue text-center mb-12">
                Elegant Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dahabiya.images.map((image, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-pharaoh-gold/25 hover:border-pharaoh-gold/45 transition-all duration-500">
                      <div className="aspect-square relative">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loader={imageLoader}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-nile-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <h4 className="font-bold text-sm mb-1">{image.alt}</h4>
                          <p className="text-xs text-pharaoh-gold">{image.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Why Choose This Dahabiya Section */}
          <AnimatedSection animation="slide-up" delay={800}>
            <div className="mb-20 bg-gradient-to-br from-pharaoh-gold/12 via-white to-nile-blue/12 rounded-3xl p-12 border-2 border-pharaoh-gold/25">
              <div className="text-center mb-8">
                <Heart className="w-18 h-18 text-pharaoh-gold mx-auto mb-6" />
                <h3 className="text-4xl font-heading font-bold text-nile-blue mb-6">
                  Why Choose Queen Cleopatra?
                </h3>
                <div className="w-20 h-0.5 bg-pharaoh-gold mx-auto rounded-full mb-8"></div>
              </div>
              <p className="text-lg text-ancient-stone leading-relaxed text-center max-w-4xl mx-auto">
                {dahabiya.advantages}
              </p>
            </div>
          </AnimatedSection>

          {/* Meaning of Dahabiya Section */}
          <AnimatedSection animation="fade-in" delay={1000}>
            <div className="mb-20 bg-gradient-to-br from-nile-blue/12 via-white to-pharaoh-gold/12 rounded-3xl p-12 border-2 border-nile-blue/25">
              <div className="text-center mb-8">
                <Anchor className="w-18 h-18 text-nile-blue mx-auto mb-6" />
                <h3 className="text-4xl font-heading font-bold text-nile-blue mb-6">
                  The Meaning of Dahabiya
                </h3>
                <div className="w-20 h-0.5 bg-nile-blue mx-auto rounded-full mb-8"></div>
              </div>
              <p className="text-lg text-ancient-stone leading-relaxed text-center max-w-4xl mx-auto">
                {dahabiya.meaning}
              </p>
            </div>
          </AnimatedSection>

          {/* Itinerary Section */}
          <AnimatedSection animation="slide-up" delay={1200}>
            <div className="mb-20">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-heading font-bold text-nile-blue mb-6">
                  4-Day Elegant Journey Itinerary
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue mx-auto rounded-full"></div>
              </div>

              <div className="space-y-12">
                {dahabiya.itineraryDays.map((day, index) => (
                  <AnimatedSection key={index} animation="slide-in-left" delay={index * 200}>
                    <div className="bg-gradient-to-br from-white via-pharaoh-gold/6 to-nile-blue/6 rounded-3xl p-8 border-2 border-pharaoh-gold/25 hover:border-pharaoh-gold/45 transition-all duration-500 group">
                      <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-22 h-22 bg-pharaoh-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <span className="text-xl font-bold text-white">Day {day.dayNumber}</span>
                          </div>
                        </div>

                        <div className="flex-grow text-center lg:text-left">
                          <h4 className="text-2xl font-heading font-bold text-nile-blue mb-4">{day.title}</h4>
                          <p className="text-ancient-stone leading-relaxed mb-6">{day.description}</p>

                          {day.images.length > 0 && (
                            <div className="flex gap-4 justify-center lg:justify-start">
                              {day.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="w-26 h-26 rounded-xl overflow-hidden border-2 border-pharaoh-gold/25">
                                  <Image
                                    src={image}
                                    alt={`Day ${day.dayNumber} - ${imgIndex + 1}`}
                                    width={104}
                                    height={104}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    loader={imageLoader}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection animation="fade-in">
            <div className="text-center bg-gradient-to-br from-nile-blue via-pharaoh-gold/20 to-nile-blue rounded-3xl p-12 text-white">
              <Heart className="w-15 h-15 text-pharaoh-gold mx-auto mb-6" />
              <h2 className="text-4xl font-heading font-bold mb-6">
                Experience Elegant Luxury
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Book your elegant journey aboard the magnificent Queen Cleopatra
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button
                    className="btn-egyptian"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, hsl(43, 85%, 58%) 0%, hsl(43, 85%, 48%) 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, hsl(43, 85%, 48%) 0%, hsl(43, 85%, 58%) 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Book Elegant Journey
                  </Button>
                </Link>
                <Link href="/dahabiyat">
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'hsl(43, 85%, 58%)',
                      color: 'hsl(43, 85%, 58%)',
                      '&:hover': {
                        borderColor: 'hsl(43, 85%, 48%)',
                        backgroundColor: 'hsl(43, 85%, 58%)',
                        color: 'hsl(210, 85%, 25%)'
                      }
                    }}
                  >
                    Compare All Dahabiyas
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
