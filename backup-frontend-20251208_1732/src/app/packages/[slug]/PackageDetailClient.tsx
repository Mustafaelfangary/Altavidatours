'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Decimal } from '@prisma/client/runtime/library';

// Import the PackageDetail component's prop types
import type { PackageDetailProps } from '@/components/package/PackageDetail';

// Dynamically import the PackageDetail component to avoid SSR issues
const PackageDetail = dynamic<PackageDetailProps>(
  () => import('@/components/package/PackageDetail').then((mod) => mod.PackageDetail),
  { 
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function PackageDetailClient({ pkg }: { pkg: PackageDetailProps['pkg'] }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure all required fields have proper defaults
  const formattedPkg: PackageDetailProps['pkg'] = {
    ...pkg,
    // Ensure price is a number or Decimal
    price: pkg.price instanceof Decimal ? Number(pkg.price) : pkg.price,
    // Ensure reviews have proper dates
    reviews: pkg.reviews.map(review => ({
      ...review,
      createdAt: typeof review.createdAt === 'string' ? new Date(review.createdAt) : review.createdAt,
      isApproved: review.isApproved ?? true // Default to true if not specified
    })),
    // Ensure dates are Date objects
    createdAt: typeof pkg.createdAt === 'string' ? new Date(pkg.createdAt) : pkg.createdAt,
    updatedAt: typeof pkg.updatedAt === 'string' ? new Date(pkg.updatedAt) : pkg.updatedAt,
    // Ensure arrays are not null/undefined
    images: pkg.images || [],
    itineraries: pkg.itineraries || [],
    highlights: pkg.highlights || [],
    inclusions: pkg.inclusions || [],
    exclusions: pkg.exclusions || [],
    // Ensure numeric fields have defaults
    rating: pkg.rating ?? 0,
    reviewCount: pkg.reviewCount ?? 0,
    duration: pkg.duration || 1,
    durationDays: pkg.durationDays || pkg.duration || 1,
    maxPeople: pkg.maxPeople || 1,
    // Ensure required strings have defaults
    shortDescription: pkg.shortDescription || pkg.description.substring(0, 100) + '...',
    // Ensure boolean fields have defaults
    isFeaturedOnHomepage: pkg.isFeaturedOnHomepage ?? false,
    // Ensure numeric fields have defaults
    homepageOrder: pkg.homepageOrder ?? 0
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <PackageDetail pkg={formattedPkg} />;
}
