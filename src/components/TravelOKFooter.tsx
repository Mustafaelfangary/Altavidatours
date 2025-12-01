"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TravelOKFooter() {
  const [logoUrl, setLogoUrl] = useState('/altavida-logo-1.png');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/logo', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.logoUrl) {
            let normalized = '/altavida-logo-1.png';
            if (typeof data.logoUrl === 'string') {
              const val = data.logoUrl.trim();
              if (val.startsWith('http')) normalized = val;
              else if (val.startsWith('/')) normalized = val;
              else if (val.match(/^[\w.-]+\.(png|jpg|jpeg|svg|webp|gif|ico)$/i)) normalized = '/' + val.replace(/^\/+/, '');
            }
            setLogoUrl(normalized);
          }
        }
      } catch (_) {
        // Use new default logo
        setLogoUrl('/altavida-logo-1.png');
      }
    };
    fetchLogo();
  }, []);
  return (
    <footer className="footer bg-white pt-16 pb-8 px-4 md:px-0 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <Image 
                src={logoUrl} 
                alt="Altavida Tours.com" 
                width={120}
                height={40}
                className="h-8 w-auto mr-3"
              />
              <div>
                <div className="text-emerald-900 font-bold text-2xl leading-tight luxury-font">Altavida</div>
                <div className="text-neutral-600 font-bold text-sm -mt-0.5 tracking-wide luxury-font">TOURS.COM</div>
              </div>
            </div>
            <p className="text-base text-gray-700/90 leading-relaxed mb-4">
              Your gateway to Egypt's wonders. From ancient pyramids to Red Sea adventures, Altavida Tours.com creates unforgettable luxury travel experiences.
            </p>
            {/* Trust Badges */}
            <div className="flex space-x-3 mt-4">
              <span className="bg-[#1193b1]/10 text-[#073b5a] px-3 py-1 rounded-full text-xs font-bold">✓ Trusted by 10,000+ guests</span>
              <span className="bg-[#1193b1]/10 text-[#073b5a] px-3 py-1 rounded-full text-xs font-bold">✓ 5-Star Reviews</span>
            </div>
            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <Link href="https://www.facebook.com/altavidatours" className="text-neutral-700 hover:text-[#1193b1] transition-colors text-xl">📘</Link>
              <Link href="https://www.instagram.com/altavidatours" className="text-neutral-700 hover:text-[#1193b1] transition-colors text-xl">📸</Link>
              <Link href="https://twitter.com/altavidatours" className="text-neutral-700 hover:text-[#1193b1] transition-colors text-xl">🐦</Link>
              <Link href="https://www.youtube.com/@altavidatours" className="text-neutral-700 hover:text-[#1193b1] transition-colors text-xl">▶️</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-emerald-900 section-heading">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/tours" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Tours & Packages</Link></li>
              <li><Link href="/attractions" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Attractions</Link></li>
              <li><Link href="/destinations" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Destinations</Link></li>
              <li><Link href="/accommodation" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Hotels & Resorts</Link></li>
              <li><Link href="/gallery" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/about" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-emerald-900 section-heading">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/tours/classic" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Classic Egypt Tours</Link></li>
              <li><Link href="/services/adventure-tours" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Desert Safari</Link></li>
              <li><Link href="/experiences/diving" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Red Sea Diving</Link></li>
              <li><Link href="/experiences/cultural" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Cultural Tours</Link></li>
              <li><Link href="/tours/private" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Private Tours</Link></li>
              <li><Link href="/tours/group" className="text-gray-700 hover:text-[#1193b1] transition-colors text-sm">Group Travel</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-emerald-900 section-heading">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-[#1193b1] text-lg">📍</span>
                <div>
                  <p className="text-sm text-gray-700">Egypt, Giza &lt;haram, Mashaal Station, pyramids view Tower 2, No 312</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-[#1193b1] text-lg">📞</span>
                <p className="text-sm text-gray-700">+20 10 02588564</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-[#1193b1] text-lg">✉️</span>
                <p className="text-sm text-gray-700">bookings@altavidatours.com</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-[#1193b1] text-lg">📱</span>
                <p className="text-sm text-gray-700">WhatsApp: +20 10 02588564</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8 md:mt-0">
              <h4 className="text-lg font-semibold mb-3 text-emerald-900">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-base bg-white text-gray-700 rounded-l border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1193b1]"
                />
                <button className="px-4 py-2 rounded-r transition-colors bg-gradient-to-r from-[#1193b1] to-[#0b79a0] text-white font-semibold">
                  <span className="text-base">Subscribe</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-base text-gray-500/80 mb-4 md:mb-0">
              © 2025 Altavida Tours.com. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-base text-gray-500/80 hover:text-[#1193b1] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-base text-gray-500/80 hover:text-[#1193b1] transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-base text-gray-500/80 hover:text-[#1193b1] transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

