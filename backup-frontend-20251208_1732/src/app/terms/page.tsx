"use client";
export const dynamic = "force-dynamic";

import { Container, Typography, Box, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import {
  HieroglyphicText,
  EgyptianBorder,
  PharaohCard,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  RoyalCrown,
  HieroglyphicDivider,
} from '@/components/ui/pharaonic-elements';
import LogoLoader from '@/components/ui/LogoLoader';
import UnifiedHero from '@/components/ui/UnifiedHero';
import Image from 'next/image';
import { useContent } from '@/hooks/useContent';

// Component for image captions with random photographer names
interface ImageWithCaptionProps {
  src: string;
  alt: string;
  photographer: string;
  className?: string;
  width?: number;
  height?: number;
}

const ImageWithCaption = ({ src, alt, photographer, className = "", width = 800, height = 600 }: ImageWithCaptionProps) => {
  return (
    <div className={`relative group ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
        <p className="text-white text-sm opacity-80">
          Photo by {photographer}
        </p>
      </div>
    </div>
  );
};

export default function TermsPage() {
  const { getContent } = useContent({ page: 'terms' });
  const [termsContent, setTermsContent] = useState<{
    title: string;
    content: string;
    lastUpdated: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Random photographer names for different images
  const photographers = ["Ahmed Abdellah", "MUhammed moses", "Osama Saber"];

  useEffect(() => {
    const loadTermsContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings/terms', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load terms content');
        }

        const data = await response.json();
        setTermsContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load terms content');
        // Fallback to default content
        setTermsContent({
          title: 'Terms and Conditions',
          content: 'Terms and conditions content is being updated. Please check back soon.',
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    loadTermsContent();
  }, []);

  if (loading) {
    return <LogoLoader variant="elegant" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Unified Hero Section */}
      <UnifiedHero
        imageSrc={getContent('terms_hero_image', '/images/dahabiya-sunset.jpg')}
        title={termsContent?.title || getContent('terms_hero_title', 'Terms and Conditions')}
        subtitle={getContent('terms_hero_subtitle', '𓊪 Royal Covenant of Service 𓊪')}
        hieroglyphicTitle={true}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      />

      {/* Terms Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/30 relative">
        <Container maxWidth="md">
          <PharaohCard className="overflow-hidden">
            <div className="p-8 md:p-12">
              {termsContent?.lastUpdated && (
                <div className="text-center mb-8 text-ocean-blue">
                  <Typography variant="body2">
                    Last Updated: {new Date(termsContent.lastUpdated).toLocaleDateString()}
                  </Typography>
                </div>
              )}

              {/* Sample Images with Captions */}
              <div className="mb-12 space-y-8">
                <ImageWithCaption
                  src="/images/images/1.jpg"
                  alt="Luxurious dahabiya cruise on the Nile River"
                  photographer={photographers[0]}
                  className="mb-6"
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <ImageWithCaption
                    src="/images/images/old.jpg"
                    alt="Traditional Egyptian architecture along the Nile"
                    photographer={photographers[1]}
                    width={400}
                    height={300}
                  />
                  <ImageWithCaption
                    src="/images/images/placeholder.svg"
                    alt="Ancient Egyptian monuments and temples"
                    photographer={photographers[2]}
                    width={400}
                    height={300}
                  />
                </div>
              </div>

              <div className="prose prose-lg prose-blue max-w-none">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: termsContent?.content || 'Terms and conditions content is being updated. Please check back soon.'
                  }}
                />
              </div>
            </div>
          </PharaohCard>
        </Container>
      </section>
    </div>
  );
}