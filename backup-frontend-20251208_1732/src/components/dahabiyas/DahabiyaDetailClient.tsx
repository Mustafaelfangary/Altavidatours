'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the DahabiyaDetail component
const DahabiyaDetail = dynamic(
  () => import('@/components/dahabiyas/DahabiyaDetail'),
  { 
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

interface DahabiyaData {
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
  gallery: Array<{ id: string; url: string; alt?: string }>;
  videoUrl?: string;
  virtualTourUrl?: string;
  features: string[];
  amenities?: string[];
  activities?: string[];
  diningOptions?: string[];
  services?: string[];
  routes?: string[];
  highlights?: string[];
  category?: 'LUXURY' | 'PREMIUM';
  rating?: number;
  reviewCount?: number;
  itineraries?: Array<{
    id: string;
    day: number;
    title: string;
    description: string;
    activities: Array<{
      id: string;
      description: string;
      time?: string;
    }>;
  }>;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    content: string;
    date: string;
    isApproved?: boolean;
  }>;
  isFeatured?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DahabiyaDetailClientProps {
  dahabiya: DahabiyaData;
}

export default function DahabiyaDetailClient({ dahabiya }: DahabiyaDetailClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Ensure all required fields have default values
  const dahabiyaWithDefaults = {
    ...dahabiya,
    gallery: dahabiya.gallery || [],
    features: dahabiya.features || [],
    amenities: dahabiya.amenities || [],
    itineraries: dahabiya.itineraries || [],
    reviews: dahabiya.reviews || []
  };

  return <DahabiyaDetail dahabiya={dahabiyaWithDefaults} />;
}
