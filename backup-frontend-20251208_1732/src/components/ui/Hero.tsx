'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
  height?: 'small' | 'medium' | 'large' | 'full';
  overlay?: 'light' | 'medium' | 'dark';
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
  height = 'large',
  overlay = 'medium',
  alignment = 'center',
  className
}: HeroProps) {
  const heightClasses = {
    small: 'min-h-[40vh]',
    medium: 'min-h-[60vh]',
    large: 'min-h-[70vh] md:min-h-[80vh]',
    full: 'min-h-screen'
  };

  const overlayClasses = {
    light: 'bg-gradient-to-b from-black/30 via-black/20 to-black/40',
    medium: 'bg-gradient-to-b from-black/50 via-black/40 to-black/60',
    dark: 'bg-gradient-to-b from-black/70 via-black/60 to-black/80'
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <section className={cn('relative overflow-hidden', heightClasses[height], className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Overlay */}
      <div className={cn('absolute inset-0', overlayClasses[overlay])} />

      {/* Content */}
      <div className="relative z-10 flex h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className={cn('max-w-4xl mx-auto w-full flex flex-col', alignmentClasses[alignment])}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 md:mb-8 max-w-2xl drop-shadow-lg">
                {subtitle}
              </p>
            )}

            {ctaText && ctaLink && (
              <div className="flex gap-4">
                <Link href={ctaLink}>
                  <Button
                    size="lg"
                    variant="primary"
                    className="px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    {ctaText}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;