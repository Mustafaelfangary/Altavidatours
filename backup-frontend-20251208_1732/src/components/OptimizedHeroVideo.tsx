"use client";

import React, { useState, useEffect, useRef } from 'react';

interface OptimizedHeroVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function getYouTubeEmbedUrl(url: string): string {
  const id = extractYouTubeId(url);
  if (!id) return url;
  // Autoplay muted loop; playlist needed for loop to work on YouTube
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${id}`;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match && match[1] ? match[1] : null;
}

function getVimeoEmbedUrl(url: string): string {
  const id = extractVimeoId(url);
  if (!id) return url;
  // Background mode for clean looped video without controls
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&background=1&loop=1&byline=0&title=0&controls=0`;
}

export default function OptimizedHeroVideo({
  src,
  poster,
  className = '',
  style = {},
  onLoad,
  onError
}: OptimizedHeroVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isYouTube = /youtube\.com|youtu\.be/.test(src);
  const isVimeo = /vimeo\.com/.test(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('✅ Video loaded successfully');
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };

    const handleError = (e: Event) => {
      console.error('❌ Video loading error:', e);
      setHasError(true);
      setIsLoaded(false);
      onError?.();
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setIsLoaded(true);
      // Try to play the video
      video.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    };

    const handlePlay = () => {
      console.log('▶️ Video started playing');
      setIsPlaying(true);
      // Keep poster for a short moment to avoid flash, then fade it out
      setTimeout(() => setShowPoster(false), 150);
    };

    const handlePause = () => {
      console.log('⏸️ Video paused');
      setIsPlaying(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onLoad, onError]);

  // Preload the video
  useEffect(() => {
    if (src && videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  const videoStyle: React.CSSProperties = {
    objectPosition: 'center center', // Center the video both horizontally and vertically
    transition: 'opacity 0.5s ease-in-out',
    opacity: isLoaded && !hasError ? 1 : 0,
    ...style
  };

  // Theater mode container style - extends beyond normal boundaries like YouTube
  const theaterContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100vw', // Full viewport width like YouTube theater mode
    height: '100%',
    backgroundColor: '#000000', // Solid dark to eliminate loading flash
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure it's above other elements
  };

  if (hasError) {
    return (
      <div 
        className={`${className}`}
        style={{
          backgroundImage: `url(${poster || '/images/hero-bg.jpg'})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#e6f0ff', // pale blue to match hero theme
          width: '100%',
          height: '100%',
          ...style
        }}
      />
    );
  }

  return (
    <>
      {/* Theater Mode Container - Full viewport width like YouTube */}
      <div style={theaterContainerStyle}>
        {/* Poster image as background while video loads */}
        {showPoster && poster && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#000000',
              zIndex: 5
            }}
          />
        )}
        
        {/* Video element - Theater mode sizing */}
        {(isYouTube || isVimeo) ? (
          <iframe
            className="hero-video w-full h-full object-contain"
            style={videoStyle}
            src={isYouTube ? getYouTubeEmbedUrl(src) : getVimeoEmbedUrl(src)}
            title="Hero Video"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => {
              setIsLoaded(true);
              setHasError(false);
              onLoad?.();
              // Fade poster out slightly after iframe reports load
              setTimeout(() => setShowPoster(false), 150);
            }}
          />
        ) : (
          <video
            ref={videoRef}
            className="hero-video w-full h-full object-contain"
            style={videoStyle}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            src={src}
          >
            <source src={src} type="video/mp4" />
            {src.endsWith('.mp4') && <source src={src.replace('.mp4', '.webm')} type="video/webm" />}
            Your browser does not support the video tag.
          </video>
        )}
      </div>

    </>
  );
}
