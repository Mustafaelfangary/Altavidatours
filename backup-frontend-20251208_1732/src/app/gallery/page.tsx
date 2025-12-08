"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, Button, Chip } from '@mui/material';
import { Camera, Eye, Heart, Ship, Package, MapPin, Filter } from 'lucide-react';
import { AnimatedSection, StaggeredAnimation } from '@/components/ui/animated-section';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContent } from '@/hooks/useContent';
// Pharaonic elements removed for cleaner design
import UnifiedHero from '@/components/ui/UnifiedHero';
import LogoLoader from '@/components/ui/LogoLoader';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  category: 'dahabiya' | 'package' | 'destination' | 'experience';
  itemName?: string;
  itemSlug?: string;
  location?: string;
  photographer?: string;
  likes: number;
  views: number;
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const { getContent } = useContent({ page: 'gallery' });
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Handle keyboard events and body scroll for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load gallery');
        }

        const data = await response.json();
        console.log('📊 Gallery API response:', data);
        console.log('🖼️ Images to display:', data.images);
        setImages(data.images || []);
        setFilteredImages(data.images || []);
        
        // Extract unique categories from images
        if (data.images && data.images.length > 0) {
          const uniqueCategories = [...new Set(data.images.map((img: { category: string }) => img.category))] as string[];
          setCategories(uniqueCategories.sort());
          console.log('📊 Categories found:', uniqueCategories);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery');
        // Set mock data on error
        const mockImages: GalleryImage[] = [
          {
            id: '1',
            url: '/images/gallery/dahabiya-1.jpg',
            alt: 'Luxury Dahabiya',
            caption: 'Princess Cleopatra sailing on the Nile',
            category: 'dahabiya',
            location: 'Nile River, Egypt',
            likes: 45,
            views: 1250
          },
          {
            id: '2',
            url: '/images/gallery/temple-1.jpg',
            alt: 'Ancient Temple',
            caption: 'Karnak Temple Complex',
            category: 'destination',
            location: 'Luxor, Egypt',
            likes: 67,
            views: 2100
          }
        ];
        setImages(mockImages);
        setFilteredImages(mockImages);
        setCategories(['dahabiya', 'destination']);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(image => image.category === filter));
    }
  }, [images, filter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dahabiya':
        return <Ship className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      case 'destination':
        return <MapPin className="w-4 h-4" />;
      case 'experience':
        return <Camera className="w-4 h-4" />;
      default:
        return <Camera className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dahabiya':
        return 'bg-ocean-blue text-white';
      case 'package':
        return 'bg-blue-600 text-white';
      case 'destination':
        return 'bg-sky-600 text-white';
      case 'experience':
        return 'bg-cyan-600 text-white';
      default:
        return 'bg-blue-700 text-white';
    }
  };

  if (loading) {
    return <LogoLoader variant="elegant" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-amber-800 font-bold text-xl">Failed to Load Gallery 𓏏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden on-light">
      {/* Unified Hero Section */}
      <UnifiedHero
        imageSrc={getContent('gallery_hero_image', '/images/Royal Cleopatra/DSC_8568.jpg')}
        title={getContent('gallery_hero_title', 'Gallery')}
        subtitle={getContent('gallery_hero_subtitle', 'Captured Moments of Egyptian Splendor')}
        hieroglyphicTitle={false}
        showEgyptianElements={false}
        showRoyalCrown={false}
        showHieroglyphics={false}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      />

      <Container maxWidth="lg" className="relative z-10">
        <AnimatedSection animation="fade-in">
          <div className="text-center text-deep-blue">
            <h2 className="text-4xl font-bold mb-6 underline-accent">{getContent('gallery_page_title', 'Gallery')}</h2>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200">
                  <Camera className="w-5 h-5 text-ocean-blue mr-2" />
                  <span className="text-deep-blue font-medium">{images.length} {getContent('gallery_photos_label', 'Photos')}</span>
                </div>
                <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200">
                  <Eye className="w-5 h-5 text-ocean-blue mr-2" />
                  <span className="text-deep-blue font-medium">
                    {images.reduce((sum, img) => sum + img.views, 0).toLocaleString()} {getContent('gallery_views_label', 'Views')}
                  </span>
                </div>

              </div>

              {/* Description */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl p-8 shadow">
                  <p className="text-xl md:text-2xl leading-relaxed text-deep-blue font-light">
                    {getContent('gallery_description', 'Explore our collection of stunning photographs showcasing the beauty of our dahabiyat, the majesty of ancient Egypt, and unforgettable travel experiences')}
                  </p>
                </div>

              </div>

            </div>
          </AnimatedSection>
        </Container>

      {/* Filters Section */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b border-amber-200 on-light">
        <Container maxWidth="lg">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
              startIcon={<Filter className="w-4 h-4" />}
            >
              {getContent('gallery_filter_all', 'All')} ({images.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? 'contained' : 'outlined'}
                onClick={() => setFilter(category)}
                className={filter === category ? 'bg-amber-600 text-white' : 'border-amber-600 text-amber-600'}
                startIcon={getCategoryIcon(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({images.filter(img => img.category === category).length})
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50 relative on-light">

        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.length === 0 ? (
                <div className="col-span-full">
                  <div className="text-center py-20">
                    <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
                    <Typography variant="h5" className="text-amber-800 font-bold mb-4">
                      {getContent('gallery_no_images_title', 'No Images Found')}
                    </Typography>
                    <Typography variant="body1" className="text-amber-700">
                      {getContent('gallery_no_images_text', 'No images match your current filter. Try adjusting your selection.')}
                    </Typography>
                  </div>
                </div>
              ) : (
                filteredImages.map((image, index) => (
                  <div key={image.id}>
                    <StaggeredAnimation>
                      <div
                        className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                        onClick={() => {
                          console.log('Image clicked:', image);
                          setSelectedImage(image);
                        }}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                            onLoad={() => {
                              console.log('✅ Gallery card image loaded successfully:', image.url);
                            }}
                            onError={(e) => {
                              console.error('❌ Gallery card image failed to load:', image.url);
                              console.log('Attempting to load placeholder...');
                              e.currentTarget.src = '/images/gallery-placeholder.JPG';
                            }}
                          />

                          {/* Simple category label */}
                          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                            {image.category}
                          </div>

                          {/* Simple view count */}
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            👁 {image.views}
                          </div>
                        </div>

                        {/* Enhanced Caption with Better Visibility */}
                        {image.caption && (
                          <div className="p-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 text-gray-800">
                            <p className="text-sm font-semibold line-clamp-2">
                              {image.caption}
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                              {image.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-blue-500" />
                                  {image.location}
                                </span>
                              )}
                              {image.photographer && (
                                <span className="photographer-credit">
                                  📷 {image.photographer}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <span></span>
                    </StaggeredAnimation>
                  </div>
                ))
              )}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[99999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedImage(null);
            }
          }}
          style={{ zIndex: 99999 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-300 z-10"
            style={{ zIndex: 100000 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image Container */}
          <div className="relative max-w-4xl max-h-[90vh] mx-auto">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              onLoad={() => console.log('Modal image loaded successfully')}
              onError={(e) => {
                console.error('Modal image failed to load:', selectedImage.url);
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
            
            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-6 rounded-b-lg">
              <h3 className="font-bold mb-2 text-xl">{selectedImage.caption || selectedImage.alt}</h3>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedImage.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {selectedImage.likes} likes
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {selectedImage.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedImage.location}
                    </span>
                  )}
                  {selectedImage.photographer && (
                    <span>
                      📷 {selectedImage.photographer}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}