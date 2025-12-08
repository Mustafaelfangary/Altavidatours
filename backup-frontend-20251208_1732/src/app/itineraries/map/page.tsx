'use client';

import Link from 'next/link';
import { ArrowLeft, Map, Calendar, Clock, Users, Star, Camera, BookOpen } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

export default function RouteMapPage() {
  const { getContent } = useContent({ page: 'itinerary_map' });
  const routes = [
    {
      name: 'Luxor to Aswan',
      duration: '4 Days',
      direction: 'Downstream',
      highlights: ['Karnak Temple', 'Valley of the Kings', 'Edfu Temple', 'Kom Ombo Temple', 'Philae Temple'],
      color: 'blue'
    },
    {
      name: 'Aswan to Luxor',
      duration: '4 Days',
      direction: 'Upstream',
      highlights: ['Philae Temple', 'Kom Ombo Temple', 'Edfu Temple', 'Valley of the Kings', 'Karnak Temple'],
      color: 'teal'
    },
    {
      name: 'Short Cruise',
      duration: '3 Days',
      direction: 'Flexible',
      highlights: ['Karnak Temple', 'Valley of the Kings', 'Edfu Temple'],
      color: 'green'
    },
    {
      name: 'Extended Cruise',
      duration: '7 Days',
      direction: 'Round Trip',
      highlights: ['All Major Sites', 'Abu Simbel', 'Esna Temple', 'Additional Excursions'],
      color: 'purple'
    }
  ];

  const mapFeatures = [
    {
      icon: Map,
      title: 'Interactive Maps',
      description: 'Zoom and explore each route with detailed site information'
    },
    {
      icon: Camera,
      title: 'Site Photos',
      description: 'View photos of temples and landmarks along each route'
    },
    {
      icon: BookOpen,
      title: 'Historical Info',
      description: 'Learn about the history and significance of each site'
    },
    {
      icon: Star,
      title: 'Route Planning',
      description: 'Plan your perfect Nile cruise route'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getContent('map_title', 'Route Map')}</h1>
              <p className="text-gray-600 mt-2">{getContent('map_subtitle', 'Explore our Nile cruise routes and ancient sites')}</p>
            </div>
            <Link
              href="/itineraries"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{getContent('map_back_btn', 'Back to Itineraries')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-r from-indigo-900 to-purple-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">{getContent('map_hero_title', 'Nile Cruise Routes')}</h2>
            <p className="text-xl mb-6 max-w-2xl">
              {getContent('map_hero_desc', 'Discover the ancient wonders along the Nile with our interactive route maps. Explore temples, tombs, and historic sites on your journey.')}
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Map size={20} />
                <span>{getContent('map_feature_1', 'Interactive Maps')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Camera size={20} />
                <span>{getContent('map_feature_2', 'Site Photos')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={20} />
                <span>{getContent('map_feature_3', 'Historical Info')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-8">
        {/* Route Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{getContent('map_routes_title', 'Cruise Routes')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{route.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span className="text-sm text-gray-600">{route.duration}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    route.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    route.color === 'teal' ? 'bg-teal-100 text-teal-800' :
                    route.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {route.direction}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                  <ul className="space-y-1">
                    {route.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-gray-700 flex items-center space-x-2">
                        <Star className="text-yellow-400" size={14} />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                  route.color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                  route.color === 'teal' ? 'bg-teal-600 text-white hover:bg-teal-700' :
                  route.color === 'green' ? 'bg-green-600 text-white hover:bg-green-700' :
                  'bg-purple-600 text-white hover:bg-purple-700'
                }`}>
                  {getContent('map_view_route_btn', 'View Route Map')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Map Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{getContent('map_features_title', 'Map Features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mapFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Map Legend */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{getContent('map_legend_title', 'Map Legend')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{getContent('map_site_types_title', 'Site Types')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-700">{getContent('map_site_temples', 'Temples')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-700">{getContent('map_site_tombs', 'Tombs')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-700">{getContent('map_site_museums', 'Museums')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-700">{getContent('map_site_cities', 'Cities')}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{getContent('map_route_info_title', 'Route Information')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-1 bg-blue-600"></div>
                    <span className="text-gray-700">{getContent('map_route_downstream', 'Downstream Route')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-1 bg-teal-600"></div>
                    <span className="text-gray-700">{getContent('map_route_upstream', 'Upstream Route')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-1 bg-green-600"></div>
                    <span className="text-gray-700">{getContent('map_route_short', 'Short Route')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-1 bg-purple-600"></div>
                    <span className="text-gray-700">{getContent('map_route_extended', 'Extended Route')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 bg-indigo-600 rounded-lg p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">{getContent('map_cta_title', 'Ready to Plan Your Route?')}</h2>
          <p className="text-xl mb-6">{getContent('map_cta_desc', 'Use our route maps to plan your perfect Nile cruise itinerary')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {getContent('map_cta_plan_btn', 'Plan Your Cruise')}
            </Link>
            <Link
              href="/itineraries"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              {getContent('map_cta_view_btn', 'View All Itineraries')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
