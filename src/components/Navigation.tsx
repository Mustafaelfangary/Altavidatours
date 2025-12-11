'use client';

import Link from 'next/link';
import DestinationDropdown from './navigation/DestinationDropdown';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            AltaVidaTours
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <DestinationDropdown />
            <Link href="/tours" className="text-gray-700 hover:text-blue-600">
              Tours
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}


