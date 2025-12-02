"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone as PhoneIcon, MapPin as MapPinIcon } from "lucide-react";
import Partners from '@/components/Partners';

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
        setLogoUrl('/altavida-logo-1.png');
      }
    };
    fetchLogo();
  }, []);

  return (
    <footer className="bg-[#f7f7f2] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
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
                <div className="text-[#0b2e4f] font-extrabold text-2xl leading-tight">Altavida</div>
                <div className="text-[#0b2e4f]/70 font-bold text-sm -mt-0.5 tracking-[0.18em]">TOURS.COM</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-[15px] md:text-base">
              Your gateway to Egypt's wonders. From ancient pyramids to Red Sea adventures, Altavida Tours.com creates unforgettable luxury travel experiences.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {[{Icon: Facebook, href: 'https://www.facebook.com/altavidatours', label: 'Facebook'},
                {Icon: Instagram, href: 'https://www.instagram.com/altavidatours', label: 'Instagram'},
                {Icon: Twitter, href: 'https://twitter.com/altavidatours', label: 'Twitter'},
                {Icon: Linkedin, href: 'https://www.linkedin.com/company/altavidatours', label: 'LinkedIn'}].map(({Icon, href, label}) => (
                <Link key={label} href={href} aria-label={label} className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-[#0b2e4f] hover:text-[#ff6600] hover:border-[#ff6600] transition-colors bg-white">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="section-heading mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/tours" className="text-[#0b2e4f]/85 hover:text-[#ff6600] transition-colors text-[15px]">Tours & Packages</Link></li>
              <li><Link href="/destinations" className="text-[#0b2e4f]/85 hover:text-[#ff6600] transition-colors text-[15px]">Destinations</Link></li>
              <li><Link href="/itineraries" className="text-[#0b2e4f]/85 hover:text-[#ff6600] transition-colors text-[15px]">Itineraries</Link></li>
              <li><Link href="/gallery" className="text-[#0b2e4f]/85 hover:text-[#ff6600] transition-colors text-[15px]">Gallery</Link></li>
              <li><Link href="/about" className="text-[#0b2e4f]/85 hover:text-[#ff6600] transition-colors text-[15px]">About Us</Link></li>
              <li><Link href="/contact" className="text-[#0b2e4f]/85 hover:text-[#ff6600] transition-colors text-[15px]">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="section-heading mb-5">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-[#0b2e4f]/85">
                <MapPinIcon size={18} className="text-[#c7a15a] mt-0.5" />
                <p className="text-[15px]">Egypt, Giza &lt;haram, Mashaal Station, pyramids view Tower 2, No 312</p>
              </div>
              <div className="flex items-center gap-3 text-[#0b2e4f]/85">
                <PhoneIcon size={18} className="text-[#c7a15a]" />
                <p className="text-[15px]">+20 10 02588564</p>
              </div>
              <div className="flex items-center gap-3 text-[#0b2e4f]/85">
                <Mail size={18} className="text-[#c7a15a]" />
                <p className="text-[15px]">bookings@altavidatours.com</p>
              </div>
              <div className="flex items-center gap-3 text-[#0b2e4f]/85">
                <PhoneIcon size={18} className="text-[#c7a15a]" />
                <p className="text-[15px]">WhatsApp: +20 10 02588564</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="section-heading mb-5">Newsletter</h3>
            <p className="text-gray-700 text-[15px] leading-relaxed mb-4">
              Subscribe for exclusive offers and timeless Egypt travel inspiration.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-stretch">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 text-base bg-white text-gray-700 rounded-l-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c7a15a]"
              />
              <button className="px-5 py-2.5 rounded-r-full bg-[#0b2e4f] text-white font-semibold">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Partners strip */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Partners variant="footer" />
        </div>

        {/* Legal bar */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600">
            <div className="text-[15px]">© {new Date().getFullYear()} Altavida Tours.com. All rights reserved.</div>
            <div className="flex items-center gap-6 text-[15px]">
              <Link href="/privacy" className="hover:text-[#ff6600] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#ff6600] transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-[#ff6600] transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
