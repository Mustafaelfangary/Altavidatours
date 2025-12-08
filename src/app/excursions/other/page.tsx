'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Palmtree,
  Clock,
  Users,
  ChevronRight,
  Camera,
  ArrowLeft
} from 'lucide-react';

const otherExcursions = [
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
    images: [
      '/desert&safary/DSC_9895.JPG',
      '/cultural&historical/IMG_3143.JPG'
    ],
    icon: Palmtree
  }
];

export default function OtherExcursionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={[
            '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
            '/cultural&historical/IMG_6828.JPG',
            '/desert&safary/DSC_9895.JPG',
            '/WhatsApp Image 2025-11-22 at 00.51.35.jpeg'
          ]}
          alt="Other Experiences"
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
            <Badge className="mb-6 bg-emerald-500/90 text-white px-6 py-2 text-lg font-semibold">
              Unique Experiences
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-serif drop-shadow-2xl">
              Cultural Delights
            </h1>
            <div className="mb-6">
              <PharaonicText className="text-white/90 text-2xl" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Immerse yourself in Egypt's vibrant culture and unique experiences
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-emerald-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Unique Cultural Experiences
          </h2>
          <PharaonicDecoration variant="section" size="md" />
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            Discover the authentic flavors and traditions of Egypt
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {otherExcursions.map((excursion) => {
            const IconComponent = excursion.icon;
            return (
              <Card 
                key={excursion.id} 
                className="group overflow-hidden bg-white border-2 border-gray-200 hover:border-emerald-500/60 shadow-lg hover:shadow-2xl transition-all duration-500"
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
                    {excursion.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-emerald-500/90 text-white backdrop-blur-sm">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:w-1/2 flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <IconComponent className="h-6 w-6 text-emerald-600" />
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
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium">{excursion.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium">{excursion.groupSize}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/contact" className="flex-1">
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          Book Now
                        </Button>
                      </Link>
                      <Link href={`/excursions/${excursion.id}`}>
                        <Button 
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
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
      <div className="bg-gradient-to-br from-emerald-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
              Gallery
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-emerald-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Cultural Moments
            </h2>
            <PharaonicDecoration variant="section" size="md" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg',
              '/cultural&historical/IMG_6828.JPG',
              '/desert&safary/DSC_9895.JPG',
              '/WhatsApp Image 2025-11-22 at 00.51.35.jpeg',
              '/cultural&historical/IMG_0456.JPG',
              '/cultural&historical/IMG_3143.JPG',
              '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg',
              '/cultural&historical/IMG_6316.JPG'
            ].map((image, index) => (
              <div 
                key={index} 
                className="relative h-64 overflow-hidden rounded-lg group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`Cultural experience ${index + 1}`}
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
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-purple-600 to-emerald-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Ready for a Unique Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your cultural adventure today and discover the authentic Egypt
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-emerald-600 font-semibold px-8 py-6 text-lg"
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