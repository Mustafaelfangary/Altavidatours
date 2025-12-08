"use client";

import React from 'react';
import { Container, Card, CardContent, Avatar } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';
import UnifiedHero from '@/components/ui/UnifiedHero';
import {
  Users,
  Award,
  Target,
  Heart,
  Star,
  Crown,
  Shield,
  Compass,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  const { getContent, loading, error } = useContent({ page: 'about' });

  if (loading) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <RoyalCrown className="w-16 h-16 text-ocean-blue mx-auto mb-6 animate-pulse" />
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-ocean-blue mx-auto mb-6"></div>
          <div className="text-ocean-blue text-3xl mb-4">𓇳 𓊪 𓈖 𓂀 𓏏 𓇯 𓊃</div>
          <p className="text-ocean-blue-dark font-bold text-xl">{getContent('about_loading_text') || 'Loading About Page...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharaonic-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-ocean-blue text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-ocean-blue-dark font-bold text-xl">Content Loading Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pharaonic-container relative overflow-hidden on-light">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      <main className="relative z-10">
        {/* Unified Hero Section */}
        <UnifiedHero
          imageSrc={getContent('about_hero_image', '/images/about-hero.png') || '/images/Royal Cleopatra/DSC_8735.jpg'}
          title={getContent('about_hero_title') || 'About Our Egyptian Legacy'}
          subtitle={getContent('about_hero_subtitle') || "Discover the story behind Egypt's premier Dahabiya cruise experience, where ancient traditions meet modern luxury."}
          hieroglyphicTitle={false}
          showEgyptianElements={true}
          showRoyalCrown={true}
          showHieroglyphics={true}
          overlayOpacity="medium"
          textColor="dark"
          minHeight="80vh"
        />

        {/* Our Story Section */}
        <div className="py-20 bg-gradient-to-b from-blue-50/30 to-white on-light">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-ocean-blue mb-6 underline-accent">
                  {getContent('about_story_title') || 'Our Story'}
                </h2>
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Leadership Team Section */}
        <div className="py-20 bg-white on-light">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-ocean-blue mb-6 underline-accent">
                  {getContent('about_team_title') || 'Our Leadership Team'}
                </h2>
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Company Stats Section */}
        <div className="py-20 bg-gradient-to-b from-blue-50/30 to-white on-light">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="text-center p-6 hover:shadow-lg transition-all duration-300 border border-blue-100">
                    <CardContent>
                      <h3 className="text-xl font-bold text-ocean-blue mb-2">Item {i}</h3>
                      <p className="text-gray-600">Pharaonic stat item {i}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </div>

        {/* Contact Information Section */}
        <div className="py-20 bg-white on-light">
          <Container maxWidth="lg">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-ocean-blue mb-6 underline-accent">
                  {getContent('about_contact_title') || 'Get in Touch'}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-deep-blue mx-auto mb-8"></div>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  {getContent('about_contact_description') || 'Ready to embark on your Nile adventure? Contact our team to start planning your journey.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                  <CardContent>
                    <Phone className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ocean-blue mb-2">Phone</h3>
                    <p className="text-gray-700">
                      {getContent('about_contact_phone') || '+201001538358'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                  <CardContent>
                    <Mail className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ocean-blue mb-2">Email</h3>
                    <p className="text-gray-700">
                      {getContent('about_contact_email') || 'info@cleopatradahabiya.com'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                  <CardContent>
                    <MapPin className="w-12 h-12 text-ocean-blue mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ocean-blue mb-2">Address</h3>
                    <p className="text-gray-700">
                      {getContent('about_contact_address') || 'Luxor, Egypt'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </Container>
        </div>
      </main>
    </div>
  );
}