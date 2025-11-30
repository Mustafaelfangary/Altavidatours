'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';

export function TravelOKFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Packages', href: '/packages' },
    { label: 'Attractions', href: '/attractions' },
    { label: 'Museums', href: '/museums' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-br from-travelok-blue-dark via-travelok-blue to-travelok-blue-light text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* About Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Altavida Tours.com</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              Experience the wonders of Egypt with our expertly curated tours and luxury Nile cruises. 
              Creating unforgettable memories since 2010.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@altavidatours.com" className="hover:text-white transition-colors">
                info@altavidatours.com
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <p className="text-white/90 text-sm mb-4">
              Stay connected for travel inspiration and special offers
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-white/90 text-sm mb-4">
              Stay current with seasonal attractions, deals and more.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-travelok-orange hover:bg-travelok-orange-dark text-white font-semibold transition-all duration-300 hover:shadow-lg"
              >
                {subscribed ? 'Subscribed!' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
            <p>© {new Date().getFullYear()} Altavida Tours.com. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Site Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default TravelOKFooter;