'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Star, Users, Calendar, MapPin, Camera, Utensils } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

export default function RomanticGetawaysPage() {
  const { getContent } = useContent({ page: 'packages_romantic' });

  const packages = [
    {
      name: getContent('romantic_pkg_1_name', 'Honeymoon Paradise'),
      duration: getContent('romantic_pkg_1_duration', '7 Days'),
      price: getContent('romantic_pkg_1_price', 'From $2,500'),
      description: getContent('romantic_pkg_1_desc', 'Ultimate romantic experience with private dinners and couples spa treatments'),
      features: [
        getContent('romantic_pkg_1_feature_1', 'Private balcony dinners'),
        getContent('romantic_pkg_1_feature_2', 'Couples spa treatments'),
        getContent('romantic_pkg_1_feature_3', 'Sunset champagne'),
        getContent('romantic_pkg_1_feature_4', 'Romantic decorations')
      ],
      image: getContent('romantic_pkg_1_image', '/images/packages/honeymoon.jpg')
    },
    {
      name: getContent('romantic_pkg_2_name', 'Anniversary Celebration'),
      duration: getContent('romantic_pkg_2_duration', '5 Days'),
      price: getContent('romantic_pkg_2_price', 'From $1,800'),
      description: getContent('romantic_pkg_2_desc', 'Celebrate your love with special anniversary packages and romantic surprises'),
      features: [
        getContent('romantic_pkg_2_feature_1', 'Anniversary dinner'),
        getContent('romantic_pkg_2_feature_2', 'Romantic room setup'),
        getContent('romantic_pkg_2_feature_3', 'Couples massage'),
        getContent('romantic_pkg_2_feature_4', 'Memory book')
      ],
      image: getContent('romantic_pkg_2_image', '/images/packages/anniversary.jpg')
    },
    {
      name: getContent('romantic_pkg_3_name', "Valentine's Special"),
      duration: getContent('romantic_pkg_3_duration', '4 Days'),
      price: getContent('romantic_pkg_3_price', 'From $1,500'),
      description: getContent('romantic_pkg_3_desc', "Perfect Valentine's Day escape with romantic activities and intimate moments"),
      features: [
        getContent('romantic_pkg_3_feature_1', "Valentine's dinner"),
        getContent('romantic_pkg_3_feature_2', 'Rose petal bath'),
        getContent('romantic_pkg_3_feature_3', 'Couples cooking class'),
        getContent('romantic_pkg_3_feature_4', 'Romantic gifts')
      ],
      image: getContent('romantic_pkg_3_image', '/images/packages/valentine.jpg')
    }
  ];

  const romanticFeatures = [
    {
      icon: Heart,
      title: getContent('romantic_feature_1_title', 'Private Dining'),
      description: getContent('romantic_feature_1_desc', 'Intimate dinners under the stars with personalized menus')
    },
    {
      icon: Camera,
      title: getContent('romantic_feature_2_title', 'Romantic Photography'),
      description: getContent('romantic_feature_2_desc', 'Professional couple photos to capture your special moments')
    },
    {
      icon: Utensils,
      title: getContent('romantic_feature_3_title', 'Couples Cooking'),
      description: getContent('romantic_feature_3_desc', 'Learn to cook traditional Egyptian dishes together')
    },
    {
      icon: Star,
      title: getContent('romantic_feature_4_title', 'Sunset Cruises'),
      description: getContent('romantic_feature_4_desc', 'Private sunset sailing with champagne and canapés')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getContent('romantic_title', 'Romantic Getaways')}</h1>
              <p className="text-gray-600 mt-2">{getContent('romantic_subtitle', 'Perfect couples retreat on the Nile')}</p>
            </div>
            <Link
              href="/packages"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{getContent('romantic_back_btn', 'Back to Packages')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-pink-900 to-rose-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">{getContent('romantic_hero_title', 'Perfect Couples Retreat')}</h2>
            <p className="text-xl mb-6 max-w-2xl">
              {getContent('romantic_hero_desc', 'Create unforgettable memories with our romantic Nile cruise getaways. Experience intimate luxury, private dining, and magical moments together.')}
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Heart size={20} />
                <span>{getContent('romantic_badge_1', 'Couples Only')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={20} />
                <span>{getContent('romantic_badge_2', 'Romantic Amenities')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>{getContent('romantic_badge_3', 'Private Service')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Romantic Packages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{getContent('romantic_packages_title', 'Romantic Packages')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                  <Heart size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{pkg.duration}</span>
                    <span className="text-lg font-bold text-pink-600">{pkg.price}</span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center space-x-2">
                          <Heart className="text-pink-500" size={14} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors font-semibold">
                    {getContent('romantic_book_btn', 'Book This Package')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Romantic Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{getContent('romantic_features_title', 'Romantic Features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {romanticFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Romantic Getaways */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{getContent('romantic_why_title', 'Why Choose Our Romantic Getaways?')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{getContent('romantic_intimate_title', 'Intimate Experience')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• {getContent('romantic_intimate_1', 'Private cabins with romantic decorations')}</li>
                  <li>• {getContent('romantic_intimate_2', 'Personal butler service for couples')}</li>
                  <li>• {getContent('romantic_intimate_3', 'Intimate dining experiences')}</li>
                  <li>• {getContent('romantic_intimate_4', 'Couples-only activities and excursions')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{getContent('romantic_special_title', 'Special Touches')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• {getContent('romantic_special_1', 'Rose petal decorations')}</li>
                  <li>• {getContent('romantic_special_2', 'Champagne and chocolate surprises')}</li>
                  <li>• {getContent('romantic_special_3', 'Romantic music and ambiance')}</li>
                  <li>• {getContent('romantic_special_4', 'Memory keepsakes and photos')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Information */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">{getContent('romantic_cta_title', 'Ready to Create Magic Together?')}</h2>
            <p className="text-center mb-6">
              {getContent('romantic_cta_desc', 'Book your romantic getaway and create unforgettable memories on the Nile')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {getContent('romantic_cta_book_btn', 'Book Your Romantic Getaway')}
              </Link>
              <Link
                href="/packages"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors"
              >
                {getContent('romantic_cta_view_btn', 'View All Packages')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
