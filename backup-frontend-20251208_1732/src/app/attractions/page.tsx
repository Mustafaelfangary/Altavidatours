'use client';

import { useState } from 'react';
import { Hero } from '@/components/ui/Hero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTABand } from '@/components/ui/CTABand';
import { AttractionCard } from '@/components/cards/AttractionCard';
import { attractions, AttractionCategory } from '@/data/attractions';
import { Filter } from 'lucide-react';

export default function AttractionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Attractions' },
    { value: AttractionCategory.HISTORY, label: 'History & Heritage' },
    { value: AttractionCategory.NATURE, label: 'Nature & Outdoors' },
    { value: AttractionCategory.ARTS, label: 'Arts & Culture' },
    { value: AttractionCategory.OUTDOOR, label: 'Outdoor Adventures' },
    { value: AttractionCategory.FAMILY, label: 'Family Activities' }
  ];

  const filteredAttractions = selectedCategory === 'all'
    ? attractions
    : attractions.filter(attr => attr.category === selectedCategory);

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title="Discover Egypt's Top Attractions"
        subtitle="Explore ancient wonders, natural beauty, and cultural treasures"
        backgroundImage="/images/Royal Cleopatra/DSC_8502.jpg"
        ctaText="View All Attractions"
        ctaLink="#attractions"
        height="medium"
      />

      {/* Attractions Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Explore Attractions"
            subtitle="From ancient monuments to natural wonders, discover the best of Egypt"
          />

          {/* Filter Bar */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-travelok-blue" />
              <h3 className="text-lg font-semibold text-travelok-blue-dark">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.value
                      ? 'bg-travelok-blue text-white shadow-lg'
                      : 'bg-white text-travelok-gray hover:bg-travelok-blue hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attractions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredAttractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                id={attraction.id}
                name={attraction.name}
                category={attraction.category}
                location={attraction.location}
                image={attraction.image}
                description={attraction.description}
                duration={attraction.duration}
              />
            ))}
          </div>

          {filteredAttractions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-travelok-gray">No attractions found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Band */}
      <CTABand
        title="Ready to Explore Egypt?"
        description="Book your perfect tour package and experience these amazing attractions"
        ctaText="View Packages"
        ctaLink="/packages"
        variant="gradient"
      />
    </main>
  );
}