'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/altavida-logo-1.png'
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Normalize the image path to support new categorized public assets
  const normalizeSrc = (imageSrc: string) => {
    if (!imageSrc) return '/altavida-logo-1.png';
    // If path begins with legacy '/images/', strip the prefix to resolve to new root categories
    if (imageSrc.startsWith('/images/')) {
      return imageSrc.replace(/^\/images\//, '/');
    }
    // If it already starts with '/', keep as-is (assumed valid under public/)
    if (imageSrc.startsWith('/')) {
      return imageSrc;
    }
    // Relative path: make it root-relative
    return `/${imageSrc.replace(/^images\//, '')}`;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const normalizedSrc = normalizeSrc(imgSrc);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={normalizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Utility function to generate optimized image URLs
export const getOptimizedImageUrl = (src: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}) => {
  const { width = 800, height = 600, quality = 75, format = 'webp' } = options || {};
  
  // Normalize the source path
  let normalizedSrc = src;
  if (src.startsWith('/images/')) {
    normalizedSrc = src.replace(/^\/images\//, '/');
  } else if (!src.startsWith('/')) {
    normalizedSrc = `/${src.replace(/^images\//, '')}`;
  }

  // For now, return the normalized path
  // In production, you might want to integrate with an image optimization service
  return normalizedSrc;
};

// Preload critical images
export const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(url);
    document.head.appendChild(link);
  });
};
