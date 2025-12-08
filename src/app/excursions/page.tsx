'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContent } from '@/hooks/useContent';
import { 
  Landmark, 
  Building2, 
  Ship, 
  Bike, 
  Waves, 
  Sparkles, 
  UtensilsCrossed, 
  ShoppingBag, 
  Palmtree,
  Camera,
  MapPin,
  Clock,
  Users,
  Star,
  ChevronRight,
  Sunset,
  Mountain,
  Globe
} from 'lucide-react';

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

const excursions: Excursion[] = [
  // Historical and Cultural Excursions
  {
    id: 'giza-pyramids-sphinx',
    name: 'Giza Pyramids and Sphinx',
    description: 'Take a guided tour to the iconic pyramids and the Sphinx, with options for camel rides. Experience the grandeur of ancient Egypt at one of the Seven Wonders of the Ancient World.',
    highlights: [
      'Visit the Great Pyramid of Khufu',
      'Explore the Pyramid of Khafre and Menkaure',
      'See the enigmatic Great Sphinx',
      'Optional camel ride around the pyramids',
      'Professional Egyptologist guide'
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
    icon: Landmark
  },
  {
    id: 'cairo-museum-tours',
    name: 'Cairo Museum Tours',
    description: 'Visit the Grand Egyptian Museum (GEM) and the older Egyptian Museum to see ancient artifacts and Tutankhamun\'s treasures. Explore the world\'s largest collection of pharaonic antiquities.',
    highlights: [
      'Grand Egyptian Museum visit',
      'Tutankhamun\'s complete collection',
      'Royal mummies hall',
      'Ancient artifacts and treasures',
      'Expert museum guide'
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
    icon: Building2
  },
  {
    id: 'luxor-karnak',
    name: 'Luxor and Karnak',
    description: 'Explore the temples and tombs of Luxor, including the Valley of the Kings and Karnak Temple, often with a sunrise hot air balloon option. Discover the ancient capital of Egypt.',
    highlights: [
      'Valley of the Kings exploration',
      'Karnak Temple complex',
      'Temple of Hatshepsut',
      'Colossi of Memnon',
      'Optional hot air balloon ride at sunrise'
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
    icon: Mountain
  },
  {
    id: 'nile-river-cruises',
    name: 'Nile River Cruises',
    description: 'Take a Nile cruise, typically starting in Luxor or Aswan, with options for multi-day trips that include stops at other sites. Sail through history on the legendary Nile River.',
    highlights: [
      'Multi-day luxury cruise',
      'Stops at ancient temples',
      'Onboard entertainment',
      'Gourmet dining',
      'Sunrise and sunset views'
    ],
    duration: '3-7 Days',
    groupSize: 'Various capacities',
    category: 'historical',
    images: [
      '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg',
      '/WhatsApp Image 2025-11-22 at 00.51.22.jpeg',
      '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg'
    ],
    icon: Ship
  },
  {
    id: 'abu-simbel',
    name: 'Abu Simbel',
    description: 'Go on a full-day tour from Aswan to see the temples of Abu Simbel. Marvel at the colossal statues of Ramses II and the stunning rock-cut temples.',
    highlights: [
      'Great Temple of Ramses II',
      'Temple of Hathor and Nefertari',
      'Colossal statues',
      'UNESCO World Heritage Site',
      'Professional guide'
    ],
    duration: 'Full Day (10-12 hours)',
    groupSize: 'Up to 15 people',
    category: 'historical',
    images: [
      '/cultural&historical/IMG_0133.JPG',
      '/cultural&historical/IMG_0514.JPG',
      '/cultural&historical/IMG_0515.JPG'
    ],
    icon: Landmark
  },
  {
    id: 'alexandria-day-trip',
    name: 'Alexandria Day Trip',
    description: 'Take a day trip from Cairo to explore the coastal city of Alexandria. Discover the Mediterranean charm and ancient wonders of Egypt\'s second-largest city.',
    highlights: [
      'Bibliotheca Alexandrina',
      'Qaitbay Citadel',
      'Catacombs of Kom el Shoqafa',
      'Montaza Palace gardens',
      'Mediterranean seafood lunch'
    ],
    duration: 'Full Day (10-12 hours)',
    groupSize: 'Up to 15 people',
    category: 'historical',
    images: [
      '/Alexandria/IMG_6198.JPG',
      '/Alexandria/IMG_6201.JPG',
      '/Alexandria/IMG_6274.JPG',
      '/Alexandria/IMG_6282.JPG',
      '/Alexandria/IMG_6334.JPG'
    ],
    icon: Globe
  },
  {
    id: 'sound-light-shows',
    name: 'Sound and Light Shows',
    description: 'Experience the history of the Pyramids or other sites through a captivating sound and light show. Watch ancient monuments come alive with spectacular illumination and narration.',
    highlights: [
      'Pyramids sound and light show',
      'Karnak Temple illumination',
      'Historical narration',
      'Spectacular light effects',
      'Evening entertainment'
    ],
    duration: '2-3 hours',
    groupSize: 'Large groups',
    category: 'historical',
    images: [
      '/cultural&historical/DSCF1165.JPG',
      '/cultural&historical/DSC_8652.JPG'
    ],
    icon: Sparkles
  },

  // Desert and Red Sea Adventures
  {
    id: 'quad-biking-safari',
    name: 'Quad Biking and Safari',
    description: 'Go on a quad bike or 6x6 buggy adventure in the desert, often including a camel ride, BBQ dinner, and show in areas like Sharm El Sheikh. Experience the thrill of desert exploration.',
    highlights: [
      'Quad bike desert adventure',
      'Camel ride experience',
      'Bedouin village visit',
      'Traditional BBQ dinner',
      'Cultural entertainment show'
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
    icon: Bike
  },
  {
    id: 'snorkeling-diving',
    name: 'Snorkeling and Diving',
    description: 'Explore the marine life at popular spots on the Red Sea, such as the Dolphin House in Hurghada or the reefs near Marsa Alam. Discover the underwater wonders of the Red Sea.',
    highlights: [
      'Dolphin House snorkeling',
      'Coral reef exploration',
      'Colorful marine life',
      'Professional diving instructors',
      'Equipment provided'
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
    icon: Waves
  },
  {
    id: 'stargazing',
    name: 'Stargazing',
    description: 'Take a desert safari to go stargazing with a jeep. Experience the crystal-clear night sky of the Egyptian desert, far from city lights.',
    highlights: [
      'Desert jeep safari',
      'Professional astronomy guide',
      'Telescope viewing',
      'Bedouin tea and snacks',
      'Milky Way observation'
    ],
    duration: 'Evening (3-4 hours)',
    groupSize: 'Up to 12 people',
    category: 'desert',
    images: [
      '/desert&safary/DSC_9895.JPG',
      '/desert&safary/DSC_9907.JPG'
    ],
    icon: Sparkles
  },
  {
    id: 'dune-bashing',
    name: 'Dune Bashing',
    description: 'Experience a thrilling dune bashing safari in the desert. Feel the adrenaline rush as you conquer the towering sand dunes in a 4x4 vehicle.',
    highlights: [
      '4x4 desert adventure',
      'Expert safari driver',
      'Sandboarding opportunity',
      'Sunset viewing',
      'Photo opportunities'
    ],
    duration: 'Half Day (3-4 hours)',
    groupSize: 'Up to 6 per vehicle',
    category: 'desert',
    images: [
      '/desert&safary/DSC_9908.JPG',
      '/desert&safary/DSC_9912.JPG'
    ],
    icon: Mountain
  },

  // Other Excursions
  {
    id: 'nile-dinner-cruise',
    name: 'Nile Dinner Cruise',
    description: 'Enjoy a dinner cruise on the Nile in Cairo with traditional entertainment. Experience Egyptian cuisine and culture while sailing on the legendary river.',
    highlights: [
      'Buffet dinner on the Nile',
      'Traditional belly dancing',
      'Tanoura show',
      'Live music',
      'Panoramic river views'
    ],
    duration: 'Evening (2-3 hours)',
    groupSize: 'Large groups',
    category: 'other',
    featured: true,
    images: [
      '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
      '/WhatsApp Image 2025-11-22 at 00.51.35.jpeg'
    ],
    icon: UtensilsCrossed
  },
  {
    id: 'khan-el-khalili',
    name: 'Khan El Khalili Bazaar',
    description: 'Wander through the famous bazaar for a shopping and cultural experience in Old Cairo. Immerse yourself in the vibrant atmosphere of this historic marketplace.',
    highlights: [
      'Historic marketplace exploration',
      'Traditional crafts and souvenirs',
      'Spice market visit',
      'Local coffee house experience',
      'Bargaining tips from guide'
    ],
    duration: 'Half Day (3-4 hours)',
    groupSize: 'Up to 15 people',
    category: 'other',
    images: [
      '/cultural&historical/IMG_6828.JPG',
      '/cultural&historical/IMG_0456.JPG'
    ],
    icon: ShoppingBag
  },
  {
    id: 'siwa-oasis',
    name: 'Siwa Oasis',
    description: 'Take a multi-day trip to the remote and natural Siwa Oasis. Discover this hidden gem in the Western Desert with its unique culture and stunning landscapes.',
    highlights: [
      'Cleopatra\'s Spring',
      'Temple of the Oracle',
      'Salt lakes swimming',
      'Traditional Siwan culture',
      'Desert camping experience'
    ],
    duration: '2-3 Days',
    groupSize: 'Up to 10 people',
    category: 'other',
    images: [
      '/desert&safary/DSC_9895.JPG',
      '/cultural&historical/IMG_3143.JPG'
    ],
    icon: Palmtree
  }
];

export default function ExcursionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'historical' | 'desert' | 'other'>('all');
  const { getContent, loading } = useContent({ page: 'excursions' });

  const filteredExcursions = selectedCategory === 'all'
    ? excursions
    : excursions.filter(exc => exc.category === selectedCategory);

  const featuredExcursions = excursions.filter(exc => exc.featured);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'historical':
        return 'bg-pharaoh-gold/20 text-pharaoh-gold border-pharaoh-gold/30';
      case 'desert':
        return 'bg-desert-sand/30 text-orange-700 border-orange-300';
      case 'other':
        return 'bg-nile-blue/20 text-nile-blue border-nile-blue/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'historical':
        return 'Historical & Cultural';
      case 'desert':
        return 'Desert & Red Sea';
      case 'other':
        return 'Other Experiences';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-nile-blue/5">
      <Navbar />
      
      {/* Hero Section with Slideshow */}
      <div className="relative h-[70vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={[
            '/cultural&historical/IMG_2798.JPG',
            '/desert&safary/DSC_9166.JPG',
            '/RedSea/1659705495000.jpg',
            '/Alexandria/IMG_6198.JPG',
            '/cultural&historical/IMG_6857.JPG',
            '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg'
          ]}
          alt="Egypt Excursions"
          autoPlay={true}
          interval={5000}
          height="h-full"
          className="rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <Badge className="mb-6 bg-pharaoh-gold/90 text-black px-6 py-2 text-lg font-semibold">
              {getContent('excursions_hero_badge', 'Discover Egypt')}
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-serif drop-shadow-2xl">
              {getContent('excursions_hero_title', 'Excursions & Adventures')}
            </h1>
            <div className="mb-6">
              <PharaonicText className="text-white/90 text-2xl" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              {getContent('excursions_hero_subtitle', 'Embark on unforgettable journeys through ancient wonders, desert landscapes, and vibrant culture')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-black font-semibold px-8 py-6 text-lg"
                onClick={() => document.getElementById('excursions-list')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {getContent('excursions_hero_button', 'Explore Excursions')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg"
                >
                  {getContent('excursions_hero_contact_button', 'Contact Us')}
                </Button>
              </Link>
            </div>
            <div className="mt-8">
              <PharaonicDecoration variant="section" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Excursions Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pharaoh-gold/20 text-pharaoh-gold border-pharaoh-gold/30">
            {getContent('excursions_featured_badge', 'Most Popular')}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
            {getContent('excursions_featured_title', 'Featured Experiences')}
          </h2>
          <PharaonicDecoration variant="section" size="md" />
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            {getContent('excursions_featured_subtitle', 'Our most sought-after adventures that showcase the best of Egypt')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {featuredExcursions.map((excursion) => {
            const IconComponent = excursion.icon;
            return (
              <Card 
                key={excursion.id} 
                className="group overflow-hidden bg-gradient-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/60 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={excursion.images[0]}
                    alt={excursion.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getCategoryColor(excursion.category)} backdrop-blur-sm`}>
                      {getCategoryLabel(excursion.category)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-pharaoh-gold/90 rounded-lg">
                        <IconComponent className="h-5 w-5 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-serif">
                        {excursion.name}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {excursion.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{excursion.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{excursion.groupSize}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/excursions/${excursion.id}`}>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-pharaoh-gold to-pharaoh-gold/80 hover:from-pharaoh-gold/90 hover:to-pharaoh-gold/70 text-black font-semibold"
                      >
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button 
                        variant="outline"
                        className="border-pharaoh-gold/30 text-pharaoh-gold hover:bg-pharaoh-gold/10"
                      >
                        Book
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Excursions Section */}
      <div id="excursions-list" className="bg-gradient-to-br from-pharaoh-gold/5 via-white to-nile-blue/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent">
              {getContent('excursions_all_title', 'All Excursions')}
            </h2>
            <PharaonicDecoration variant="section" size="md" />
            <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
              {getContent('excursions_all_subtitle', 'Browse our complete collection of tours and experiences')}
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="all" className="w-full mb-12">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-auto p-2 bg-white/50 backdrop-blur-sm border-2 border-pharaoh-gold/20">
              <TabsTrigger
                value="all"
                onClick={() => setSelectedCategory('all')}
                className="data-[state=active]:bg-pharaoh-gold data-[state=active]:text-black font-semibold py-3"
              >
                {getContent('excursions_tab_all', 'All Tours')}
              </TabsTrigger>
              <TabsTrigger
                value="historical"
                onClick={() => setSelectedCategory('historical')}
                className="data-[state=active]:bg-pharaoh-gold data-[state=active]:text-black font-semibold py-3"
              >
                {getContent('excursions_tab_historical', 'Historical')}
              </TabsTrigger>
              <TabsTrigger
                value="desert"
                onClick={() => setSelectedCategory('desert')}
                className="data-[state=active]:bg-pharaoh-gold data-[state=active]:text-black font-semibold py-3"
              >
                {getContent('excursions_tab_desert', 'Desert & Sea')}
              </TabsTrigger>
              <TabsTrigger
                value="other"
                onClick={() => setSelectedCategory('other')}
                className="data-[state=active]:bg-pharaoh-gold data-[state=active]:text-black font-semibold py-3"
              >
                {getContent('excursions_tab_other', 'Other')}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Excursions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredExcursions.map((excursion) => {
              const IconComponent = excursion.icon;
              return (
                <Card 
                  key={excursion.id} 
                  className="group overflow-hidden bg-white border-2 border-gray-200 hover:border-pharaoh-gold/60 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden">
                      <Image
                        src={excursion.images[0]}
                        alt={excursion.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(excursion.category)} backdrop-blur-sm`}>
                          {getCategoryLabel(excursion.category)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 md:w-1/2 flex flex-col">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-pharaoh-gold/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-pharaoh-gold" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif flex-1">
                          {excursion.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {excursion.description}
                      </p>
                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-pharaoh-gold" />
                          <span className="font-medium">{excursion.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-pharaoh-gold" />
                          <span className="font-medium">{excursion.groupSize}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href="/contact" className="flex-1">
                          <Button 
                            className="w-full bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-black font-semibold"
                          >
                            Book Now
                          </Button>
                        </Link>
                        <Link href={`/excursions/${excursion.id}`}>
                          <Button 
                            variant="outline"
                            className="border-pharaoh-gold/30 text-pharaoh-gold hover:bg-pharaoh-gold/10"
                          >
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-nile-blue/20 text-nile-blue border-nile-blue/30">
            {getContent('excursions_gallery_badge', 'Gallery')}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
          {getContent('excursions_gallery_title', 'Experience Egypt')}
          </h2>
          <PharaonicDecoration variant="section" size="md" />
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
          {getContent('excursions_gallery_subtitle', 'A visual journey through our most memorable excursions')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            '/cultural&historical/IMG_2798.JPG',
            '/desert&safary/DSC_9166.JPG',
            '/RedSea/1659705495000.jpg',
            '/Alexandria/IMG_6198.JPG',
            '/cultural&historical/IMG_6857.JPG',
            '/cultural&historical/IMG_6316.JPG',
            '/desert&safary/DSC_9814.JPG',
            '/RedSea/FB_IMG_1468343472163.jpg',
            '/Alexandria/IMG_6274.JPG',
            '/cultural&historical/IMG_2970.JPG',
            '/desert&safary/DSC_9895.JPG',
            '/cultural&historical/IMG_0456.JPG'
          ].map((image, index) => (
            <div 
              key={index} 
              className="relative h-64 overflow-hidden rounded-lg group cursor-pointer"
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            {getContent('excursions_cta_title', 'Ready for Your Egyptian Adventure?')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {getContent('excursions_cta_subtitle', 'Contact us today to customize your perfect excursion package')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-pharaoh-gold font-semibold px-8 py-6 text-lg"
              >
                {getContent('excursions_cta_button', 'Get in Touch')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/packages">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                {getContent('excursions_cta_packages_button', 'View Packages')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}