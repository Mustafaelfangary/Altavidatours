"use client";

import Image from 'next/image';
import { MapPin, Users, Clock, Tag, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface PackageHeroProps {
  name: string;
  mainImage: string | null;
  price: number;
  discountPrice?: number | null;
  destination: string;
  duration: number;
  maxGroupSize?: number | null;
  category?: string | null;
}

export default function PackageDetailHero({
  name,
  mainImage,
  price,
  discountPrice,
  destination,
  duration,
  maxGroupSize,
  category,
}: PackageHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-[500px] md:h-[600px] w-full">
        <Image
          src={mainImage || '/placeholder.jpg'}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70" />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-8 right-8 bg-red-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg animate-pulse">
            <div className="text-center">
              <p className="text-sm font-bold">SAVE</p>
              <p className="text-2xl font-bold">{discount}%</p>
            </div>
          </div>
        )}

        {/* Category Tag */}
        {category && (
          <div className="absolute top-8 left-8">
            <div className="bg-amber-400 text-gray-900 px-4 py-2 rounded-full font-semibold text-sm uppercase tracking-wide shadow-lg">
              {category}
            </div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif drop-shadow-2xl leading-tight">
              {name}
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 md:gap-8 mb-6">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5 text-amber-300" />
                <span className="text-white font-medium">{destination}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-amber-300" />
                <span className="text-white font-medium">{duration} Days</span>
              </div>
              {maxGroupSize && (
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Users className="w-5 h-5 text-amber-300" />
                  <span className="text-white font-medium">Max {maxGroupSize} Guests</span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="flex items-end gap-4">
              <div className="flex items-baseline gap-3">
                {discountPrice && (
                  <span className="text-3xl md:text-4xl font-bold text-white font-serif drop-shadow-lg">
                    ${discountPrice.toLocaleString()}
                  </span>
                )}
                <span
                  className={`font-bold drop-shadow-lg ${
                    discountPrice ? 'text-xl line-through text-gray-300' : 'text-3xl md:text-4xl text-white'
                  }`}
                >
                  ${price.toLocaleString()}
                </span>
              </div>
              {discountPrice && (
                <span className="text-sm text-amber-300 font-semibold mb-1">Per Person</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white opacity-75" />
      </div>
    </div>
  );
}


