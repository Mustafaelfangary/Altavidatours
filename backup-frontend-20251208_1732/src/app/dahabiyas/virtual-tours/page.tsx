import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Play, Camera, MapPin, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Virtual Tours | 360° Dahabiya Tours | AltaVida Tours',
  description: 'Take virtual tours of our luxury dahabiyas with 360° views. Explore cabins, decks, and amenities before booking your Nile cruise.',
  keywords: 'virtual tours, 360 tours, dahabiya tours, Nile cruise virtual tour, Egypt travel',
};

export default function VirtualToursPage() {
  const tours = [
    {
      name: 'Royal Cleopatra',
      description: 'Experience ultimate luxury with our 360° virtual tour',
      duration: '5 min',
      views: 'Master Suite, Sun Deck, Dining Room',
      image: '/images/virtual-tours/royal-cleopatra.jpg',
      link: '/dahabiyas/royal-cleopatra'
    },
    {
      name: 'Princess Cleopatra',
      description: 'Discover elegant comfort through our immersive tour',
      duration: '4 min',
      views: 'Princess Suite, Observation Deck, Lounge',
      image: '/images/virtual-tours/princess-cleopatra.jpg',
      link: '/dahabiyas/princess-cleopatra'
    },
    {
      name: 'Queen Cleopatra',
      description: 'Explore regal majesty with our royal virtual experience',
      duration: '4 min',
      views: 'Royal Suite, Royal Deck, Dining Hall',
      image: '/images/virtual-tours/queen-cleopatra.jpg',
      link: '/dahabiyas/queen-cleopatra'
    },
    {
      name: 'AZHAR I',
      description: 'Step into traditional charm with our authentic tour',
      duration: '5 min',
      views: 'Master Cabin, Traditional Deck, Common Areas',
      image: '/images/virtual-tours/azhar-i.jpg',
      link: '/dahabiyas/azhar-i'
    },
    {
      name: 'AZHAR II',
      description: 'Experience contemporary elegance in our modern tour',
      duration: '5 min',
      views: 'Executive Suite, Modern Deck, Tech Areas',
      image: '/images/virtual-tours/azhar-ii.jpg',
      link: '/dahabiyas/azhar-ii'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Virtual Tours</h1>
              <p className="text-gray-600 mt-2">Explore our luxury dahabiyas with immersive 360° virtual tours</p>
            </div>
            <Link 
              href="/dahabiyas" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dahabiyas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Experience Before You Book</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Take immersive 360° virtual tours of our luxury dahabiyas. Explore every cabin, deck, and amenity 
            from the comfort of your home before making your booking decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-lg px-6 py-3">
              <Camera size={20} />
              <span>360° Views</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-lg px-6 py-3">
              <Play size={20} />
              <span>Interactive Tours</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-lg px-6 py-3">
              <MapPin size={20} />
              <span>Every Detail</span>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <div key={tour.name} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Tour Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play size={48} className="mx-auto mb-2" />
                    <p className="text-sm font-semibold">Start Virtual Tour</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {tour.duration}
                </div>
              </div>

              {/* Tour Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
                <p className="text-gray-600 mb-4">{tour.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Clock size={16} />
                    <span>Duration: {tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Users size={16} />
                    <span>Views: {tour.views}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2">
                    <Play size={16} />
                    <span>Start Tour</span>
                  </button>
                  <Link 
                    href={tour.link}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Virtual Tours Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Play size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Start Tour</h3>
              <p className="text-gray-600">Click the play button to begin your immersive 360° experience</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Camera size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Explore</h3>
              <p className="text-gray-600">Navigate through cabins, decks, and common areas with interactive controls</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Book</h3>
              <p className="text-gray-600">Ready to book? Contact us or view detailed information about your chosen dahabiya</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Real Thing?</h2>
          <p className="text-xl mb-6">After exploring our virtual tours, book your actual Nile cruise adventure</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Your Cruise
            </Link>
            <Link 
              href="/dahabiyas" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View All Dahabiyas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
