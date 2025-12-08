'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ImageSlideshow } from '@/components/ui/ImageSlideshow';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import { Badge } from '@/components/ui/badge';
import { Container, Button as MuiButton } from '@mui/material';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';

const imageCategories = {
  all: 'All Images',
  whatsapp: 'Recent Photos',
  cultural: 'Cultural & Historical',
  alexandria: 'Alexandria',
  adventure: 'Adventure',
  desert: 'Desert & Safari',
  redsea: 'Red Sea',
  religious: 'Religious Sites'
};

const allImages = [
  // WhatsApp Images (New)
  { url: '/WhatsApp Image 2025-11-22 at 00.51.17.jpeg', alt: 'Egypt Travel Experience', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.18.jpeg', alt: 'Ancient Wonders', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.19.jpeg', alt: 'Cultural Heritage', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.20.jpeg', alt: 'Historic Sites', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.21.jpeg', alt: 'Egyptian Adventures', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.22.jpeg', alt: 'Travel Memories', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.23.jpeg', alt: 'Pyramids & Temples', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.24.jpeg', alt: 'Nile Experiences', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.24 (1).jpeg', alt: 'Desert Adventures', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.24 (2).jpeg', alt: 'Egyptian Culture', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.24 (3).jpeg', alt: 'Historic Monuments', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.35.jpeg', alt: 'Travel Experiences', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.35 (1).jpeg', alt: 'Ancient Egypt', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.35 (2).jpeg', alt: 'Cultural Sites', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.36.jpeg', alt: 'Egypt Tours', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.18 (1).jpeg', alt: 'Travel Adventures', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.20 (1).jpeg', alt: 'Historic Wonders', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.21 (1).jpeg', alt: 'Egyptian Heritage', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.21 (2).jpeg', alt: 'Ancient Monuments', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.22 (1).jpeg', alt: 'Cultural Experiences', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.22 (2).jpeg', alt: 'Travel Destinations', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.23 (1).jpeg', alt: 'Historic Landmarks', category: 'whatsapp' },
  { url: '/WhatsApp Image 2025-11-22 at 00.51.23 (2).jpeg', alt: 'Egyptian Sites', category: 'whatsapp' },
  
  // Cultural & Historical
  { url: '/cultural&historical/Saqqara pyramid.jpg', alt: 'Saqqara Pyramid', category: 'cultural' },
  { url: '/cultural&historical/IMG_2798.JPG', alt: 'Pyramids of Giza', category: 'cultural' },
  { url: '/cultural&historical/IMG_2970.JPG', alt: 'Great Sphinx', category: 'cultural' },
  { url: '/cultural&historical/IMG_6316.JPG', alt: 'Museum Exhibits', category: 'cultural' },
  { url: '/cultural&historical/IMG_6901.JPG', alt: 'Historic Sites', category: 'cultural' },
  { url: '/cultural&historical/IMG_6974.JPG', alt: 'Ancient Artifacts', category: 'cultural' },
  { url: '/cultural&historical/IMG_0456.JPG', alt: 'Cultural Heritage', category: 'cultural' },
  { url: '/cultural&historical/IMG_0514.JPG', alt: 'Islamic Architecture', category: 'cultural' },
  { url: '/cultural&historical/IMG_0515.JPG', alt: 'Historic Architecture', category: 'cultural' },
  { url: '/cultural&historical/IMG_6828.JPG', alt: 'Museum Collections', category: 'cultural' },
  { url: '/cultural&historical/IMG_6857.JPG', alt: 'Ancient Treasures', category: 'cultural' },
  { url: '/cultural&historical/DSC_8652.JPG', alt: 'Step Pyramid', category: 'cultural' },
  { url: '/cultural&historical/DSCF1165.JPG', alt: 'Dahshur Pyramids', category: 'cultural' },
  
  // Alexandria
  { url: '/Alexandria/IMG_6198.JPG', alt: 'Alexandria City', category: 'alexandria' },
  { url: '/Alexandria/IMG_6201.JPG', alt: 'Alexandria Library', category: 'alexandria' },
  { url: '/Alexandria/IMG_6274.JPG', alt: 'Mediterranean Coast', category: 'alexandria' },
  { url: '/Alexandria/IMG_6334.JPG', alt: 'Roman Ruins', category: 'alexandria' },
  { url: '/Alexandria/IMG_6485.JPG', alt: 'Alexandria Views', category: 'alexandria' },
  { url: '/Alexandria/IMG_6489.JPG', alt: 'Coastal City', category: 'alexandria' },
  { url: '/Alexandria/IMG_6504.JPG', alt: 'Mediterranean Beauty', category: 'alexandria' },
  { url: '/Alexandria/IMG_6526.JPG', alt: 'Historic Alexandria', category: 'alexandria' },
  
  // Adventure
  { url: '/adventure/adventure.jpg', alt: 'Adventure Tours', category: 'adventure' },
  { url: '/adventure/adventure2.jpg', alt: 'Outdoor Adventures', category: 'adventure' },
  { url: '/adventure/IMG-20170613-WA0106.jpg', alt: 'Adventure Activities', category: 'adventure' },
  { url: '/adventure/IMG-20170613-WA0109.jpg', alt: 'Exciting Experiences', category: 'adventure' },
  
  // Desert & Safari
  { url: '/desert&safary/DSC_9166.JPG', alt: 'Desert Safari', category: 'desert' },
  { url: '/desert&safary/DSC_9167.JPG', alt: 'Desert Adventures', category: 'desert' },
  { url: '/desert&safary/DSC_9814.JPG', alt: 'Safari Experience', category: 'desert' },
  { url: '/desert&safary/DSC_9826.JPG', alt: 'Desert Landscape', category: 'desert' },
  { url: '/desert&safary/DSC_9895.JPG', alt: 'Desert Tours', category: 'desert' },
  { url: '/desert&safary/DSC_9907.JPG', alt: 'Safari Tours', category: 'desert' },
  { url: '/desert&safary/DSC_9908.JPG', alt: 'Desert Views', category: 'desert' },
  { url: '/desert&safary/DSC_9912.JPG', alt: 'Desert Experience', category: 'desert' },
  
  // Red Sea
  { url: '/RedSea/1659705495000.jpg', alt: 'Red Sea Coast', category: 'redsea' },
  { url: '/RedSea/FB_IMG_1468343472163.jpg', alt: 'Red Sea Views', category: 'redsea' },
  { url: '/RedSea/FB_IMG_1474204861825.jpg', alt: 'Coastal Beauty', category: 'redsea' },
  { url: '/RedSea/FB_IMG_1503932804009.jpg', alt: 'Red Sea Adventures', category: 'redsea' },
  { url: '/RedSea/FB_IMG_1503932816796.jpg', alt: 'Beach Views', category: 'redsea' },
  
  // Religious
  { url: '/religious/20180517_104948.jpg', alt: 'Coptic Cairo', category: 'religious' }
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { getContent, loading } = useContent({ page: 'gallery' });

  const filteredImages = selectedCategory === 'all'
    ? allImages
    : allImages.filter(img => img.category === selectedCategory);

  const featuredImages = allImages
    .filter(img => img.category === 'whatsapp')
    .slice(0, 10)
    .map(img => img.url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="relative h-[70vh] mt-16 overflow-hidden">
        <ImageSlideshow
          images={featuredImages}
          alt="Egypt Travel Gallery"
          autoPlay={true}
          interval={4500}
          height="h-full"
          className="rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif drop-shadow-2xl headline-animated">
              {getContent('gallery_hero_title', 'Photo Gallery')}
            </h1>
            <div className="mb-4">
              <PharaonicText className="text-white/90" showTranslation={true} />
            </div>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
              {getContent('gallery_hero_subtitle', 'Explore the beauty of Egypt through our lens')}
            </p>
            <div className="mt-4">
              <PharaonicDecoration variant="section" size="md" />
            </div>
          </div>
        </div>
      </div>

      <Container maxWidth="lg" className="py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(imageCategories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === key
                  ? 'bg-pharaoh-gold text-white shadow-lg scale-105'
                  : 'bg-white text-nile-blue hover:bg-pharaoh-gold/10 border-2 border-pharaoh-gold/30'
              }`}
            >
              {label}
              {key === 'whatsapp' && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</Badge>
              )}
            </button>
          ))}
        </div>

        {/* Image Count */}
        <div className="text-center mb-8">
          <p className="text-ancient-stone text-lg">
            Showing <span className="font-bold text-nile-blue">{filteredImages.length}</span> {selectedCategory === 'all' ? 'images' : imageCategories[selectedCategory as keyof typeof imageCategories].toLowerCase()}
          </p>
        </div>

        {/* Enhanced Image Gallery */}
        <div className="mb-8">
          <ImageGallery
            images={filteredImages}
            columns={4}
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-12 bg-gradient-to-br from-pharaoh-gold/10 via-nile-blue/5 to-pharaoh-gold/10 rounded-3xl border-2 border-pharaoh-gold/20">
          <h2 className="text-3xl md:text-4xl font-bold text-nile-blue mb-4">
            {getContent('gallery_cta_title', 'Ready to Create Your Own Memories?')}
          </h2>
          <p className="text-ancient-stone text-lg mb-8 max-w-2xl mx-auto">
            {getContent('gallery_cta_subtitle', 'Book your Egypt tour today and experience these amazing destinations for yourself.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/daily-tours" className="btn-pharaoh text-lg px-8 py-6 inline-block text-center rounded-full no-underline">
              {getContent('gallery_cta_tours_button', 'Explore Tours')}
            </Link>
            <Link href="/packages" className="btn-nile text-lg px-8 py-6 inline-block text-center rounded-full no-underline">
              {getContent('gallery_cta_packages_button', 'View Packages')}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
