'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PharaonicDecoration } from './PharaonicDecoration';
import imageLoader from '../../utils/imageLoader';

interface LoadingPageProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function LoadingPage({ isLoading, onComplete }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Animate progress to 100%
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowContent(false);
              onComplete?.();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      // Loading animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLoading, onComplete]);

  if (!showContent) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-linear-to-br from-nile-blue via-pharaoh-gold/20 to-nile-blue flex items-center justify-center">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pharaoh-gold/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-nile-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        {/* Logo with Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-pharaoh-gold/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative animate-scale-in">
            <Image
              src="/icons/altavida-logo-1.svg"
              alt="AltaVida Tours Logo"
              width={200}
              height={200}
              loader={imageLoader}
              className="object-contain animate-float"
              priority
              onError={(e) => {
                console.error('altavida logo not found in /icons, using fallback');
                (e.target as HTMLImageElement).src = '/icons/altavida-logo-1.png';
              }}
            />
          </div>
        </div>

        {/* Pharaonic Text */}
        <div className="text-4xl md:text-6xl font-serif text-pharaoh-gold tracking-wider animate-fade-in">
          𓎼𓇌𓊪𓏏 𓏏𓅲𓂋𓋴
        </div>
        <div className="text-lg md:text-xl text-white/80 font-light animate-fade-in" style={{ animationDelay: '0.3s' }}>
          AltaVida Tours
        </div>

        {/* Pharaonic Decorations */}
        <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <PharaonicDecoration variant="section" size="md" />
        </div>

        {/* Progress Bar */}
        <div className="w-64 md:w-80 h-1 bg-white/20 rounded-full overflow-hidden mt-8">
          <div
            className="h-full bg-linear-to-r from-pharaoh-gold to-nile-blue transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading Text */}
        <div className="text-white/60 text-sm animate-pulse">
          {isLoading ? 'Loading...' : 'Almost ready...'}
        </div>
      </div>
    </div>
  );
}



