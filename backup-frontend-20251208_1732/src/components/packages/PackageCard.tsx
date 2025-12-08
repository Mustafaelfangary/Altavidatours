"use client";

import React from 'react';
import UnifiedCard from '@/components/ui/UnifiedCard';

interface Package {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  isFeaturedOnHomepage?: boolean;
  homepageOrder?: number;
}

interface PackageCardProps {
  package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <UnifiedCard
      type="package"
      title={pkg.name}
      description={pkg.description}
      shortDescription={pkg.shortDescription}
      imageUrl={pkg.mainImageUrl || '/images/package-placeholder.jpg'}
      href={`/packages/${pkg.slug || pkg.id}`}
      metadata={{
        price: pkg.price,
        duration: pkg.durationDays,
        featured: pkg.isFeaturedOnHomepage,
        location: "Egypt"
      }}
      primaryButton={{
        text: "Book Now",
        href: `/booking?package=${pkg.slug || pkg.id}`,
        icon: "\ud80f"
      }}
      secondaryButton={{
        text: "View Details",
        href: `/packages/${pkg.slug || pkg.id}`,
        icon: "\ud80b"
      }}
    />
  );
}
