'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewDetailsButton } from '@/components/ui/ViewDetailsButton';

interface AttractionCardProps {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  description: string;
  duration?: string;
  className?: string;
}

export function AttractionCard({
  id,
  name,
  category,
  location,
  image,
  description,
  duration,
  className
}: AttractionCardProps) {
  return (
    <div className={cn(
      'group card-travelok h-full cursor-pointer',
      className
    )}>
      <Link href={`/attractions/${id}`} className="block h-full">
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-travelok-blue text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-travelok-blue-dark mb-2 group-hover:text-travelok-blue transition-colors">
            {name}
          </h3>

          {/* Location & Duration */}
          <div className="flex flex-wrap gap-3 mb-3 text-sm text-travelok-gray">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-travelok-gray line-clamp-3 mb-4">
            {description}
          </p>

          {/* View Details Button */}
          <ViewDetailsButton 
            href={`/attractions/${id}`}
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
          />
        </div>
      </Link>
    </div>
  );
}

export default AttractionCard;