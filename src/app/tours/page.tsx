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
  Mountain, 
  Waves, 
  Sparkles, 
  Clock,
  Users,
  ChevronRight,
  Calendar,
  MapPin
} from 'lucide-react';

const tourCategories = [
  {
    id: 'daily-tours',
    name: 'Daily Tours',
    description: 'Short guided trips perfect for exploring Egypt\'s highlights in a day. From the Pyramids to local markets, experience the best of Egypt.',
    href: '/daily-tours',
    image: '/cultural&historical/IMG_2798.JPG',
    icon: Clock,
    featured: true,
    highlights: ['Half-day & full-day options', 'Expert local guides', 'Small group sizes']
  },
  {
    id: 'historical',
    name: 'Historical & Cultural',
    description: 'Journey through millennia of history. Visit ancient temples, tombs, and monuments that tell the story of pharaohs and civilizations.',
    href: '/excursions/historical',
    image: '/cultural&historical/IMG_6857.JPG',
    icon: Landmark,
    featured: true,
    highlights: ['Pyramids & Sphinx', 'Valley of the Kings', 'Ancient temples']
  },
  {
    id: 'desert',
    name: 'Desert & Red Sea',
    description: 'Adventure awaits in Egypt\'s stunning deserts and crystal-clear Red Sea waters. From safari to snorkeling, thrill-seekers welcome.',
    href: '/excursions/desert',
    image: '/desert&safary/DSC_9166.JPG',
    icon: Mountain,
    featured: true,
    highlights: ['Quad biking', 'Snorkeling & diving', 'Desert safaris']
  },
  {
    id: 'other',
    name: 'Unique Experiences',
    description: 'Discover Egypt beyond the usual. Hot air balloon rides, Nile dinner cruises, and authentic local experiences await.',
    href: '/excursions/other',
    image: '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
    icon: Sparkles,
    highlights: ['Hot air balloons', 'Nile dinner cruises', 'Local markets']
  }
];

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-papyrus via-white to-nile-blue/5">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={[
            '/cultural&historical/IMG_2798.JPG',
            '/desert&safary/DSC_9166.JPG',
            '/RedSea/1659705495000.jpg',
            '/cultural&historical/IMG_6857.JPG'
          ]}
          alt="Egypt Tours"
          autoPlay={true}
          interval={5000}
          height="h-full"
          className="rounded-none"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/30 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <Badge className="mb-6 bg-pharaoh-gold/90 text-black px-6 py-2 text-lg font-semibold">
              Explore Egypt
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-serif drop-shadow-2xl">
              Tours & Excursions
            </h1>
            <div className="mb-6">
              <PharaonicText className="text-white/90 text-2xl" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Discover the wonders of ancient Egypt with our expertly curated tours and unforgettable experiences
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-black font-semibold px-8 py-6 text-lg"
                onClick={() => document.getElementById('tour-categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Tours
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/tailor-made">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg"
                >
                  Custom Trip
                </Button>
              </Link>
            </div>
            <div className="mt-8">
              <PharaonicDecoration variant="section" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Tour Categories Section */}
      <div id="tour-categories" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pharaoh-gold/20 text-pharaoh-gold border-pharaoh-gold/30">
            Choose Your Adventure
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-linear-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
            Tour Categories
          </h2>
          <PharaonicDecoration variant="section" size="md" />
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            From ancient wonders to desert adventures, find the perfect tour for your Egyptian journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tourCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className="group overflow-hidden bg-linear-to-br from-white via-pharaoh-gold/5 to-nile-blue/5 border-2 border-pharaoh-gold/30 hover:border-pharaoh-gold/60 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loader={imageLoader}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
                  {category.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-pharaoh-gold/90 text-black backdrop-blur-sm">
                        Popular
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-pharaoh-gold/90 rounded-lg">
                        <IconComponent className="h-5 w-5 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-serif">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="border-pharaoh-gold/30 text-pharaoh-gold">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  <Link href={category.href}>
                    <Button
                      className="w-full bg-linear-to-r from-pharaoh-gold to-pharaoh-gold/80 hover:from-pharaoh-gold/90 hover:to-pharaoh-gold/70 text-black font-semibold"
                    >
                      Explore {category.name}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-linear-to-br from-pharaoh-gold/5 via-white to-nile-blue/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-serif">Quick Links</h2>
            <p className="text-muted-foreground">Jump directly to what interests you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/excursions" className="group p-6 bg-white rounded-xl border-2 border-transparent hover:border-pharaoh-gold/50 shadow-lg hover:shadow-xl transition-all text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-pharaoh-gold" />
              <span className="font-semibold group-hover:text-pharaoh-gold transition-colors">All Excursions</span>
            </Link>
            <Link href="/packages" className="group p-6 bg-white rounded-xl border-2 border-transparent hover:border-pharaoh-gold/50 shadow-lg hover:shadow-xl transition-all text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-nile-blue" />
              <span className="font-semibold group-hover:text-nile-blue transition-colors">Tour Packages</span>
            </Link>
            <Link href="/dahabiyat" className="group p-6 bg-white rounded-xl border-2 border-transparent hover:border-pharaoh-gold/50 shadow-lg hover:shadow-xl transition-all text-center">
              <Waves className="h-8 w-8 mx-auto mb-3 text-pharaoh-gold" />
              <span className="font-semibold group-hover:text-pharaoh-gold transition-colors">Nile Cruises</span>
            </Link>
            <Link href="/gallery" className="group p-6 bg-white rounded-xl border-2 border-transparent hover:border-pharaoh-gold/50 shadow-lg hover:shadow-xl transition-all text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-nile-blue" />
              <span className="font-semibold group-hover:text-nile-blue transition-colors">Photo Gallery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Ready to Explore Egypt?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let us help you plan the perfect Egyptian adventure. Contact our experts today.
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
            <Link href="/tailor-made">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Design Your Trip
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



