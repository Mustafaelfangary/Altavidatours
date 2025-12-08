"use client";

import UnifiedHero from '@/components/ui/UnifiedHero';
import { Container } from '@mui/material';

export default function UnifiedHeroPreviewPage() {
  return (
    <div className="min-h-screen">
      {/* Example 1: Video Hero (Homepage Style) */}
      <UnifiedHero
        videoSrc="/videos/home_hero_video.mp4"
        posterSrc="/images/hero-video-poster.jpg"
        title="Experience the Magic of the Nile"
        subtitle="Luxury Dahabiya Cruises Through Ancient Egypt"
        hieroglyphicTitle={true}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="100vh"
      >
        {/* Custom CTA Content */}
        <div className="mt-8">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg hover:from-blue-700 hover:to-blue-800 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
            <span className="mr-2">𓊪</span>
            Explore Fleet
            <span className="ml-2">𓊪</span>
          </button>
        </div>
      </UnifiedHero>

      {/* Example 2: Image Hero (About Style) */}
      <UnifiedHero
        imageSrc="/images/about-hero.png"
        title="About Our Egyptian Legacy"
        subtitle="Discover the story behind Egypt's premier Dahabiya cruise experience, where ancient traditions meet modern luxury."
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      />

      {/* Example 3: Contact Hero with Custom Elements */}
      <UnifiedHero
        videoSrc="/videos/contact-hero.mp4"
        posterSrc="/images/hero-bg.jpg"
        title="Contact Our Egypt Experts"
        subtitle="Ready to embark on your Egyptian adventure? Our expert team is here to help you plan the perfect Nile cruise experience."
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        {/* Custom hieroglyphic decorations */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-amber-400 text-3xl drop-shadow-lg">𓈖</span>
          <span className="text-blue-300 text-3xl drop-shadow-lg">𓂀</span>
          <span className="text-amber-400 text-3xl drop-shadow-lg">𓏏</span>
          <span className="text-blue-300 text-3xl drop-shadow-lg">𓇯</span>
          <span className="text-amber-400 text-3xl drop-shadow-lg">𓊃</span>
        </div>
      </UnifiedHero>

      {/* Documentation Section */}
      <div className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <Container maxWidth="md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Unified Hero Design System
          </h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Theatre Mode Video Hero</h3>
              <p className="text-gray-600 mb-4">
                The homepage uses the theatre mode video hero with full viewport width, 
                hieroglyphic side panels, and Egyptian decorative elements.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Full viewport width like YouTube theatre mode</li>
                <li>Animated hieroglyphic side panels</li>
                <li>Video loading states with logo animation</li>
                <li>Fallback to poster image on video error</li>
                <li>Egyptian pattern overlays</li>
                <li>Consistent pale blue overlay system</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Unified Hero Features</h3>
              <p className="text-gray-600 mb-4">
                All pages now use the same hero design system with consistent 
                Egyptian theming and theatre mode functionality.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Consistent overlay opacity options (light, medium, heavy)</li>
                <li>Royal crown and hieroglyphic decorations</li>
                <li>Responsive text sizing and layout</li>
                <li>Customizable content areas for page-specific elements</li>
                <li>Unified Egyptian pattern background</li>
                <li>Theatre mode video support with fallbacks</li>
                <li>Dark and light text color options</li>
                <li>Configurable Egyptian elements display</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Pages Updated</h3>
              <p className="text-gray-600 mb-4">
                The following pages have been updated to use the unified hero design:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <ul className="list-disc list-inside space-y-1">
                  <li>Homepage (Theatre Mode Video)</li>
                  <li>About Page</li>
                  <li>Contact Page</li>
                  <li>Terms Page</li>
                  <li>Privacy Page</li>
                  <li>Gallery Page</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li>Dahabiyas Page</li>
                  <li>Blogs Page</li>
                  <li>FAQ Page</li>
                  <li>Reviews Page</li>
                  <li>Packages Pages</li>
                  <li>Itineraries Pages</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}