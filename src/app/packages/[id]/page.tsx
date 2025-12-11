import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import PackageDetailHero from '@/components/packages/PackageDetailHero';
import IncludesExcludes from '@/components/packages/IncludesExcludes';
import { ArrowLeft, Share2, MapPin, Users, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id } });
  
  if (!pkg) return { title: 'Package Not Found' };
  
  return {
    title: `${pkg.name} - AltaVida Tours`,
    description: pkg.shortDescription || pkg.description,
    openGraph: {
      title: pkg.name,
      description: pkg.shortDescription || pkg.description,
      images: pkg.mainImage ? [{ url: pkg.mainImage, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
  });

  if (!pkg) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/packages" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Packages
          </Link>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <PackageDetailHero
        name={pkg.name}
        mainImage={pkg.mainImage}
        price={pkg.price}
        discountPrice={pkg.discountPrice}
        destination={pkg.destination}
        duration={pkg.duration}
        maxGroupSize={pkg.maxGroupSize}
        category={pkg.category}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-red-600" />
              <h3 className="font-semibold text-gray-900">Destination</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pkg.destination}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-600">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Duration</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pkg.duration} Days</p>
          </div>

          {pkg.maxGroupSize && (
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-600">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Group Size</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">Up to {pkg.maxGroupSize}</p>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">About This Package</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{pkg.description}</p>
          {pkg.shortDescription && (
            <p className="text-base text-gray-600 italic border-l-4 border-amber-400 pl-6">{pkg.shortDescription}</p>
          )}
        </div>

        {/* Includes/Excludes */}
        <IncludesExcludes
          includes={pkg.includes as string[] | undefined}
          excludes={pkg.excludes as string[] | undefined}
        />

        {/* Gallery */}
        {pkg.images && pkg.images.length > 0 && (
          <section className="py-12 bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">Photo Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(pkg.images as string[]).map((image, idx) => (
                <div key={idx} className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <Image
                    src={image}
                    alt={`${pkg.name} - Image ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 bg-linear-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-serif mb-4">Ready to Experience {pkg.name}?</h2>
            <p className="text-lg mb-8 opacity-90">Join us for an unforgettable journey. Book now or contact us for more information.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                Book Now
              </button>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Related Packages */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">You May Also Like</h2>
          <div className="text-center text-gray-600">
            <p>Explore other amazing packages and create your perfect trip.</p>
            <Link href="/packages" className="inline-block mt-4 text-red-600 font-semibold hover:text-red-700">
              View All Packages →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 