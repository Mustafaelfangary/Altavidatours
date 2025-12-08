import Image from 'next/image';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { AnimatedSection, StaggeredAnimation, FloatingElement } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Crown, Sparkles, Wifi, Car, Utensils, Bed, Bath, Sun, Camera, Music, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrincessCleopatraPage() {
  const dahabiya = {
    name: 'Princess Cleopatra Dahabiya',
    type: 'LUXURY',
    category: 'DELUXE',
    shortDescription: 'Experience luxury and elegance aboard our Princess Cleopatra, a beautifully crafted traditional dahabiya.',
    description: 'Experience luxury and elegance aboard our Princess Cleopatra, a beautifully crafted traditional dahabiya that combines authentic Egyptian sailing with modern comfort. The Princess Cleopatra represents the perfect harmony between traditional Egyptian craftsmanship and contemporary luxury. Built by master craftsmen in Esna, this magnificent vessel follows the authentic design of 19th-century dahabiyas while incorporating all modern amenities for your comfort.',
    advantages: 'Princess Cleopatra offers an intimate and exclusive way to explore the timeless Nile. With only 16 guests maximum, you receive personalized attention from our dedicated crew. The vessel can access smaller ports and hidden gems that large cruise ships cannot reach. Our traditional sailing experience combined with luxury amenities creates memories that last a lifetime. The authentic Egyptian hospitality and gourmet cuisine prepared with fresh local ingredients make every meal a celebration.',
    meaning: 'Dahabiya is an Arabic word meaning "the golden one". These elegant sailing boats with their distinctive two large sails are replicas of the original 19th-century vessels that once carried royalty and dignitaries along the Nile. The golden name reflects both the color of the sails in the Egyptian sun and the precious nature of the experience they provide.',
    mainImageUrl: '/images/princess-cleopatra-dahabiya.jpg',
    videoUrl: '/videos/princess-cleopatra-tour.mp4',
    capacity: 16,
    pricePerDay: 1800,
    rating: 4.9,
    features: ['Luxury Cabins', 'Sun Deck', 'Traditional Sailing', 'Fine Dining', 'Air Conditioning', 'En-suite Bathrooms', 'Panoramic Views', 'Cultural Experiences'],
    amenities: ['Luxury Cabins', 'Fine Dining Restaurant', 'Sun Deck', 'Air Conditioning', 'En-suite Bathrooms', 'Traditional Sailing', 'Cultural Performances', 'Panoramic Windows', 'Safety Equipment', 'WiFi Available'],
    images: [
      { url: '/images/princess-cleopatra-indoor.jpg', alt: 'Elegant Interior Lounge', category: 'INDOOR' },
      { url: '/images/princess-cleopatra-outdoor.jpg', alt: 'Beautiful Outdoor Deck', category: 'OUTDOOR' },
      { url: '/images/princess-cleopatra-twin.jpg', alt: 'Twin Cabin with Nile View', category: 'TWIN_CABIN' },
      { url: '/images/princess-cleopatra-double.jpg', alt: 'Double Cabin Luxury', category: 'DOUBLE_CABIN' },
      { url: '/images/princess-cleopatra-suite.jpg', alt: 'Princess Suite', category: 'SUITE_CABIN' },
      { url: '/images/princess-cleopatra-bathroom.jpg', alt: 'Marble Bathroom', category: 'BATHROOM' },
      { url: '/images/princess-cleopatra-restaurant.jpg', alt: 'Fine Dining Restaurant', category: 'RESTAURANT_BAR' },
      { url: '/images/princess-cleopatra-deck.jpg', alt: 'Sun Deck Paradise', category: 'DECK' }
    ],
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Luxor - Valley of the Kings',
        description: 'Begin your journey in Luxor, exploring the magnificent Valley of the Kings and the Temple of Queen Hatshepsut. Board Princess Cleopatra in the afternoon and enjoy welcome drinks as we set sail.',
        images: ['/images/valley-of-kings.jpg', '/images/hatshepsut-temple.jpg']
      },
      {
        dayNumber: 2,
        title: 'Esna - Traditional Sailing',
        description: 'Experience authentic dahabiya sailing as we navigate through the Esna Lock. Visit the Temple of Khnum and enjoy traditional Egyptian lunch on deck while watching the Nile countryside.',
        images: ['/images/esna-lock.jpg', '/images/khnum-temple.jpg']
      },
      {
        dayNumber: 3,
        title: 'Edfu - Temple of Horus',
        description: 'Explore the best-preserved temple in Egypt, the Temple of Horus at Edfu. Take a horse-drawn carriage ride through the local market and enjoy cultural performances on board.',
        images: ['/images/edfu-temple.jpg', '/images/horse-carriage.jpg']
      },
      {
        dayNumber: 4,
        title: 'Aswan - Philae Temple',
        description: 'Conclude your journey in Aswan with visits to the beautiful Philae Temple and the High Dam. Enjoy a farewell dinner under the stars as we anchor near Elephantine Island.',
        images: ['/images/philae-temple.jpg', '/images/aswan-sunset.jpg']
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
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-nile-blue/80 via-pharaoh-gold/40 to-ancient-stone/80"></div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-24 h-24 text-pharaoh-gold animate-float">
            <Crown className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute bottom-20 right-20 w-20 h-20 text-pharaoh-gold animate-pulse">
            <Anchor className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 text-pharaoh-gold animate-bounce">
            <Sparkles className="w-full h-full drop-shadow-lg" />
          </div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white mb-12">
              <div className="inline-block p-4 rounded-full bg-pharaoh-gold/30 backdrop-blur-sm border-2 border-pharaoh-gold/50 mb-6">
                <Crown className="w-16 h-16 text-pharaoh-gold" />
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-pharaoh-gold via-white to-pharaoh-gold bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                <span className="inline-block animate-bounce hover:animate-spin transition-all duration-500 hover:scale-110">{dahabiya.name.split(' ')[0]}</span>{' '}
                <span className="inline-block animate-pulse delay-300 hover:animate-bounce hover:text-pharaoh-gold transition-all duration-500">{dahabiya.name.split(' ')[1]}</span>{' '}
                <span className="inline-block animate-bounce delay-500 hover:animate-pulse hover:scale-125 transition-all duration-500">{dahabiya.name.split(' ')[2]}</span>
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

              <p className="text-2xl md:text-3xl font-light mb-8 bg-gradient-to-r from-pharaoh-gold via-white to-pharaoh-gold bg-clip-text text-transparent max-w-4xl mx-auto animate-fade-in hover:animate-pulse hover:scale-105 transition-all duration-700">
                <span className="hover:bg-gradient-to-r hover:from-nile-blue hover:via-pharaoh-gold hover:to-white hover:bg-clip-text hover:text-transparent transition-all duration-500">
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
                  <div className="text-pharaoh-gold/90 text-sm">Rating</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-pharaoh-gold/30">
                  <Calendar className="w-8 h-8 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">${dahabiya.pricePerDay}</div>
                  <div className="text-pharaoh-gold/90 text-sm">Per Day</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-pharaoh-gold/30">
                  <Anchor className="w-8 h-8 text-pharaoh-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-pharaoh-gold/90 text-sm">Days Journey</div>
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
              <h2 className="text-5xl font-heading font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-6 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-nile-blue hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  ✨ About Princess Cleopatra ✨
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue mx-auto rounded-full mb-8 animate-shimmer hover:w-32 hover:h-2 transition-all duration-500"></div>
              <p className="text-xl bg-gradient-to-r from-ancient-stone via-nile-blue/80 to-ancient-stone bg-clip-text text-transparent leading-relaxed max-w-4xl mx-auto hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-nile-blue hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent transition-all duration-700">
                <span className="hover:animate-pulse">{dahabiya.description}</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection animation="slide-up" delay={200}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold bg-clip-text text-transparent text-center mb-12 animate-bounce hover:animate-pulse hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-white hover:via-pharaoh-gold hover:to-nile-blue hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  ✨ Luxury Dahabiya Features ✨
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dahabiya.features.map((feature, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-gradient-to-br from-pharaoh-gold/10 via-white to-nile-blue/10 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-500 group hover:scale-105">
                      <div className="w-12 h-12 bg-pharaoh-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <Sparkles className="w-6 h-6 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="font-bold bg-gradient-to-r from-nile-blue to-pharaoh-gold bg-clip-text text-transparent text-sm animate-pulse hover:animate-bounce hover:scale-105 hover:bg-gradient-to-r hover:from-pharaoh-gold hover:to-white hover:bg-clip-text hover:text-transparent transition-all duration-500">{feature}</h4>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Amenities Grid */}
          <AnimatedSection animation="slide-up" delay={400}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent text-center mb-12 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-nile-blue hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  🌟 Premium Luxury Amenities 🌟
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dahabiya.amenities.map((amenity, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-500 group hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-pharaoh-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <Crown className="w-8 h-8 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-lg font-heading font-bold bg-gradient-to-r from-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-2 animate-pulse hover:animate-bounce hover:scale-110 hover:bg-gradient-to-r hover:from-white hover:via-pharaoh-gold hover:to-nile-blue hover:bg-clip-text hover:text-transparent transition-all duration-500">{amenity}</h4>
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
                Dahabiya Gallery
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
            <div className="mb-20 bg-gradient-to-br from-pharaoh-gold/10 via-white to-nile-blue/10 rounded-3xl p-12 border-2 border-pharaoh-gold/20">
              <div className="text-center mb-8">
                <Crown className="w-16 h-16 text-pharaoh-gold mx-auto mb-6" />
                <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-6 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                  <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-nile-blue hover:bg-clip-text hover:text-transparent transition-all duration-700">
                    👑 Why Choose Princess Cleopatra? 👑
                  </span>
                </h3>
                <div className="w-20 h-0.5 bg-pharaoh-gold mx-auto rounded-full mb-8"></div>
              </div>
              <p className="text-lg bg-gradient-to-r from-ancient-stone via-nile-blue/80 to-ancient-stone bg-clip-text text-transparent leading-relaxed text-center max-w-4xl mx-auto hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-nile-blue hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent hover:animate-pulse transition-all duration-700">
                <span className="hover:scale-105 transition-all duration-500">{dahabiya.advantages}</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Meaning of Dahabiya Section */}
          <AnimatedSection animation="fade-in" delay={1000}>
            <div className="mb-20 bg-gradient-to-br from-nile-blue/10 via-white to-pharaoh-gold/10 rounded-3xl p-12 border-2 border-nile-blue/20">
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
                <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-6 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                  <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-nile-blue hover:bg-clip-text hover:text-transparent transition-all duration-700">
                    🗓️ 4-Day Magical Journey Itinerary 🗓️
                  </span>
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue mx-auto rounded-full animate-shimmer hover:w-32 hover:h-2 transition-all duration-500"></div>
              </div>

              <div className="space-y-12">
                {dahabiya.itineraryDays.map((day, index) => (
                  <AnimatedSection key={index} animation="slide-in-left" delay={index * 200}>
                    <div className="bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 rounded-3xl p-8 border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-500 group">
                      <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-pharaoh-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <span className="text-2xl font-bold text-white">Day {day.dayNumber}</span>
                          </div>
                        </div>

                        <div className="flex-grow text-center lg:text-left">
                          <h4 className="text-2xl font-heading font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-4 animate-pulse hover:animate-bounce hover:scale-105 transition-all duration-500">
                            <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-nile-blue hover:bg-clip-text hover:text-transparent transition-all duration-700">
                              {day.title}
                            </span>
                          </h4>
                          <p className="bg-gradient-to-r from-ancient-stone via-nile-blue/60 to-ancient-stone bg-clip-text text-transparent leading-relaxed mb-6 hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-nile-blue hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent hover:animate-pulse transition-all duration-700">
                            <span className="hover:scale-105 transition-all duration-500">{day.description}</span>
                          </p>

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
              <h2 className="text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-white via-pharaoh-gold to-white bg-clip-text text-transparent animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  ✨ Ready to Experience Princess Cleopatra? ✨
                </span>
              </h2>
              <p className="text-xl mb-8 bg-gradient-to-r from-white/90 via-pharaoh-gold/80 to-white/90 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent hover:animate-pulse transition-all duration-700">
                <span className="hover:scale-105 transition-all duration-500">
                  🚢 Book your luxury Nile cruise aboard this magnificent dahabiya 🚢
                </span>
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
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Book Now
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
                    View All Dahabiyas
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
