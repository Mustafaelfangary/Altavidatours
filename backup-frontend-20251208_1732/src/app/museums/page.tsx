'use client';

import { useState } from 'react';
import { Hero } from '@/components/ui/Hero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTABand } from '@/components/ui/CTABand';
import { MuseumCard } from '@/components/cards/MuseumCard';
import { museums, MuseumType } from '@/data/museums';
import { Filter } from 'lucide-react';

export default function MuseumsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = [
    { value: 'all', label: 'All Museums' },
    { value: MuseumType.ARCHAEOLOGICAL, label: 'Archaeological' },
    { value: MuseumType.ART, label: 'Art Museums' },
    { value: MuseumType.HISTORY, label: 'History Museums' },
    { value: MuseumType.CULTURAL, label: 'Cultural Museums' }
  ];

  const filteredMuseums = selectedType === 'all'
    ? museums
    : museums.filter(museum => museum.type === selectedType);

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title="Explore Egypt's Museums"
        subtitle="Discover world-class collections of ancient artifacts and cultural treasures"
        backgroundImage="/images/Royal Cleopatra/DSC_8534.jpg"
        ctaText="View All Museums"
        ctaLink="#museums"
        height="medium"
      />

      {/* Museums Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="World-Class Museums"
            subtitle="Home to some of the world's most significant archaeological and cultural collections"
          />

          {/* Filter Bar */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-travelok-blue" />
              <h3 className="text-lg font-semibold text-travelok-blue-dark">Filter by Type</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedType === type.value
                      ? 'bg-travelok-green text-white shadow-lg'
                      : 'bg-white text-travelok-gray hover:bg-travelok-green hover:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Museums Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredMuseums.map((museum) => (
              <MuseumCard
                key={museum.id}
                id={museum.id}
                name={museum.name}
                type={museum.type}
                location={museum.location}
                image={museum.image}
                description={museum.description}
                openingHours={museum.openingHours}
              />
            ))}
          </div>

          {filteredMuseums.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-travelok-gray">No museums found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Band */}
      <CTABand
        title="Plan Your Cultural Journey"
        description="Combine museum visits with our curated tour packages"
        ctaText="Explore Packages"
        ctaLink="/packages"
        variant="blue"
      />
    </main>
  );
}