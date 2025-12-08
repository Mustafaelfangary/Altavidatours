import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Default tours for fallback (when database is empty)
const defaultTours: Record<string, any> = {
  'pyramids-giza-sphinx': {
    id: 'pyramids-giza-sphinx',
    slug: 'pyramids-giza-sphinx',
    name: 'Pyramids of Giza & Sphinx Tour',
    shortDescription: 'Discover the iconic Pyramids of Giza and the Great Sphinx, one of the Seven Wonders of the Ancient World.',
    description: 'Experience the grandeur of ancient Egypt with a comprehensive tour of the Pyramids of Giza, including the Great Pyramid of Khufu, Pyramid of Khafre, Pyramid of Menkaure, and the enigmatic Sphinx. Your expert guide will share fascinating stories about these architectural marvels and their historical significance.',
    pricePerDay: 75,
    capacity: 15,
    features: ['Professional Egyptologist Guide', 'Entrance Fees Included', 'Camel Ride Experience', 'Hotel Pickup & Drop-off', 'Lunch at Local Restaurant'],
    highlights: ['Great Pyramid of Khufu', 'The Sphinx', 'Panoramic Views', 'Camel Ride'],
    inclusions: ['Entrance fees', 'Professional guide', 'Lunch', 'Transportation', 'Bottled water'],
    exclusions: ['Personal expenses', 'Tips', 'Optional activities'],
    rating: 4.8,
    type: 'STANDARD',
    category: 'DELUXE',
    duration: 'Full Day',
    location: 'Giza, Egypt',
    mainImageUrl: '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg',
    images: [
      { url: '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg', alt: 'Pyramids of Giza' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.18.jpeg', alt: 'Great Sphinx' },
    ]
  },
  'grand-egyptian-museum': {
    id: 'grand-egyptian-museum',
    slug: 'grand-egyptian-museum',
    name: 'Grand Egyptian Museum Tour',
    shortDescription: 'Explore the world\'s largest archaeological museum dedicated to a single civilization.',
    description: 'Visit the magnificent Grand Egyptian Museum, home to over 100,000 artifacts including the complete Tutankhamun collection.',
    pricePerDay: 85,
    capacity: 20,
    features: ['Skip-the-Line Tickets', 'Expert Museum Guide', 'Audio Guide Available', 'Hotel Transfer'],
    highlights: ['Tutankhamun Collection', 'Ancient Artifacts', 'Interactive Exhibits'],
    inclusions: ['Museum entry', 'Guide', 'Transportation'],
    exclusions: ['Personal expenses', 'Tips'],
    rating: 4.9,
    type: 'PREMIUM',
    category: 'LUXURY',
    duration: '4-5 hours',
    location: 'Giza, Egypt',
    mainImageUrl: '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg',
    images: []
  },
  'coptic-cairo': {
    id: 'coptic-cairo',
    slug: 'coptic-cairo',
    name: 'Coptic Cairo & Old Cairo Tour',
    shortDescription: 'Discover the Christian heritage of Egypt in the historic Coptic Quarter of Cairo.',
    description: 'Explore the ancient Coptic Cairo district, home to some of the oldest Christian churches in the world.',
    pricePerDay: 65,
    capacity: 15,
    features: ['Historical Sites Visit', 'Professional Guide', 'Entrance Fees', 'Transportation'],
    highlights: ['Hanging Church', 'Coptic Museum', 'Ben Ezra Synagogue'],
    inclusions: ['Entrance fees', 'Guide', 'Transportation', 'Lunch'],
    exclusions: ['Personal expenses', 'Tips'],
    rating: 4.7,
    type: 'STANDARD',
    category: 'DELUXE',
    duration: '3-4 hours',
    location: 'Cairo, Egypt',
    mainImageUrl: '/religious/20180517_104948.jpg',
    images: []
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try to find in database first
    let tour = await prisma.dailyTour.findUnique({
      where: { slug },
      include: { images: true },
    });

    // If not found by slug, try by ID
    if (!tour) {
      tour = await prisma.dailyTour.findUnique({
        where: { id: slug },
        include: { images: true },
      });
    }

    // If found in database, return it
    if (tour) {
      return NextResponse.json({
        ...tour,
        pricePerDay: Number(tour.pricePerDay),
      });
    }

    // Fallback to default tours
    if (defaultTours[slug]) {
      return NextResponse.json(defaultTours[slug]);
    }

    return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to fetch tour:', error);
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}

