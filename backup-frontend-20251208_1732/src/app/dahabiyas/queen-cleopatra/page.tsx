import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Calendar, MapPin, Clock, Wifi, Car, Utensils, Waves } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Queen Cleopatra Dahabiya | Regal Nile Cruise | AltaVida Tours',
  description: 'Experience regal sailing aboard the Queen Cleopatra dahabiya. Majestic Nile cruise with royal amenities and exceptional luxury.',
  keywords: 'Queen Cleopatra, regal dahabiya, Nile cruise, Egypt travel, royal cruise',
};

export default function QueenCleopatraPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-amber-900 to-amber-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Queen Cleopatra</h1>
            <p className="text-xl mb-6 max-w-2xl">Regal sailing experience with majestic amenities and royal treatment</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400" size={20} />
                <span className="text-lg font-semibold">4.8 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>Up to 8 Guests</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>3-7 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Royal Majesty</h2>
              <p className="text-lg text-gray-700 mb-6">
                The Queen Cleopatra embodies the grandeur and majesty of ancient Egyptian royalty. This magnificent 
                dahabiya offers a truly regal experience, combining traditional elegance with modern luxury in a 
                way that honors the legacy of Egypt's most famous queen.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With opulent interiors, world-class service, and attention to every royal detail, the Queen Cleopatra 
                provides an unforgettable journey that makes you feel like royalty sailing on the sacred waters of the Nile.
              </p>
            </section>

            {/* Features */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Royal Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Wifi className="text-amber-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Premium WiFi</h4>
                    <p className="text-gray-600">High-speed internet with royal priority access</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Utensils className="text-amber-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Royal Dining</h4>
                    <p className="text-gray-600">Gourmet cuisine fit for royalty</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Car className="text-amber-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Royal Transfers</h4>
                    <p className="text-gray-600">Luxury vehicle transfers with royal treatment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Waves className="text-amber-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Royal Deck</h4>
                    <p className="text-gray-600">Majestic deck with throne-like seating</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accommodations */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Royal Accommodations</h3>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Royal Suite</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• King-size bed with silk linens</li>
                      <li>• Private royal balcony with Nile views</li>
                      <li>• Marble bathroom with gold fixtures</li>
                      <li>• Royal mini-bar and champagne service</li>
                      <li>• Personal royal butler</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Noble Cabins</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Queen-size bed with luxury linens</li>
                      <li>• Large windows with royal Nile views</li>
                      <li>• Elegant bathroom with premium amenities</li>
                      <li>• Individual climate control</li>
                      <li>• Royal housekeeping service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Royal Journey</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                    <option>3 Days / 2 Nights</option>
                    <option>4 Days / 3 Nights</option>
                    <option>7 Days / 6 Nights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>6 Guests</option>
                    <option>8 Guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-semibold">
                  Check Royal Availability
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Royal Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">8 Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Length:</span>
                  <span className="font-semibold">38 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabins:</span>
                  <span className="font-semibold">4 Suites</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crew:</span>
                  <span className="font-semibold">8 Members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-semibold">2018</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-amber-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Royal Experience?</h2>
          <p className="text-xl mb-6">Contact us today to book your majestic Nile cruise aboard the Queen Cleopatra</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/dahabiyas" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              View All Dahabiyas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
