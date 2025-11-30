"use client";

import { Container, Typography, Box, Paper } from '@mui/material';
import { useContent } from '@/hooks/useContent';
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

export default function PrivacyPage() {
  const { getContent } = useContent({ page: 'privacy' });
  const [privacyContent, setPrivacyContent] = useState<{
    title: string;
    content: string;
    lastUpdated: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrivacyContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings/privacy', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load privacy content');
        }

        const data = await response.json();
        setPrivacyContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load privacy content');
        // Fallback to default content
        setPrivacyContent({
          title: 'Privacy Policy',
          content: 'Privacy policy content is being updated. Please check back soon.',
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    loadPrivacyContent();
  }, []);

  if (loading) {
    return <LogoLoader variant="elegant" />;
  }
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Unified Hero Section */}
      <UnifiedHero
        imageSrc={getContent('privacy_hero_image', '/images/privacy-hero-bg.jpg')}
        title={privacyContent?.title || getContent('privacy_hero_title', 'Privacy Policy')}
        subtitle={getContent('privacy_hero_subtitle', '𓊪 Royal Decree of Privacy Protection 𓊪')}
        hieroglyphicTitle={true}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      />

      {/* Privacy Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-deep-blue-50/30 relative">
        <Container maxWidth="md">
          <PharaohCard className="overflow-hidden">
            <div className="p-8 md:p-12">
              {privacyContent?.lastUpdated && (
                <div className="text-center mb-8 text-amber-600">
                  <Typography variant="body2">
                    Last Updated: {new Date(privacyContent.lastUpdated).toLocaleDateString()}
                  </Typography>
                </div>
              )}

              <div className="prose prose-lg prose-amber max-w-none">
                <div
                  className="text-amber-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: privacyContent?.content || 'Privacy policy content is being updated. Please check back soon.'
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