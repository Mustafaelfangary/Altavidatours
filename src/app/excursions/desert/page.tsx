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
  Bike, 
  Waves, 
  Sparkles, 
  Mountain,
  Clock,
  Users,
  ChevronRight,
  Camera,
  ArrowLeft
} from 'lucide-react';

const desertExcursions = [
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
    images: [
      '/desert&safary/DSC_9908.JPG',
      '/desert&safary/DSC_9912.JPG'
    ],
    icon: Mountain
  }
];

export default function DesertExcursionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={[
            '/desert&safary/DSC_9166.JPG',
            '/RedSea/1659705495000.jpg',
            '/desert&safary/DSC_9814.JPG',
            '/RedSea/FB_IMG_1468343472163.jpg',
            '/desert&safary/DSC_9895.JPG'
          ]}
          alt="Desert & Red Sea Adventures"
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
            <Badge className="mb-6 bg-orange-500/90 text-white px-6 py-2 text-lg font-semibold">
              Desert & Red Sea
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-serif drop-shadow-2xl">
              Adventure Awaits
            </h1>
            <div className="mb-6">
              <PharaonicText className="text-white/90 text-2xl" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Experience the thrill of Egypt's deserts and the beauty of the Red Sea
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-orange-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
            Desert & Red Sea Adventures
          </h2>
          <PharaonicDecoration variant="section" size="md" />
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            Thrilling adventures in Egypt's stunning natural landscapes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {desertExcursions.map((excursion) => {
            const IconComponent = excursion.icon;
            return (
              <Card 
                key={excursion.id} 
                className="group overflow-hidden bg-white border-2 border-gray-200 hover:border-orange-500/60 shadow-lg hover:shadow-2xl transition-all duration-500"
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
                        <Badge className="bg-orange-500/90 text-white backdrop-blur-sm">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:w-1/2 flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <IconComponent className="h-6 w-6 text-orange-600" />
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
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">{excursion.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">{excursion.groupSize}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/contact" className="flex-1">
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                        >
                          Book Now
                        </Button>
                      </Link>
                      <Link href={`/excursions/${excursion.id}`}>
                        <Button
                          variant="outline"
                          className="border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
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
      <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-500/20 text-orange-600 border-orange-500/30">
              Gallery
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-r from-orange-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
              Adventure Highlights
            </h2>
            <PharaonicDecoration variant="section" size="md" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '/desert&safary/DSC_9166.JPG',
              '/RedSea/1659705495000.jpg',
              '/desert&safary/DSC_9814.JPG',
              '/RedSea/FB_IMG_1468343472163.jpg',
              '/desert&safary/DSC_9895.JPG',
              '/RedSea/FB_IMG_1474204861825.jpg',
              '/desert&safary/DSC_9908.JPG',
              '/RedSea/FB_IMG_1503932804009.jpg'
            ].map((image, index) => (
              <div 
                key={index} 
                className="relative h-64 overflow-hidden rounded-lg group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`Adventure ${index + 1}`}
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
      <div className="bg-gradient-to-r from-orange-600 via-blue-600 to-orange-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Ready for an Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your desert or Red Sea adventure today and create unforgettable memories
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-orange-600 font-semibold px-8 py-6 text-lg"
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