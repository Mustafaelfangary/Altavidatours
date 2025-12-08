"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, Typography, Box, Alert, Pagination } from '@mui/material';
// import FeaturedDahabiyaCard from './FeaturedDahabiyaCard';
import ScheduleDemo from '@/components/homepage/ScheduleDemo';
import { useContent } from '@/hooks/useContent';
import { LogoSpinner } from '@/components/ui/LogoLoader';

interface TravelServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  cabins?: number;
  crew?: number;
  length?: number;
  width?: number;
  yearBuilt?: number;
  mainImage?: string;
  gallery: string[];
  videoUrl?: string;
  features: string[];
  amenities: string[];
  activities: string[];
  diningOptions: string[];
  routes: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
category: 'STANDARD' | 'DELUXE' | 'LUXURY' | 'PREMIUM' | 'VIP';
}

interface ServiceListResponse {
  services: TravelServiceItem[];
  total: number;
  pages: number;
  currentPage: number;
}

interface ServiceListProps {
  activeOnly?: boolean;
  limit?: number;
}

export default function DahabiyaList({ activeOnly = true, limit = 12 }: ServiceListProps) {
  const [data, setData] = useState<ServiceListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { getContent } = useContent({ page: 'services' });

  const fetchServices = async (page: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(activeOnly && { active: 'true' }),
      });

      const response = await fetch(`/api/travel-services?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage, activeOnly, limit]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LogoSpinner size="md" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        className="mb-6 bg-red-50 border-2 border-red-200"
        style={{ borderRadius: '12px' }}
      >
        <Typography className="font-medium">{error}</Typography>
      </Alert>
    );
  }

  if (!data || data.services.length === 0) {
    return (
      <Box textAlign="center" py={12} className="bg-gray-50 rounded-lg border">
        <Typography variant="h4" className="text-gray-800 font-bold mb-2">
          {getContent('services_empty_title') || 'No Services Found'}
        </Typography>
        <Typography variant="body1" className="text-gray-600 max-w-md mx-auto">
          {activeOnly
            ? (getContent('services_empty_description_active') || 'Our services are being updated. Please check back soon for new experiences.')
            : (getContent('services_empty_description_all') || 'No services have been added to our collection yet.')
          }
        </Typography>
      </Box>
    );
  }

  // Group dahabiyas by category
  const groupedServices = data.services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, TravelServiceItem[]>);

  // Define category order
  const categoryOrder = ['VIP', 'LUXURY', 'PREMIUM', 'DELUXE', 'STANDARD'];

  return (
    <Box>
      {/* Enhanced Results Summary */}
      <Box mb={6} textAlign="center">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Typography variant="h5" className="text-gray-900 font-bold mb-1">
            {getContent('services_title') || 'Featured Travel Services'}
          </Typography>
          <Typography variant="h6" className="text-gray-700">
            {getContent('services_description') || 'Showing'} {data.services.length} of {data.total} services
          </Typography>
        </div>
      </Box>

      {/* Render categories in order */}
      {categoryOrder.map((category) => {
        const categoryServices = groupedServices[category];
        if (!categoryServices || categoryServices.length === 0) return null;

        return (
          <Box key={category} mb={8}>
            {/* Category Header */}
            <Box mb={4} textAlign="center">
              <Typography variant="h4" className="text-gray-800 font-bold mb-6">
                {category} Collection
              </Typography>
            </Box>

            {/* Category Dahabiyas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto px-4 lg:px-6 mb-8">
              {categoryServices.map((service, index) => {
              const getCategoryConfig = (category: string) => {
                switch (category) {
                  case 'VIP':
                    return {
                      badge: 'VIP',
                      icon: '⭐',
                      gradientFrom: 'from-amber-500',
                      gradientTo: 'to-yellow-600',
                      hoverColor: 'group-hover:text-amber-600',
                      buttonGradient: 'from-amber-500 to-yellow-600',
                      buttonHover: 'hover:from-amber-600 hover:to-yellow-700',
                      borderColor: 'border-amber-200 hover:border-amber-400'
                    };
                  case 'LUXURY':
                    return {
                      badge: 'LUXURY',
                      icon: '💎',
                      gradientFrom: 'from-purple-600',
                      gradientTo: 'to-indigo-700',
                      hoverColor: 'group-hover:text-purple-600',
                      buttonGradient: 'from-purple-600 to-indigo-700',
                      buttonHover: 'hover:from-purple-700 hover:to-indigo-800',
                      borderColor: 'border-purple-200 hover:border-purple-400'
                    };
                  case 'PREMIUM':
                    return {
                      badge: 'PREMIUM',
                      icon: '🏆',
                      gradientFrom: 'from-emerald-500',
                      gradientTo: 'to-teal-600',
                      hoverColor: 'group-hover:text-emerald-600',
                      buttonGradient: 'from-emerald-500 to-teal-600',
                      buttonHover: 'hover:from-emerald-600 hover:to-teal-700',
                      borderColor: 'border-emerald-200 hover:border-emerald-400'
                    };
                  case 'DELUXE':
                    return {
                      badge: 'DELUXE',
                      icon: '✨',
                      gradientFrom: 'from-cyan-500',
                      gradientTo: 'to-blue-600',
                      hoverColor: 'group-hover:text-cyan-600',
                      buttonGradient: 'from-cyan-500 to-blue-600',
                      buttonHover: 'hover:from-cyan-600 hover:to-blue-700',
                      borderColor: 'border-cyan-200 hover:border-cyan-400'
                    };
                  default: // STANDARD
                    return {
                      badge: 'STANDARD',
                      icon: '🌟',
                      gradientFrom: 'from-gray-500',
                      gradientTo: 'to-slate-600',
                      hoverColor: 'group-hover:text-gray-600',
                      buttonGradient: 'from-gray-500 to-slate-600',
                      buttonHover: 'hover:from-gray-600 hover:to-slate-700',
                      borderColor: 'border-gray-200 hover:border-gray-400'
                    };
                }
              };
              
              const config = getCategoryConfig(service.category);
              
              return (
                <div
                  key={String(service.id)}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border ${config.borderColor} w-full max-w-xs mx-auto lg:max-w-none`}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  {/* Category Badge */}
                  <div className={`absolute top-4 left-4 z-10 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    <span className="mr-1">{config.icon}</span>
                    {config.badge}
                  </div>
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={String(service.mainImage || '/images/placeholder-service.jpg')}
                      alt={String(service.name || 'Service')}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 text-center">
                      <h3 className={`text-xl font-bold text-gray-800 mb-4 ${config.hoverColor} transition-colors duration-300`}>
                      {String(service.name || 'Service')}
                    </h3>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <Link href={`/booking?service=${service.slug || service.id}`}>
                        <button className={`w-full bg-gradient-to-r ${config.buttonGradient} text-white px-6 py-3 text-sm font-semibold ${config.buttonHover} rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105`}>
                          Book Now
                        </button>
                      </Link>
                      
                      <Link href={`/dahabiyas/${service.slug || service.id}`}>
                        <button className={`w-full border-2 ${config.gradientFrom.replace('from-', 'border-')} ${config.hoverColor.replace('group-hover:', '').replace('text-', 'text-')} px-6 py-3 text-sm font-semibold hover:bg-opacity-10 rounded-xl transition-all duration-300 transform hover:scale-105`}>
                          View Details
                        </button>
                      </Link>
                    </div>
                    
                  </div>
                </div>
              );
              })}
            </div>

            {/* Schedule Section for this category */}
            <Box mb={6}>
              <ScheduleDemo category={category} className="max-w-none" />
            </Box>
          </Box>
        );
      })}

      {/* Enhanced Pagination */}
      {data && data.pages > 1 && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          
          <div className="bg-gradient-to-r from-ocean-blue-100 to-navy-blue-100 rounded-lg p-4 border-2 border-egyptian-gold/20">
            <Pagination
              count={data.pages}
              page={currentPage}
              onChange={handlePageChange}
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#8B4513',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#0080ff',
                    color: '#fff',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#0080ff',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#B8860B',
                    },
                  },
                },
              }}
            />
          </div>
        </Box>
      )}
    </Box>
  );
}
