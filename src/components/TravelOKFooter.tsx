"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TravelOKFooter() {
  const [logoUrl, setLogoUrl] = useState('/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/logo', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.logoUrl) {
            const normalized = data.logoUrl.startsWith('/') ? data.logoUrl : `/images/${data.logoUrl}`;
            setLogoUrl(normalized);
          }
        }
      } catch (_) {
        // keep default
      }
    };
    fetchLogo();
  }, []);
  return (
    <footer className="bg-travelok-blue text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Image 
                  src={logoUrl} 
                  alt="Altavida Tours.com" 
                  width={140}
                  height={40}
                  className="h-10 w-auto mr-3 invert"
                />
                <div>
                  <div className="text-white font-bold text-xl leading-tight">Altavida</div>
                  <div className="text-orange-300 font-bold text-base -mt-0.5 tracking-wide">TOURS.COM</div>
                </div>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Your gateway to Egypt's incredible wonders. From ancient pyramids to Red Sea adventures, Altavida Tours.com creates unforgettable travel experiences across the land of the pharaohs.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/altavidatours" className="text-blue-200 hover:text-white transition-colors">
                <span className="text-2xl">📘</span>
              </Link>
              <Link href="https://www.instagram.com/altavidatours" className="text-blue-200 hover:text-white transition-colors">
                <span className="text-2xl">📸</span>
              </Link>
              <Link href="https://twitter.com/altavidatours" className="text-blue-200 hover:text-white transition-colors">
                <span className="text-2xl">🐦</span>
              </Link>
              <Link href="https://www.youtube.com/@altavidatours" className="text-blue-200 hover:text-white transition-colors">
                <span className="text-2xl">📺</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-orange-300">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/tours" className="text-blue-200 hover:text-white transition-colors text-sm">Tours & Packages</Link></li>
              <li><Link href="/attractions" className="text-blue-200 hover:text-white transition-colors text-sm">Attractions</Link></li>
              <li><Link href="/destinations" className="text-blue-200 hover:text-white transition-colors text-sm">Destinations</Link></li>
              <li><Link href="/accommodation" className="text-blue-200 hover:text-white transition-colors text-sm">Hotels & Resorts</Link></li>
              <li><Link href="/gallery" className="text-blue-200 hover:text-white transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/about" className="text-blue-200 hover:text-white transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-orange-300">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/tours/classic" className="text-blue-200 hover:text-white transition-colors text-sm">Classic Egypt Tours</Link></li>
              <li><Link href="/services/adventure-tours" className="text-blue-200 hover:text-white transition-colors text-sm">Desert Safari</Link></li>
              <li><Link href="/experiences/diving" className="text-blue-200 hover:text-white transition-colors text-sm">Red Sea Diving</Link></li>
              <li><Link href="/experiences/cultural" className="text-blue-200 hover:text-white transition-colors text-sm">Cultural Tours</Link></li>
              <li><Link href="/tours/private" className="text-blue-200 hover:text-white transition-colors text-sm">Private Tours</Link></li>
              <li><Link href="/tours/group" className="text-blue-200 hover:text-white transition-colors text-sm">Group Travel</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-orange-300">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-orange-300 text-lg">📍</span>
                <div>
                  <p className="text-sm text-blue-200">Cairo, Egypt</p>
                  <p className="text-sm text-blue-200">Nile Corniche, Zamalek</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-orange-300 text-lg">📞</span>
                <p className="text-sm text-blue-200">+20 2 2736 8888</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-orange-300 text-lg">✉️</span>
                <p className="text-sm text-blue-200">bookings@altavidatours.com</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-orange-300 text-lg">📱</span>
                <p className="text-sm text-blue-200">WhatsApp: +20 100 123 4567</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h4 className="text-md font-semibold mb-3 text-orange-300">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-white text-gray-800 rounded-l focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r transition-colors">
                  <span className="text-sm font-semibold">Subscribe</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-400 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-blue-200 mb-4 md:mb-0">
              © 2024 Altavida Tours.com. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-blue-200 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-blue-200 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-sm text-blue-200 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

