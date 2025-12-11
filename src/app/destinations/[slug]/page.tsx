import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import DestinationDetailHero from '@/components/destinations/DestinationDetailHero';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Zap, Heart, Share2 } from 'lucide-react';

async function getDestination(slug: string) {
  // Guard against invalid slug values (undefined, array)
  if (!slug || Array.isArray(slug)) return null;

  try {
    const destination = await prisma.destination.findUnique({
      where: { slug },
    });

    if (!destination) return null;
    return destination;
  } catch (error) {
    // Log the error for debugging but avoid crashing the request
    // Prisma errors sometimes surface as panics; returning null lets the page render a 404 instead
    // Keep the console.error to help trace the underlying cause locally
    // eslint-disable-next-line no-console
    console.error('Error fetching destination by slug:', slug, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const destination = await getDestination(params.slug);

  if (!destination)
    return { title: 'Destination Not Found' };

  return {
    title: `${destination.name} - AltaVida Tours`,
    description: destination.description || `Explore ${destination.name} with AltaVida Tours`,
    openGraph: {
      title: destination.name,
      description: destination.description || undefined,
      images: destination.imageCover ? [{ url: destination.imageCover, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = await getDestination(params.slug);

  if (!destination) {
    notFound();
  }

  const highlights = (destination.highlights as string[]) || [];
  const images = (destination.images as string[]) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            ← Back to Destinations
          </Link>
          <div className="flex gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Add to Wishlist">
              <Heart className="w-6 h-6 text-gray-600 hover:text-red-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <DestinationDetailHero
        name={destination.name}
        imageCover={destination.imageCover}
        region={destination.region}
        country={destination.country}
        highlights={highlights}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-red-600" />
              <h3 className="font-semibold text-gray-900">Location</h3>
            </div>
            <p className="text-lg text-gray-700">
              {destination.region && `${destination.region}, `}
              {destination.country}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-600">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Highlights</h3>
            </div>
            <p className="text-lg text-gray-700">{highlights.length} Amazing Attractions</p>
          </div>
        </div>

        {/* Description Section */}
        {destination.description && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Discover {destination.name}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{destination.description}</p>
          </div>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">Key Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-amber-400">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">✨</div>
                    <p className="text-gray-800 font-medium">{highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {images.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">Photo Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                >
                  <Image
                    src={image}
                    alt={`${destination.name} - Image ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 bg-linear-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-8 text-white mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-serif mb-4">Experience {destination.name}</h2>
            <p className="text-lg mb-8 opacity-90">
              Discover the magic of {destination.name} with our expertly curated tours and packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/packages"
                className="bg-white text-red-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                View Packages
              </Link>
              <Link
                href="/tailor-made"
                className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
              >
                Tailor-Made Trip
              </Link>
            </div>
          </div>
        </section>

        {/* Related Destinations */}
        <section>
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">Explore More Destinations</h2>
          <div className="text-center text-gray-600">
            <p className="mb-6">Discover other amazing destinations and plan your next adventure.</p>
            <Link href="/destinations" className="inline-block text-red-600 font-semibold hover:text-red-700 text-lg">
              View All Destinations →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
