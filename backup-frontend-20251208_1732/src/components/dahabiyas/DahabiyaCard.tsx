"use client";

import React, { useState } from 'react';
import UnifiedCard from '@/components/ui/UnifiedCard';
import QuickBookingWidget from '@/components/booking/QuickBookingWidget';

interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  cabins?: number;
  crew?: number;
  length?: number;
  width?: number;
  yearBuilt?: number;
  mainImage?: string;
  gallery: string[];
  videoUrl?: string;
  features: string[];
  amenities: string[];
  activities: string[];
  diningOptions: string[];
  routes: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  category: 'LUXURY' | 'PREMIUM';
}

interface DahabiyaCardProps {
  dahabiya: Dahabiya;
}

export default function DahabiyaCard({ dahabiya }: DahabiyaCardProps) {
  const [showQuickBooking, setShowQuickBooking] = useState(false);

  return (
    <>
      <UnifiedCard
        type="dahabiya"
        category={dahabiya.category}
        title={dahabiya.name}
        description={dahabiya.description}
        shortDescription={dahabiya.shortDescription}
        imageUrl={dahabiya.mainImage || '/images/placeholder-dahabiya.jpg'}
        href={`/dahabiyas/${dahabiya.slug || dahabiya.id}`}
        metadata={{
          price: dahabiya.pricePerDay,
          capacity: dahabiya.capacity,
          rating: dahabiya.rating,
          reviewCount: dahabiya.reviewCount,
          featured: dahabiya.isFeatured,
          location: "Nile River, Egypt"
        }}
        primaryButton={{
          text: "Book Now",
          href: `/booking?dahabiya=${dahabiya.slug || dahabiya.id}`,
          icon: "𓁍𓁎"
        }}
        secondaryButton={{
          text: "View Details",
          href: `/dahabiyas/${dahabiya.slug}`,
          icon: "𓁍"
        }}
      />

      {/* Quick Booking Widget */}
      <QuickBookingWidget
        dahabiya={dahabiya}
        open={showQuickBooking}
        onClose={() => setShowQuickBooking(false)}
      />
    </>
  );
}
