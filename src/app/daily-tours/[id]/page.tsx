'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { PharaonicDecoration } from '@/components/ui/PharaonicDecoration';
import { Star, Users, Clock, MapPin, Camera, Utensils, Bus, BookOpen, Check, ArrowLeft } from 'lucide-react';

interface DailyTour {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  features: string[];
  rating: number;
  type: string;
  category: string;
  mainImageUrl?: string;
  images?: Array<{ url: string; alt?: string }>;
}

const defaultTours: Record<string, DailyTour> = {
  'pyramids-giza-sphinx': {
    id: 'pyramids-giza-sphinx',
    name: 'Pyramids of Giza & Sphinx Tour',
    shortDescription: 'Discover the iconic Pyramids of Giza and the Great Sphinx, one of the Seven Wonders of the Ancient World.',
    description: 'Experience the grandeur of ancient Egypt with a comprehensive tour of the Pyramids of Giza, including the Great Pyramid of Khufu, Pyramid of Khafre, Pyramid of Menkaure, and the enigmatic Sphinx. Your expert guide will share fascinating stories about these architectural marvels and their historical significance. This full-day tour includes a camel ride around the pyramids, entrance to the Great Pyramid (optional), and a visit to the Solar Boat Museum.',
    pricePerDay: 75,
    capacity: 15,
    features: ['Professional Egyptologist Guide', 'Entrance Fees Included', 'Camel Ride Experience', 'Hotel Pickup & Drop-off', 'Lunch at Local Restaurant', 'Solar Boat Museum Visit', 'Bottled Water'],
    rating: 4.8,
    type: 'STANDARD',
    category: 'DELUXE',
    mainImageUrl: '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg',
    images: [
      { url: '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg', alt: 'Pyramids of Giza' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.18.jpeg', alt: 'Great Sphinx' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.19.jpeg', alt: 'Pyramid Complex' },
      { url: '/cultural&historical/IMG_2798.JPG', alt: 'Pyramids View' },
      { url: '/cultural&historical/IMG_2970.JPG', alt: 'Sphinx View' }
    ]
  },
  'grand-egyptian-museum': {
    id: 'grand-egyptian-museum',
    name: 'Grand Egyptian Museum Tour',
    shortDescription: 'Explore the world\'s largest archaeological museum dedicated to a single civilization.',
    description: 'Visit the magnificent Grand Egyptian Museum, home to over 100,000 artifacts including the complete Tutankhamun collection. This state-of-the-art museum showcases Egypt\'s rich history from prehistoric times to the Greco-Roman period. Your guide will take you through the most significant exhibits and explain their historical context. The museum features interactive displays, virtual reality experiences, and stunning architectural design.',
    pricePerDay: 85,
    capacity: 20,
    features: ['Skip-the-Line Tickets', 'Expert Museum Guide', 'Audio Guide Available', 'Hotel Transfer', 'Duration: 4-5 hours', 'Interactive Exhibits Access', 'Photography Permits'],
    rating: 4.9,
    type: 'PREMIUM',
    category: 'LUXURY',
    mainImageUrl: '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg',
    images: [
      { url: '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg', alt: 'Grand Egyptian Museum' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg', alt: 'Museum Exhibits' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.22.jpeg', alt: 'Ancient Artifacts' },
      { url: '/cultural&historical/IMG_6316.JPG', alt: 'Museum Interior' },
      { url: '/cultural&historical/IMG_6828.JPG', alt: 'Exhibits' }
    ]
  },
  'coptic-cairo': {
    id: 'coptic-cairo',
    name: 'Coptic Cairo & Old Cairo Tour',
    shortDescription: 'Discover the Christian heritage of Egypt in the historic Coptic Quarter of Cairo.',
    description: 'Explore the ancient Coptic Cairo district, home to some of the oldest Christian churches in the world. Visit the Hanging Church, the Church of St. Sergius, the Coptic Museum, and the Ben Ezra Synagogue. Learn about the rich history of Christianity in Egypt and see beautiful religious art and architecture. This tour provides insight into the multicultural history of Egypt.',
    pricePerDay: 65,
    capacity: 15,
    features: ['Historical Sites Visit', 'Professional Guide', 'Entrance Fees', 'Transportation', 'Duration: 3-4 hours', 'Coptic Museum Entry', 'Traditional Lunch'],
    rating: 4.7,
    type: 'STANDARD',
    category: 'DELUXE',
    mainImageUrl: '/religious/20180517_104948.jpg',
    images: [
      { url: '/cultural&historical/IMG_0133.JPG', alt: 'Coptic Churches' }
    ]
  },
  'saqqara-dahshur': {
    id: 'saqqara-dahshur',
    name: 'Saqqara & Dahshur Pyramids Tour',
    shortDescription: 'Visit the Step Pyramid of Djoser and the Bent Pyramid, exploring Egypt\'s pyramid evolution.',
    description: 'Journey to Saqqara to see the Step Pyramid of Djoser, the oldest stone pyramid in Egypt. Then continue to Dahshur to explore the Bent Pyramid and the Red Pyramid. This tour offers a unique perspective on the evolution of pyramid construction techniques in ancient Egypt. You\'ll also visit the Mastaba tombs and see ancient hieroglyphics.',
    pricePerDay: 90,
    capacity: 12,
    features: ['Step Pyramid of Djoser', 'Bent Pyramid Visit', 'Red Pyramid Exploration', 'Expert Guide', 'Lunch Included', 'Mastaba Tombs', 'Hieroglyphics Viewing'],
    rating: 4.8,
    type: 'PREMIUM',
    category: 'LUXURY',
    mainImageUrl: '/cultural&historical/Saqqara pyramid.jpg',
    images: [
      { url: '/cultural&historical/DSC_8652.JPG', alt: 'Step Pyramid' },
      { url: '/cultural&historical/DSCF1165.JPG', alt: 'Dahshur Pyramids' }
    ]
  },
  'alexandria-day-trip': {
    id: 'alexandria-day-trip',
    name: 'Alexandria Day Trip from Cairo',
    shortDescription: 'Explore the Mediterranean city of Alexandria, home to the legendary Library and ancient Roman ruins.',
    description: 'Take a full-day trip to Alexandria, the Pearl of the Mediterranean. Visit the Bibliotheca Alexandrina, the Catacombs of Kom el Shoqafa, Pompey\'s Pillar, Qaitbay Citadel, and enjoy a delicious seafood lunch by the Mediterranean Sea. Experience the unique blend of Egyptian, Greek, and Roman cultures. This tour includes comfortable transportation from Cairo.',
    pricePerDay: 120,
    capacity: 15,
    features: ['Full Day Tour', 'Bibliotheca Alexandrina', 'Catacombs Visit', 'Seafood Lunch', 'Private Transportation', 'Qaitbay Citadel', 'Roman Amphitheater'],
    rating: 4.9,
    type: 'LUXURY',
    category: 'PREMIUM',
    mainImageUrl: '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg',
    images: [
      { url: '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg', alt: 'Alexandria City' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg', alt: 'Mediterranean Coast' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.35.jpeg', alt: 'Alexandria Views' },
      { url: '/Alexandria/IMG_6198.JPG', alt: 'Alexandria Library' },
      { url: '/Alexandria/IMG_6274.JPG', alt: 'Coastline' }
    ]
  },
  'egyptian-museum-citadel': {
    id: 'egyptian-museum-citadel',
    name: 'Egyptian Museum & Citadel of Saladin',
    shortDescription: 'Discover the treasures of Tutankhamun and explore the medieval Citadel of Saladin.',
    description: 'Visit the Egyptian Museum in Tahrir Square, home to the world\'s most extensive collection of Pharaonic antiquities. See the golden mask of Tutankhamun and thousands of artifacts. Then explore the Citadel of Saladin, including the magnificent Muhammad Ali Mosque, and enjoy panoramic views of Cairo. This tour combines ancient and medieval history.',
    pricePerDay: 70,
    capacity: 18,
    features: ['Museum Entry', 'Citadel Visit', 'Muhammad Ali Mosque', 'Professional Guide', 'Hotel Transfer', 'Panoramic Views', 'Historical Context'],
    rating: 4.7,
    type: 'STANDARD',
    category: 'DELUXE',
    mainImageUrl: '/cultural&historical/IMG_6901.JPG',
    images: [
      { url: '/cultural&historical/IMG_6974.JPG', alt: 'Museum Treasures' },
      { url: '/cultural&historical/IMG_7516.CR2', alt: 'Citadel Views' }
    ]
  },
  'khan-el-khalili-bazaar': {
    id: 'khan-el-khalili-bazaar',
    name: 'Khan el-Khalili Bazaar & Islamic Cairo',
    shortDescription: 'Immerse yourself in the vibrant atmosphere of Cairo\'s historic bazaar and Islamic architecture.',
    description: 'Explore the famous Khan el-Khalili Bazaar, one of the oldest markets in the Middle East. Shop for souvenirs, spices, jewelry, and traditional crafts. Visit the Al-Azhar Mosque, one of the oldest universities in the world, and walk through the historic Islamic Cairo district with its stunning Mamluk architecture. Experience authentic Egyptian culture and cuisine.',
    pricePerDay: 55,
    capacity: 20,
    features: ['Bazaar Shopping', 'Al-Azhar Mosque', 'Islamic Architecture Tour', 'Local Guide', 'Traditional Tea Break', 'Souvenir Shopping', 'Local Cuisine'],
    rating: 4.6,
    type: 'STANDARD',
    category: 'STANDARD',
    mainImageUrl: '/cultural&historical/IMG_0456.JPG',
    images: [
      { url: '/cultural&historical/IMG_0514.JPG', alt: 'Khan el-Khalili' },
      { url: '/cultural&historical/IMG_0515.JPG', alt: 'Islamic Architecture' }
    ]
  },
  'memphis-sakkara': {
    id: 'memphis-sakkara',
    name: 'Memphis & Saqqara Historical Tour',
    shortDescription: 'Visit the ancient capital of Memphis and the necropolis of Saqqara with its step pyramid.',
    description: 'Explore Memphis, the ancient capital of Egypt, and see the colossal statue of Ramesses II. Then visit Saqqara, the vast necropolis where the Step Pyramid of Djoser stands. Learn about the early dynastic period of ancient Egypt and see some of the oldest structures in the world. This tour provides deep insights into the origins of Egyptian civilization.',
    pricePerDay: 80,
    capacity: 15,
    features: ['Memphis Ruins', 'Step Pyramid', 'Mastaba Tombs', 'Expert Egyptologist', 'Lunch Included', 'Colossal Statue Viewing', 'Historical Context'],
    rating: 4.8,
    type: 'PREMIUM',
    category: 'DELUXE',
    mainImageUrl: '/cultural&historical/Saqqara pyramid.jpg',
    images: [
      { url: '/cultural&historical/DSC_8401.JPG', alt: 'Memphis Statue' },
      { url: '/cultural&historical/1 (23).JPG', alt: 'Saqqara Complex' }
    ]
  }
};

export default function DailyTourDetailPage() {
  const params = useParams();
  const tourId = params?.id as string;
  const [tour, setTour] = useState<DailyTour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        if (defaultTours[tourId]) {
          setTour(defaultTours[tourId]);
        } else {
          // Try to fetch from API
          const response = await fetch(`/api/dahabiyat/${tourId}`);
          const data = await response.json();
          if (data) {
            setTour(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch tour:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharaoh-gold mx-auto mb-4"></div>
            <p className="text-nile-blue">Loading tour details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-nile-blue mb-4">Tour Not Found</h1>
          <p className="text-ancient-stone mb-8">The tour you're looking for doesn't exist.</p>
          <Link href="/daily-tours">
            <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
      <Navbar />
      
      {/* Enhanced Hero Section with Slideshow */}
      <div className="relative h-[70vh] w-full mt-16">
        {tour.images && tour.images.length > 1 ? (
          <ImageSlideshow
            images={[tour.mainImageUrl || tour.images[0].url, ...tour.images.map(img => img.url)]}
            alt={tour.name}
            autoPlay={true}
            interval={5000}
            height="h-full"
            className="rounded-none"
          />
        ) : (
          <>
            <Image
              src={tour.mainImageUrl || tour.images?.[0]?.url || '/placeholder.jpg'}
              alt={tour.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto z-20">
          <Link href="/daily-tours">
            <Button variant="outline" className="mb-4 bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg border-2 border-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-serif drop-shadow-2xl headline-animated">
            {tour.name}
          </h1>
          <div className="mt-2">
            <PharaonicDecoration variant="inline" size="sm" />
          </div>
          <div className="flex items-center gap-4 text-white">
            <Badge className="bg-pharaoh-gold/95 backdrop-blur-sm text-white px-4 py-2 text-lg shadow-lg">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {tour.rating}
            </Badge>
            <span className="text-xl font-semibold drop-shadow-lg">${tour.pricePerDay} per person</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-nile-blue mb-4 font-serif">Tour Overview</h2>
              <p className="text-ancient-stone text-lg leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </Card>

            {/* Enhanced Gallery */}
            {tour.images && tour.images.length > 0 && (
              <Card className="p-8 bg-gradient-to-br from-white to-pharaoh-gold/5">
                <h2 className="text-3xl font-bold text-nile-blue mb-6 font-serif">Photo Gallery</h2>
                <ImageGallery
                  images={tour.images}
                  columns={3}
                />
              </Card>
            )}

            {/* What's Included */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-nile-blue mb-6 font-serif">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-pharaoh-gold mt-0.5 flex-shrink-0" />
                    <span className="text-ancient-stone">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-nile-blue mb-2">
                  ${tour.pricePerDay}
                </div>
                <div className="text-ancient-stone">per person</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-ancient-stone">Duration</span>
                  <span className="font-semibold text-nile-blue">Full Day</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-ancient-stone">Max Group Size</span>
                  <span className="font-semibold text-nile-blue">{tour.capacity} people</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-ancient-stone">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-pharaoh-gold fill-current" />
                    <span className="font-semibold text-nile-blue">{tour.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ancient-stone">Category</span>
                  <Badge className="bg-pharaoh-gold text-white">{tour.category}</Badge>
                </div>
              </div>

              <Link href={`/book?tour=${tour.id}`}>
                <Button className="w-full bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white text-lg py-6">
                  Book This Tour
                </Button>
              </Link>

              <div className="mt-4 text-center text-sm text-ancient-stone">
                Free cancellation up to 24 hours before tour
              </div>
            </Card>

            {/* Quick Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-nile-blue mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Professional Guide</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bus className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Hotel Pickup & Drop-off</span>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Meals Included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Photo Opportunities</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

