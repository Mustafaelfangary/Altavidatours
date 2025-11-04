import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import type { PackageData } from '@/types/package.types';
import dynamic from 'next/dynamic';

// Dynamically import the PackageDetail component to avoid SSR issues
const PackageDetail = dynamic<{ pkg: PackageData }>(
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

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const revalidate = 3600; // Revalidate every hour

export default async function PackageDetailPage({ params }: PageProps) {
  try {
    // Fetch package data from the database
    const pkg = await prisma.package.findUnique({
      where: { slug: params.slug },
    });

    if (!pkg) {
      return notFound();
    }

    // Transform the data to match the PackageData type
    const rawItinerary = Array.isArray(pkg.itinerary) ? (pkg.itinerary as any[]) : [];
    const itineraryDays = rawItinerary.map((day: any, index: number) => ({
      id: `day-${pkg.id}-${index + 1}`,
      day: Number(day?.dayNumber ?? index + 1),
      title: day?.title || `Day ${Number(day?.dayNumber ?? index + 1)}`,
      description: day?.description || '',
      isActive: true,
      activities: Array.isArray(day?.activities)
        ? day.activities.map((a: any, i: number) => ({
            id: `act-${pkg.id}-${index}-${i}`,
            description: typeof a === 'string' ? a : (a?.description || 'Activity'),
            time: typeof a === 'string' ? 'TBD' : (a?.time || 'TBD'),
            order: i,
          }))
        : [],
    }));

    const packageData: PackageData = {
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      shortDescription: pkg.shortDescription || null,
      price: pkg.price ? Number(pkg.price) : 0,
      duration: pkg.duration || 0,
      durationDays: pkg.duration || 0,
      maxPeople: pkg.maxGroupSize || 0,
      mainImageUrl: pkg.mainImage || '/images/default-package.jpg',
      isFeaturedOnHomepage: false,
      homepageOrder: 0,
      images: Array.isArray(pkg.images) ? pkg.images.map((url, index) => ({
        id: `img-${pkg.id}-${index}`,
        url: url,
        alt: `${pkg.name} - Image ${index + 1}`,
        order: index,
        isActive: true
      })) : [],
      itineraries: itineraryDays,
      reviews: [],
      highlights: [],
      inclusions: [],
      exclusions: [],
      category: 'STANDARD',
      rating: 0,
      reviewCount: 0,
      createdAt: pkg.createdAt || new Date(),
      updatedAt: pkg.updatedAt || new Date()
    };

    return <PackageDetail pkg={packageData} />;
  } catch (error) {
    console.error('Error fetching package:', error);
    return notFound();
  }
}

export async function generateStaticParams() {
  try {
    const packages = await prisma.package.findMany({
      select: {
        slug: true
      },
      take: 100 // Limit to 100 packages to avoid timeout during build
    });

    return packages.map((pkg) => ({
      slug: pkg.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<{
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
}> {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slug: params.slug },
      select: {
        name: true,
        shortDescription: true,
        mainImage: true
      }
    });

    if (!pkg) {
      return {
        title: 'Package Not Found',
        description: 'The requested package could not be found.'
      };
    }

    return {
      title: pkg.name,
      description: pkg.shortDescription || '',
      openGraph: {
        title: pkg.name,
        description: pkg.shortDescription || '',
        images: [
          {
            url: pkg.mainImage || '/images/default-package.jpg',
            width: 1200,
            height: 630,
            alt: pkg.name
          }
        ]
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Package Details',
      description: 'View package details'
    };
  }
}