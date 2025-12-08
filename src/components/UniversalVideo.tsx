"use client";

import React, { useState, useEffect } from 'react';

interface UniversalVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export default function UniversalVideo({
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  playsInline = true,
  className = "",
  style = {},
  onLoad,
  onError,
}: UniversalVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setError('No video source provided');
      setIsLoading(false);
      return;
    }

    console.log('UniversalVideo: Loading video from:', src);
  }, [src]);

  const handleLoadedData = () => {
    console.log('UniversalVideo: Video loaded successfully');
    setIsLoading(false);
    setError(null);
    if (onLoad) onLoad();
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('UniversalVideo: Video loading error:', e);
    const errorMessage = 'Failed to load video. Please check the URL and try again.';
    setError(errorMessage);
    setIsLoading(false);
    if (onError) onError(errorMessage);
  };

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={style}>
        <div className="text-center p-4">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-1">Video source: {src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      <video
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
        onLoadedData={handleLoadedData}
        onError={handleError}
        className="w-full h-full object-cover"
        style={{
          filter: 'brightness(1.08) saturate(1.15) contrast(1.08)',
          transition: 'filter 1s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
} 