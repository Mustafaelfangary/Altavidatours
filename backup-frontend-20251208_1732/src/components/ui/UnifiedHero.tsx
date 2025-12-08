"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import Image from 'next/image';
import OptimizedHeroVideo from '@/components/OptimizedHeroVideo';

interface UnifiedHeroProps {
  // Media props
  videoSrc?: string;
  posterSrc?: string;
  imageSrc?: string;
  
  // Content props
  title: string;
  subtitle?: string;
  // Styling props (deprecated - kept for compatibility)
  hieroglyphicTitle?: boolean;
  showEgyptianElements?: boolean;
  showRoyalCrown?: boolean;
  showHieroglyphics?: boolean;
  overlayOpacity?: 'light' | 'medium' | 'heavy';
  textColor?: 'dark' | 'light';
  // Media display behavior
  mediaFit?: 'contain' | 'cover';
  
  // Layout props
  minHeight?: string;
  className?: string;
  
  // Children for custom content
  children?: React.ReactNode;
}

export default function UnifiedHero({
  videoSrc,
  posterSrc,
  imageSrc,
  title,
  subtitle,
  hieroglyphicTitle,
  showEgyptianElements = false,
  showRoyalCrown = false,
  showHieroglyphics = false,
  overlayOpacity = 'medium',
  textColor = 'light',
  mediaFit = 'contain',
  minHeight = '80vh',
  className = '',
  children
}: UnifiedHeroProps) {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const imageFitClass = mediaFit === 'cover' ? 'object-cover' : 'object-contain';

  // Determine overlay classes based on opacity
  const getOverlayClass = () => {
    switch (overlayOpacity) {
      case 'light':
        return 'hero-overlay-light';
      case 'heavy':
        return 'hero-overlay-heavy';
      default:
        return 'hero-overlay-pale';
    }
  };

  // Determine text color classes
  const getTextColorClass = () => {
    return textColor === 'light' ? 'text-white' : 'text-gray-900';
  };

  return (
    <section 
      className={`hero-section ${className}`} 
      style={{ 
        marginTop: '-80px',
        minHeight 
      }}
    >
      {/* Egyptian Pattern Background - Removed */}

      {/* Media Background - Theatre Mode */}
      <div className="absolute inset-0">
        {/* Video Background */}
        {videoSrc && !videoError && (
          <OptimizedHeroVideo
            src={videoSrc}
            poster={posterSrc}
            className="absolute inset-0 w-full h-full z-10"
            onLoad={() => {
              setVideoError(false);
              setVideoLoaded(true);
            }}
            onError={() => {
              setVideoError(true);
              setVideoLoaded(false);
            }}
          />
        )}

        {/* Fallback Image Background */}
        {(imageSrc || (videoError && posterSrc)) && (
          <div className="absolute inset-0 z-5 bg-[#e6f0ff]">
            <Image
              src={imageSrc || posterSrc || '/images/hero-bg.jpg'}
              alt={title}
              fill
              className={`${imageFitClass}`}
              priority
            />
          </div>
        )}

        {/* Fallback gradient when video fails */}
        {videoError && !imageSrc && !posterSrc && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/70 via-blue-100/50 to-blue-200/80 z-5"></div>
        )}

        {/* Video Loading Overlay - Removed for cleaner experience */}
      </div>

      {/* Unified Overlays */}
      <div className={getOverlayClass()}></div>
      <div className="hero-pattern"></div>

      {/* Loading indicator - Removed */}

      {/* Hero Content */}
      <div className="relative z-30 h-full flex items-center justify-center">
        <Container maxWidth="xl" className="hero-container">
          <div className={`text-center ${getTextColorClass()}`}>
            {/* Main Title - Simplified */}
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 ${getTextColorClass()} hero-title force-white drop-shadow-2xl`}
              style={{ color: '#ffffff' }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className={`text-lg md:text-xl lg:text-2xl mb-12 max-w-5xl mx-auto leading-relaxed ${textColor === 'light' ? 'text-gray-200' : 'text-gray-700'} font-light drop-shadow-lg`}>
                {subtitle}
              </p>
            )}

            {/* Custom Children Content */}
            {children}
          </div>
        </Container>
      </div>
    </section>
  );
}