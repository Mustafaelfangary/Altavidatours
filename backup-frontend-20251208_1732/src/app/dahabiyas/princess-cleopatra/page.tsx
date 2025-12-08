import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Calendar, MapPin, Clock, Wifi, Car, Utensils, Waves } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Princess Cleopatra Dahabiya | Elegant Nile Cruise | AltaVida Tours',
  description: 'Experience elegant comfort aboard the Princess Cleopatra dahabiya. Sophisticated Nile cruise with refined amenities and exceptional service.',
  keywords: 'Princess Cleopatra, elegant dahabiya, Nile cruise, Egypt travel, sophisticated cruise',
};

export default function PrincessCleopatraPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-purple-900 to-purple-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Princess Cleopatra</h1>
            <p className="text-xl mb-6 max-w-2xl">Elegant comfort on the Nile with sophisticated amenities and refined service</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400" size={20} />
                <span className="text-lg font-semibold">4.9 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>Up to 10 Guests</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Elegant Sophistication</h2>
              <p className="text-lg text-gray-700 mb-6">
                The Princess Cleopatra embodies refined elegance and sophisticated comfort. This beautiful dahabiya 
                offers an intimate and luxurious experience, perfect for discerning travelers seeking both comfort 
                and authenticity on their Nile journey.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With carefully curated interiors, exceptional dining, and personalized attention to detail, the Princess 
                Cleopatra provides an unforgettable experience that combines modern luxury with traditional Egyptian 
                charm.
              </p>
            </section>

            {/* Features */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Elegant Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Wifi className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Complimentary WiFi</h4>
                    <p className="text-gray-600">High-speed internet access throughout the vessel</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Utensils className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Fine Dining</h4>
                    <p className="text-gray-600">Gourmet meals featuring local and international cuisine</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Car className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Airport Transfers</h4>
                    <p className="text-gray-600">Comfortable transfers to and from the vessel</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Waves className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Observation Deck</h4>
                    <p className="text-gray-600">Spacious deck with panoramic Nile views</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accommodations */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Elegant Accommodations</h3>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Princess Suite</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Queen-size bed with luxury linens</li>
                      <li>• Private balcony overlooking the Nile</li>
                      <li>• Elegant bathroom with modern amenities</li>
                      <li>• Mini-refrigerator and coffee maker</li>
                      <li>• Personal butler service</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Deluxe Cabins</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Comfortable twin or double beds</li>
                      <li>• Large windows with Nile views</li>
                      <li>• Modern bathroom facilities</li>
                      <li>• Individual air conditioning</li>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Journey</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>3 Days / 2 Nights</option>
                    <option>4 Days / 3 Nights</option>
                    <option>7 Days / 6 Nights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>6 Guests</option>
                    <option>8 Guests</option>
                    <option>10 Guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                  Check Availability
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">10 Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Length:</span>
                  <span className="font-semibold">40 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabins:</span>
                  <span className="font-semibold">5 Suites</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crew:</span>
                  <span className="font-semibold">10 Members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-semibold">2019</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Princess Experience?</h2>
          <p className="text-xl mb-6">Contact us today to book your elegant Nile cruise aboard the Princess Cleopatra</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/dahabiyas" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              View All Dahabiyas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
