'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, Star, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';

import { Decimal } from '@prisma/client/runtime/library';

interface PackageImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  isActive: boolean;
}

export interface Activity {
  id: string;
  description: string;
  time: string;
  order: number;
  [key: string]: any;
}

export interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  isActive: boolean;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: Date;
  isApproved: boolean;
}

export interface PackageDetailProps {
  pkg: {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    price: number; // Convert Decimal to number when passing the prop
    duration: number;
    durationDays: number;
    maxPeople: number;
    mainImageUrl: string;
    isFeaturedOnHomepage: boolean;
    homepageOrder: number;
    images: PackageImage[];
    itineraries: ItineraryDay[];
    reviews: Review[];
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    category?: string;
    rating?: number;
    reviewCount?: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function PackageDetail({ pkg }: PackageDetailProps) {
  const mainImage = pkg.mainImageUrl || (pkg.images?.length ? pkg.images[0].url : '/images/placeholder-package.jpg');
  const galleryImages = pkg.images?.filter(img => img.url !== mainImage) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Package Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{pkg.name}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          {pkg.rating && (
            <div className="flex items-center mr-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{pkg.rating.toFixed(1)}</span>
              {pkg.reviewCount && (
                <span className="ml-1 text-sm">({pkg.reviewCount} reviews)</span>
              )}
            </div>
          )}
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Egypt</span>
          </div>
        </div>
        
        {pkg.shortDescription && (
          <p className="text-lg text-gray-700 mb-6">{pkg.shortDescription}</p>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5 text-travelok-blue mr-2" />
            <span>{`${pkg.durationDays} ${pkg.durationDays === 1 ? 'Day' : 'Days'}`}</span>
          </div>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
            <Users className="w-5 h-5 text-travelok-blue mr-2" />
            <span>Max {pkg.maxPeople} People</span>
          </div>
          {pkg.category && (
            <Badge variant="secondary" className="text-sm">
              {pkg.category}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery */}
        <div className="lg:col-span-2">
          <div className="relative h-96 w-full rounded-xl overflow-hidden mb-4">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={pkg.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((image) => (
                <div key={image.id} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.alt || pkg.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Booking & Info */}
        <div className="lg:sticky lg:top-4 h-fit">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="mb-6">
              <div className="text-3xl font-bold text-travelok-blue mb-2">
                {formatCurrency(pkg.price)}
                <span className="text-base font-normal text-gray-500"> / person</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Inclusive of all taxes</p>
              
              <Button className="w-full bg-travelok-blue hover:bg-travelok-blue-dark text-white py-6 text-lg">
                Book Now
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Have questions?{' '}
                  <a href="/contact" className="text-travelok-blue hover:underline">
                    Contact us
                  </a>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-lg mb-3">Highlights</h3>
              <ul className="space-y-2">
                {pkg.highlights?.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-travelok-green mt-0.5 mr-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="prose max-w-none">
              <h3>About This Package</h3>
              <p>{String(pkg.description)}</p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h4>What's Included</h4>
                  <ul>
                    {pkg.inclusions?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-travelok-green mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4>What's Not Included</h4>
                  <ul>
                    {pkg.exclusions?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <XCircle className="w-4 h-4 text-rose-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itinerary">
            <div className="space-y-8">
              {pkg.itineraries?.filter(day => day.isActive).map((day) => (
                <div key={day.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{String(day.description)}</p>
                  
                  {day.activities && day.activities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Activities:</h4>
                      <ul className="space-y-2">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-travelok-blue mt-0.5">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                            <span>{String(activity.description)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            {pkg.reviews && pkg.reviews.length > 0 ? (
              <div className="space-y-6">
                {pkg.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{review.author}</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.content}</p>
                    <div className="text-sm text-gray-500">
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }).format(new Date(review.createdAt))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                <Button variant="outline" className="mt-4">Write a Review</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper components
const CheckCircle2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const XCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);
