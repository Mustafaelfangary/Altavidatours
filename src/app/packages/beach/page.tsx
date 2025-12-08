import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Waves, Star, Users, Calendar, MapPin, Camera, Sun } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Beach Extensions | Red Sea Relaxation | AltaVida Tours',
  description: 'Extend your Nile cruise with Red Sea beach relaxation. Combine ancient history with modern beach luxury in Egypt\'s premier beach destinations.',
  keywords: 'beach extensions, Red Sea, beach vacation, Egypt beach, Hurghada, Sharm El Sheikh',
};

export default function BeachExtensionsPage() {
  const destinations = [
    {
      name: 'Hurghada',
      duration: '3-7 Days',
      price: 'From $800',
      description: 'Perfect blend of beach relaxation and water sports in Egypt\'s premier Red Sea destination',
      features: ['All-inclusive resorts', 'Diving & snorkeling', 'Desert safaris', 'Water sports'],
      image: '/images/beach/hurghada.jpg'
    },
    {
      name: 'Sharm El Sheikh',
      duration: '3-7 Days',
      price: 'From $900',
      description: 'Luxury beach experience with world-class diving and stunning coral reefs',
      features: ['Luxury resorts', 'World-class diving', 'Coral reef tours', 'Spa treatments'],
      image: '/images/beach/sharm.jpg'
    },
    {
      name: 'Marsa Alam',
      duration: '3-5 Days',
      price: 'From $700',
      description: 'Unspoiled beaches and pristine coral reefs for the ultimate beach escape',
      features: ['Pristine beaches', 'Coral reef diving', 'Dolphin watching', 'Eco-friendly resorts'],
      image: '/images/beach/marsa-alam.jpg'
    }
  ];

  const beachFeatures = [
    {
      icon: Waves,
      title: 'Water Activities',
      description: 'Diving, snorkeling, and water sports in crystal-clear waters'
    },
    {
      icon: Sun,
      title: 'Beach Relaxation',
      description: 'Pristine beaches with luxury resort amenities'
    },
    {
      icon: Camera,
      title: 'Marine Life',
      description: 'Explore vibrant coral reefs and exotic marine life'
    },
    {
      icon: Star,
      title: 'Luxury Resorts',
      description: 'World-class accommodations with all-inclusive packages'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Beach Extensions</h1>
              <p className="text-gray-600 mt-2">Red Sea relaxation after your Nile cruise</p>
            </div>
            <Link 
              href="/packages" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Packages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-cyan-900 to-blue-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Red Sea Paradise</h2>
            <p className="text-xl mb-6 max-w-2xl text-justify">
              Extend your Nile cruise adventure with a relaxing beach extension. 
              Experience the best of both worlds - ancient history and modern beach luxury.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Waves size={20} />
                <span>Crystal Clear Waters</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={20} />
                <span>Luxury Resorts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>All-Inclusive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-8">
        {/* Beach Destinations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Beach Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <div key={index} className="egypt-card">
                <div className="relative h-44 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Waves size={48} className="text-white" />
                </div>
                <div className="egypt-card-body">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-3 text-justify">{destination.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{destination.duration}</span>
                    <span className="text-lg font-bold egypt-price">{destination.price}</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {destination.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center space-x-2">
                          <Waves className="text-cyan-500" size={12} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/contact" className="egypt-cta w-full text-center">
                    Book This Destination
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Beach Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Beach Experience Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beachFeatures.map((feature, index) => (
              <div key={index} className="egypt-card text-center">
                <div className="egypt-card-body">
                  <div className="bg-cyan-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <feature.icon size={28} className="text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Beach Extensions */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Why Add Beach Extensions?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Perfect Combination</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Combine ancient history with modern beach luxury</li>
                  <li>• Experience Egypt\'s diverse landscapes</li>
                  <li>• Relax after exploring ancient temples</li>
                  <li>• Create a complete vacation experience</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Red Sea Highlights</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• World-class diving and snorkeling</li>
                  <li>• Pristine coral reefs and marine life</li>
                  <li>• Luxury all-inclusive resorts</li>
                  <li>• Year-round perfect weather</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Package Combinations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Combinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nile + Hurghada</h3>
              <p className="text-gray-600 mb-4">
                Combine a 4-day Nile cruise with 3 days in Hurghada for the perfect cultural and beach experience.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">7 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">From $2,200</span>
                </div>
              </div>
              <button className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors font-semibold">
                Book This Combination
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nile + Sharm El Sheikh</h3>
              <p className="text-gray-600 mb-4">
                Experience luxury with a 5-day Nile cruise followed by 4 days in Sharm El Sheikh\'s premium resorts.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">9 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">From $3,100</span>
                </div>
              </div>
              <button className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors font-semibold">
                Book This Combination
              </button>
            </div>
          </div>
        </section>

        {/* Booking Information */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Ready to Extend Your Adventure?</h2>
            <p className="text-center mb-6">
              Add a beach extension to your Nile cruise and experience the best of Egypt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Book Your Beach Extension
              </Link>
              <Link 
                href="/packages" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors"
              >
                View All Packages
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
