"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  Send,
  Heart,
  Anchor,
  Waves,
  Sun,
  Star,
  ArrowRight
} from 'lucide-react';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';

interface FooterContent {
  [key: string]: any;
}

interface FooterProps {
  settings?: { [key: string]: string };
}

export default function Footer({ settings = {} }: FooterProps) {
  const [content] = useState<FooterContent>({});
  const [email, setEmail] = useState('');

  // Permanent default content for AltaVida Tours / Treasure details
  const defaults: FooterContent = {
    footer_company_name: 'AltaVida Tours',
    footer_description:
      'Explore Egypt with AltaVida Tours. Tailored Nile journeys, dahabiya cruises, cultural adventures, and luxury experiences crafted by local experts.',
    contact_phone: '+20 100 258 8564',
    contact_email: 'info@altavidatours.com',
    contact_address:
      'Pyramids View Tower 2, No. 312, Mashaal Station, Giza, Haram, Giza, Egypt',
    footer_site_url: 'https://www.altavidatours.com',
    footer_whatsapp: '+20 100 258 8564',
    footer_copyright: 'All rights reserved by AltaVida Tours.',
  };

  // Helper to get content with fallback (settings can optionally override defaults)
  const get = (key: string, fallback = '') => {
    return content[key] || settings[key] || defaults[key] || fallback;
  };

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  // Navigation links
  const quickLinks = [
    { href: "/daily-tours", label: get('footer_link_daily_tours', 'Daily Tours'), icon: Anchor },
    { href: "/packages", label: get('footer_link_packages', 'Packages'), icon: Star },
    { href: "/about", label: get('footer_link_about', 'About Us'), icon: Heart },
    { href: "/contact", label: get('footer_link_contact', 'Contact'), icon: Mail },
  ];

  const servicesLinks = [
    { href: "/tailor-made", label: get('footer_link_tailor_made', 'Tailor Made'), icon: Sun },
    { href: "/excursions", label: get('footer_link_excursions', 'Excursions'), icon: Waves },
    { href: "/gallery", label: get('footer_link_gallery', 'Gallery'), icon: Star },
    { href: "/reviews", label: get('footer_link_reviews', 'Reviews'), icon: Heart },
  ];

  const socialLinks = [
    { icon: Facebook, url: get('footer_social_facebook', '#'), label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Instagram, url: get('footer_social_instagram', '#'), label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Twitter, url: get('footer_social_twitter', '#'), label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: Linkedin, url: get('footer_social_linkedin', '#'), label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Youtube, url: get('footer_social_youtube', '#'), label: 'YouTube', color: 'hover:text-red-500' },
  ].filter(social => social.url && social.url !== '#'); // Only show configured social links

  return (
    <footer className="relative overflow-hidden">
      {/* Pale gradient background with Egyptian-inspired colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-blue-50 to-purple-50"></div>
      
      {/* Decorative elements with animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pharaoh-gold rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-nile-blue rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-emerald-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Animated wave pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pharaoh-gold/10 to-transparent">
        <svg className="absolute bottom-0 w-full h-16 text-blue-400/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Company Info with Logo */}
            <div className="lg:col-span-1 space-y-6">
              <div className="group">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-pharaoh-gold to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Anchor className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pharaoh-gold via-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
                      AltaVida Tours
                    </h2>
                    <p className="text-pharaoh-gold text-sm font-semibold">Egypt Tours & Travel</p>
                  </div>
                </div>
                
                {/* Logo - place the AltaVida logo in `public/icons/altavida-logo-1.svg` */}
                <div className="mb-6">
                  <Image
                    src="/icons/altavida-logo-1.svg"
                    alt="AltaVida Tours Logo"
                    width={200}
                    height={200}
                    className="object-contain group-hover:scale-105 transition-transform duration-300 bg-white/5 rounded-lg p-2"
                    style={{ maxWidth: '180px', height: 'auto', minHeight: '60px' }}
                    loader={({ src, width, quality = 75 }) => `${src}?w=${width}&q=${quality}`}
                    onError={(e) => {
                      console.error('altavida logo not found in /icons. Please add the logo file as /icons/altavida-logo-1.svg');
                      // Try fallback
                      const img = e.target as HTMLImageElement;
                      if (!img.src.includes('wordmark')) {
                        img.src = '/icons/altavida-logo-1.png';
                      }
                    }}
                  />
                </div>
                
                {/* Pharaonic Text */}
                <div className="mb-4">
                  <PharaonicText showTranslation={false} className="text-left" />
                </div>
                
                {/* Pharaonic Decorations */}
                <div className="mb-4">
                  <PharaonicDecoration variant="footer" size="sm" />
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-base">
                {get('footer_description', 'Discover the wonders of Egypt with our comprehensive travel packages and daily tours. Experience ancient history, vibrant culture, and unforgettable adventures.')}
              </p>

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <Link
                        key={index}
                        href={social.url}
                        className={`w-10 h-10 bg-pharaoh-gold/20 rounded-full flex items-center justify-center text-pharaoh-gold ${social.color} transition-all duration-300 hover:bg-pharaoh-gold/30 hover:scale-110 hover:shadow-lg hover:rotate-12`}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconComponent className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-pharaoh-gold to-nile-blue bg-clip-text text-transparent relative">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-pharaoh-gold to-orange-500 rounded-full animate-pulse"></div>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="flex items-center space-x-3 text-gray-700 hover:text-pharaoh-gold transition-all duration-300 group"
                      >
                        <IconComponent className="w-4 h-4 text-pharaoh-gold group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                        <span className="group-hover:translate-x-2 transition-transform duration-300 font-medium">{link.label}</span>
                        <ArrowRight className="w-3 h-3 text-pharaoh-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-nile-blue to-purple-600 bg-clip-text text-transparent relative">
                Our Services
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-nile-blue to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </h3>
              <ul className="space-y-3">
                {servicesLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="flex items-center space-x-3 text-gray-700 hover:text-nile-blue transition-all duration-300 group"
                      >
                        <IconComponent className="w-4 h-4 text-nile-blue group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                        <span className="group-hover:translate-x-2 transition-transform duration-300 font-medium">{link.label}</span>
                        <ArrowRight className="w-3 h-3 text-nile-blue opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent relative">
                Get In Touch
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-4">
                {get('contact_address') && (
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300">
                      <MapPin className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        {get('contact_address')}
                      </p>
                    </div>
                  </div>
                )}

                {get('contact_phone') && (
                  <div className="flex items-center space-x-3 group">
                    <div className="w-8 h-8 bg-nile-blue/30 rounded-full flex items-center justify-center group-hover:bg-nile-blue group-hover:scale-110 transition-all duration-300">
                      <Phone className="w-4 h-4 text-nile-blue group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      {get('contact_phone')}
                    </p>
                  </div>
                )}

                {get('contact_email') && (
                  <div className="flex items-center space-x-3 group">
                    <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                      <Mail className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      {get('contact_email')}
                    </p>
                  </div>
                )}
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-pharaoh-gold/10 to-nile-blue/10 rounded-lg p-4 backdrop-blur-sm border-2 border-pharaoh-gold/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
                  <Send className="w-4 h-4 text-pharaoh-gold" />
                  Stay Updated
                </h4>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 bg-white/80 border-2 border-pharaoh-gold/30 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:border-pharaoh-gold transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pharaoh-gold to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-pharaoh-gold/90 hover:to-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:rotate-12 transition-all duration-300" />
                    <span>Subscribe</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t-2 border-pharaoh-gold/20 pt-8">
            {/* Pharaonic Text in Footer */}
            <div className="flex justify-center mb-6 animate-pulse">
              <PharaonicText className="text-pharaoh-gold" showTranslation={true} />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-700 text-sm font-semibold">
                  © 2025 AltaVida Tours. All rights reserved.
                </p>
                <p className="text-gray-600 text-xs mt-1 flex items-center justify-center md:justify-start space-x-1">
                  <span>Crafted with</span>
                  <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                  <span className="font-medium">for the timeless beauty of Egypt</span>
                </p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 font-medium">
                <Link href="/privacy" className="hover:text-pharaoh-gold hover:scale-110 transition-all duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-pharaoh-gold hover:scale-110 transition-all duration-300">
                  Terms of Service
                </Link>
                <Link href="/sitemap" className="hover:text-pharaoh-gold hover:scale-110 transition-all duration-300">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
