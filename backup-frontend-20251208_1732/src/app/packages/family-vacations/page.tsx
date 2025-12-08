'use client';

import { Metadata } from 'next';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { Container } from '@mui/material';
import { Users, Heart, Shield, Star, Gift, Camera, Gamepad2, Baby } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function FamilyVacationsPackagePage() {
  const familyFeatures = [
    {
      icon: Users,
      title: 'Multi-Generational Fun',
      description: 'Activities and experiences designed to engage grandparents, parents, and children alike.',
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      title: 'Memory Making',
      description: 'Special moments and photo opportunities to create lifelong family memories.',
      color: 'text-red-600'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Child-safe environments, professional supervision, and comprehensive safety measures.',
      color: 'text-green-600'
    },
    {
      icon: Star,
      title: 'Kid-Friendly Guides',
      description: 'Expert guides trained to engage children with interactive storytelling and games.',
      color: 'text-yellow-600'
    },
    {
      icon: Gift,
      title: 'Special Amenities',
      description: 'Family rooms, children\'s menus, high chairs, and child-friendly facilities.',
      color: 'text-purple-600'
    },
    {
      icon: Camera,
      title: 'Photo Adventures',
      description: 'Professional family photography and designated photo spots at iconic locations.',
      color: 'text-indigo-600'
    }
  ];

  const familyPackages = [
    {
      title: 'Ultimate Family Nile Adventure',
      duration: '10 Days / 9 Nights',
      description: 'The complete Egyptian experience designed specifically for families with children.',
      highlights: ['Luxury dahabiya cruise', 'Pyramid exploration', 'Camel riding', 'Kids activities'],
      price: 'From $4,200',
      ages: 'All Ages',
      image: '/images/family-nile-ultimate.jpg',
      href: '/packages/ultimate-family-nile'
    },
    {
      title: 'Egypt Family Discovery',
      duration: '8 Days / 7 Nights',
      description: 'Perfect introduction to Egypt for families with teens and younger children.',
      highlights: ['Cairo highlights', 'Nile cruise', 'Temple visits', 'Traditional markets'],
      price: 'From $3,400',
      ages: '8+ Years',
      image: '/images/egypt-family-discovery.jpg',
      href: '/packages/egypt-family-discovery'
    },
    {
      title: 'Little Explorers Egypt',
      duration: '6 Days / 5 Nights',
      description: 'Specially designed for families traveling with young children and toddlers.',
      highlights: ['Shorter excursions', 'Interactive museums', 'Pool time', 'Child care'],
      price: 'From $2,800',
      ages: '2-12 Years',
      image: '/images/little-explorers.jpg',
      href: '/packages/little-explorers'
    },
    {
      title: 'Teen Adventure Egypt',
      duration: '9 Days / 8 Nights',
      description: 'Action-packed adventure designed to engage and excite teenage travelers.',
      highlights: ['Adventure activities', 'Night tours', 'Photography workshops', 'Cultural immersion'],
      price: 'From $3,800',
      ages: '13+ Years',
      image: '/images/teen-adventure.jpg',
      href: '/packages/teen-adventure'
    }
  ];

  const kidActivities = [
    {
      title: 'Pyramid Treasure Hunt',
      description: 'Interactive treasure hunt games around the Great Pyramid complex',
      icon: '🗺️',
      age: '6-14 years'
    },
    {
      title: 'Hieroglyphic Workshop',
      description: 'Learn to write your name in ancient Egyptian hieroglyphs',
      icon: '📜',
      age: '8+ years'
    },
    {
      title: 'Junior Archaeologist',
      description: 'Hands-on archaeological experience with replica artifacts',
      icon: '⛏️',
      age: '10+ years'
    },
    {
      title: 'Mummy Making Game',
      description: 'Fun educational activity about ancient Egyptian mummification',
      icon: '🏺',
      age: '7-15 years'
    },
    {
      title: 'Egyptian Arts & Crafts',
      description: 'Create Egyptian-inspired artwork and take home as souvenirs',
      icon: '🎨',
      age: '4+ years'
    },
    {
      title: 'Pharaoh Dress-up',
      description: 'Try on traditional Egyptian costumes and royal accessories',
      icon: '👑',
      age: '3+ years'
    }
  ];

  const ageGroups = [
    {
      title: 'Toddlers (2-4 years)',
      features: ['Stroller-friendly routes', 'Nap time accommodations', 'Childproofed rooms', 'Baby equipment'],
      icon: <Baby className="w-8 h-8" />
    },
    {
      title: 'Kids (5-12 years)',
      features: ['Interactive games', 'Educational activities', 'Adventure challenges', 'Kid-friendly dining'],
      icon: <Gamepad2 className="w-8 h-8" />
    },
    {
      title: 'Teens (13+ years)',
      features: ['Photography workshops', 'Cultural exchanges', 'Adventure sports', 'Social activities'],
      icon: <Camera className="w-8 h-8" />
    },
    {
      title: 'All Generations',
      features: ['Multi-level experiences', 'Flexible scheduling', 'Comfort amenities', 'Shared adventures'],
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white">
      <UnifiedHero
        title="Family Vacation Packages"
        subtitle="Create magical memories with our specially designed family vacation packages to Egypt. From toddlers to grandparents, everyone will find wonder in the land of the pharaohs."
        backgroundImage="/images/family-vacation-hero.jpg"
        height="70vh"
        ctaButtons={[
          {
            text: "Browse Family Packages",
            href: "#packages",
            variant: "primary"
          },
          {
            text: "Get Custom Quote",
            href: "/contact",
            variant: "secondary"
          }
        ]}
      />

      <Container maxWidth="xl" className="py-16 px-4">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Perfect Egyptian Adventures for the Whole Family
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our family vacation packages are carefully crafted to ensure every family member, 
            from the youngest to the oldest, has an unforgettable experience exploring the wonders 
            of ancient Egypt in comfort and safety.
          </p>
        </div>

        {/* Family Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {familyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Age-Specific Experiences */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Experiences for Every Age</h2>
            <p className="text-lg text-gray-600">Tailored activities and accommodations for different age groups</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ageGroups.map((group, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-center mb-4 text-blue-600">
                  {group.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{group.title}</h3>
                <ul className="space-y-2">
                  {group.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Family Packages */}
        <div id="packages" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Family Vacation Packages</h2>
            <p className="text-lg text-gray-600">Choose the perfect package for your family's needs and interests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {familyPackages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold text-center px-4">{pkg.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {pkg.duration}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{pkg.price}</div>
                      <div className="text-xs text-gray-500">{pkg.ages}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((highlight, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={pkg.href}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 text-center block"
                  >
                    View Package Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kids Activities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Kids Activities</h2>
            <p className="text-lg text-gray-600">Fun, educational activities designed just for young explorers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kidActivities.map((activity, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="text-3xl mb-3 text-center">{activity.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{activity.title}</h3>
                <p className="text-gray-600 text-sm text-center mb-2">{activity.description}</p>
                <div className="text-center">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {activity.age}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Family Testimonial */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 text-center text-white mb-16">
          <div className="text-4xl mb-6">👨‍👩‍👧‍👦</div>
          <blockquote className="text-xl italic mb-6 max-w-3xl mx-auto">
            "Our family trip to Egypt with AltaVida Tours was absolutely magical! The kids learned so much, 
            and we created memories that will last a lifetime. Every detail was perfectly planned for our family."
          </blockquote>
          <p className="font-semibold">- The Johnson Family</p>
          <p className="text-sm opacity-90">Family of 5, traveled with kids ages 6, 10, and 14</p>
        </div>

        {/* Safety & Comfort */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Family's Safety & Comfort</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance and emergency support throughout your journey</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold mb-2">Family-Friendly Hotels</h3>
              <p className="text-gray-600">Carefully selected accommodations with family rooms and child-safe facilities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚐</div>
              <h3 className="text-xl font-semibold mb-2">Safe Transportation</h3>
              <p className="text-gray-600">Modern vehicles with safety features and professional, experienced drivers</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Plan Your Family Adventure?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let our family travel specialists help you create the perfect Egyptian adventure for your family. 
            Every detail is carefully planned to ensure a safe, comfortable, and unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 font-semibold"
            >
              Get Your Custom Family Quote
            </Link>
            <Link
              href="/packages"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold"
            >
              Browse All Packages
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
