'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description?: string;
  order: number;
  isActive: boolean;
}

interface PartnersProps {
  variant?: 'footer' | 'page';
  className?: string;
}

export default function Partners({ variant = 'footer', className = '' }: PartnersProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        if (response.ok) {
          const data = await response.json();
          setPartners(data);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return null;
  }

  // Use mock partners if none exist in database
  const displayPartners = partners.length > 0 ? partners : [
    {
      id: 'mock-1',
      name: 'Altavida Tours.com',
      logoUrl: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png',
      websiteUrl: 'https://www.altavidatours.com',
      description: 'Premium Egypt Tours & Travel Experiences',
      order: 0,
      isActive: true,
    },
  ];

  const showAdminNotice = partners.length === 0;
  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold mb-4 text-white">Our Partners</h3>
        {showAdminNotice && (
          <p className="text-xs text-yellow-300 mb-2">⚠️ Using demo partners. Add real partners in admin panel.</p>
        )}
        <div className="flex flex-wrap gap-4 items-center">
          {displayPartners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover:scale-105 border border-white/20 group"
              title={partner.description || partner.name}
            >
              <div className="relative">
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                  unoptimized
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    );
  }

  // Page variant - larger, more detailed
  return (
    <section className={`py-20 bg-gradient-to-b from-[#f5f1e8] via-white to-[#f5f1e8] ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">🤝</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-ocean-blue mb-6"
          >
            Our Trusted Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-lg max-w-3xl mx-auto"
          >
            We collaborate with leading travel companies to bring you exceptional experiences across Egypt
          </motion.p>
        </div>

        {showAdminNotice && (
          <div className="text-center mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800 font-semibold">⚠️ Demo Partners Displayed</p>
            <p className="text-yellow-700 text-sm mt-2">
              Add real partners in the <a href="/admin/partners" className="underline font-bold">Admin Panel</a>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayPartners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="block group"
            >
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border-2 border-transparent hover:border-[#0080ff] h-full flex flex-col relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0080ff]/5 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex flex-col items-center text-center relative z-10 flex-1">
                  {/* Logo Container */}
                  <div className="mb-6 bg-gradient-to-br from-[#f5f1e8] to-white rounded-2xl p-8 w-full flex items-center justify-center min-h-[160px] shadow-inner group-hover:shadow-lg group-hover:scale-105 transition-all duration-500 border border-gray-100">
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={240}
                      height={120}
                      className="max-h-28 w-auto object-contain filter group-hover:brightness-110 transition-all duration-500"
                      unoptimized
                    />
                  </div>

                  {/* Partner Info */}
                  <h3 className="text-2xl font-bold text-ocean-blue mb-3 group-hover:text-[#0080ff] transition-colors duration-300">
                    {partner.name}
                  </h3>
                  {partner.description && (
                    <p className="text-gray-600 text-sm mb-6 flex-1">
                      {partner.description}
                    </p>
                  )}

                  {/* Visit Button */}
                  <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0080ff] to-[#0066cc] text-white font-semibold rounded-full group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                    <span>Visit Website</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
