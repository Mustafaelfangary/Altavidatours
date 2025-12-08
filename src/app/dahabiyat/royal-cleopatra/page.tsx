import Image from 'next/image';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { AnimatedSection, StaggeredAnimation, FloatingElement } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Crown, Sparkles, Wifi, Car, Utensils, Bed, Bath, Sun, Camera, Music, Shield, Diamond, Award } from 'lucide-react';
import Link from 'next/link';

export default function RoyalCleopatraPage() {
  const dahabiya = {
    name: 'Royal Cleopatra Dahabiya',
    type: 'PREMIUM',
    category: 'LUXURY',
    shortDescription: 'Sail in ultimate luxury aboard the Royal Cleopatra, our flagship vessel that represents the pinnacle of dahabiya elegance.',
    description: 'Sail in ultimate luxury aboard the Royal Cleopatra, our flagship vessel that represents the pinnacle of dahabiya elegance and sophistication. The Royal Cleopatra stands as our crown jewel, a masterpiece of traditional Egyptian boat building enhanced with the finest luxury amenities. This flagship dahabiya offers an unparalleled level of comfort and service, featuring spacious suites, premium dining experiences, and exclusive access to Egypt\'s most treasured sites.',
    advantages: 'Royal Cleopatra offers the ultimate in luxury Nile cruising with only 20 guests maximum, ensuring the most exclusive and personalized experience possible. Our flagship vessel features the largest suites on the Nile, each with panoramic windows and private balconies. The dedicated butler service, world-class cuisine, and exclusive archaeological site access create an experience that surpasses even the finest hotels. This is truly sailing fit for royalty.',
    meaning: 'Dahabiya, meaning "the golden one" in Arabic, represents the most elegant way to experience the Nile. These traditional sailing vessels were once the exclusive domain of Egyptian royalty and European nobility. The Royal Cleopatra continues this legacy, offering modern luxury while maintaining the authentic charm and grace of these historic boats.',
    mainImageUrl: '/images/royal-cleopatra-dahabiya.jpg',
    videoUrl: '/videos/royal-cleopatra-luxury.mp4',
    capacity: 20,
    pricePerDay: 2200,
    rating: 5.0,
    features: ['Royal Suites', 'Premium Dining', 'Exclusive Access', 'Butler Service', 'Private Balconies', 'Panoramic Windows', 'VIP Treatment', 'Luxury Amenities'],
    amenities: ['Royal Suites', 'Gourmet Restaurant', 'Butler Service', 'Private Balconies', 'Premium Bar', 'Exclusive Deck', 'VIP Access', 'Luxury Services', 'Panoramic Windows', 'Premium Safety'],
    images: [
      { url: '/images/royal-cleopatra-indoor.jpg', alt: 'Royal Interior Lounge', category: 'INDOOR' },
      { url: '/images/royal-cleopatra-outdoor.jpg', alt: 'Premium Outdoor Deck', category: 'OUTDOOR' },
      { url: '/images/royal-cleopatra-twin.jpg', alt: 'Royal Twin Suite', category: 'TWIN_CABIN' },
      { url: '/images/royal-cleopatra-double.jpg', alt: 'Royal Double Suite', category: 'DOUBLE_CABIN' },
      { url: '/images/royal-cleopatra-suite.jpg', alt: 'Presidential Suite', category: 'SUITE_CABIN' },
      { url: '/images/royal-cleopatra-bathroom.jpg', alt: 'Luxury Marble Bathroom', category: 'BATHROOM' },
      { url: '/images/royal-cleopatra-restaurant.jpg', alt: 'Gourmet Dining Room', category: 'RESTAURANT_BAR' },
      { url: '/images/royal-cleopatra-deck.jpg', alt: 'Royal Sun Deck', category: 'DECK' }
    ],
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Luxor - Royal Welcome',
        description: 'Begin your royal journey with VIP transfers and exclusive access to the Valley of the Kings. Board Royal Cleopatra with a champagne welcome and private tour of Karnak Temple after hours.',
        images: ['/images/karnak-private.jpg', '/images/royal-welcome.jpg']
      },
      {
        dayNumber: 2,
        title: 'Esna - Exclusive Sailing',
        description: 'Experience premium dahabiya sailing with butler service and gourmet dining. Private visit to Esna Temple with expert Egyptologist guide and traditional music performance on deck.',
        images: ['/images/esna-exclusive.jpg', '/images/butler-service.jpg']
      },
      {
        dayNumber: 3,
        title: 'Edfu - VIP Temple Access',
        description: 'Exclusive early morning access to Edfu Temple before crowds arrive. Enjoy royal treatment with private horse-drawn carriage and premium shopping experience in local markets.',
        images: ['/images/edfu-vip.jpg', '/images/royal-carriage.jpg']
      },
      {
        dayNumber: 4,
        title: 'Aswan - Royal Farewell',
        description: 'Conclude your royal journey with private felucca sailing around Elephantine Island and exclusive dinner at Philae Temple. Royal farewell ceremony with traditional Egyptian entertainment.',
        images: ['/images/philae-private.jpg', '/images/royal-farewell.jpg']
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
          <div className="absolute top-20 left-20 w-28 h-28 text-pharaoh-gold animate-float">
            <Crown className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute bottom-20 right-20 w-24 h-24 text-pharaoh-gold animate-pulse">
            <Diamond className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 text-pharaoh-gold animate-bounce">
            <Award className="w-full h-full drop-shadow-lg" />
          </div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white mb-12">
              <div className="inline-block p-6 rounded-full bg-pharaoh-gold/30 backdrop-blur-sm border-2 border-pharaoh-gold/50 mb-8">
                <Crown className="w-20 h-20 text-pharaoh-gold" />
              </div>
              <h1 className="text-7xl md:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-pharaoh-gold via-white to-pharaoh-gold bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                <span className="inline-block animate-bounce hover:animate-spin transition-all duration-500 hover:scale-110">{dahabiya.name.split(' ')[0]}</span>{' '}
                <span className="inline-block animate-pulse delay-300 hover:animate-bounce hover:text-purple-400 transition-all duration-500">{dahabiya.name.split(' ')[1]}</span>
              </h1>
              
              {/* Type and Category Badges */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className="px-8 py-4 bg-pharaoh-gold/90 text-nile-blue rounded-full font-bold text-xl shadow-lg">
                  {dahabiya.type}
                </span>
                <span className="px-8 py-4 bg-nile-blue/90 text-pharaoh-gold rounded-full font-bold text-xl shadow-lg">
                  {dahabiya.category}
                </span>
              </div>

              <p className="text-2xl md:text-3xl font-light mb-8 bg-gradient-to-r from-pharaoh-gold via-white to-purple-400 bg-clip-text text-transparent max-w-4xl mx-auto animate-fade-in hover:animate-pulse hover:scale-105 transition-all duration-700">
                <span className="hover:bg-gradient-to-r hover:from-purple-400 hover:via-white hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent transition-all duration-500">
                  {dahabiya.shortDescription}
                </span>
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-pharaoh-gold/30">
                  <Users className="w-10 h-10 text-pharaoh-gold mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">{dahabiya.capacity}</div>
                  <div className="text-pharaoh-gold/90">Max Guests</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-pharaoh-gold/30">
                  <Star className="w-10 h-10 text-pharaoh-gold fill-current mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">{dahabiya.rating}</div>
                  <div className="text-pharaoh-gold/90">Perfect Rating</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-pharaoh-gold/30">
                  <Calendar className="w-10 h-10 text-pharaoh-gold mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">${dahabiya.pricePerDay}</div>
                  <div className="text-pharaoh-gold/90">Per Day</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-pharaoh-gold/30">
                  <Crown className="w-10 h-10 text-pharaoh-gold mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">Royal</div>
                  <div className="text-pharaoh-gold/90">Experience</div>
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
              <h2 className="text-5xl font-heading font-bold bg-gradient-to-r from-purple-600 via-pharaoh-gold to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  👑 About Royal Cleopatra 👑
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 via-pharaoh-gold to-purple-600 mx-auto rounded-full mb-8 animate-shimmer hover:w-32 hover:h-2 transition-all duration-500"></div>
              <p className="text-xl bg-gradient-to-r from-ancient-stone via-purple-600/60 to-ancient-stone bg-clip-text text-transparent leading-relaxed max-w-4xl mx-auto hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-purple-600 hover:to-pharaoh-gold hover:bg-clip-text hover:text-transparent hover:animate-pulse transition-all duration-700">
                <span className="hover:scale-105 transition-all duration-500">{dahabiya.description}</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection animation="slide-up" delay={200}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-purple-600 via-pharaoh-gold to-purple-600 bg-clip-text text-transparent text-center mb-12 animate-bounce hover:animate-pulse hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  💎 Royal Premium Features 💎
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dahabiya.features.map((feature, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-gradient-to-br from-pharaoh-gold/15 via-white to-nile-blue/15 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/50 transition-all duration-500 group hover:scale-105">
                      <div className="w-14 h-14 bg-pharaoh-gold/25 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <Crown className="w-7 h-7 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="font-bold bg-gradient-to-r from-purple-600 to-pharaoh-gold bg-clip-text text-transparent text-sm animate-pulse hover:animate-bounce hover:scale-105 hover:bg-gradient-to-r hover:from-pharaoh-gold hover:to-white hover:bg-clip-text hover:text-transparent transition-all duration-500">{feature}</h4>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Amenities Grid */}
          <AnimatedSection animation="slide-up" delay={400}>
            <div className="mb-20">
              <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-purple-600 via-pharaoh-gold to-purple-600 bg-clip-text text-transparent text-center mb-12 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                  💎 Royal Premium Amenities 💎
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dahabiya.amenities.map((amenity, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                    <div className="bg-gradient-to-br from-white via-pharaoh-gold/8 to-nile-blue/8 rounded-2xl p-6 text-center border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/50 transition-all duration-500 group hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-pharaoh-gold/15 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pharaoh-gold group-hover:scale-110 transition-all duration-500">
                        <Diamond className="w-8 h-8 text-pharaoh-gold group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-lg font-heading font-bold bg-gradient-to-r from-pharaoh-gold to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse hover:animate-bounce hover:scale-110 hover:bg-gradient-to-r hover:from-white hover:via-pharaoh-gold hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-500">{amenity}</h4>
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
                Royal Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dahabiya.images.map((image, index) => (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/50 transition-all duration-500">
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
            <div className="mb-20 bg-gradient-to-br from-pharaoh-gold/15 via-white to-nile-blue/15 rounded-3xl p-12 border-2 border-pharaoh-gold/30">
              <div className="text-center mb-8">
                <Crown className="w-20 h-20 text-pharaoh-gold mx-auto mb-6" />
                <h3 className="text-4xl font-heading font-bold bg-gradient-to-r from-purple-600 via-pharaoh-gold to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse hover:animate-bounce hover:scale-110 transition-all duration-500">
                  <span className="hover:bg-gradient-to-r hover:from-pharaoh-gold hover:via-white hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-700">
                    👑 Why Choose Royal Cleopatra? 👑
                  </span>
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
            <div className="mb-20 bg-gradient-to-br from-nile-blue/15 via-white to-pharaoh-gold/15 rounded-3xl p-12 border-2 border-nile-blue/30">
              <div className="text-center mb-8">
                <Anchor className="w-20 h-20 text-nile-blue mx-auto mb-6" />
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
                  4-Day Royal Journey Itinerary
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue mx-auto rounded-full"></div>
              </div>

              <div className="space-y-12">
                {dahabiya.itineraryDays.map((day, index) => (
                  <AnimatedSection key={index} animation="slide-in-left" delay={index * 200}>
                    <div className="bg-gradient-to-br from-white via-pharaoh-gold/8 to-nile-blue/8 rounded-3xl p-8 border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/50 transition-all duration-500 group">
                      <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-pharaoh-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <span className="text-2xl font-bold text-white">Day {day.dayNumber}</span>
                          </div>
                        </div>

                        <div className="flex-grow text-center lg:text-left">
                          <h4 className="text-2xl font-heading font-bold text-nile-blue mb-4">{day.title}</h4>
                          <p className="text-ancient-stone leading-relaxed mb-6">{day.description}</p>

                          {day.images.length > 0 && (
                            <div className="flex gap-4 justify-center lg:justify-start">
                              {day.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="w-28 h-28 rounded-xl overflow-hidden border-2 border-pharaoh-gold/30">
                                  <Image
                                    src={image}
                                    alt={`Day ${day.dayNumber} - ${imgIndex + 1}`}
                                    width={112}
                                    height={112}
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
              <Crown className="w-16 h-16 text-pharaoh-gold mx-auto mb-6" />
              <h2 className="text-4xl font-heading font-bold mb-6">
                Experience Royal Luxury
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Book your royal journey aboard the flagship Royal Cleopatra
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
                    Book Royal Journey
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
