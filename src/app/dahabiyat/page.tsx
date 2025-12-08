import prisma from "@/lib/prisma";
import { DahabiyaList } from "./DahabiyaList";
import { unstable_noStore as noStore } from 'next/cache';
import Image from 'next/image';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import { AnimatedSection, StaggeredAnimation, FloatingElement } from '@/components/ui/animated-section';
import { Star, Users, Calendar, MapPin, Anchor, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getDahabiyat() {
  // Disable caching for this request
  noStore();
  
  try {
    console.log('Fetching dahabiyat...');
    const dahabiyat = await prisma.dahabiya.findMany({
      include: {
        images: true,
        reviews: true,
      },
    });
    console.log('Found dahabiyat:', dahabiyat);

    // Convert Decimal values to numbers
    const formattedDahabiyat = dahabiyat.map(dahabiya => ({
      ...dahabiya,
      pricePerDay: Number(dahabiya.pricePerDay),
      capacity: Number(dahabiya.capacity),
      rating: Number(dahabiya.rating),
      averageRating: dahabiya.reviews.length > 0
        ? Number(dahabiya.reviews.reduce((acc, review) => acc + review.rating, 0) / dahabiya.reviews.length)
        : 0
    }));
    console.log('Formatted dahabiyat:', formattedDahabiyat);

    return formattedDahabiyat;
  } catch (error) {
    console.error('Error fetching dahabiyat:', error);
    return [];
  }
}

async function getContent() {
  try {
    const content = await prisma.websiteContent.findMany({
      where: {
        page: 'dahabiyat',
        isActive: true,
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    const contentMap = new Map();
    content.forEach(item => {
      contentMap.set(item.key, item);
    });

    return contentMap;
  } catch (error) {
    console.error('Error fetching content:', error);
    return new Map();
  }
}

// Featured Dahabiyas data based on reference site
const featuredDahabiyas = [
  {
    id: 'princess-cleopatra',
    name: 'Princess Cleopatra Dahabiya',
    description: 'Experience luxury and elegance aboard our Princess Cleopatra, a beautifully crafted traditional dahabiya that combines authentic Egyptian sailing with modern comfort.',
    image: '/images/princess-cleopatra-dahabiya.jpg',
    cabins: 8,
    capacity: 16,
    features: ['Luxury Cabins', 'Sun Deck', 'Traditional Sailing', 'Fine Dining'],
    priceFrom: 1800,
    rating: 4.9
  },
  {
    id: 'royal-cleopatra',
    name: 'Royal Cleopatra Dahabiya',
    description: 'Sail in royal style aboard our flagship Royal Cleopatra, offering the ultimate in luxury Nile cruising with unparalleled service and amenities.',
    image: '/images/royal-cleopatra-dahabiya.jpg',
    cabins: 8,
    capacity: 16,
    features: ['Royal Suites', 'Premium Service', 'Gourmet Cuisine', 'Private Balconies'],
    priceFrom: 2700,
    rating: 5.0
  },
  {
    id: 'queen-cleopatra',
    name: 'Queen Cleopatra Dahabiya',
    description: 'Discover the majesty of the Nile aboard Queen Cleopatra, where traditional Egyptian hospitality meets contemporary luxury in perfect harmony.',
    image: '/images/queen-cleopatra-dahabiya.jpg',
    cabins: 8,
    capacity: 16,
    features: ['Elegant Interiors', 'Panoramic Views', 'Cultural Experiences', 'Spa Services'],
    priceFrom: 2200,
    rating: 4.8
  },
  {
    id: 'azhar-dahabiya',
    name: 'Azhar Dahabiya',
    description: 'Experience authentic Nile sailing aboard Azhar Dahabiya, a traditional vessel that offers intimate cruising with personalized service and cultural immersion.',
    image: '/images/azhar-dahabiya.jpg',
    cabins: 6,
    capacity: 12,
    features: ['Intimate Setting', 'Cultural Tours', 'Traditional Cuisine', 'Personalized Service'],
    priceFrom: 1350,
    rating: 4.7
  }
];

export default async function DahabiyatPage() {
  const dahabiyat = await getDahabiyat();
  const contentMap = await getContent();

  // Helper function to get content
  const getContentValue = (key: string, fallback: string = '') => {
    const content = contentMap.get(key);
    return content?.content || content?.mediaUrl || fallback;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/5">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-nile-blue via-pharaoh-gold/20 to-ancient-stone overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-10 w-20 h-20 text-pharaoh-gold animate-float">
            <Anchor className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute bottom-20 right-20 w-16 h-16 text-pharaoh-gold animate-pulse" style={{ animationDelay: '2s' }}>
            <Crown className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 text-pharaoh-gold animate-bounce" style={{ animationDelay: '4s' }}>
            <Sparkles className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute top-1/3 left-1/4 w-14 h-14 text-pharaoh-gold animate-spin-slow" style={{ animationDelay: '1s' }}>
            <Star className="w-full h-full drop-shadow-lg" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 w-10 h-10 text-pharaoh-gold animate-floating" style={{ animationDelay: '3s' }}>
            <MapPin className="w-full h-full drop-shadow-lg" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-nile-blue/80 via-transparent to-pharaoh-gold/30"></div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-white">
              <div className="mb-8">
                <div className="inline-block p-4 rounded-full bg-pharaoh-gold/20 backdrop-blur-sm border border-pharaoh-gold/30 mb-6">
                  <Anchor className="w-12 h-12 text-pharaoh-gold" />
                </div>
              </div>
              <h1 className="text-7xl md:text-8xl font-heading font-bold mb-8 bg-gradient-to-r from-pharaoh-gold via-white to-pharaoh-gold bg-clip-text text-transparent drop-shadow-2xl">
                {getContentValue('dahabiyat_hero_title', 'Our Dahabiyas')}
              </h1>
              <p className="text-3xl md:text-4xl font-light mb-10 text-pharaoh-gold/90 drop-shadow-lg">
                {getContentValue('dahabiyat_hero_subtitle', 'Discover the Golden Ones - Traditional Sailing Vessels')}
              </p>
              <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-pharaoh-gold/20">
                <p className="text-xl md:text-2xl leading-relaxed text-white/95">
                  {getContentValue('dahabiyat_hero_description', 'A Dahabiya is an Arabic word meaning \'the golden one\'. These large, comfortable sailing boats with elegant forms and two large sails are replicas of original 19th-century vessels, offering the romance of the past combined with the comfort of today.')}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Featured Dahabiyas Section */}
      <section className="py-24 bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-pharaoh-gold rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-nile-blue rotate-45 animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pharaoh-gold/20 rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-nile-blue/20 rounded-full animate-bounce"></div>
        </div>

        <Container maxWidth="lg" className="relative z-10">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-20">
              <div className="inline-block p-3 rounded-full bg-pharaoh-gold/10 border border-pharaoh-gold/30 mb-6">
                <Crown className="w-10 h-10 text-pharaoh-gold" />
              </div>
              <h2 className="text-6xl md:text-7xl font-heading font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-8 drop-shadow-sm">
                {getContentValue('dahabiyat_fleet_title', 'Our Fleet')}
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue mx-auto mb-8 rounded-full"></div>
              <p className="text-2xl text-ancient-stone leading-relaxed max-w-4xl mx-auto font-light">
                {getContentValue('dahabiyat_fleet_description', 'Choose from our collection of authentic dahabiyas, each offering a unique blend of traditional Egyptian sailing and modern luxury amenities.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {featuredDahabiyas.map((dahabiya, index) => (
              <AnimatedSection key={dahabiya.id} animation="scale-in" delay={index * 200}>
                <Card
                  className="group overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/60 relative"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,215,0,0.05) 50%, rgba(30,58,138,0.05) 100%)',
                    backdropFilter: 'blur(15px)',
                  }}
                >
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-pharaoh-gold/40 rounded-tl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-nile-blue/40 rounded-br-3xl"></div>

                  <div className="relative overflow-hidden">
                    <FloatingElement intensity={0.4}>
                      <CardMedia
                        component="img"
                        height="320"
                        image={dahabiya.image}
                        alt={dahabiya.name}
                        className="h-80 object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                      />
                    </FloatingElement>

                    {/* Enhanced price badge */}
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-pharaoh-gold to-pharaoh-gold/80 text-nile-blue px-5 py-3 rounded-full font-bold text-base shadow-lg border border-pharaoh-gold/50 backdrop-blur-sm">
                      <span className="text-sm">From</span> ${dahabiya.priceFrom}
                    </div>

                    {/* Enhanced rating badge */}
                    <div className="absolute bottom-6 left-6 flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-pharaoh-gold/30">
                      <Star className="w-5 h-5 text-pharaoh-gold fill-current" />
                      <span className="text-base font-bold text-nile-blue">{dahabiya.rating}</span>
                      <span className="text-sm text-ancient-stone">Excellent</span>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute top-4 left-4 w-3 h-3 bg-pharaoh-gold rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-nile-blue rounded-full animate-bounce"></div>
                  </div>

                  <CardContent className="p-10 relative">
                    {/* Title with enhanced styling */}
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-heading font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                        {dahabiya.name}
                      </h3>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-pharaoh-gold to-nile-blue mx-auto rounded-full"></div>
                    </div>

                    <p className="text-ancient-stone leading-relaxed mb-8 text-lg text-center font-light">
                      {dahabiya.description}
                    </p>

                    {/* Enhanced info section */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="text-center p-4 bg-gradient-to-br from-pharaoh-gold/10 to-pharaoh-gold/5 rounded-2xl border border-pharaoh-gold/20">
                        <Users className="w-8 h-8 text-pharaoh-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-nile-blue">{dahabiya.cabins}</div>
                        <div className="text-sm text-ancient-stone font-medium">Luxury Cabins</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-nile-blue/10 to-nile-blue/5 rounded-2xl border border-nile-blue/20">
                        <MapPin className="w-8 h-8 text-nile-blue mx-auto mb-2" />
                        <div className="text-2xl font-bold text-pharaoh-gold">{dahabiya.capacity}</div>
                        <div className="text-sm text-ancient-stone font-medium">Max Guests</div>
                      </div>
                    </div>

                    {/* Enhanced features */}
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                      {dahabiya.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-pharaoh-gold/15 to-nile-blue/15 text-nile-blue rounded-full text-sm font-semibold border border-pharaoh-gold/30 hover:border-pharaoh-gold/50 transition-colors duration-300 shadow-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Enhanced button */}
                    <Link href={`/dahabiyat/${dahabiya.id}`}>
                      <Button
                        className="w-full btn-egyptian group relative overflow-hidden"
                        size="large"
                        sx={{
                          background: 'linear-gradient(135deg, hsl(43, 85%, 58%) 0%, hsl(210, 85%, 25%) 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <span className="group-hover:scale-105 transition-transform duration-300 font-bold text-lg">
                          Explore This Dahabiya
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Dahabiya Section */}
      <section className="py-20 bg-gradient-to-r from-papyrus to-white">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="slide-in-left">
              <div>
                <h2 className="text-4xl font-heading font-bold text-nile-blue mb-8">
                  {getContentValue('dahabiyat_why_different_title', 'Why is Dahabiya Different from Regular Nile Cruises?')}
                </h2>

                <div className="space-y-6 text-lg text-ancient-stone leading-relaxed">
                  {getContentValue('dahabiyat_why_different_content', 'Regular Nile Cruises are managed by big and noisy engines, and stop only 2 times on the way.\n\nUnlike regular cruises, with Dahabiya all your time is spent in real sailing, your stops are at least double those made by regular cruises. Dahabiya normally has a limited number of cabins, varying from 5 to 12 cabins, making it more suitable for families and friends traveling together.\n\nAll those who have tried the comfort of the Dahabiya and experienced regular Nile Cruises know the big difference between them.').split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/real sailing/g, '<strong class="text-pharaoh-gold">real sailing</strong>').replace(/big difference/g, '<strong class="text-pharaoh-gold">big difference</strong>') }} />
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/sailing-tours">
                    <Button className="btn-egyptian" size="large">
                      Explore Our Sailing Tours
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-in-right" delay={200}>
              <div className="relative">
                <FloatingElement intensity={0.4}>
                  <Image
                    src={getContentValue('dahabiyat_why_different_image', '/images/dahabiya-sailing.jpg')}
                    alt="Dahabiya Sailing Experience"
                    width={600}
                    height={500}
                    className="rounded-3xl shadow-2xl border-4 border-pharaoh-gold/30"
                  />
                </FloatingElement>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pharaoh-gold/20 rounded-full blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-nile-blue/20 rounded-full blur-xl"></div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-white">
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-nile-blue mb-6">
                {getContentValue('dahabiyat_experience_title', 'The Dahabiya Experience')}
              </h2>
              <p className="text-xl text-ancient-stone leading-relaxed max-w-4xl mx-auto">
                {getContentValue('dahabiyat_experience_description', 'When you sail on our Dahabiya, you will have a great unforgettable experience as you will feel the beauty, not just see it. Pass through green valleys, islands, farms, and villages, off the beaten path attractions, and enjoy the romantic view of the pure sky full of stars.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-12 h-12" />,
                title: "Wake Up to Different Views",
                description: "Every day brings a new and amazing view as you sail along the timeless Nile."
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "Privacy & Relaxation",
                description: "Enjoy your privacy and relax on the sundeck under the sun or stars with your favorite drink."
              },
              {
                icon: <MapPin className="w-12 h-12" />,
                title: "Authentic Stops",
                description: "Visit famous historical landmarks and villages hardly visited by tourists."
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                <Card className="text-center p-8 h-full bg-gradient-to-br from-white to-papyrus/30 border-2 border-pharaoh-gold/20 hover:border-pharaoh-gold/40 transition-all duration-300 hover:shadow-xl">
                  <div className="w-20 h-20 bg-pharaoh-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-pharaoh-gold">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-nile-blue mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-ancient-stone leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Database Dahabiyas Section */}
      {dahabiyat.length > 0 && (
        <section className="py-20 bg-papyrus">
          <Container maxWidth="lg">
            <AnimatedSection animation="slide-up">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading font-bold text-nile-blue mb-6">
                  {getContentValue('dahabiyat_available_title', 'Available Dahabiyas')}
                </h2>
                <p className="text-xl text-ancient-stone">
                  {getContentValue('dahabiyat_available_description', 'Browse our current fleet and find your perfect Nile adventure')}
                </p>
              </div>
            </AnimatedSection>
            <DahabiyaList dahabiyat={dahabiyat} />
          </Container>
        </section>
      )}
    </div>
  );
}
