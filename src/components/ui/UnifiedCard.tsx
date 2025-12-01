"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ViewDetailsButton } from '@/components/ui/ViewDetailsButton';

// Type definitions for different content types
export type CardType = 'dahabiya' | 'package' | 'blog' | 'itinerary' | 'destination' | 'experience' | 'custom';

export type CategoryConfig = {
  badge: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  hoverColor: string;
  buttonGradient: string;
  buttonHover: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
};

// Predefined category configurations
const getCategoryConfig = (type: CardType, category?: string): CategoryConfig => {
  // For dahabiyas, use the category
  if (type === 'dahabiya') {
    switch (category) {
      case 'PREMIUM':
        return {
          badge: 'PREMIUM',
          icon: '👑',
          gradientFrom: 'from-travelok-orange',
          gradientTo: 'to-travelok-orange-dark',
          hoverColor: 'group-hover:text-travelok-orange',
          buttonGradient: 'from-travelok-orange to-travelok-orange-dark',
          buttonHover: 'hover:from-travelok-orange-dark hover:to-travelok-orange',
          borderColor: 'border-travelok-orange/20 hover:border-travelok-orange/40',
          badgeBg: 'bg-travelok-orange/10',
          badgeText: 'text-travelok-orange-dark',
          badgeBorder: 'border-travelok-orange/30'
        };
      case 'LUXURY':
        return {
          badge: 'LUXURY',
          icon: '💎',
          gradientFrom: 'from-travelok-blue',
          gradientTo: 'to-travelok-blue-dark',
          hoverColor: 'group-hover:text-travelok-blue',
          buttonGradient: 'from-travelok-blue to-travelok-blue-dark',
          buttonHover: 'hover:from-travelok-blue-dark hover:to-travelok-blue',
          borderColor: 'border-travelok-blue/20 hover:border-travelok-blue/40',
          badgeBg: 'bg-travelok-blue/10',
          badgeText: 'text-travelok-blue-dark',
          badgeBorder: 'border-travelok-blue/30'
        };
      case 'DELUXE':
        return {
          badge: 'DELUXE',
          icon: '𓊪',
          gradientFrom: 'from-emerald-500',
          gradientTo: 'to-teal-600',
          hoverColor: 'group-hover:text-emerald-600',
          buttonGradient: 'from-emerald-500 to-teal-600',
          buttonHover: 'hover:from-emerald-600 hover:to-teal-700',
          borderColor: 'border-emerald-200 hover:border-emerald-400',
          badgeBg: 'bg-emerald-100',
          badgeText: 'text-emerald-800',
          badgeBorder: 'border-emerald-200'
        };
      default: // BOUTIQUE
        return {
          badge: 'BOUTIQUE',
          icon: '🛥️',
          gradientFrom: 'from-travelok-blue-light',
          gradientTo: 'to-travelok-blue',
          hoverColor: 'group-hover:text-travelok-blue-light',
          buttonGradient: 'from-travelok-blue-light to-travelok-blue',
          buttonHover: 'hover:from-travelok-blue hover:to-travelok-blue-dark',
          borderColor: 'border-travelok-blue-light/20 hover:border-travelok-blue-light/40',
          badgeBg: 'bg-travelok-blue-light/10',
          badgeText: 'text-travelok-blue',
          badgeBorder: 'border-travelok-blue-light/30'
        };
    }
  }

  // For other types, use type-based configurations
  switch (type) {
    case 'package':
      return {
        badge: 'PACKAGE',
        icon: '📦',
        gradientFrom: 'from-travelok-blue',
        gradientTo: 'to-travelok-blue-light',
        hoverColor: 'group-hover:text-travelok-blue',
        buttonGradient: 'from-travelok-blue to-travelok-blue-light',
        buttonHover: 'hover:from-travelok-blue-dark hover:to-travelok-blue',
        borderColor: 'border-travelok-blue/20 hover:border-travelok-blue/40',
        badgeBg: 'bg-travelok-blue/10',
        badgeText: 'text-travelok-blue-dark',
        badgeBorder: 'border-travelok-blue/30'
      };
    case 'blog':
      return {
        badge: 'ARTICLE',
        icon: '𓂋',
        gradientFrom: 'from-green-500',
        gradientTo: 'to-emerald-600',
        hoverColor: 'group-hover:text-green-600',
        buttonGradient: 'from-green-500 to-emerald-600',
        buttonHover: 'hover:from-green-600 hover:to-emerald-700',
        borderColor: 'border-green-200 hover:border-green-400',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-800',
        badgeBorder: 'border-green-200'
      };
    case 'itinerary':
      return {
        badge: 'JOURNEY',
        icon: '🗺️',
        gradientFrom: 'from-travelok-orange',
        gradientTo: 'to-travelok-orange-light',
        hoverColor: 'group-hover:text-travelok-orange',
        buttonGradient: 'from-travelok-orange to-travelok-orange-light',
        buttonHover: 'hover:from-travelok-orange-dark hover:to-travelok-orange',
        borderColor: 'border-travelok-orange/20 hover:border-travelok-orange/40',
        badgeBg: 'bg-travelok-orange/10',
        badgeText: 'text-travelok-orange-dark',
        badgeBorder: 'border-travelok-orange/30'
      };
    case 'destination':
      return {
        badge: 'DESTINATION',
        icon: '𓉐',
        gradientFrom: 'from-indigo-500',
        gradientTo: 'to-purple-600',
        hoverColor: 'group-hover:text-indigo-600',
        buttonGradient: 'from-indigo-500 to-purple-600',
        buttonHover: 'hover:from-indigo-600 hover:to-purple-700',
        borderColor: 'border-indigo-200 hover:border-indigo-400',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-800',
        badgeBorder: 'border-indigo-200'
      };
    case 'experience':
      return {
        badge: 'EXPERIENCE',
        icon: '𓊪',
        gradientFrom: 'from-pink-500',
        gradientTo: 'to-rose-600',
        hoverColor: 'group-hover:text-pink-600',
        buttonGradient: 'from-pink-500 to-rose-600',
        buttonHover: 'hover:from-pink-600 hover:to-rose-700',
        borderColor: 'border-pink-200 hover:border-pink-400',
        badgeBg: 'bg-pink-100',
        badgeText: 'text-pink-800',
        badgeBorder: 'border-pink-200'
      };
    default:
      return {
        badge: 'ITEM',
        icon: '🛥️',
        gradientFrom: 'from-travelok-blue-light',
        gradientTo: 'to-travelok-blue',
        hoverColor: 'group-hover:text-travelok-blue',
        buttonGradient: 'from-travelok-blue-light to-travelok-blue',
        buttonHover: 'hover:from-travelok-blue hover:to-travelok-blue-dark',
        borderColor: 'border-travelok-blue/20 hover:border-travelok-blue/40',
        badgeBg: 'bg-travelok-blue/10',
        badgeText: 'text-travelok-blue-dark',
        badgeBorder: 'border-travelok-blue/30'
      };
  }
};

// Main props interface
interface UnifiedCardProps {
  // Required props
  title: string;
  imageUrl?: string;
  href: string;
  
  // Type and category
  type: CardType;
  category?: string;
  
  // Content
  description?: string;
  shortDescription?: string;
  
  // Metadata (flexible for different content types)
  metadata?: {
    price?: number;
    duration?: number;
    capacity?: number;
    author?: string;
    publishedAt?: string;
    readTime?: number;
    location?: string;
    rating?: number;
    reviewCount?: number;
    featured?: boolean;
    tags?: string[];
    [key: string]: any;
  };
  
  // Buttons
  primaryButton?: {
    text: string;
    href: string;
    icon?: ReactNode;
  };
  secondaryButton?: {
    text: string;
    href: string;
    icon?: ReactNode;
  };
  
  // Layout options
  imageHeight?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showMetadata?: boolean;
  animationDelay?: number;
  
  // Custom overrides
  customConfig?: Partial<CategoryConfig>;
}

export default function UnifiedCard({
  title,
  imageUrl,
  href,
  type,
  category,
  description,
  shortDescription,
  metadata = {},
  primaryButton,
  secondaryButton,
  imageHeight = 'md',
  showBadge = true,
  showMetadata = true,
  animationDelay = 0,
  customConfig
}: UnifiedCardProps) {
  const config = customConfig ? { ...getCategoryConfig(type, category), ...customConfig } : getCategoryConfig(type, category);
  
  const heightClasses = {
    sm: 'h-48',
    md: 'h-56',
    lg: 'h-64'
  };

  // Format price based on type
  const formatPrice = (price: number) => {
    const suffix = type === 'dahabiya' ? '/day' : '';
    return `$${price.toLocaleString()}${suffix}`;
  };

  // Render metadata based on content type
  const renderMetadata = () => {
    if (!showMetadata || !metadata) return null;

    const metadataItems = [];

    // Common metadata items
    if (metadata.price) {
      metadataItems.push(
        <span key="price" className="flex items-center">
          <span className="mr-1">💰</span>
          {formatPrice(metadata.price)}
        </span>
      );
    }

    if (metadata.duration) {
      const durationText = type === 'blog' && metadata.readTime 
        ? `${metadata.readTime} min read`
        : `${metadata.duration} days`;
      metadataItems.push(
        <span key="duration" className="flex items-center">
          <span className="mr-1">⏱️</span>
          {durationText}
        </span>
      );
    }

    if (metadata.capacity) {
      metadataItems.push(
        <span key="capacity" className="flex items-center">
          <span className="mr-1">👥</span>
          Up to {metadata.capacity}
        </span>
      );
    }

    if (metadata.author) {
      metadataItems.push(
        <span key="author" className="flex items-center">
          <span className="mr-1">✍️</span>
          {metadata.author}
        </span>
      );
    }

    if (metadata.publishedAt) {
      metadataItems.push(
        <span key="published" className="flex items-center">
          <span className="mr-1">📅</span>
          {new Date(metadata.publishedAt).toLocaleDateString()}
        </span>
      );
    }

    if (metadata.location) {
      metadataItems.push(
        <span key="location" className="flex items-center">
          <span className="mr-1">📍</span>
          {metadata.location}
        </span>
      );
    }

    if (metadata.rating && metadata.reviewCount) {
      metadataItems.push(
        <span key="rating" className="flex items-center">
          <span className="mr-1">⭐</span>
          {metadata.rating.toFixed(1)} ({metadata.reviewCount})
        </span>
      );
    }

    return (
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600 flex-wrap gap-2">
        {metadataItems}
      </div>
    );
  };

  const cardContent = (
      <div 
        className={`group glass-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-200 hover:border-[#1193b1]/20 h-full flex flex-col`}
      style={{
        animationDelay: `${animationDelay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {/* Image */}
      <div className={`relative ${heightClasses[imageHeight]} overflow-hidden bg-gray-100`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out z-0"
            style={{ zIndex: 0 }}
            onLoad={() => {
              console.log('✅ UnifiedCard image loaded successfully:', imageUrl);
            }}
            onError={(e) => {
              console.error('❌ UnifiedCard image failed to load:', imageUrl);
              e.currentTarget.src = '/images/placeholder.jpg';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1193b1]/10 to-[#1193b1]/20 z-0">
            <span className="text-6xl text-[#073b5a]/30">𓇳</span>
          </div>
        )}
        {/* Badge */}
          {showBadge && (
          <div className={`absolute top-3 left-3 z-20 bg-[#1193b1] text-white px-3 py-1 rounded-full text-xs font-bold shadow border border-[#1193b1]/20 luxury-font`}> 
            <span className="mr-1">{config.icon}</span>
            {metadata.featured ? 'FEATURED' : config.badge}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1193b1]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
      </div>
      
      {/* Content */}
      <div className="p-6 text-center flex-1 flex flex-col">
        <h3 className={`text-xl font-bold text-[#073b5a] mb-2 section-heading luxury-font ${config.hoverColor} transition-colors duration-300`}>
          {title}
        </h3>
        
        {/* Description */}
        {(shortDescription || description) && (
          <p className="text-gray-700/85 text-sm mb-4 line-clamp-2 flex-1 luxury-font">
            {shortDescription || description}
          </p>
        )}
        
        {/* Metadata */}
        {renderMetadata()}
        
        {/* Tags */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {metadata.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-[#1193b1]/10 text-[#073b5a] rounded-full"
                >
                  {tag}
                </span>
              ))}
              {metadata.tags.length > 3 && (
                <span className="text-xs px-2 py-1 bg-[#1193b1]/10 text-[#073b5a] rounded-full">
                  +{metadata.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          {primaryButton ? (
            <ViewDetailsButton 
              href={primaryButton.href}
              className="w-full bg-gradient-to-r from-[#1193b1] to-[#0b79a0] text-white luxury-font text-lg px-4 py-2 rounded-md"
              icon={primaryButton.icon}
            >
              {primaryButton.text}
            </ViewDetailsButton>
          ) : (
            <ViewDetailsButton 
              href={href}
              className="w-full bg-gradient-to-r from-[#1193b1] to-[#0b79a0] text-white luxury-font text-lg px-4 py-2 rounded-md"
            />
          )}
          {secondaryButton && (
            <ViewDetailsButton 
              href={secondaryButton.href}
              variant="outline"
              className="w-full border-[#1193b1] text-[#073b5a] bg-white luxury-font text-lg opacity-90 hover:opacity-100"
              icon={secondaryButton.icon}
            >
              {secondaryButton.text}
            </ViewDetailsButton>
          )}
        </div>
      </div>
    </div>
  );

  // If no custom buttons are provided, wrap in a Link
  if (!primaryButton && !secondaryButton) {
    return (
      <Link href={href} className="block group h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

// Export the type definitions for use in other components
export type { UnifiedCardProps };