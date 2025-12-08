'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import { Star, Users, Clock, MapPin, Camera, Utensils, Bus, UserCheck } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

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

const defaultTours: DailyTour[] = [
  {
    id: 'pyramids-giza-sphinx',
    name: 'Pyramids of Giza & Sphinx Tour',
    shortDescription: 'Discover the iconic Pyramids of Giza and the Great Sphinx, one of the Seven Wonders of the Ancient World.',
    description: 'Experience the grandeur of ancient Egypt with a comprehensive tour of the Pyramids of Giza, including the Great Pyramid of Khufu, Pyramid of Khafre, Pyramid of Menkaure, and the enigmatic Sphinx. Your expert guide will share fascinating stories about these architectural marvels and their historical significance.',
    pricePerDay: 75,
    capacity: 15,
    features: ['Professional Egyptologist Guide', 'Entrance Fees Included', 'Camel Ride Experience', 'Hotel Pickup & Drop-off', 'Lunch at Local Restaurant'],
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
  {
    id: 'grand-egyptian-museum',
    name: 'Grand Egyptian Museum Tour',
    shortDescription: 'Explore the world\'s largest archaeological museum dedicated to a single civilization.',
    description: 'Visit the magnificent Grand Egyptian Museum, home to over 100,000 artifacts including the complete Tutankhamun collection. This state-of-the-art museum showcases Egypt\'s rich history from prehistoric times to the Greco-Roman period. Your guide will take you through the most significant exhibits and explain their historical context.',
    pricePerDay: 85,
    capacity: 20,
    features: ['Skip-the-Line Tickets', 'Expert Museum Guide', 'Audio Guide Available', 'Hotel Transfer', 'Duration: 4-5 hours'],
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
  {
    id: 'coptic-cairo',
    name: 'Coptic Cairo & Old Cairo Tour',
    shortDescription: 'Discover the Christian heritage of Egypt in the historic Coptic Quarter of Cairo.',
    description: 'Explore the ancient Coptic Cairo district, home to some of the oldest Christian churches in the world. Visit the Hanging Church, the Church of St. Sergius, the Coptic Museum, and the Ben Ezra Synagogue. Learn about the rich history of Christianity in Egypt and see beautiful religious art and architecture.',
    pricePerDay: 65,
    capacity: 15,
    features: ['Historical Sites Visit', 'Professional Guide', 'Entrance Fees', 'Transportation', 'Duration: 3-4 hours'],
    rating: 4.7,
    type: 'STANDARD',
    category: 'DELUXE',
    mainImageUrl: '/religious/20180517_104948.jpg',
    images: [
      { url: '/cultural&historical/IMG_0133.JPG', alt: 'Coptic Churches' }
    ]
  },
  {
    id: 'saqqara-dahshur',
    name: 'Saqqara & Dahshur Pyramids Tour',
    shortDescription: 'Visit the Step Pyramid of Djoser and the Bent Pyramid, exploring Egypt\'s pyramid evolution.',
    description: 'Journey to Saqqara to see the Step Pyramid of Djoser, the oldest stone pyramid in Egypt. Then continue to Dahshur to explore the Bent Pyramid and the Red Pyramid. This tour offers a unique perspective on the evolution of pyramid construction techniques in ancient Egypt.',
    pricePerDay: 90,
    capacity: 12,
    features: ['Step Pyramid of Djoser', 'Bent Pyramid Visit', 'Red Pyramid Exploration', 'Expert Guide', 'Lunch Included'],
    rating: 4.8,
    type: 'PREMIUM',
    category: 'LUXURY',
    mainImageUrl: '/cultural&historical/Saqqara pyramid.jpg',
    images: [
      { url: '/cultural&historical/DSC_8652.JPG', alt: 'Step Pyramid' },
      { url: '/cultural&historical/DSCF1165.JPG', alt: 'Dahshur Pyramids' }
    ]
  },
  {
    id: 'alexandria-day-trip',
    name: 'Alexandria Day Trip from Cairo',
    shortDescription: 'Explore the Mediterranean city of Alexandria, home to the legendary Library and ancient Roman ruins.',
    description: 'Take a full-day trip to Alexandria, the Pearl of the Mediterranean. Visit the Bibliotheca Alexandrina, the Catacombs of Kom el Shoqafa, Pompey\'s Pillar, Qaitbay Citadel, and enjoy a delicious seafood lunch by the Mediterranean Sea. Experience the unique blend of Egyptian, Greek, and Roman cultures.',
    pricePerDay: 120,
    capacity: 15,
    features: ['Full Day Tour', 'Bibliotheca Alexandrina', 'Catacombs Visit', 'Seafood Lunch', 'Private Transportation'],
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
  {
    id: 'egyptian-museum-citadel',
    name: 'Egyptian Museum & Citadel of Saladin',
    shortDescription: 'Discover the treasures of Tutankhamun and explore the medieval Citadel of Saladin.',
    description: 'Visit the Egyptian Museum in Tahrir Square, home to the world\'s most extensive collection of Pharaonic antiquities. See the golden mask of Tutankhamun and thousands of artifacts. Then explore the Citadel of Saladin, including the magnificent Muhammad Ali Mosque, and enjoy panoramic views of Cairo.',
    pricePerDay: 70,
    capacity: 18,
    features: ['Museum Entry', 'Citadel Visit', 'Muhammad Ali Mosque', 'Professional Guide', 'Hotel Transfer'],
    rating: 4.7,
    type: 'STANDARD',
    category: 'DELUXE',
    mainImageUrl: '/WhatsApp Image 2025-11-22 at 00.51.36.jpeg',
    images: [
      { url: '/WhatsApp Image 2025-11-22 at 00.51.36.jpeg', alt: 'Egyptian Museum' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.35 (1).jpeg', alt: 'Museum Treasures' },
      { url: '/WhatsApp Image 2025-11-22 at 00.51.35 (2).jpeg', alt: 'Citadel Views' },
      { url: '/cultural&historical/IMG_6901.JPG', alt: 'Museum Interior' },
      { url: '/cultural&historical/IMG_6974.JPG', alt: 'Artifacts' }
    ]
  },
  {
    id: 'khan-el-khalili-bazaar',
    name: 'Khan el-Khalili Bazaar & Islamic Cairo',
    shortDescription: 'Immerse yourself in the vibrant atmosphere of Cairo\'s historic bazaar and Islamic architecture.',
    description: 'Explore the famous Khan el-Khalili Bazaar, one of the oldest markets in the Middle East. Shop for souvenirs, spices, jewelry, and traditional crafts. Visit the Al-Azhar Mosque, one of the oldest universities in the world, and walk through the historic Islamic Cairo district with its stunning Mamluk architecture.',
    pricePerDay: 55,
    capacity: 20,
    features: ['Bazaar Shopping', 'Al-Azhar Mosque', 'Islamic Architecture Tour', 'Local Guide', 'Traditional Tea Break'],
    rating: 4.6,
    type: 'STANDARD',
    category: 'STANDARD',
    mainImageUrl: '/cultural&historical/IMG_0456.JPG',
    images: [
      { url: '/cultural&historical/IMG_0514.JPG', alt: 'Khan el-Khalili' },
      { url: '/cultural&historical/IMG_0515.JPG', alt: 'Islamic Architecture' }
    ]
  },
  {
    id: 'memphis-sakkara',
    name: 'Memphis & Saqqara Historical Tour',
    shortDescription: 'Visit the ancient capital of Memphis and the necropolis of Saqqara with its step pyramid.',
    description: 'Explore Memphis, the ancient capital of Egypt, and see the colossal statue of Ramesses II. Then visit Saqqara, the vast necropolis where the Step Pyramid of Djoser stands. Learn about the early dynastic period of ancient Egypt and see some of the oldest structures in the world.',
    pricePerDay: 80,
    capacity: 15,
    features: ['Memphis Ruins', 'Step Pyramid', 'Mastaba Tombs', 'Expert Egyptologist', 'Lunch Included'],
    rating: 4.8,
    type: 'PREMIUM',
    category: 'DELUXE',
    mainImageUrl: '/cultural&historical/Saqqara pyramid.jpg',
    images: [
      { url: '/cultural&historical/DSC_8401.JPG', alt: 'Memphis Statue' },
      { url: '/cultural&historical/1 (23).JPG', alt: 'Saqqara Complex' }
    ]
  }
];

export default function DailyToursPage() {
  const [tours, setTours] = useState<DailyTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { getContent } = useContent({ page: 'daily-tours' });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/dahabiyat');
        const data = await response.json();
        if (data.dailyTours && Array.isArray(data.dailyTours) && data.dailyTours.length > 0) {
          setTours(data.dailyTours);
        } else {
          // Use default tours if API doesn't return any
          setTours(defaultTours);
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error);
        // Use default tours on error
        setTours(defaultTours);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const filteredTours = selectedCategory === 'all' 
    ? tours 
    : tours.filter(tour => tour.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ['all', 'deluxe', 'luxury', 'premium', 'standard'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharaoh-gold mx-auto mb-4"></div>
            <p className="text-nile-blue">Loading amazing tours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
      <Navbar />
      
      {/* Enhanced Hero Section with Slideshow */}
      <div className="relative h-[70vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={[
            '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.18.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.19.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.22.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg',
            '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
            '/cultural&historical/Saqqara pyramid.jpg',
            '/Alexandria/IMG_6198.JPG'
          ]}
          alt="Egypt Daily Tours"
          autoPlay={true}
          interval={5000}
          height="h-full"
          className="rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif drop-shadow-2xl headline-animated">
              {getContent('daily-tours_hero_title', 'Daily Tours in Egypt')}
            </h1>
            <div className="mb-4">
              <PharaonicText className="text-white/90" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
              {getContent('daily-tours_hero_subtitle', 'Discover the wonders of ancient Egypt with our expertly guided daily tours. From the Pyramids to the Grand Egyptian Museum, experience the best of Cairo and beyond.')}
            </p>
            <div className="mt-4">
              <PharaonicDecoration variant="section" size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-pharaoh-gold text-white shadow-lg scale-105'
                  : 'bg-white text-nile-blue hover:bg-pharaoh-gold/10 border-2 border-pharaoh-gold/30'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <Card key={tour.id} className="group overflow-hidden bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                <Link href={`/daily-tours/${tour.id}`} className="block">
                  {/* Enhanced Tour Image with Slideshow */}
                  <div className="relative h-72 w-full overflow-hidden">
                    {tour.images && tour.images.length > 1 ? (
                      <div className="relative h-full w-full">
                        <ImageSlideshow
                          images={[tour.mainImageUrl || tour.images[0].url, ...tour.images.slice(1).map(img => img.url)]}
                          alt={tour.name}
                          autoPlay={true}
                          interval={4000}
                          height="h-full"
                          showControls={false}
                          className="rounded-t-lg"
                        />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={tour.mainImageUrl || tour.images?.[0]?.url || '/placeholder.jpg'}
                          alt={tour.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </>
                    )}

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 z-30">
                      <Badge className="bg-pharaoh-gold/95 backdrop-blur-sm text-white font-bold px-3 py-2 text-sm flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        {tour.rating}
                      </Badge>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 z-30">
                      <Badge className="bg-nile-blue/95 backdrop-blur-sm text-white font-bold px-3 py-2 text-sm shadow-lg">
                        ${tour.pricePerDay}
                      </Badge>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-pharaoh-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Tour Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 text-nile-blue font-serif group-hover:text-pharaoh-gold transition-colors duration-300">
                      {tour.name}
                    </h2>

                    <p className="text-ancient-stone mb-4 line-clamp-2 text-sm leading-relaxed">
                      {tour.shortDescription || tour.description}
                    </p>

                    {/* Tour Features */}
                    <div className="space-y-2 mb-4">
                      {tour.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-nile-blue">
                          <div className="w-1.5 h-1.5 rounded-full bg-pharaoh-gold"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {tour.features.length > 3 && (
                        <div className="text-xs text-ancient-stone italic">
                          +{tour.features.length - 3} more features
                        </div>
                      )}
                    </div>

                    {/* Tour Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-pharaoh-gold/20">
                      <div className="flex items-center gap-4 text-sm text-ancient-stone">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Max {tour.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Full Day</span>
                        </div>
                      </div>
                      <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-xl border border-pharaoh-gold/30">
              <MapPin className="w-16 h-16 text-pharaoh-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-nile-blue mb-4">No Tours Available</h3>
              <p className="text-ancient-stone">
                Our daily tours are being prepared. Please check back soon for amazing Egypt experiences.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

