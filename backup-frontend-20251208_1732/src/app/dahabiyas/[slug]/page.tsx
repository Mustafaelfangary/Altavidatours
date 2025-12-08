import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import DahabiyaDetailWrapper from '@/components/dahabiyas/DahabiyaDetailWrapper';

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: Array<{
    id: string;
    description: string;
    time: string;
  }>;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  isApproved: boolean;
}

async function getDahabiyaData(slug: string) {
  const dahabiya = await prisma.dahabiya.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });

  if (!dahabiya) return null;

  // Transform the data to match the expected format
  return {
    id: dahabiya.id,
    name: dahabiya.name,
    slug: dahabiya.slug || slug,
    description: dahabiya.description || '',
    shortDescription: dahabiya.summary || '',
    pricePerDay: 0,
    capacity: dahabiya.capacity || 0,
    cabins: dahabiya.cabins || 0,
    crew: dahabiya.crew || 0,
    length: dahabiya.length || 0,
    width: 0,
    yearBuilt: 0,
    mainImage: dahabiya.imageCover || '/images/default-dahabiya.jpg',
    gallery: Array.isArray(dahabiya.images) ? dahabiya.images.map((url, index) => ({
      id: `img-${dahabiya.id}-${index}`,
      url,
      alt: `${dahabiya.name} - Image ${index + 1}`
    })) : [],
    features: [
      'Private balconies in all cabins',
      'Air conditioning',
      'En-suite bathrooms',
      'Panoramic windows',
      'Luxury linens',
      '24/7 room service'
    ],
    amenities: [
      'Sun deck with loungers',
      'Jacuzzi',
      'Bar',
      'Restaurant',
      'WiFi',
      'TV in cabins'
    ],
    activities: [
      'Guided tours',
      'Nile swimming',
      'Sunset felucca rides',
      'Cultural performances',
      'Cooking classes'
    ],
    diningOptions: [
      'Gourmet international cuisine',
      'Traditional Egyptian dishes',
      'Vegetarian/vegan options',
      '24-hour room service',
      'Private dining available'
    ],
    services: [
      'Private butler',
      'Laundry service',
      'Airport transfers',
      'Guided excursions',
      'Massage and spa services'
    ],
    routes: [
      'Luxor to Aswan (5 days/4 nights)',
      'Aswan to Luxor (4 days/3 nights)',
      'Extended Nile cruise (8 days/7 nights)'
    ],
    highlights: [
      'Luxury accommodation with private balconies',
      'Gourmet dining with local and international cuisine',
      'Personalized butler service',
      'Small group experience (max 12 guests)',
      'Expert Egyptologist guide',
      'All-inclusive experience'
    ],
    category: 'LUXURY' as const,
    rating: 4.8,
    reviewCount: 42,
    itineraries: [],
    reviews: [
      {
        id: '1',
        author: 'John D.',
        rating: 5,
        content: 'An unforgettable experience! The Royal Cleopatra exceeded all our expectations. The crew was exceptional, the food was delicious, and the cabins were incredibly comfortable.',
        date: '2023-10-15',
        isApproved: true
      },
      {
        id: '2',
        author: 'Sarah M.',
        rating: 4,
        content: 'Beautiful dahabiya with excellent service. The private balcony was the highlight of our trip. Would definitely recommend!',
        date: '2023-09-28',
        isApproved: true
      }
    ],
    isFeatured: true,
    isActive: true,
    videoUrl: 'https://www.youtube.com/watch?v=example',
    virtualTourUrl: 'https://example.com/virtual-tour',
    createdAt: dahabiya.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: dahabiya.updatedAt?.toISOString() || new Date().toISOString()
  };
}

export default async function DahabiyaPage({ params }: { params: { slug: string } }) {
  const dahabiyaData = await getDahabiyaData(params.slug);
  
  if (!dahabiyaData) {
    return notFound();
  }

  return <DahabiyaDetailWrapper dahabiya={dahabiyaData} />;
}

// Generate static params for all dahabiya slugs
export async function generateStaticParams() {
  try {
    const dahabiyas = await prisma.dahabiya.findMany({
      select: { slug: true },
      take: 100
    });

    return dahabiyas.map((dahabiya) => ({
      slug: dahabiya.slug
    }));
  } catch (error) {
    console.error('Error generating static params for dahabiyas:', error);
    return [];
  }
}
