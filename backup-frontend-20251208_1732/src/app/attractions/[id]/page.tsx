'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/ui/Hero';
import { CTABand } from '@/components/ui/CTABand';
import { attractions } from '@/data/attractions';
import type { Attraction } from '@/data/attractions';
import { MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AttractionDetailPage() {
  const params = useParams();
  const attractionId = params?.id as string;

  const attraction = attractions.find((a: Attraction) => a.id === attractionId);

  if (!attraction) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-travelok-blue-dark mb-4">Attraction Not Found</h1>
          <p className="text-travelok-gray mb-6">The attraction you're looking for doesn't exist.</p>
          <Link href="/attractions">
            <Button>View All Attractions</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title={attraction.name}
        subtitle={attraction.description}
        backgroundImage={attraction.image}
        height="medium"
      />

      {/* Attraction Details Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Overview */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-travelok-blue-dark mb-6">About This Attraction</h2>
                
                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-travelok-gray">
                    <MapPin className="w-5 h-5 text-travelok-blue" />
                    <span className="font-semibold">{attraction.location}</span>
                  </div>
                  {attraction.duration && (
                    <div className="flex items-center gap-2 text-travelok-gray">
                      <Clock className="w-5 h-5 text-travelok-blue" />
                      <span className="font-semibold">{attraction.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-travelok-gray">
                    <Star className="w-5 h-5 text-travelok-orange fill-current" />
                    <span className="font-semibold">4.8/5 Rating</span>
                  </div>
                </div>

                <p className="text-travelok-gray leading-relaxed text-lg">
                  {attraction.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-travelok-blue-dark mb-6">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attraction.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                      <Star className="w-5 h-5 text-travelok-orange fill-current flex-shrink-0 mt-0.5" />
                      <span className="text-travelok-gray">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {attraction.gallery && attraction.gallery.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-travelok-blue-dark mb-6">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {attraction.gallery.map((image, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                        <Image
                          src={image}
                          alt={`${attraction.name} - Image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Visit Info Card */}
                <div className="card-travelok p-6">
                  <h3 className="text-xl font-bold text-travelok-blue-dark mb-4">Visitor Information</h3>
                  <div className="space-y-4">
                    {attraction.openingHours && (
                      <div>
                        <p className="text-sm font-semibold text-travelok-gray mb-1">Opening Hours</p>
                        <p className="text-travelok-dark">{attraction.openingHours}</p>
                      </div>
                    )}
                    {attraction.admissionFee && (
                      <div>
                        <p className="text-sm font-semibold text-travelok-gray mb-1">Admission Fee</p>
                        <p className="text-travelok-dark">{attraction.admissionFee}</p>
                      </div>
                    )}
                    {attraction.duration && (
                      <div>
                        <p className="text-sm font-semibold text-travelok-gray mb-1">Recommended Duration</p>
                        <p className="text-travelok-dark">{attraction.duration}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-travelok-gray mb-1">Category</p>
                      <span className="inline-block px-3 py-1 bg-travelok-blue text-white rounded-full text-sm font-semibold">
                        {attraction.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Book Tour Card */}
                <div className="card-travelok p-6 bg-gradient-to-br from-travelok-blue to-travelok-blue-light text-white">
                  <h3 className="text-xl font-bold mb-3">Include in Your Tour</h3>
                  <p className="text-white/90 text-sm mb-6">
                    This attraction is featured in many of our tour packages
                  </p>
                  <Link href="/packages">
                    <Button className="w-full bg-white text-travelok-blue hover:bg-gray-100 font-semibold py-6">
                      View Packages
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <CTABand
        title="Explore More Attractions"
        description="Discover other amazing sites and experiences in Egypt"
        ctaText="View All Attractions"
        ctaLink="/attractions"
        variant="blue"
      />
    </main>
  );
}