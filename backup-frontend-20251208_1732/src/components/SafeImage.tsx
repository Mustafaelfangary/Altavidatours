"use client";

import { useState, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  onError?: (error: any) => void;
}

export default function SafeImage({ 
  src, 
  alt = '', 
  fallbackSrc = '/images/placeholder.jpg',
  onError,
  ...props 
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((error: any) => {
    console.warn(`Image failed to load: ${currentSrc}`, error);
    
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    
    onError?.(error);
  }, [currentSrc, fallbackSrc, hasError, onError]);

  // If src changes, reset error state
  if (src !== currentSrc && !hasError) {
    setCurrentSrc(src);
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
      // Add these props to improve loading behavior
      placeholder={props.placeholder || "blur"}
      blurDataURL={props.blurDataURL || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZjNmNGY2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZTVlN2ViIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4="}
    />
  );
}
