"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { Star, User, MapPin, Calendar } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name?: string;
    image?: string;
  };
  dahabiya: {
    name: string;
    hieroglyph?: string;
  };
  tripDate?: string;
  location?: string;
}

interface ReviewCardProps {
  review: Review;
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < rating ? 'text-[#1193b1] fill-current' : 'text-gray-300'
      }`}
    />
  ));
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-200 hover:border-blue-400 h-full flex flex-col">
      {/* Review Badge */}
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
        <span className="mr-1">💬</span>
        REVIEW
      </div>
      
      {/* Content */}
      <div className="p-6 text-center flex-1 flex flex-col">
        {/* User Info */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {review.user.image ? (
            <Image
              src={review.user.image}
              alt={review.user.name || 'User'}
              width={50}
              height={50}
              className="rounded-full border-2 border-blue-500"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {review.user.name || 'Anonymous Traveler'}
            </h3>
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          {review.user.image ? (
            <Image
              src={review.user.image}
              alt={review.user.name || 'User'}
              width={50}
              height={50}
              className="rounded-full border-2 border-ocean-blue"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-ocean-blue to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1">
            <Typography
              variant="h6"
              className="font-bold text-black mb-1"
              style={{ fontFamily: 'serif' }}
            >
              {review.user.name || 'Anonymous Traveler'}
            </Typography>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
            </div>
          </div>
        </div>

        
        {/* Dahabiya Name */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-blue-600">
            {review.dahabiya.name}
          </h4>
        </div>

        {/* Review Content */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 italic">
          &quot;{review.comment}&quot;
        </p>

        {/* Metadata */}
        <div className="flex justify-center items-center mb-4 text-sm text-gray-600 flex-wrap gap-2">
          <span className="flex items-center">
            <span className="mr-1">📅</span>
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
          {review.tripDate && (
            <span className="flex items-center">
              <span className="mr-1">✈️</span>
              {new Date(review.tripDate).toLocaleDateString()}
            </span>
          )}
          {review.location && (
            <span className="flex items-center">
              <span className="mr-1">📍</span>
              {review.location}
            </span>
          )}
        </div>

        {/* Rating Display */}
        <div className="mt-auto">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl inline-block shadow-md">
            <span className="text-sm font-semibold">
              {review.rating}/5 Stars
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
