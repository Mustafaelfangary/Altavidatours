'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTABandProps {
  title: string;
  description?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  variant?: 'blue' | 'orange' | 'gradient';
  className?: string;
}

export function CTABand({
  title,
  description,
  ctaText,
  ctaLink,
  backgroundImage,
  variant = 'gradient',
  className
}: CTABandProps) {
  const variantClasses = {
    blue: 'bg-gradient-to-r from-travelok-blue to-travelok-blue-light',
    orange: 'bg-gradient-to-r from-travelok-orange to-travelok-orange-light',
    gradient: 'bg-gradient-to-r from-travelok-blue via-travelok-blue-light to-travelok-orange'
  };

  return (
    <section className={cn('relative py-16 md:py-20 overflow-hidden', className)}>
      {/* Background */}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover"
              quality={80}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
        </>
      ) : (
        <div className={cn('absolute inset-0', variantClasses[variant])} />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            {title}
          </h2>
          
          {description && (
            <p className="text-lg sm:text-xl text-white/95 mb-6 md:mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          <Link href={ctaLink}>
            <Button
              size="lg"
              className="bg-white text-travelok-blue hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTABand;