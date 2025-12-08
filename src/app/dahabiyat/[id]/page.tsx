import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import ReviewList from "@/components/ReviewList";
import CategorizedGallery from "@/components/dahabiya/CategorizedGallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import ItineraryGallery from "@/components/dahabiya/ItineraryGallery";

interface DahabiyaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: DahabiyaPageProps): Promise<Metadata> {
  const { id } = await params;
  const dahabiya = await prisma.dahabiya.findUnique({
    where: { id },
  });

  if (!dahabiya) {
    return {
      title: "Dahabiya Not Found",
    };
  }

  return {
    title: dahabiya.name,
    description: dahabiya.shortDescription || dahabiya.description,
  };
}

export default async function DahabiyaPage({ params }: DahabiyaPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const dahabiya = await prisma.dahabiya.findUnique({
    where: { id },
    include: {
      images: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      itinerary: {
        include: {
          days: {
            include: { images: true },
            orderBy: { dayNumber: 'asc' },
          },
        },
      },
    },
  });

  if (!dahabiya) {
    notFound();
  }

  // Convert Decimal values to numbers and fix image alt types
  const serializedDahabiya = {
    ...dahabiya,
    pricePerDay: Number(dahabiya.pricePerDay),
    capacity: Number(dahabiya.capacity),
    rating: Number(dahabiya.rating),
    averageRating: dahabiya.reviews.length > 0
      ? Number(dahabiya.reviews.reduce((acc, review) => acc + review.rating, 0) / dahabiya.reviews.length)
      : 0,
    images: dahabiya.images.map(img => ({ ...img, alt: img.alt ?? undefined })),
    itinerary: dahabiya.itinerary ? {
      ...dahabiya.itinerary,
      days: dahabiya.itinerary.days.map(day => ({
        ...day,
        images: day.images.map(img => ({ ...img, alt: img.alt ?? undefined }))
      }))
    } : null,
    uniqueness: "Why is this Dahabiya different from regular Nile Cruises?",
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative h-[60vh] rounded-2xl overflow-hidden mb-12">
          <Image
            src={serializedDahabiya.images[0]?.url || '/placeholder.jpg'}
            alt={serializedDahabiya.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{serializedDahabiya.name}</h1>
            <p className="text-lg opacity-90">{serializedDahabiya.shortDescription}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold mb-6">About this Dahabiya</h2>
              <div className="prose max-w-none">
                <p>{serializedDahabiya.description}</p>
              </div>
            </div>

            {/* Why Choose This Dahabiya */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-red-900 font-serif">
                Why Choose This Dahabiya?
              </h2>
              <div className="prose max-w-none text-red-900">
                <p className="text-lg leading-relaxed">{serializedDahabiya.advantages}</p>
              </div>
            </div>

            {/* The Meaning of Dahabiya */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-900 font-serif">
                The Meaning of Dahabiya
              </h2>
              <div className="prose max-w-none text-blue-900">
                <p className="text-lg leading-relaxed">{serializedDahabiya.meaning}</p>
              </div>
            </div>

            {/* Image Gallery */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Gallery</h2>
              <CategorizedGallery images={serializedDahabiya.images} />
            </div>

            {/* Itinerary Section */}
            {serializedDahabiya.itinerary && serializedDahabiya.itinerary.days.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-8 text-emerald-800 font-serif text-center">Itinerary</h2>
                <div className="space-y-10">
                  {serializedDahabiya.itinerary.days.map((day, idx) => (
                    <div key={day.id} className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg p-8 animate-fade-in">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-lg">
                          {day.dayNumber}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-emerald-900 mb-1 font-serif">{day.title}</h3>
                          <p className="text-gray-700 text-lg font-sans">{day.description}</p>
                        </div>
                      </div>
                      {day.images.length > 0 && (
                        <ItineraryGallery images={day.images} dayTitle={day.title} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {serializedDahabiya.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg"
                  >
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Reviews</h2>
              <ReviewList reviews={serializedDahabiya.reviews} dahabiyaId={serializedDahabiya.id} />
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Book This Dahabiya</h2>
              <BookingForm
                dahabiyaId={serializedDahabiya.id}
                price={serializedDahabiya.pricePerDay}
                minDays={1}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-2xl font-bold">${serializedDahabiya.pricePerDay.toString()}</p>
                    <p className="text-gray-600">per day</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: Math.round(serializedDahabiya.averageRating) }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      ({serializedDahabiya.reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <BookingForm dahabiyaId={serializedDahabiya.id} price={serializedDahabiya.pricePerDay} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 