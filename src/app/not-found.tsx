import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl w-full text-center px-6 py-12 bg-white rounded-2xl shadow-xl">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <Image
            src="/AppIcons/android/mipmap-xxxhdpi/altavida.png"
            alt="Altavida Tours Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-8xl font-bold text-blue-600 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for might have been moved, deleted, or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Return Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors duration-200"
          >
            Contact Support
          </Link>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Or try these helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            <Link href="/destinations" className="text-blue-600 hover:underline">Destinations</Link>
            <Link href="/packages" className="text-blue-600 hover:underline">Packages</Link>
            <Link href="/about" className="text-blue-600 hover:underline">About Us</Link>
            <Link href="/gallery" className="text-blue-600 hover:underline">Gallery</Link>
          </div>
        </div>
      </div>
    </div>
  );
}