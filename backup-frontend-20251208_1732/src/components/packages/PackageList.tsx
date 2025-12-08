"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { PackageCard } from './PackageCard';
import { LogoSpinner } from '@/components/ui/LogoLoader';

interface Package {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  isFeaturedOnHomepage?: boolean;
  homepageOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PackageListProps {
  activeOnly?: boolean;
  limit?: number;
  featured?: boolean;
}

export function PackageList({ activeOnly = true, limit, featured }: PackageListProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (featured) params.append('featured', 'true');
        
        console.log('📦 PackageList: Fetching packages with params:', params.toString());
        const response = await fetch(`/api/packages?${params.toString()}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('📦 PackageList: API error:', response.status, errorText);
          throw new Error(`Failed to fetch packages: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📦 PackageList: Received data:', data);
        let fetchedPackages = data.packages || data || [];
        
        // Filter packages if requested (all packages are considered active since there's no isActive field)
        if (activeOnly) {
          // All packages are considered active since the Package model doesn't have isActive field
          // This filter is kept for future compatibility
          fetchedPackages = fetchedPackages.filter((pkg: Package) => pkg.price > 0);
        }
        
        console.log('📦 PackageList: Setting packages:', fetchedPackages.length);
        setPackages(fetchedPackages);
      } catch (err) {
        console.error('📦 PackageList: Error fetching packages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load packages');
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [activeOnly, limit, featured]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LogoSpinner size="md" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="text-center">
          <Typography variant="h6" className="text-red-600 mb-2">
            Error Loading Packages
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {error}
          </Typography>
        </div>
      </Box>
    );
  }

  if (packages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="text-center">
          <Typography className="text-6xl text-gray-300 mb-4">𓇳</Typography>
          <Typography variant="h6" className="text-gray-500 mb-2">
            No Packages Available
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Check back soon for new journey packages
          </Typography>
        </div>
      </Box>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
          <Typography className="text-4xl text-blue-600">𓇳</Typography>
          <Typography variant="h4" className="font-bold text-gray-800">
            Our Journey Packages
          </Typography>
          <Typography className="text-4xl text-blue-600">𓇳</Typography>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
        </div>
        <Typography variant="h6" className="text-gray-600 max-w-2xl mx-auto">
          Carefully curated experiences that combine luxury, culture, and adventure along the eternal Nile
        </Typography>
      </div>

      {/* Enhanced Package Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 lg:px-2 xl:px-0 max-w-none mx-auto">
        {packages.map((pkg) => (
          <div key={pkg.id} className="w-full mx-auto lg:max-w-none">
            <PackageCard package={pkg} />
          </div>
        ))}
      </div>

      {/* Enhanced Pagination - if needed */}
      {packages.length >= (limit || 12) && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          {/* Decorative Divider */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-blue-400"></div>
            <Typography className="text-blue-600 text-3xl">𓇳</Typography>
            <div className="w-16 h-0.5 bg-blue-400"></div>
          </div>
          
          <Typography variant="body2" className="text-gray-600">
            Showing {packages.length} packages
          </Typography>
        </Box>
      )}
    </div>
  );
}
