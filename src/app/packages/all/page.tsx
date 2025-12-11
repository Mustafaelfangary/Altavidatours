'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, Calendar, MapPin, Ship, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import imageLoader from '../../../utils/imageLoader';

interface Package {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  category?: string;
  cairoNights?: number;
  dahabiyaNights?: number;
  maxGuests?: number;
  highlights?: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export default function AllPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        const data = await response.json();
        setPackages(data.filter((pkg: Package) => pkg.isActive));
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Packages</h1>
        <p className="text-muted-foreground">Explore our complete collection of travel packages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden">
            {pkg.mainImageUrl && (
              <div className="relative h-48">
                <Image
                  loader={imageLoader}
                  src={pkg.mainImageUrl}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
                {pkg.isFeatured && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{pkg.name}</CardTitle>
              {pkg.category && (
                <Badge variant="outline" className="w-fit">
                  {pkg.category}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {pkg.shortDescription || pkg.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {pkg.durationDays} days
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Up to {pkg.maxGuests || 12} guests
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">${pkg.price}</div>
                <Link href={`/packages/${pkg.slug}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No packages available</h3>
          <p className="text-muted-foreground">Check back soon for new packages!</p>
        </div>
      )}
    </div>
  );
}


