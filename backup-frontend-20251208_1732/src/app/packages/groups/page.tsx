import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, Star, Calendar, MapPin, Camera, Utensils, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Group Bookings | Special Group Rates | AltaVida Tours',
  description: 'Special group booking rates for families, friends, and organizations. Exclusive group packages with personalized service and group discounts.',
  keywords: 'group bookings, group rates, family groups, corporate groups, group discounts, Egypt group travel',
};

export default function GroupBookingsPage() {
  const groupTypes = [
    {
      name: 'Family Groups',
      size: '6-16 People',
      discount: '15% Off',
      description: 'Perfect for family reunions and multi-generational trips',
      features: ['Family-friendly activities', 'Interconnecting cabins', 'Kids\' programs', 'Family dining options'],
      image: '/images/groups/family.jpg'
    },
    {
      name: 'Friends Groups',
      size: '8-20 People',
      discount: '20% Off',
      description: 'Ideal for friend groups and social gatherings',
      features: ['Group activities', 'Social spaces', 'Group excursions', 'Evening entertainment'],
      image: '/images/groups/friends.jpg'
    },
    {
      name: 'Corporate Groups',
      size: '10-30 People',
      discount: '25% Off',
      description: 'Professional retreats and corporate team building',
      features: ['Meeting facilities', 'Team building activities', 'Professional guides', 'Corporate dining'],
      image: '/images/groups/corporate.jpg'
    }
  ];

  const groupBenefits = [
    {
      icon: Users,
      title: 'Group Discounts',
      description: 'Special rates for groups of 6 or more people'
    },
    {
      icon: Star,
      title: 'Personalized Service',
      description: 'Dedicated group coordinator and customized itinerary'
    },
    {
      icon: Camera,
      title: 'Group Activities',
      description: 'Exclusive group excursions and special experiences'
    },
    {
      icon: Heart,
      title: 'Flexible Planning',
      description: 'Customizable packages to suit your group\'s needs'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Group Bookings</h1>
              <p className="text-gray-600 mt-2">Special group rates and personalized service</p>
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
      <div className="relative h-[60vh] bg-gradient-to-r from-green-900 to-emerald-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Group Adventures</h2>
            <p className="text-xl mb-6 max-w-2xl">
              Bring your family, friends, or colleagues together for an unforgettable Nile cruise experience. 
              Special group rates and personalized service for groups of 6 or more.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>6+ People</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={20} />
                <span>Group Discounts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Flexible Dates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Group Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Group Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groupTypes.map((group, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <Users size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{group.size}</span>
                    <span className="text-lg font-bold text-green-600">{group.discount}</span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {group.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center space-x-2">
                          <Users className="text-green-500" size={14} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    Get Group Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Group Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Group Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {groupBenefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Group Packages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Group Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Standard Group Package</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-semibold">6-12 People</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold text-green-600">15% Off</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">4-7 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">From $1,200/person</span>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• Group coordinator</li>
                <li>• Private group excursions</li>
                <li>• Group dining arrangements</li>
                <li>• Flexible itinerary</li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Request Quote
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Group Package</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-semibold">12+ People</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold text-green-600">25% Off</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">5-10 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">From $1,500/person</span>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• Dedicated group manager</li>
                <li>• Exclusive group activities</li>
                <li>• Private dahabiya charter</li>
                <li>• Customized experiences</li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Request Quote
              </button>
            </div>
          </div>
        </section>

        {/* Group Planning Process */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Group Planning Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600 text-sm">Reach out with your group size and preferences</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Quote</h3>
                <p className="text-gray-600 text-sm">We\'ll create a personalized package and quote</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Together</h3>
                <p className="text-gray-600 text-sm">Work with our team to finalize your itinerary</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoy</h3>
                <p className="text-gray-600 text-sm">Experience your perfect group adventure</p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Information */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Ready to Plan Your Group Adventure?</h2>
            <p className="text-center mb-6">
              Contact us today to start planning your group Nile cruise experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Group Quote
              </Link>
              <Link 
                href="/packages" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
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
