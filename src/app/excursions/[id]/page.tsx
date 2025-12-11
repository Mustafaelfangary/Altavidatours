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

interface Excursion {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  duration: string;
  groupSize: string;
  category: 'historical' | 'desert' | 'other';
  featured?: boolean;
  images: string[];
  icon: any;
}

const defaultExcursions: Record<string, Excursion> = {
  'giza-pyramids-sphinx': {
    id: 'giza-pyramids-sphinx',
    name: 'Giza Pyramids and Sphinx',
    description: 'Take a guided tour to the iconic pyramids and the Sphinx, with options for camel rides. Experience the grandeur of ancient Egypt at one of the Seven Wonders of the Ancient World. This comprehensive tour includes visits to all three main pyramids (Great Pyramid of Khufu, Pyramid of Khafre, and Pyramid of Menkaure) and the enigmatic Great Sphinx. Your professional Egyptologist guide will share fascinating stories about the construction techniques, historical significance, and mysteries of these architectural marvels. The tour includes a camel ride around the pyramids complex and visits to the Solar Boat Museum.',
    highlights: [
      'Visit the Great Pyramid of Khufu',
      'Explore the Pyramid of Khafre and Menkaure',
      'See the enigmatic Great Sphinx',
      'Optional camel ride around the pyramids',
      'Professional Egyptologist guide',
      'Solar Boat Museum visit',
      'Bottled water and refreshments'
    ],
    duration: 'Half Day (4-5 hours)',
    groupSize: 'Up to 15 people',
    category: 'historical',
    featured: true,
    images: [
      '/cultural&historical/IMG_2798.JPG',
      '/cultural&historical/IMG_2970.JPG',
      '/cultural&historical/DSC_8401.JPG',
      '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg'
    ],
    icon: 'Landmark'
  },
  'cairo-museum-tours': {
    id: 'cairo-museum-tours',
    name: 'Cairo Museum Tours',
    description: 'Visit the Grand Egyptian Museum (GEM) and the older Egyptian Museum to see ancient artifacts and Tutankhamun\'s treasures. Explore the world\'s largest collection of pharaonic antiquities spanning from prehistoric times to the Greco-Roman period. The Grand Egyptian Museum features over 100,000 artifacts including the complete Tutankhamun collection with his famous golden mask. Your expert museum guide will take you through the most significant exhibits and provide detailed historical context. The museum also features interactive displays and virtual reality experiences showcasing ancient Egyptian civilization.',
    highlights: [
      'Grand Egyptian Museum visit',
      'Tutankhamun\'s complete collection',
      'Royal mummies hall',
      'Ancient artifacts and treasures',
      'Expert museum guide',
      'Interactive exhibits access',
      'Photography permits'
    ],
    duration: 'Full Day (6-7 hours)',
    groupSize: 'Up to 20 people',
    category: 'historical',
    featured: true,
    images: [
      '/cultural&historical/IMG_6316.JPG',
      '/cultural&historical/IMG_6828.JPG',
      '/cultural&historical/IMG_0456.JPG',
      '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg'
    ],
    icon: 'Building2'
  },
  'luxor-karnak': {
    id: 'luxor-karnak',
    name: 'Luxor and Karnak',
    description: 'Explore the temples and tombs of Luxor, including the Valley of the Kings and Karnak Temple, often with a sunrise hot air balloon option. Discover the ancient capital of Egypt. This full-day excursion takes you on a journey through thousands of years of Egyptian history. Visit the Valley of the Kings where pharaohs were buried, explore the magnificent Karnak Temple complex with its towering columns and intricate hieroglyphics, and see the Temple of Hatshepsut carved into the cliff face. The optional sunrise hot air balloon ride offers spectacular views of the Nile Valley and ancient sites.',
    highlights: [
      'Valley of the Kings exploration',
      'Karnak Temple complex',
      'Temple of Hatshepsut',
      'Colossi of Memnon',
      'Optional hot air balloon ride at sunrise',
      'Professional Egyptologist guide',
      'Lunch at local restaurant'
    ],
    duration: 'Full Day (8-10 hours)',
    groupSize: 'Up to 12 people',
    category: 'historical',
    featured: true,
    images: [
      '/cultural&historical/IMG_6857.JPG',
      '/cultural&historical/IMG_6901.JPG',
      '/cultural&historical/IMG_6974.JPG',
      '/cultural&historical/IMG_3143.JPG'
    ],
    icon: 'Mountain'
  },
  'nile-river-cruises': {
    id: 'nile-river-cruises',
    name: 'Nile River Cruises',
    description: 'Take a Nile cruise, typically starting in Luxor or Aswan, with options for multi-day trips that include stops at other sites. Sail through history on the legendary Nile River. Experience the majesty of ancient Egypt from the comfort of a luxury cruise vessel. Multi-day options range from 3 to 7 days, with stops at major archaeological sites including temples, tombs, and ancient cities. Each cruise includes onboard entertainment, gourmet dining featuring Egyptian and international cuisine, and expert guides explaining the historical significance of each site. Sunrise and sunset views from the Nile are absolutely spectacular.',
    highlights: [
      'Multi-day luxury cruise',
      'Stops at ancient temples',
      'Onboard entertainment',
      'Gourmet dining',
      'Sunrise and sunset views',
      'Expert Egyptologist guide',
      'All meals and beverages included'
    ],
    duration: '3-7 Days',
    groupSize: 'Various capacities',
    category: 'historical',
    featured: false,
    images: [
      '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg',
      '/WhatsApp Image 2025-11-22 at 00.51.22.jpeg',
      '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg'
    ],
    icon: 'Ship'
  },
  'abu-simbel': {
    id: 'abu-simbel',
    name: 'Abu Simbel',
    description: 'Go on a full-day tour from Aswan to see the temples of Abu Simbel. Marvel at the colossal statues of Ramses II and the stunning rock-cut temples. Located in southern Egypt near the Sudanese border, Abu Simbel is a UNESCO World Heritage Site featuring two massive rock temples built by Pharaoh Ramses II. The Great Temple is famous for its four colossal 67-meter-high statues of Ramses II guarding the entrance. Inside, beautifully preserved hieroglyphics and reliefs cover the walls. The temples were relocated in the 1960s to save them from the rising waters of Lake Nasser.',
    highlights: [
      'Great Temple of Ramses II',
      'Temple of Hathor and Nefertari',
      'Colossal statues',
      'UNESCO World Heritage Site',
      'Professional guide',
      'Hieroglyphics and reliefs viewing',
      'Lake Nasser views'
    ],
    duration: 'Full Day (10-12 hours)',
    groupSize: 'Up to 15 people',
    category: 'historical',
    featured: false,
    images: [
      '/cultural&historical/IMG_0133.JPG',
      '/cultural&historical/IMG_0514.JPG',
      '/cultural&historical/IMG_0515.JPG'
    ],
    icon: 'Landmark'
  },
  'alexandria-day-trip': {
    id: 'alexandria-day-trip',
    name: 'Alexandria Day Trip',
    description: 'Take a day trip from Cairo to explore the coastal city of Alexandria. Discover the Mediterranean charm and ancient wonders of Egypt\'s second-largest city. Founded by Alexander the Great in 331 BC, Alexandria was once the center of the ancient world. Today, it retains much of its cosmopolitan character with a blend of Mediterranean and Egyptian cultures. Visit the Bibliotheca Alexandrina, a modern tribute to the ancient Library of Alexandria, the Qaitbay Citadel overlooking the harbor, the fascinating Catacombs of Kom el Shoqafa, and enjoy fresh seafood lunch at a waterfront restaurant.',
    highlights: [
      'Bibliotheca Alexandrina',
      'Qaitbay Citadel',
      'Catacombs of Kom el Shoqafa',
      'Montaza Palace gardens',
      'Mediterranean seafood lunch',
      'Roman Amphitheater',
      'Harbor and coastal views'
    ],
    duration: 'Full Day (10-12 hours)',
    groupSize: 'Up to 15 people',
    category: 'historical',
    featured: false,
    images: [
      '/Alexandria/IMG_6198.JPG',
      '/Alexandria/IMG_6201.JPG',
      '/Alexandria/IMG_6274.JPG',
      '/Alexandria/IMG_6282.JPG',
      '/Alexandria/IMG_6334.JPG'
    ],
    icon: 'Globe'
  },
  'sound-light-shows': {
    id: 'sound-light-shows',
    name: 'Sound and Light Shows',
    description: 'Experience the history of the Pyramids or other sites through a captivating sound and light show. Watch ancient monuments come alive with spectacular illumination and narration. These evening shows use cutting-edge technology to bring Egyptian history to life. The Pyramids Sound and Light Show is performed multiple times each week, with performances available in several languages. Spectators sit in comfortable seating while the monuments are illuminated in synchronized light displays accompanied by dramatic narration telling the story of the pharaohs, the building of the pyramids, and ancient Egyptian civilization.',
    highlights: [
      'Pyramids sound and light show',
      'Karnak Temple illumination options',
      'Historical narration',
      'Spectacular light effects',
      'Evening entertainment',
      'Multi-language options',
      'Comfortable seating'
    ],
    duration: '2-3 hours',
    groupSize: 'Large groups',
    category: 'historical',
    featured: false,
    images: [
      '/cultural&historical/DSCF1165.JPG',
      '/cultural&historical/DSC_8652.JPG'
    ],
    icon: 'Sparkles'
  },
  'quad-biking-safari': {
    id: 'quad-biking-safari',
    name: 'Quad Biking and Safari',
    description: 'Go on a quad bike or 6x6 buggy adventure in the desert, often including a camel ride, BBQ dinner, and show in areas like Sharm El Sheikh. Experience the thrill of desert exploration. Feel the adrenaline rush as you navigate through sand dunes in high-powered quad bikes or 4x6 buggies. After an exhilarating ride through the desert landscape, visit a traditional Bedouin village to experience authentic desert culture. Enjoy a traditional BBQ dinner cooked over a campfire, followed by entertainment including belly dancing and cultural performances. The experience concludes under the starlit desert sky.',
    highlights: [
      'Quad bike desert adventure',
      'Camel ride experience',
      'Bedouin village visit',
      'Traditional BBQ dinner',
      'Cultural entertainment show',
      'Campfire experience',
      'Stargazing'
    ],
    duration: 'Half Day (4-5 hours)',
    groupSize: 'Up to 20 people',
    category: 'desert',
    featured: true,
    images: [
      '/desert&safary/DSC_9166.JPG',
      '/desert&safary/DSC_9167.JPG',
      '/desert&safary/DSC_9814.JPG',
      '/desert&safary/DSC_9826.JPG'
    ],
    icon: 'Bike'
  },
  'snorkeling-diving': {
    id: 'snorkeling-diving',
    name: 'Snorkeling and Diving',
    description: 'Explore the marine life at popular spots on the Red Sea, such as the Dolphin House in Hurghada or the reefs near Marsa Alam. Discover the underwater wonders of the Red Sea. The Red Sea is one of the world\'s premier diving and snorkeling destinations, famous for its pristine coral reefs and abundant marine life. Whether you\'re a beginner or experienced diver, there are sites suitable for all levels. Common sightings include colorful tropical fish, sea turtles, rays, and dolphins. The water is warm year-round and visibility is excellent. Professional instructors provide safety briefings and guidance.',
    highlights: [
      'Dolphin House snorkeling',
      'Coral reef exploration',
      'Colorful marine life',
      'Professional diving instructors',
      'Equipment provided',
      'Safety briefing included',
      'Multiple reef sites'
    ],
    duration: 'Full Day (6-8 hours)',
    groupSize: 'Up to 15 people',
    category: 'desert',
    featured: true,
    images: [
      '/RedSea/1659705495000.jpg',
      '/RedSea/FB_IMG_1468343472163.jpg',
      '/RedSea/FB_IMG_1474204861825.jpg',
      '/RedSea/FB_IMG_1503932804009.jpg'
    ],
    icon: 'Waves'
  },
  'stargazing': {
    id: 'stargazing',
    name: 'Stargazing',
    description: 'Take a desert safari to go stargazing with a jeep. Experience the crystal-clear night sky of the Egyptian desert, far from city lights. The Egyptian desert offers some of the best stargazing opportunities on Earth due to minimal light pollution. Professional astronomy guides use telescopes and laser pointers to identify constellations, planets, and celestial objects. You\'ll learn about ancient Egyptian astronomy and how the ancients used stars for navigation and timekeeping. The experience is typically combined with Bedouin hospitality including traditional tea and snacks around a campfire.',
    highlights: [
      'Desert jeep safari',
      'Professional astronomy guide',
      'Telescope viewing',
      'Bedouin tea and snacks',
      'Milky Way observation',
      'Constellation identification',
      'Celestial photography tips'
    ],
    duration: 'Evening (3-4 hours)',
    groupSize: 'Up to 12 people',
    category: 'desert',
    featured: false,
    images: [
      '/desert&safary/DSC_9895.JPG',
      '/desert&safary/DSC_9907.JPG'
    ],
    icon: 'Sparkles'
  },
  'dune-bashing': {
    id: 'dune-bashing',
    name: 'Dune Bashing',
    description: 'Experience a thrilling dune bashing safari in the desert. Feel the adrenaline rush as you conquer the towering sand dunes in a 4x4 vehicle. This exciting activity is perfect for adventure seekers looking for an unforgettable experience. Expert drivers navigate the dramatic landscape of towering dunes, sudden descents, and flat plains in specially equipped 4x4 vehicles. Many tours include sandboarding opportunities where you can slide down the biggest dunes. The tour typically includes a sunset viewing, Bedouin village visit, and traditional dinner. Photography opportunities abound throughout the experience.',
    highlights: [
      '4x4 desert adventure',
      'Expert safari driver',
      'Sandboarding opportunity',
      'Sunset viewing',
      'Photo opportunities',
      'Bedouin village visit',
      'Traditional dinner included'
    ],
    duration: 'Half Day (3-4 hours)',
    groupSize: 'Up to 6 per vehicle',
    category: 'desert',
    featured: false,
    images: [
      '/desert&safary/DSC_9908.JPG',
      '/desert&safary/DSC_9912.JPG'
    ],
    icon: 'Mountain'
  },
  'nile-dinner-cruise': {
    id: 'nile-dinner-cruise',
    name: 'Nile Dinner Cruise',
    description: 'Enjoy a dinner cruise on the Nile in Cairo with traditional entertainment. Experience Egyptian cuisine and culture while sailing on the legendary river. Spend an unforgettable evening cruising on the Nile River while enjoying delicious food and entertainment. The cruise typically operates in the evening, departing in the early night and returning late. A buffet dinner features both Egyptian and international cuisine. Entertainment includes traditional belly dancing, Tanoura (whirling dervish) performances, and live music. The atmosphere is festive and romantic, perfect for couples or groups of friends.',
    highlights: [
      'Buffet dinner on the Nile',
      'Traditional belly dancing',
      'Tanoura show',
      'Live music',
      'Panoramic river views',
      'Sunset and night views of Cairo',
      'Egyptian and international cuisine'
    ],
    duration: 'Evening (2-3 hours)',
    groupSize: 'Large groups',
    category: 'other',
    featured: true,
    images: [
      '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
      '/WhatsApp Image 2025-11-22 at 00.51.35.jpeg'
    ],
    icon: 'UtensilsCrossed'
  },
  'khan-el-khalili': {
    id: 'khan-el-khalili',
    name: 'Khan El Khalili Bazaar',
    description: 'Wander through the famous bazaar for a shopping and cultural experience in Old Cairo. Immerse yourself in the vibrant atmosphere of this historic marketplace. Khan El Khalili is one of the oldest markets in the Middle East and a must-visit destination for anyone seeking an authentic Cairo experience. The bazaar is a maze of narrow alleyways lined with shops selling everything from traditional crafts and souvenirs to spices, jewelry, and textiles. The air is filled with exotic aromas and the sounds of merchants and shoppers haggling. Your local guide will help you navigate and teach you the art of bargaining.',
    highlights: [
      'Historic marketplace exploration',
      'Traditional crafts and souvenirs',
      'Spice market visit',
      'Local coffee house experience',
      'Bargaining tips from guide',
      'Al-Azhar Mosque visit',
      'Islamic Cairo architecture'
    ],
    duration: 'Half Day (3-4 hours)',
    groupSize: 'Up to 15 people',
    category: 'other',
    featured: false,
    images: [
      '/cultural&historical/IMG_6828.JPG',
      '/cultural&historical/IMG_0456.JPG'
    ],
    icon: 'ShoppingBag'
  },
  'siwa-oasis': {
    id: 'siwa-oasis',
    name: 'Siwa Oasis',
    description: 'Take a multi-day trip to the remote and natural Siwa Oasis. Discover this hidden gem in the Western Desert with its unique culture and stunning landscapes. Siwa is one of Egypt\'s most remote and isolated oases, located 560 km west of Cairo near the Libyan border. This extraordinary destination offers a fascinating blend of natural beauty, ancient history, and unique Siwan culture. The oasis is surrounded by sand dunes and contains several freshwater lakes and springs. Visit Cleopatra\'s Spring for a refreshing bath, explore the Temple of the Oracle where Alexander the Great consulted the oracle, and experience the warmth of Siwan hospitality.',
    highlights: [
      'Cleopatra\'s Spring',
      'Temple of the Oracle',
      'Salt lakes swimming',
      'Traditional Siwan culture',
      'Desert camping experience',
      'Sunset over the dunes',
      'Traditional Siwan meals'
    ],
    duration: '2-3 Days',
    groupSize: 'Up to 10 people',
    category: 'other',
    featured: false,
    images: [
      '/desert&safary/DSC_9895.JPG',
      '/cultural&historical/IMG_3143.JPG'
    ],
    icon: 'Palmtree'
  }
};

export default function ExcursionDetailPage() {
  const params = useParams();
  const excursionId = params?.id as string;
  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExcursion = async () => {
      try {
        if (defaultExcursions[excursionId]) {
          setExcursion(defaultExcursions[excursionId]);
        } else {
          // Try to fetch from API if it exists
          const response = await fetch(`/api/excursions/${excursionId}`);
          const data = await response.json();
          if (data) {
            setExcursion(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch excursion:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (excursionId) {
      fetchExcursion();
    }
  }, [excursionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-papyrus via-white to-pharaoh-gold/10">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharaoh-gold mx-auto mb-4"></div>
            <p className="text-nile-blue">Loading excursion details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!excursion) {
    return (
      <div className="min-h-screen bg-linear-to-br from-papyrus via-white to-pharaoh-gold/10">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-nile-blue mb-4">Excursion Not Found</h1>
          <p className="text-ancient-stone mb-8">The excursion you're looking for doesn't exist.</p>
          <Link href="/excursions">
            <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Excursions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-papyrus via-white to-pharaoh-gold/10">
      <Navbar />
      
      {/* Enhanced Hero Section with Slideshow */}
      <div className="relative h-[70vh] w-full mt-16">
        {excursion.images && excursion.images.length > 1 ? (
          <ImageSlideshow
            images={excursion.images}
            alt={excursion.name}
            autoPlay={true}
            interval={5000}
            height="h-full"
            className="rounded-none"
          />
        ) : (
          <>
            <Image
              src={excursion.images?.[0] || '/placeholder.jpg'}
              alt={excursion.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto z-20">
          <Link href="/excursions">
            <Button variant="outline" className="mb-4 bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg border-2 border-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Excursions
            </Button>
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-serif drop-shadow-2xl headline-animated">
            {excursion.name}
          </h1>
          <div className="mt-2">
            <PharaonicDecoration variant="inline" size="sm" />
          </div>
          <div className="flex items-center gap-4 text-white flex-wrap">
            <Badge className="bg-pharaoh-gold/95 backdrop-blur-sm text-white px-4 py-2 text-lg shadow-lg">
              {excursion.category.replace(/^\w/, (c) => c.toUpperCase())} & Cultural
            </Badge>
            <span className="text-xl font-semibold drop-shadow-lg">{excursion.duration}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-nile-blue mb-4 font-serif">About This Excursion</h2>
              <p className="text-ancient-stone text-lg leading-relaxed whitespace-pre-line">
                {excursion.description}
              </p>
            </Card>

            {/* Highlights */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-nile-blue mb-6 font-serif">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {excursion.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-pharaoh-gold mt-0.5 shrink-0" />
                    <span className="text-ancient-stone">{highlight}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Gallery */}
            {excursion.images && excursion.images.length > 0 && (
              <Card className="p-8 bg-linear-to-br from-white to-pharaoh-gold/5">
                <h2 className="text-3xl font-bold text-nile-blue mb-6 font-serif">Photo Gallery</h2>
                <ImageGallery
                  images={excursion.images.map(img => ({ url: img, alt: excursion.name }))}
                  columns={3}
                />
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-nile-blue mb-2">Ready to Explore?</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-ancient-stone">Duration</span>
                  <span className="font-semibold text-nile-blue">{excursion.duration}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-ancient-stone">Group Size</span>
                  <span className="font-semibold text-nile-blue">{excursion.groupSize}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ancient-stone">Category</span>
                  <Badge className="bg-pharaoh-gold text-white capitalize">
                    {excursion.category}
                  </Badge>
                </div>
              </div>

              <Link href="/contact">
                <Button className="w-full bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-white text-lg py-6">
                  Book This Excursion
                </Button>
              </Link>

              <div className="mt-4 text-center text-sm text-ancient-stone">
                Contact us for custom pricing and availability
              </div>
            </Card>

            {/* Quick Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-nile-blue mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Expert Guide</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Curated Route</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Photography</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-pharaoh-gold" />
                  <span className="text-ancient-stone">Flexible Hours</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
