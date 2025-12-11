"use client";

import Image from 'next/image';
import { MapPin, Users, TrendingUp, Star } from 'lucide-react';

interface DestinationDetailHeroProps {
  name: string;
  imageCover: string | null;
  region?: string | null;
  country?: string;
  highlights?: string[];
}

export default function DestinationDetailHero({
  name,
  imageCover,
  region,
  country = 'Egypt',
  highlights = [],
}: DestinationDetailHeroProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-[500px] md:h-[600px] w-full">
        <Image
          src={imageCover || '/placeholder.jpg'}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70" />

        {/* Country Badge */}
        <div className="absolute top-8 left-8">
          <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            {country}
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif drop-shadow-2xl leading-tight">
              {name}
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5 text-amber-300" />
                <span className="text-white font-medium">{country}</span>
                {region && (
                  <>
                    <span className="text-amber-300">•</span>
                    <span className="text-white font-medium">{region}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-amber-300" />
                <span className="text-white font-medium">Premium Destination</span>
              </div>
            </div>

            {/* Highlights Preview */}
            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {highlights.slice(0, 3).map((highlight, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-400/20 backdrop-blur-sm border border-amber-300/50 text-amber-100 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    ✨ {highlight}
                  </div>
                ))}
                {highlights.length > 3 && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                    +{highlights.length - 3} more highlights
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


