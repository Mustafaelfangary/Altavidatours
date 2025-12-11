'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import imageLoader from '../../utils/imageLoader';

interface ImageSlideshowProps {
  images: string[];
  alt?: string;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  height?: string;
}

export function ImageSlideshow({
  images,
  alt = 'Slideshow image',
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
  height = 'h-[600px]'
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isPlaying && !isHovered && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, isHovered, images.length, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative w-full ${height} overflow-hidden rounded-2xl shadow-2xl group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              loader={imageLoader}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 rounded-full w-12 h-12 transition-all duration-300 opacity-0 group-hover:opacity-100"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 rounded-full w-12 h-12 transition-all duration-300 opacity-0 group-hover:opacity-100"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 rounded-full w-10 h-10 transition-all duration-300"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-3 bg-pharaoh-gold shadow-lg'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}



