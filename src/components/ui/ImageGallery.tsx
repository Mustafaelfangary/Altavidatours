'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import imageLoader from '../../utils/imageLoader';

interface ImageGalleryProps {
  images: Array<{ url: string; alt?: string }> | string[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ImageGallery({ images, columns = 3, className = '' }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Normalize images array
  const normalizedImages = images.map((img) =>
    typeof img === 'string' ? { url: img, alt: '' } : img
  );

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + normalizedImages.length) % normalizedImages.length);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % normalizedImages.length);
    }
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
        {normalizedImages.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-video overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.url}
              alt={image.alt || `Gallery image ${index + 1}`}
              width={400}
              height={300}
              loader={imageLoader}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm font-medium">{image.alt || `Image ${index + 1}`}</span>
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
          {selectedImage !== null && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={normalizedImages[selectedImage].url}
                alt={normalizedImages[selectedImage].alt || `Image ${selectedImage + 1}`}
                fill
                loader={imageLoader}
                className="object-contain"
                priority
              />
              
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation */}
              {normalizedImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-12 h-12"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-12 h-12"
                    onClick={goToNext}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                    {selectedImage + 1} / {normalizedImages.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

