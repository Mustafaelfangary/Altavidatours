'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MuseumCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  image: string;
  description: string;
  openingHours?: string;
  className?: string;
}

export function MuseumCard({
  id,
  name,
  type,
  location,
  image,
  description,
  openingHours,
  className
}: MuseumCardProps) {
  return (
    <Link href={`/museums/${id}`}>
      <div className={cn(
        'group card-travelok h-full cursor-pointer',
        className
      )}>
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Type Badge */}
          <div className="absolute top-4 left-4 bg-travelok-green text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {type}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-travelok-blue-dark mb-2 group-hover:text-travelok-blue transition-colors">
            {name}
          </h3>

          {/* Location & Hours */}
          <div className="flex flex-wrap gap-3 mb-3 text-sm text-travelok-gray">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            {openingHours && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{openingHours}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-travelok-gray line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default MuseumCard;