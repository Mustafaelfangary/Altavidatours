"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Heart, Star, Globe, X, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import MediaPicker from '@/components/admin/MediaPicker';
import Partners from '@/components/Partners';

interface FooterSettings {
  [key: string]: string | number | boolean | null | undefined;
  'footer-title'?: string;
  'footer-description'?: string;
  'footer-address'?: string;
  'footer-phone'?: string;
  'footer-email'?: string;
  'footer-facebook'?: string;
  'footer-twitter'?: string;
  'footer-instagram'?: string;
  'footer-company-name'?: string;
  'footer_quick_links_title'?: string;
  'footer_follow_us_title'?: string;
  'footer_newsletter_title'?: string;
  'footer-newsletter-text'?: string;
  'footer_subscribe_button_text'?: string;
  'footer_developer_logo'?: string;
  'footer_developer_phone'?: string;
  'footer_developer_contact_text'?: string;
  'footer_developer_contact_modal_title'?: string;
  'footer_developer_contact_url'?: string;
  'footer_developer_phone_url'?: string;
  'footer_loading_text'?: string;
}

interface FooterProps {
  settings?: FooterSettings;
  footerSettings?: FooterSettings;
}

// Contact Developer Modal Component
function ContactDeveloperModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { getContent } = useContent({ page: 'global_media' });

  const get = (key: string, fallback = '') => {
    const contentValue = getContent(key, '');
    return contentValue || fallback;
  };

  // WhatsApp handler
  const handleWhatsApp = () => {
    const phone = get('footer_developer_phone', '+201234567890').replace(/\\s+/g, '').replace('+', '');
    const message = encodeURIComponent('Hello! I would like to get in touch regarding your development services.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm rounded-full hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Mail className="w-4 h-4 mr-2" />
        {get('footer_developer_contact_text', 'Contact Developer')}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.95) 0%, rgba(59, 130, 246, 0.9) 25%, rgba(16, 185, 129, 0.85) 50%, rgba(96, 165, 250, 0.9) 75%, rgba(34, 197, 94, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '3px solid rgba(13, 148, 136, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(13, 148, 136, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 60px rgba(13, 148, 136, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {get('footer_developer_contact_modal_title', 'Contact Developer')}
              </h3>

              <div className="space-y-3">
                <a
                  href={get('footer_developer_contact_url', 'mailto:developer@altavidatours.com')}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 50%, #059669 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(13, 148, 136, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Send Email
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className="w-5 h-5 mr-3 text-lg">💬</span>
                  WhatsApp
                </button>

                <a
                  href={get('footer_developer_phone_url', 'tel:+201234567890')}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #1A73E8 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function FooterModern({ settings = {}, footerSettings = {} }: FooterProps) {
  const { getContent, loading: contentLoading } = useContent({ page: 'footer' });
  const { getContent: getGlobalContent } = useContent({ page: 'global_media' });
  const { getContent: getBrandingContent } = useContent({ page: 'branding_settings' });
  const { data: session } = useSession();
  const [footerLogoTimestamp, setFooterLogoTimestamp] = useState(Date.now());

  // Get dynamic footer logo with cache busting
  const getFooterLogo = () => {
    // Prefer branding settings, fallback to global media
    const logoUrl = getBrandingContent('footer_logo', '') || getGlobalContent('footer_logo', '/images/altavida-logo.svg');
    // Add cache-busting timestamp
    if (logoUrl.includes('?')) {
      return `${logoUrl}&t=${footerLogoTimestamp}`;
    }
    return `${logoUrl}?t=${footerLogoTimestamp}`;
  };

  // Helper to get a setting value with priority: footerSettings > content > settings > fallback
  const get = (key: string, fallback = '') => {
    // For developer-related keys, check global_media content first
    if (key.includes('developer')) {
      const globalContentValue = getGlobalContent(key, '');
      if (globalContentValue) return globalContentValue;
    }

    // Use content system for ALL other keys
    const contentValue = getContent(key, '');
    return footerSettings[key] || (contentValue || settings[key]) || fallback;
  };

  // Add event listeners for logo updates
  useEffect(() => {
    const handleLogoUpdate = () => {
      setFooterLogoTimestamp(Date.now());
    };
    
    window.addEventListener('content-updated', handleLogoUpdate);
    window.addEventListener('logo-updated', handleLogoUpdate);
    
    return () => {
      window.removeEventListener('content-updated', handleLogoUpdate);
      window.removeEventListener('logo-updated', handleLogoUpdate);
    };
  }, []);

  if (contentLoading) {
    return (
      <footer className="bg-gradient-to-b from-teal-50 to-blue-50 min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-700 font-semibold">{get('footer_loading_text', 'Loading Footer...')}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0B2E4F 0%, #08243E 65%, #081A2D 100%)' }}>
      {/* TravelOK-style background */}
      <div className="absolute inset-0 bg-gradient-to-br from-travelok-blue-800/90 via-travelok-blue-900/95 to-black/90"></div>

      {/* TravelOK pattern overlay */}
      <div className="absolute inset-0 opacity-3">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6600' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15v-30l-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* TravelOK decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating elements with TravelOK colors */}
        <div className="absolute top-10 left-10 w-3 h-3 bg-travelok-orange/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-travelok-blue/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-travelok-orange/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Container maxWidth="xl" className="relative z-10">
        <div className="py-12 md:py-16 px-4 sm:px-6">
          {/* Modern Header - Mobile Optimized */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center mb-6">
              <Image
                src={getFooterLogo()}
                alt="AltaVida Tours Logo"
                width={150}
                height={150}
                className="h-24 md:h-32 w-auto object-contain"
                unoptimized={true}
                key={`footer-logo-${footerLogoTimestamp}`}
              />
            </div>

            {/* TravelOK Divider */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-travelok-orange to-transparent"></div>
                <div className="mx-4 text-2xl">🛥️</div>
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 px-4">
              <span className="text-travelok-orange mr-2">✨</span>
              {get('footer-title', 'AltaVida Tours')}
              <span className="text-travelok-orange ml-2">✨</span>
            </h2>
            <p className="text-white/90 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-4 font-medium">
              <span className="text-travelok-orange mr-2">🛥️</span>
              {get('footer-description', 'Experience the magic of ancient Egypt with luxury dahabiya cruises along the timeless Nile River. Your gateway to pharaonic wonders and unforgettable adventures.')}
              <span className="text-travelok-orange ml-2">🛥️</span>
            </p>
          </div>

          {/* Modern Content Grid - Mobile Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 md:mb-16">

            {/* Navigation */}
            <div className="text-center sm:text-left">
              <h3 className="text-travelok-orange font-bold text-lg mb-4">
                <span className="text-white mr-2">📍</span>
                {get('footer_quick_links_title', 'Quick Links')}
                <span className="text-white ml-2">📍</span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: get('footer-link-home', 'Home'), href: '/' },
                  { name: get('footer-link-dahabiyas', 'Dahabiyas'), href: '/dahabiyas' },
                  { name: get('footer-link-itineraries', 'Itineraries'), href: '/itineraries' },
                  { name: get('footer-link-packages', 'Packages'), href: '/packages' },
                  { name: get('footer-link-about', 'About Us'), href: '/about' },
                  { name: get('footer-link-contact', 'Contact'), href: '/contact' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-travelok-orange transition-colors duration-300 font-medium text-base block py-1 px-3 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-travelok-orange"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - Mobile Enhanced */}
            <div className="text-center sm:text-left">
              <h3 className="text-travelok-orange font-bold text-lg mb-4">
                <span className="text-white mr-2">📞</span>
                Contact Information
                <span className="text-white ml-2">📞</span>
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: MapPin,
                    text: get('footer-address', 'Luxor, Egypt - Nile River'),
                    color: 'text-travelok-orange'
                  },
                  {
                    icon: Phone,
                    text: get('footer-phone', '+20 95 237 0574'),
                    color: 'text-white'
                  },
                  {
                    icon: Mail,
                    text: get('footer-email', 'info@altavidatours.com'),
                    color: 'text-travelok-orange'
                  }
                ].map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <div key={index} className="flex items-center justify-center sm:justify-start space-x-3 py-2">
                      <Icon className={`w-5 h-5 ${contact.color} flex-shrink-0`} />
                      <span className="text-white/90 font-medium text-base break-all sm:break-normal">
                        {contact.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media - Mobile Enhanced */}
            <div className="text-center sm:text-left">
              <h3 className="text-travelok-orange font-bold text-lg mb-4">
                <span className="text-white mr-2">🌐</span>
                {get('footer_follow_us_title', 'Connect With Us')}
                <span className="text-white ml-2">🌐</span>
              </h3>
              <div className="flex justify-center sm:justify-start space-x-4 mb-4">
                {[
                  { icon: Facebook, href: get('footer-facebook', '#'), label: 'Facebook', color: 'hover:bg-blue-500' },
                  { icon: Twitter, href: get('footer-twitter', '#'), label: 'Twitter', color: 'hover:bg-sky-400' },
                  { icon: Instagram, href: get('footer-instagram', '#'), label: 'Instagram', color: 'hover:bg-pink-500' },
                  { icon: Linkedin, href: get('footer-linkedin', '#'), label: 'LinkedIn', color: 'hover:bg-blue-700' }
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={String(social.href || '#')}
                    className={`w-12 h-12 bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center ${social.color} hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300 group focus-visible:outline-2 focus-visible:outline-travelok-orange`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white/80 group-hover:text-white" />
                  </Link>
                ))}
              </div>
              <p className="text-white/70 text-sm">
                Follow us for dahabiya adventures and exclusive offers!
              </p>
            </div>

            {/* Newsletter - Mobile Enhanced */}
            <div className="text-center sm:text-left">
              <h3 className="text-travelok-orange font-bold text-lg mb-4">
                <span className="text-white mr-2">📧</span>
                {get('footer_newsletter_title', 'Newsletter')}
                <span className="text-white ml-2">📧</span>
              </h3>
              <p className="text-white/90 mb-4 text-base font-medium px-2 sm:px-0">
                {get('footer-newsletter-text', 'Subscribe for exclusive dahabiya offers and ancient Egypt travel guides.')}
              </p>

              <div className="space-y-3 px-2 sm:px-0">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-lg focus:outline-none focus:border-travelok-orange focus:ring-2 focus:ring-travelok-orange/20 text-white placeholder-white/60 text-base backdrop-blur-sm"
                />

                <button className="w-full bg-gradient-to-r from-travelok-orange to-travelok-orange-dark text-white font-semibold py-3 px-6 rounded-lg hover:from-travelok-orange-dark hover:to-travelok-orange hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-base shadow-lg focus-visible:outline-2 focus-visible:outline-white">
                  <Send className="w-5 h-5" />
                  <span className="mr-1">🛥️</span>
                  <span>{get('footer_subscribe_button_text', 'Subscribe')}</span>
                  <span className="ml-1">🛥️</span>
                </button>
              </div>
            </div>
          </div>

          {/* Our Partners Section */}
          <div className="mt-12 pt-8 border-t border-teal-200/50">
            <Partners variant="footer" />
          </div>

          {/* Admin Access - Only visible to admin users */}
          {session?.user?.role === 'ADMIN' && (
            <div className="mt-12 p-6 bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl border-2 border-teal-200">
              <div className="text-center">
                <h4 className="text-teal-800 font-bold text-base mb-3">
                  <span className="text-blue-600 mr-2">👑</span>
                  Admin Access
                  <span className="text-teal-600 ml-2">👑</span>
                </h4>
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 text-base font-medium shadow-lg"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            </div>
          )}

          {/* TravelOK Divider */}
          <div className="my-12">
            <div className="flex items-center justify-center">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-travelok-orange to-transparent max-w-xs"></div>
              <div className="mx-6 flex space-x-2 text-2xl">
                <span>🛥️</span>
                <span>🏺</span>
                <span>🕌</span>
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/50 to-transparent max-w-xs"></div>
            </div>
          </div>

          {/* Developer Contact Section - Mobile Enhanced */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 px-4">
            {/* Developer Logo */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-lg flex-shrink-0">
              <Image
                src={String(get('footer_developer_logo', '/images/logo-white.png') || '/images/logo-white.png')}
                alt="Developer Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contact Developer Button */}
            <div className="mt-2 sm:mt-0">
              <ContactDeveloperModal />
            </div>
          </div>

          {/* TravelOK Bottom Section - Enhanced */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-white/90 font-medium text-base text-center md:text-left">
                © {new Date().getFullYear()} {get('footer-company-name', 'AltaVida Tours')}. All Rights Reserved.
                <span className="text-travelok-orange ml-2">Made with</span>
                <Heart className="w-4 h-4 text-red-400 mx-1 inline" />
                <span className="text-white">for Egyptian adventures</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <Link
                  href="/privacy"
                  className="text-white/80 hover:text-travelok-orange transition-colors duration-300 font-medium text-base px-3 py-1 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-travelok-orange"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-white/80 hover:text-travelok-orange transition-colors duration-300 font-medium text-base px-3 py-1 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-travelok-orange"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/sitemap"
                  className="text-white/80 hover:text-travelok-orange transition-colors duration-300 font-medium text-base px-3 py-1 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-travelok-orange"
                >
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
