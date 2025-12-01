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
    <footer className="footer glass-card text-gold bg-[rgba(10,35,66,0.98)] pt-16 pb-8 px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <Image 
                src={logoUrl} 
                alt="Altavida Tours.com" 
                width={140}
                height={40}
                className="h-10 w-auto mr-3 drop-shadow-lg"
              />
              <div>
                <div className="text-gold font-bold text-2xl leading-tight luxury-font">Altavida</div>
                <div className="text-gold-light font-bold text-lg -mt-0.5 tracking-wide luxury-font">TOURS.COM</div>
              </div>
            </div>
            <p className="text-base text-gold/80 leading-relaxed mb-4">
              Your gateway to Egypt's wonders. From ancient pyramids to Red Sea adventures, Altavida Tours.com creates unforgettable luxury travel experiences.
            </p>
            {/* Trust Badges */}
            <div className="flex space-x-3 mt-4">
              <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold">✓ Trusted by 10,000+ guests</span>
              <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold">✓ 5-Star Reviews</span>
            </div>
            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <Link href="https://www.facebook.com/altavidatours" className="text-gold hover:text-gold-light transition-colors text-2xl">📘</Link>
              <Link href="https://www.instagram.com/altavidatours" className="text-gold hover:text-gold-light transition-colors text-2xl">📸</Link>
              <Link href="https://twitter.com/altavidatours" className="text-gold hover:text-gold-light transition-colors text-2xl">🐦</Link>
              <Link href="https://www.youtube.com/@altavidatours" className="text-gold hover:text-gold-light transition-colors text-2xl">▶️</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold section-heading">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/tours" className="text-gold hover:text-gold-light transition-colors text-sm">Tours & Packages</Link></li>
              <li><Link href="/attractions" className="text-gold hover:text-gold-light transition-colors text-sm">Attractions</Link></li>
              <li><Link href="/destinations" className="text-gold hover:text-gold-light transition-colors text-sm">Destinations</Link></li>
              <li><Link href="/accommodation" className="text-gold hover:text-gold-light transition-colors text-sm">Hotels & Resorts</Link></li>
              <li><Link href="/gallery" className="text-gold hover:text-gold-light transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/about" className="text-gold hover:text-gold-light transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold section-heading">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/tours/classic" className="text-gold hover:text-gold-light transition-colors text-sm">Classic Egypt Tours</Link></li>
              <li><Link href="/services/adventure-tours" className="text-gold hover:text-gold-light transition-colors text-sm">Desert Safari</Link></li>
              <li><Link href="/experiences/diving" className="text-gold hover:text-gold-light transition-colors text-sm">Red Sea Diving</Link></li>
              <li><Link href="/experiences/cultural" className="text-gold hover:text-gold-light transition-colors text-sm">Cultural Tours</Link></li>
              <li><Link href="/tours/private" className="text-gold hover:text-gold-light transition-colors text-sm">Private Tours</Link></li>
              <li><Link href="/tours/group" className="text-gold hover:text-gold-light transition-colors text-sm">Group Travel</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold section-heading">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-gold text-lg">📍</span>
                <div>
                  <p className="text-sm text-gold">Cairo, Egypt</p>
                  <p className="text-sm text-gold">Nile Corniche, Zamalek</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gold text-lg">📞</span>
                <p className="text-sm text-gold">+20 2 2736 8888</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gold text-lg">✉️</span>
                <p className="text-sm text-gold">bookings@altavidatours.com</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gold text-lg">📱</span>
                <p className="text-sm text-gold">WhatsApp: +20 100 123 4567</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8 md:mt-0">
              <h4 className="text-lg font-semibold mb-3 text-gold">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-base bg-white/80 text-gold rounded-l focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button className="btn-gold px-4 py-2 rounded-r transition-colors">
                  <span className="text-base font-semibold">Subscribe</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-base text-gold/80 mb-4 md:mb-0">
              © 2025 Altavida Tours.com. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-base text-gold/80 hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-base text-gold/80 hover:text-gold transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-base text-gold/80 hover:text-gold transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

