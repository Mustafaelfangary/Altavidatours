import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Calendar, MapPin, Clock, Wifi, Car, Utensils, Waves } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AZHAR I Dahabiya | Traditional Nile Cruise | AltaVida Tours',
  description: 'Experience traditional charm aboard the AZHAR I dahabiya. Authentic Nile cruise combining traditional elegance with modern luxury.',
  keywords: 'AZHAR I, traditional dahabiya, Nile cruise, Egypt travel, authentic cruise',
};

export default function AzharIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-emerald-900 to-emerald-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">AZHAR I</h1>
            <p className="text-xl mb-6 max-w-2xl">Traditional charm meets modern luxury on this authentic Nile experience</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400" size={20} />
                <span className="text-lg font-semibold">4.7 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>Up to 14 Guests</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Authentic Tradition</h2>
              <p className="text-lg text-gray-700 mb-6">
                The AZHAR I represents the perfect blend of traditional Egyptian craftsmanship and modern comfort. 
                This authentic dahabiya maintains the classic design elements that have made Nile cruising legendary, 
                while incorporating contemporary amenities for today's discerning travelers.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With its traditional wooden construction, elegant sails, and warm hospitality, the AZHAR I offers 
                an authentic Nile experience that connects you with the timeless beauty and rich history of Egypt's 
                most important waterway.
              </p>
            </section>

            {/* Features */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Wifi className="text-emerald-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Modern Connectivity</h4>
                    <p className="text-gray-600">WiFi and modern amenities in traditional setting</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Utensils className="text-emerald-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Authentic Cuisine</h4>
                    <p className="text-gray-600">Traditional Egyptian dishes with modern presentation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Car className="text-emerald-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Comfortable Transfers</h4>
                    <p className="text-gray-600">Reliable transfers maintaining traditional hospitality</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Waves className="text-emerald-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Traditional Deck</h4>
                    <p className="text-gray-600">Classic deck design with authentic Egyptian elements</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accommodations */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional Accommodations</h3>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Master Cabin</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Comfortable double bed with Egyptian cotton</li>
                      <li>• Traditional wooden windows with Nile views</li>
                      <li>• Authentic bathroom with modern facilities</li>
                      <li>• Traditional furnishings with modern comfort</li>
                      <li>• Personal service with Egyptian hospitality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Standard Cabins</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Twin or double beds with quality linens</li>
                      <li>• Traditional windows overlooking the Nile</li>
                      <li>• Modern bathroom facilities</li>
                      <li>• Individual air conditioning</li>
                      <li>• Daily traditional housekeeping</li>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Traditional Journey</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option>3 Days / 2 Nights</option>
                    <option>4 Days / 3 Nights</option>
                    <option>7 Days / 6 Nights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>6 Guests</option>
                    <option>8 Guests</option>
                    <option>10 Guests</option>
                    <option>12 Guests</option>
                    <option>14 Guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                  Check Availability
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Traditional Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">14 Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Length:</span>
                  <span className="font-semibold">42 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabins:</span>
                  <span className="font-semibold">7 Cabins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crew:</span>
                  <span className="font-semibold">10 Members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-semibold">2017</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-emerald-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Traditional Experience?</h2>
          <p className="text-xl mb-6">Contact us today to book your authentic Nile cruise aboard the AZHAR I</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/dahabiyas" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              View All Dahabiyas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
