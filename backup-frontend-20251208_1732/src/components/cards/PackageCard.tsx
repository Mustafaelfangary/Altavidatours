'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackageCardProps {
  id: string;
  title: string;
  duration: string;
  image: string;
  price: {
    from: number;
    currency: string;
  };
  destinations: string[];
  type: string;
  className?: string;
}

export function PackageCard({
  id,
  title,
  duration,
  image,
  price,
  destinations,
  type,
  className
}: PackageCardProps) {
  return (
    <Link href={`/packages/${id}`}>
      <div className={cn(
        'group card-travelok h-full cursor-pointer',
        className
      )}>
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Type Badge */}
          <div className="absolute top-4 right-4 bg-travelok-orange text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {type}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-travelok-blue-dark mb-3 group-hover:text-travelok-blue transition-colors">
            {title}
          </h3>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-travelok-gray">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{destinations.slice(0, 2).join(', ')}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-travelok-gray">From</p>
              <p className="text-2xl font-bold text-travelok-blue">
                {price.currency === 'USD' ? '$' : price.currency === 'EUR' ? '€' : '£'}
                {price.from}
              </p>
            </div>
            <div className="flex items-center gap-1 text-travelok-orange">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PackageCard;