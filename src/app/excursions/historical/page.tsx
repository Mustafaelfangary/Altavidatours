'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import imageLoader from '@/utils/imageLoader';
import { 
  Landmark, 
  Building2, 
  Ship, 
  Mountain,
  Globe,
  Sparkles,
  Clock,
  Users,
  ChevronRight,
  Camera,
  ArrowLeft
} from 'lucide-react';

const historicalExcursions = [
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
    images: [
      '/cultural&historical/DSCF1165.JPG',
      '/cultural&historical/DSC_8652.JPG'
    ],
    icon: Sparkles
  }
];

export default function HistoricalExcursionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/5">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={[
            '/cultural&historical/IMG_2798.JPG',
            '/cultural&historical/IMG_6857.JPG',
            '/Alexandria/IMG_6198.JPG',
            '/cultural&historical/IMG_6316.JPG',
            '/cultural&historical/IMG_2970.JPG'
          ]}
          alt="Historical & Cultural Excursions"
          autoPlay={true}
          interval={5000}
          height="h-full"
          className="rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <Link href="/excursions" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to All Excursions</span>
            </Link>
            <Badge className="mb-6 bg-pharaoh-gold/90 text-black px-6 py-2 text-lg font-semibold">
              Historical & Cultural
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-serif drop-shadow-2xl">
              Ancient Wonders
            </h1>
            <div className="mb-6">
              <PharaonicText className="text-white/90 text-2xl" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Journey through millennia of history and discover the magnificent monuments of ancient Egypt
            </p>
            <div className="mt-8">
              <PharaonicDecoration variant="section" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Excursions Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
            Historical & Cultural Tours
          </h2>
          <PharaonicDecoration variant="section" size="md" />
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            Explore Egypt's rich heritage with our expertly curated historical tours
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {historicalExcursions.map((excursion) => {
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
                      loader={imageLoader}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {excursion.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-pharaoh-gold/90 text-black backdrop-blur-sm">
                          Featured
                        </Badge>
                      </div>
                    )}
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

      {/* Gallery Section */}
      <div className="bg-gradient-to-br from-pharaoh-gold/5 via-white to-nile-blue/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pharaoh-gold/20 text-pharaoh-gold border-pharaoh-gold/30">
              Gallery
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
              Historical Treasures
            </h2>
            <PharaonicDecoration variant="section" size="md" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '/cultural&historical/IMG_2798.JPG',
              '/cultural&historical/IMG_6857.JPG',
              '/Alexandria/IMG_6198.JPG',
              '/cultural&historical/IMG_6316.JPG',
              '/cultural&historical/IMG_2970.JPG',
              '/cultural&historical/IMG_6828.JPG',
              '/Alexandria/IMG_6274.JPG',
              '/cultural&historical/IMG_0456.JPG'
            ].map((image, index) => (
              <div 
                key={index} 
                className="relative h-64 overflow-hidden rounded-lg group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`Historical site ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loader={imageLoader}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Ready to Explore Ancient Egypt?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your historical tour today and walk in the footsteps of pharaohs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-pharaoh-gold font-semibold px-8 py-6 text-lg"
              >
                Contact Us
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/excursions">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                View All Excursions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}