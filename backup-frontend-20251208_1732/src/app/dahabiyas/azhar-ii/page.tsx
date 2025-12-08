import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Calendar, MapPin, Clock, Wifi, Car, Utensils, Waves } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AZHAR II Dahabiya | Contemporary Nile Cruise | AltaVida Tours',
  description: 'Experience contemporary elegance aboard the AZHAR II dahabiya. Modern Nile cruise with sleek design and contemporary luxury.',
  keywords: 'AZHAR II, contemporary dahabiya, Nile cruise, Egypt travel, modern cruise',
};

export default function AzharIIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-indigo-900 to-indigo-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">AZHAR II</h1>
            <p className="text-xl mb-6 max-w-2xl">Contemporary elegance on water with sleek design and modern luxury</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400" size={20} />
                <span className="text-lg font-semibold">4.6 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>Up to 16 Guests</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contemporary Design</h2>
              <p className="text-lg text-gray-700 mb-6">
                The AZHAR II represents the future of Nile cruising with its contemporary design and modern amenities. 
                This sleek dahabiya combines cutting-edge technology with elegant comfort, offering a fresh perspective 
                on traditional Nile travel.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With its minimalist interiors, state-of-the-art facilities, and innovative design elements, the AZHAR II 
                provides a sophisticated and comfortable experience that appeals to modern travelers seeking both luxury 
                and contemporary style.
              </p>
            </section>

            {/* Features */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contemporary Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Wifi className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">High-Tech Connectivity</h4>
                    <p className="text-gray-600">Ultra-fast WiFi and smart room controls</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Utensils className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Modern Cuisine</h4>
                    <p className="text-gray-600">Contemporary dining with international flavors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Car className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Transfers</h4>
                    <p className="text-gray-600">Modern vehicles with GPS and comfort features</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Waves className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Modern Deck</h4>
                    <p className="text-gray-600">Sleek deck design with contemporary seating</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accommodations */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contemporary Accommodations</h3>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Executive Suite</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• King-size bed with smart mattress</li>
                      <li>• Floor-to-ceiling windows with Nile views</li>
                      <li>• Modern bathroom with rain shower</li>
                      <li>• Smart room controls and entertainment</li>
                      <li>• 24/7 concierge service</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Contemporary Cabins</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Queen-size bed with premium linens</li>
                      <li>• Large windows with panoramic views</li>
                      <li>• Modern bathroom with luxury amenities</li>
                      <li>• Smart climate control system</li>
                      <li>• Daily housekeeping service</li>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Contemporary Journey</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>3 Days / 2 Nights</option>
                    <option>4 Days / 3 Nights</option>
                    <option>7 Days / 6 Nights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>6 Guests</option>
                    <option>8 Guests</option>
                    <option>10 Guests</option>
                    <option>12 Guests</option>
                    <option>14 Guests</option>
                    <option>16 Guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                  Check Availability
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contemporary Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">16 Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Length:</span>
                  <span className="font-semibold">48 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabins:</span>
                  <span className="font-semibold">8 Suites</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crew:</span>
                  <span className="font-semibold">12 Members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-semibold">2021</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-indigo-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Contemporary Experience?</h2>
          <p className="text-xl mb-6">Contact us today to book your modern Nile cruise aboard the AZHAR II</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/dahabiyas" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              View All Dahabiyas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
