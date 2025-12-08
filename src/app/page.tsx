"use client";
export const dynamic = "force-dynamic";

import Navbar from '@/components/Navbar';
import { Container, Typography, Grid, Box, Card } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoHero } from '@/components/hero/video-hero';
import DahabiyaComparison from '@/components/DahabiyaComparison';
import StorySection from '@/components/StorySection';
import { useTranslation } from '@/lib/i18n';
import GallerySlideshow from '@/components/GallerySlideshow';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import { AnimatedSection, StaggeredAnimation, FloatingElement } from '@/components/ui/animated-section';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, MapPin, Clock, Users, Shield, Award, Heart } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { IMAGES, getHeroImages, getGalleryImages, FEATURED_TOURS } from '@/constants/images';
import imageLoader from '../utils/imageLoader';

// ReadMore component
function ReadMore({ text, maxLength = 220 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxLength) return <span>{text}</span>;
  return (
    <span>
      {expanded ? text : text.slice(0, maxLength) + '...'}
      <button
        className="ml-2 text-primary underline text-sm font-medium focus:outline-none"
        onClick={() => setExpanded((v) => !v)}
        type="button"
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>
    </span>
  );
}

export default function HomePage() {
  const { getContent, getContentBlock, loading, error } = useContent({ page: 'homepage' });
  const t = useTranslation();

  // Helper to get a setting value (backward compatibility)
  const get = (key: string, fallback = '') => {
    return getContent(key, fallback);
  };

  // Helper to get a public asset path
  const getPublic = (key: string, fallback = '') => {
    const val = get(key, fallback);
    if (!val) return '';
    return val.startsWith('/') ? val : `/${val}`;
  };

  const features = [
    {
      icon: Shield,
      title: getContent('homepage_feature_1_title', 'Premium Safety'),
      description: getContent('homepage_feature_1_description', 'Your safety is our top priority with certified vessels and experienced crew.')
    },
    {
      icon: Award,
      title: getContent('homepage_feature_2_title', 'Luxury Experience'),
      description: getContent('homepage_feature_2_description', 'Indulge in the finest amenities and personalized service throughout your journey.')
    },
    {
      icon: MapPin,
      title: getContent('homepage_feature_3_title', 'Authentic Routes'),
      description: getContent('homepage_feature_3_description', 'Discover hidden gems and ancient wonders along the timeless Nile.')
    },
    {
      icon: Heart,
      title: getContent('homepage_feature_4_title', 'Personalized Care'),
      description: getContent('homepage_feature_4_description', 'Enjoy intimate experiences with limited guests and dedicated attention.')
    }
  ];

  const testimonials = [
    {
      name: getContent('homepage_testimonial_1_name', 'Sarah Johnson'),
      text: getContent('homepage_testimonial_1_text', 'An absolutely magical experience! Our guide was exceptional and the Pyramids were breathtaking.'),
      rating: 5,
      location: 'New York, USA'
    },
    {
      name: getContent('homepage_testimonial_2_name', 'Michael Chen'),
      text: getContent('homepage_testimonial_2_text', 'The perfect blend of history and adventure. Highly recommend for anyone visiting Egypt.'),
      rating: 5,
      location: 'London, UK'
    },
    {
      name: getContent('homepage_testimonial_3_name', 'Emma Rodriguez'),
      text: getContent('homepage_testimonial_3_text', 'Exceeded all expectations. The tour experience is truly unique and unforgettable.'),
      rating: 5,
      location: 'Madrid, Spain'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section with Slideshow */}
        {getContentBlock('homepage_hero_video')?.mediaUrl ? (
          <VideoHero
            videoSrc={getContentBlock('homepage_hero_video')?.mediaUrl || '/videos/hero-video.mp4'}
            title={getContent('homepage_hero_title', 'Discover the Wonders of Egypt')}
            subtitle={getContent('homepage_hero_subtitle', 'Premier Travel & Tours Agency in Egypt')}
            ctaText={getContent('homepage_hero_cta_text', 'Explore Our Tours')}
            ctaLink={getContent('homepage_hero_cta_link', '/daily-tours')}
          />
        ) : (
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Enhanced Hero Slideshow */}
            <div className="absolute inset-0 z-0">
              <ImageSlideshow
                images={getHeroImages()}
                alt="Egypt Travel Hero"
                autoPlay={true}
                interval={5000}
                height="h-screen"
                className="rounded-none"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>

            <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
              <AnimatedSection animation="fade-in">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 font-serif drop-shadow-2xl headline-animated">
                  {getContent('homepage_hero_title', 'Discover the Wonders of Egypt')}
                </h1>
                {/* Pharaonic Text */}
                <div className="mb-4">
                  <PharaonicText className="text-white/90" showTranslation={true} />
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={200}>
                <p className="text-2xl md:text-3xl mb-8 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
                  {getContent('homepage_hero_subtitle', 'Premier Travel & Tours Agency in Egypt')}
                </p>
                {/* Pharaonic Decorations */}
                <div className="mt-4">
                  <PharaonicDecoration variant="section" size="md" />
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={400}>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-95 leading-relaxed">
                  {getContent('homepage_hero_description', 'Experience the magic of ancient Egypt with our expertly crafted tours. From the Pyramids of Giza to the Grand Egyptian Museum, discover the treasures of this magnificent land.')}
                </p>
              </AnimatedSection>
              <AnimatedSection animation="scale-in" delay={600}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/daily-tours">
                    <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white text-lg px-10 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                      {getContent('homepage_hero_cta_text', 'Explore Our Tours')}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-lg px-10 py-6 rounded-full border-2 border-white/50 shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-pharaoh-gold/10 section-enhanced">
          <Container maxWidth="lg">
            <div className="text-center mb-12">
              <PharaonicDecoration variant="section" size="sm" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="section-title mb-6 headline-animated">
                  {getContent('homepage_dahabiya_title', 'Why Choose Our Travel Agency?')}
                </h2>
                <p className="text-lg text-ancient-stone mb-6 leading-relaxed">
                  <ReadMore text={getContent('homepage_dahabiya_content', 'We are a premier travel and tours agency in Egypt, offering expertly guided daily tours, multi-day packages, and customized travel experiences. Our professional Egyptologist guides, comfortable transportation, and carefully curated itineraries ensure you discover the best of ancient and modern Egypt. From the Pyramids of Giza to the Grand Egyptian Museum, we make your Egyptian adventure unforgettable.')} />
                </p>
                <div className="flex gap-4">
                  <Link href="/about">
                    <Button className="btn-pharaoh">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/daily-tours">
                    <Button className="btn-nile">
                      View Our Tours
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-pharaoh-gold/30 rounded-3xl blur-3xl group-hover:blur-[40px] transition-all duration-700 animate-pulse"></div>
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                  <Image
                    src={getContentBlock('homepage_dahabiya_image')?.mediaUrl || FEATURED_TOURS.pyramids}
                    alt="Why Choose Egipto Trips"
                    width={600}
                    height={400}
                    className="rounded-3xl transform group-hover:scale-110 transition-transform duration-700"
                    loader={imageLoader}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pharaoh-gold/20 rounded-full blur-2xl group-hover:bg-pharaoh-gold/30 transition-all duration-500"></div>
              </div>
            </div>
        </Container>
        </section>

        {/* What Makes Us Different Section */}
        <section className="py-20 bg-gradient-to-br from-nile-blue/5 via-white to-pharaoh-gold/5 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-20 w-40 h-40 border border-pharaoh-gold rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-nile-blue/10 rounded-full animate-float"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-pharaoh-gold rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-10 right-1/3 w-16 h-16 bg-pharaoh-gold/20 rounded-full animate-bounce"></div>
          </div>

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <AnimatedSection animation="slide-up">
              <div className="text-center mb-16">
                <h2 className="section-title text-nile-blue font-heading mb-4">
                  {getContent('homepage_why_different_title', 'What Makes Our Tours Special?')}
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue mx-auto mb-8 rounded-full animate-shimmer"></div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={200}>
              <div className="max-w-4xl mx-auto">
                {/* Colorful Animated Text Box */}
                <div className="relative bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 rounded-3xl p-8 shadow-2xl border border-pharaoh-gold/20 backdrop-blur-sm">
                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold opacity-20 animate-gradient-x"></div>
                  <div className="absolute inset-1 rounded-3xl bg-white/90 backdrop-blur-sm"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-pharaoh-gold rounded-full animate-pulse"></div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-nile-blue rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-3 -left-2 w-5 h-5 bg-pharaoh-gold/60 rounded-full animate-float"></div>
                    <div className="absolute -bottom-4 -right-4 w-7 h-7 bg-nile-blue/60 rounded-full animate-pulse"></div>

                    {/* Text Content with ReadMore */}
                    <div className="prose prose-lg max-w-none">
                      <div className="text-ancient-stone leading-relaxed text-lg">
                        <ReadMore
                          text={getContent('homepage_why_different_content', 'Our travel agency stands out with professional Egyptologist guides, small group sizes for personalized experiences, skip-the-line access to major attractions, comfortable air-conditioned transportation, and carefully curated itineraries that showcase both ancient wonders and modern Egyptian culture. We offer daily tours, multi-day packages, and custom-tailored experiences to suit every traveler\'s needs.')}
                          maxLength={400}
                        />
                      </div>
                    </div>

                    {/* Bottom decorative line */}
                    <div className="mt-8 w-full h-1 bg-gradient-to-r from-transparent via-pharaoh-gold to-transparent rounded-full animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 via-amber-50 to-emerald-50 relative overflow-hidden section-enhanced">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pharaoh-gold to-amber-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-nile-blue to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <Container maxWidth="lg" className="relative z-10">
            <AnimatedSection animation="slide-up">
              <div className="text-center mb-20">
                {/* Enhanced Title with Gradient and Animation */}
                <div className="mb-6">
                  <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-nile-blue via-pharaoh-gold to-emerald-600 bg-clip-text text-transparent font-cinzel tracking-tight leading-tight hover:scale-105 transition-transform duration-500 cursor-default drop-shadow-lg">
                    {getContent('homepage_features_title', 'Why Choose Our Tours')}
                  </h2>
                  {/* Decorative underline */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-32 h-1.5 bg-gradient-to-r from-pharaoh-gold via-amber-400 to-pharaoh-gold rounded-full animate-shimmer shadow-lg"></div>
                  </div>
                </div>

                {/* Enhanced Subtitle */}
                <p className="text-xl md:text-2xl text-slate-700 font-semibold max-w-3xl mx-auto leading-relaxed font-poppins tracking-wide">
                  {getContent('homepage_features_subtitle', 'Discover what makes our Egypt tours truly exceptional')}
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <AnimatedSection key={index} animation="scale-in" delay={index * 150}>
                    <div className="group relative">
                      {/* Card with enhanced styling */}
                      <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 text-center border-2 border-transparent hover:border-pharaoh-gold/40 shadow-pharaoh hover:shadow-nile transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 card-enhanced-hover">
                        {/* Gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pharaoh-gold/5 via-transparent to-nile-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Enhanced Icon */}
                        <FloatingElement intensity={0.4}>
                          <div className="relative w-20 h-20 mx-auto mb-6">
                            {/* Icon background with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pharaoh-gold/20 via-amber-300/20 to-pharaoh-gold/20 rounded-2xl group-hover:from-pharaoh-gold group-hover:via-amber-400 group-hover:to-pharaoh-gold transition-all duration-500 shadow-lg group-hover:shadow-xl"></div>
                            <div className="relative w-full h-full flex items-center justify-center rounded-2xl">
                              <Icon className="w-10 h-10 text-pharaoh-gold group-hover:text-white transition-all duration-500 transform group-hover:scale-110" />
                            </div>
                          </div>
                        </FloatingElement>

                        {/* Enhanced Title */}
                        <h3 className="text-xl font-bold text-nile-blue group-hover:text-pharaoh-gold transition-colors duration-300 mb-4 font-cinzel tracking-wide">
                          {feature.title}
                        </h3>

                        {/* Enhanced Description */}
                        <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed font-poppins font-medium">
                          {feature.description}
                        </p>

                        {/* Decorative element */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-pharaoh-gold to-amber-400 group-hover:w-16 transition-all duration-500 rounded-full"></div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Featured Tours Section */}
        <section className="py-20 bg-gray-50">
          <Container maxWidth="lg">
            <div className="text-center mb-16">
              <h2 className="section-title">
                {getContent('homepage_featured_title', 'Our Featured Tours')}
              </h2>
              <p className="section-subtitle">
                {getContent('homepage_featured_subtitle', 'Discover our most popular Egypt tour experiences')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Featured Tour 1 */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-white to-pharaoh-gold/5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-pharaoh-gold/30">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getContentBlock('homepage_featured_1_image')?.mediaUrl || FEATURED_TOURS.pyramids}
                    alt="Featured Tour 1"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-pharaoh-gold text-white px-3 py-1 font-bold">Popular</Badge>
                  </div>
                </div>
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-nile-blue mb-3 group-hover:text-pharaoh-gold transition-colors duration-300">
                    {getContent('homepage_featured_1_title', 'Pyramids of Giza & Sphinx')}
                  </h3>
                  <p className="text-ancient-stone mb-6 leading-relaxed">
                    {getContent('homepage_featured_1_description', 'Discover the iconic Pyramids of Giza and the Great Sphinx with our expert Egyptologist guide.')}
                  </p>
                  <Link href="/daily-tours/pyramids-giza-sphinx">
                    <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white w-full group-hover:shadow-lg transition-all duration-300">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Featured Tour 2 */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-white to-nile-blue/5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-nile-blue/30">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getContentBlock('homepage_featured_2_image')?.mediaUrl || FEATURED_TOURS.museum}
                    alt="Featured Tour 2"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-nile-blue text-white px-3 py-1 font-bold">Premium</Badge>
                  </div>
                </div>
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-nile-blue mb-3 group-hover:text-nile-blue transition-colors duration-300">
                    {getContent('homepage_featured_2_title', 'Grand Egyptian Museum Tour')}
                  </h3>
                  <p className="text-ancient-stone mb-6 leading-relaxed">
                    {getContent('homepage_featured_2_description', 'Explore the world\'s largest archaeological museum with skip-the-line access and expert guides.')}
                  </p>
                  <Link href="/daily-tours/grand-egyptian-museum">
                    <Button className="bg-nile-blue hover:bg-nile-blue/90 text-white w-full group-hover:shadow-lg transition-all duration-300">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Featured Tour 3 */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-pharaoh-gold/30">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getContentBlock('homepage_featured_3_image')?.mediaUrl || FEATURED_TOURS.alexandria}
                    alt="Featured Tour 3"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-amber-500 text-white px-3 py-1 font-bold">Featured</Badge>
                  </div>
                </div>
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-nile-blue mb-3 group-hover:text-pharaoh-gold transition-colors duration-300">
                    {getContent('homepage_featured_3_title', 'Alexandria Day Trip')}
                  </h3>
                  <p className="text-ancient-stone mb-6 leading-relaxed">
                    {getContent('homepage_featured_3_description', 'Explore the Mediterranean city of Alexandria with visits to the Library, Catacombs, and Citadel.')}
                  </p>
                  <Link href="/daily-tours/alexandria-day-trip">
                    <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white w-full group-hover:shadow-lg transition-all duration-300">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Explore More CTA */}
            <div className="text-center mt-12">
              <Link href="/excursions">
                <Button size="lg" className="bg-gradient-to-r from-pharaoh-gold to-nile-blue hover:from-pharaoh-gold/90 hover:to-nile-blue/90 text-white font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                  Explore All Excursions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
        </Container>
        </section>

        {/* Share Your Memories Section */}
        <section className="py-20">
          <Container maxWidth="lg">
            <div className="text-center mb-16">
              <h2 className="section-title">
                {getContent('homepage_memories_title', 'Share Your Memories With Us')}
              </h2>
              <p className="section-subtitle">
                {getContent('homepage_memories_subtitle', 'Join our community of travelers and share your unforgettable moments')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-muted-foreground mb-6">
                  <ReadMore text={getContent('homepage_memories_content', 'We love seeing our guests create lasting memories on their Egypt adventures. Share your photos and stories with our community of travelers. Your experiences inspire others to embark on their own journey through the wonders of ancient Egypt.')} />
                </p>
                <div className="flex gap-4">
                  <Link href="/gallery">
                    <Button className="btn-primary">
                      View Gallery
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button className="btn-outline">
                      Share Your Story
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {IMAGES.recent.slice(0, 8).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-xl group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:z-10">
                    <Image
                      src={image}
                      alt={`Egypt Travel Memory ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
        </Container>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <Container maxWidth="lg">
            <div className="text-center mb-16">
              <h2 className="section-title">
                {getContent('homepage_testimonials_title', 'What Our Guests Say')}
              </h2>
              <p className="section-subtitle">
                {getContent('homepage_testimonials_subtitle', 'Discover why travelers choose our tours')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-8 card-enhanced group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pharaoh-gold/5 rounded-full blur-3xl group-hover:bg-pharaoh-gold/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-pharaoh-gold fill-current animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                      ))}
                    </div>
                    <p className="text-ancient-stone mb-6 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                    <div className="border-t border-pharaoh-gold/20 pt-4">
                      <p className="font-bold text-nile-blue text-lg">{testimonial.name}</p>
                      <p className="text-sm text-ancient-stone">{testimonial.location}</p>
                    </div>
                  </div>
                </Card>
            ))}
            </div>
        </Container>
        </section>

        {/* Enhanced Gallery Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <Container maxWidth="lg">
            <div className="text-center mb-16">
              <h2 className="section-title">
                {getContent('homepage_gallery_title', 'Gallery')}
              </h2>
              <p className="section-subtitle">
                {getContent('homepage_gallery_subtitle', 'Explore the beauty of Egypt through our tours')}
              </p>
            </div>
            <div className="mb-12">
              <ImageSlideshow
                images={getHeroImages()}
                alt="Egypt Travel Gallery"
                autoPlay={true}
                interval={4500}
                height="h-[600px]"
                className="shadow-2xl"
              />
            </div>
            <div className="mt-12">
              <ImageGallery
                images={getGalleryImages().slice(0, 15)}
                columns={3}
              />
            </div>
        </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <Container maxWidth="lg">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">
                {getContent('homepage_cta_title', 'Ready to Explore Egypt?')}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {getContent('homepage_cta_subtitle', 'Book your Egypt tour today and create memories that will last a lifetime.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/daily-tours">
                  <Button className="btn-secondary text-lg px-8 py-4">
                    {getContent('homepage_cta_button_text', 'Explore Tours')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
                    Contact Us
            </Button>
                </Link>
              </div>
            </div>
        </Container>
        </section>
      </main>
    </div>
  );
}
