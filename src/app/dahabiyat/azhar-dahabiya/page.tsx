"use client";

import Image from 'next/image';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import imageLoader from '@/utils/imageLoader';
import { AnimatedSection, StaggeredAnimation, FloatingElement } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Crown, Sparkles, Wifi, Car, Utensils, Bed, Bath, Sun, Camera, Music, Shield, Leaf, TreePine } from 'lucide-react';
import Link from 'next/link';

export default function AzharDahabiyaPage() {
  const dahabiya = {
    name: 'Azhar Dahabiya',
    type: 'STANDARD',
    category: 'DELUXE',
    shortDescription: 'Discover authentic Nile sailing aboard Azhar Dahabiya, where intimate charm meets traditional Egyptian hospitality.',
    description: 'Discover authentic Nile sailing aboard Azhar Dahabiya, where intimate charm meets traditional Egyptian hospitality in its purest form. This beautifully crafted dahabiya offers a more personal and authentic experience, perfect for travelers seeking genuine connections with Egypt\'s timeless culture. Azhar combines traditional sailing with comfortable accommodations, creating an atmosphere of warmth and authenticity that larger vessels simply cannot match.',
    advantages: 'Azhar Dahabiya offers the most intimate and authentic Nile experience with only 12 guests maximum, ensuring a family-like atmosphere and personalized attention from our dedicated crew. Our smaller size allows access to secluded spots larger boats cannot reach, while our traditional design and local crew provide genuine insights into Egyptian river life. The cozy accommodations and authentic dining experiences create lasting memories and friendships that extend far beyond your journey.',
    meaning: 'Dahabiya, meaning "the golden one" in Arabic, represents the traditional sailing vessels that have graced the Nile for millennia. Azhar, meaning "flowers" or "blossoms" in Arabic, embodies the natural beauty and authentic charm of these historic boats. This vessel maintains the original spirit of dahabiya travel, offering guests a genuine connection to Egypt\'s river heritage and the timeless rhythm of Nile life.',
    mainImageUrl: '/images/azhar-dahabiya.jpg',
    videoUrl: '/videos/azhar-authentic.mp4',
    capacity: 12,
    pricePerDay: 1650,
    rating: 4.7,
    features: ['Intimate Setting', 'Authentic Experience', 'Traditional Sailing', 'Local Crew', 'Cozy Cabins', 'Genuine Hospitality', 'Secluded Access', 'Immersion Experience'],
    amenities: ['Cozy Cabins', 'Traditional Restaurant', 'Authentic Décor', 'Local Guides', 'Traditional Music', 'Intimate Deck', 'Activities', 'Genuine Hospitality', 'Traditional Sailing', 'Local Cuisine'],
    images: [
      { url: '/images/azhar-indoor.jpg', alt: 'Cozy Traditional Lounge', category: 'INDOOR' },
      { url: '/images/azhar-outdoor.jpg', alt: 'Intimate Outdoor Deck', category: 'OUTDOOR' },
      { url: '/images/azhar-twin.jpg', alt: 'Cozy Twin Cabin', category: 'TWIN_CABIN' },
      { url: '/images/azhar-double.jpg', alt: 'Comfortable Double Cabin', category: 'DOUBLE_CABIN' },
      { url: '/images/azhar-suite.jpg', alt: 'Traditional Suite', category: 'SUITE_CABIN' },
      { url: '/images/azhar-bathroom.jpg', alt: 'Traditional Bathroom', category: 'BATHROOM' },
      { url: '/images/azhar-restaurant.jpg', alt: 'Authentic Dining Area', category: 'RESTAURANT_BAR' },
      { url: '/images/azhar-deck.jpg', alt: 'Traditional Sailing Deck', category: 'DECK' }
    ],
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Luxor - Authentic Welcome',
        description: 'Begin your authentic journey with traditional Egyptian welcome and local tea ceremony. Board Azhar with warm hospitality and intimate introduction to your crew and fellow travelers.',
        images: ['/images/tea-ceremony.jpg', '/images/authentic-welcome.jpg']
      },
      {
        dayNumber: 2,
        title: 'Esna - Local Life',
        description: 'Experience genuine local life with visits to traditional markets and family homes. Enjoy authentic Egyptian meals prepared by local cooks using traditional recipes and fresh ingredients.',
        images: ['/images/local-market.jpg', '/images/traditional-cooking.jpg']
      },
      {
        dayNumber: 3,
        title: 'Edfu - Hidden Gems',
        description: 'Discover secluded spots only accessible to smaller boats and visit hidden temples away from crowds. Experience traditional fishing with local fishermen and sunset sailing.',
        images: ['/images/hidden-temple.jpg', '/images/traditional-fishing.jpg']
      },
      {
        dayNumber: 4,
        title: 'Aswan - Heartfelt Farewell',
        description: 'Conclude with intimate farewell gathering featuring traditional music by local musicians and sharing stories with your new friends around Nubian villages.',
        images: ['/images/nubian-music.jpg', '/images/farewell-gathering.jpg']
      }
    ]
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-papyrus via-white to-pharaoh-gold/5">
      {/* Hero Section with Video/Image */}
      <section className="relative py-32 bg-linear-to-br from-nile-blue via-pharaoh-gold/20 to-ancient-stone overflow-hidden">
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
          <div className="absolute inset-0 bg-linear-to-br from-nile-blue/80 via-pharaoh-gold/40 to-ancient-stone/80"></div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-24 h-24 text-pharaoh-gold animate-float">
            <Leaf className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute bottom-20 right-20 w-20 h-20 text-pharaoh-gold animate-pulse">
            <TreePine className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 text-pharaoh-gold animate-bounce">
            <Sparkles className="w-full h-full drop-shadow-lg" />
          </div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white mb-12">
              <div className="inline-block p-4 rounded-full bg-pharaoh-gold/30 backdrop-blur-sm border-2 border-pharaoh-gold/50 mb-6">
                <Leaf className="w-16 h-16 text-pharaoh-gold" />
              </div>
              <h1 className="text-6xl md:text-7xl font-heading font-bold mb-6 bg-linear-to-r from-pharaoh-gold via-white to-pharaoh-gold bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                <span className="inline-block animate-bounce hover:animate-spin transition-all duration-500 hover:scale-110">{dahabiya.name.split(' ')[0]}</span>{' '}
                <span className="inline-block animate-pulse delay-300 hover:animate-bounce hover:text-green-400 transition-all duration-500">{dahabiya.name.split(' ')[1]}</span>
              </h1>
              
              {/* Type and Category Badges */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className="px-6 py-3 bg-pharaoh-gold/90 text-nile-blue rounded-full font-bold text-lg shadow-lg">
                  {dahabiya.type}
                </span>
                <span className="px-6 py-3 bg-nile-blue/90 text-pharaoh-gold rounded-full font-bold text-lg shadow-lg">
                  {dahabiya.category}
                </span>
              </div>

              <p className="text-xl md:text-2xl font-light mb-8 bg-linear-to-r from-pharaoh-gold via-white to-green-400 bg-clip-text text-transparent max-w-4xl mx-auto animate-fade-in hover:animate-pulse hover:scale-105 transition-all duration-700">
                <span className="hover:bg-linear-to-r hover:from-green-400 hover:via-white hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent transition-all duration-500">
                  {dahabiya.shortDescription}
                </span>
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-pharaoh-gold/30">
                  <Users className="w-8 h-8 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{dahabiya.capacity}</div>
                  <div className="text-pharaoh-gold/90 text-sm">Max Guests</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-pharaoh-gold/30">
                  <Star className="w-8 h-8 text-pharaoh-gold fill-current mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{dahabiya.rating}</div>
                  <div className="text-pharaoh-gold/90 text-sm">Great Rating</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-pharaoh-gold/30">
                  <Calendar className="w-8 h-8 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">${dahabiya.pricePerDay}</div>
                  <div className="text-pharaoh-gold/90 text-sm">Per Day</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-pharaoh-gold/30">
                  <Leaf className="w-8 h-8 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">Authentic</div>
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
              <h2 className="text-5xl font-heading font-bold bg-linear-to-r from-green-400 via-pharaoh-gold to-green-400 bg-clip-text text-transparent mb-6 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                <span className="hover:bg-linear-to-r hover:from-pharaoh-gold hover:via-white hover:to-green-400 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  🌿 About Azhar Dahabiya 🌿
                </span>
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-green-400 via-pharaoh-gold to-green-400 mx-auto rounded-full mb-8 animate-shimmer hover:w-32 hover:h-2 transition-all duration-500"></div>
              <p className="text-xl bg-linear-to-r from-ancient-stone via-green-400/60 to-ancient-stone bg-clip-text text-transparent leading-relaxed max-w-4xl mx-auto hover:bg-linear-to-r hover:from-pharaoh-gold hover:via-green-400 hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent hover:animate-pulse transition-all duration-700">
                <span className="hover:scale-105 transition-all duration-500">{dahabiya.description}</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection animation="slide-up" delay={200}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold bg-linear-to-r from-green-400 via-pharaoh-gold to-green-400 bg-clip-text text-transparent text-center mb-12 animate-bounce hover:animate-pulse hover:scale-110 transition-all duration-500">
                <span className="hover:bg-linear-to-r hover:from-pharaoh-gold hover:via-white hover:to-green-400 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  🌿 Authentic Natural Features 🌿
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dahabiya.features.map((feature, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-linear-to-br from-pharaoh-gold/10 via-white to-nile-blue/10 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-500 group hover:scale-105">
                      <div className="w-12 h-12 bg-pharaoh-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <Leaf className="w-6 h-6 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
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
                Traditional Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dahabiya.amenities.map((amenity, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-linear-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-500 group hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-pharaoh-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <TreePine className="w-8 h-8 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
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
                Authentic Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dahabiya.images.map((image, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-500">
                      <div className="aspect-square relative">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loader={imageLoader}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-nile-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
            <div className="mb-20 bg-linear-to-br from-pharaoh-gold/10 via-white to-nile-blue/10 rounded-3xl p-12 border-2 border-pharaoh-gold/20">
              <div className="text-center mb-8">
                <Leaf className="w-16 h-16 text-pharaoh-gold mx-auto mb-6" />
                <h3 className="text-4xl font-heading font-bold text-nile-blue mb-6">
                  Why Choose Azhar Dahabiya?
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
            <div className="mb-20 bg-linear-to-br from-nile-blue/10 via-white to-pharaoh-gold/10 rounded-3xl p-12 border-2 border-nile-blue/20">
              <div className="text-center mb-8">
                <Anchor className="w-16 h-16 text-nile-blue mx-auto mb-6" />
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
                  4-Day Authentic Journey Itinerary
                </h3>
                <div className="w-24 h-1 bg-linear-to-r from-nile-blue via-pharaoh-gold to-nile-blue mx-auto rounded-full"></div>
              </div>

              <div className="space-y-12">
                {dahabiya.itineraryDays.map((day, index) => (
                  <AnimatedSection key={index} animation="slide-in-left" delay={index * 200}>
                    <div className="bg-linear-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 rounded-3xl p-8 border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-500 group">
                      <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="shrink-0">
                          <div className="w-20 h-20 bg-pharaoh-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <span className="text-xl font-bold text-white">Day {day.dayNumber}</span>
                          </div>
                        </div>

                        <div className="grow text-center lg:text-left">
                          <h4 className="text-2xl font-heading font-bold text-nile-blue mb-4">{day.title}</h4>
                          <p className="text-ancient-stone leading-relaxed mb-6">{day.description}</p>

                          {day.images.length > 0 && (
                            <div className="flex gap-4 justify-center lg:justify-start">
                              {day.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-pharaoh-gold/20">
                                  <Image
                                    src={image}
                                    alt={`Day ${day.dayNumber} - ${imgIndex + 1}`}
                                    width={96}
                                    height={96}
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
            <div className="text-center bg-linear-to-br from-nile-blue via-pharaoh-gold/20 to-nile-blue rounded-3xl p-12 text-white">
              <Leaf className="w-14 h-14 text-pharaoh-gold mx-auto mb-6" />
              <h2 className="text-4xl font-heading font-bold mb-6">
                Experience Authentic Charm
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Book your authentic journey aboard the intimate Azhar Dahabiya
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
                    Book Authentic Journey
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


