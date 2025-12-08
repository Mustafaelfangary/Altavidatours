import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ItineraryGallery from '@/components/dahabiya/ItineraryGallery';

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      itineraryDays: {
        include: { images: true },
        orderBy: { dayNumber: 'asc' },
      },
    },
  });
  if (!pkg) return notFound();
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-xl mb-10">
        <Image
          src={pkg.mainImageUrl || '/placeholder.jpg'}
          alt={pkg.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2 font-serif drop-shadow-lg">{pkg.name}</h1>
          <p className="text-lg opacity-90 mb-2">{pkg.shortDescription}</p>
          <div className="flex gap-6 items-center">
            <span className="bg-amber-500 text-white font-bold px-4 py-1 rounded-full text-lg shadow">${pkg.price.toLocaleString()}</span>
            <span className="bg-emerald-600 text-white font-bold px-4 py-1 rounded-full text-lg shadow">{pkg.durationDays} days</span>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-emerald-900 font-serif">About this Package</h2>
        <p className="text-lg text-gray-800 leading-relaxed bg-white/80 rounded-xl p-6 shadow">{pkg.description}</p>
      </div>
      {/* Itinerary Section */}
      {pkg.itineraryDays.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-emerald-800 font-serif text-center">Itinerary</h2>
          <div className="space-y-10">
            {pkg.itineraryDays.map((day) => (
              <div key={day.id} className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl shadow-lg p-8 animate-fade-in">
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
                  <ItineraryGallery
                    images={day.images.map(({ url, alt }) => ({ url, alt: alt ?? undefined }))}
                    dayTitle={day.title}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Booking/Inquiry Button */}
      <div className="flex justify-center mt-12">
        <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full text-xl shadow-lg transition-all">Book or Inquire Now</button>
      </div>
    </div>
  );
} 