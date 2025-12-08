import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, Star, CheckCircle, XCircle, Wifi, Utensils, Car, Waves } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Dahabiyas | Luxury Nile Cruise Comparison | AltaVida Tours',
  description: 'Compare our luxury dahabiyas to find the perfect Nile cruise for your journey. Detailed comparison of amenities, capacity, and features.',
  keywords: 'compare dahabiyas, Nile cruise comparison, luxury cruise comparison, Egypt travel',
};

export default function CompareDahabiyasPage() {
  const dahabiyas = [
    {
      name: 'Royal Cleopatra',
      capacity: '12 Guests',
      cabins: '6 Suites',
      rating: '5.0',
      features: ['Master Suite', 'Gourmet Dining', 'Private Transfers', 'Sun Deck'],
      price: 'Premium',
      color: 'blue'
    },
    {
      name: 'Princess Cleopatra',
      capacity: '10 Guests',
      cabins: '5 Suites',
      rating: '4.9',
      features: ['Princess Suite', 'Fine Dining', 'Airport Transfers', 'Observation Deck'],
      price: 'Luxury',
      color: 'purple'
    },
    {
      name: 'Queen Cleopatra',
      capacity: '8 Guests',
      cabins: '4 Suites',
      rating: '4.8',
      features: ['Royal Suite', 'Royal Dining', 'Royal Transfers', 'Royal Deck'],
      price: 'Royal',
      color: 'amber'
    },
    {
      name: 'AZHAR I',
      capacity: '14 Guests',
      cabins: '7 Cabins',
      rating: '4.7',
      features: ['Master Cabin', 'Authentic Cuisine', 'Comfortable Transfers', 'Traditional Deck'],
      price: 'Traditional',
      color: 'emerald'
    },
    {
      name: 'AZHAR II',
      capacity: '16 Guests',
      cabins: '8 Suites',
      rating: '4.6',
      features: ['Executive Suite', 'Modern Cuisine', 'Smart Transfers', 'Modern Deck'],
      price: 'Contemporary',
      color: 'indigo'
    }
  ];

  const features = [
    { name: 'WiFi', icon: Wifi },
    { name: 'Dining', icon: Utensils },
    { name: 'Transfers', icon: Car },
    { name: 'Deck', icon: Waves }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compare Dahabiyas</h1>
              <p className="text-gray-600 mt-2">Find the perfect luxury Nile cruise for your journey</p>
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

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                  {dahabiyas.map((dahabiya) => (
                    <th key={dahabiya.name} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">{dahabiya.name}</span>
                        <span className="text-xs text-gray-500">{dahabiya.price}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Capacity */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Capacity</td>
                  {dahabiyas.map((dahabiya) => (
                    <td key={dahabiya.name} className="px-6 py-4 text-center text-sm text-gray-700">
                      <div className="flex items-center justify-center space-x-1">
                        <Users size={16} />
                        <span>{dahabiya.capacity}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Cabins */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Cabins</td>
                  {dahabiyas.map((dahabiya) => (
                    <td key={dahabiya.name} className="px-6 py-4 text-center text-sm text-gray-700">
                      {dahabiya.cabins}
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Rating</td>
                  {dahabiyas.map((dahabiya) => (
                    <td key={dahabiya.name} className="px-6 py-4 text-center text-sm text-gray-700">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="text-yellow-400" size={16} />
                        <span>{dahabiya.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                {features.map((feature, index) => (
                  <tr key={feature.name} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center space-x-2">
                        <feature.icon size={16} className="text-gray-600" />
                        <span>{feature.name}</span>
                      </div>
                    </td>
                    {dahabiyas.map((dahabiya) => (
                      <td key={dahabiya.name} className="px-6 py-4 text-center text-sm text-gray-700">
                        <CheckCircle className="text-green-500 mx-auto" size={20} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Individual Dahabiya Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dahabiyas.map((dahabiya) => (
            <div key={dahabiya.name} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{dahabiya.name}</h3>
                <p className="text-sm text-gray-600">{dahabiya.price} Experience</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">{dahabiya.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabins:</span>
                  <span className="font-semibold">{dahabiya.cabins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400" size={16} />
                    <span className="font-semibold">{dahabiya.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                <ul className="space-y-1">
                  {dahabiya.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={`/dahabiyas/${dahabiya.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`w-full bg-${dahabiya.color}-600 text-white py-2 px-4 rounded-lg hover:bg-${dahabiya.color}-700 transition-colors text-center block font-semibold`}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-6">Our travel experts can help you select the perfect dahabiya for your Nile cruise</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Our Experts
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
