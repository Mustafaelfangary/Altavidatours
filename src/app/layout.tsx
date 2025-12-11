// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AltaVida Tours',
  description: 'Your Egypt travel experience',
};

// Add default icons (favicons / apple touch)
metadata.icons = {
  icon: '/icons/altavida-logo-1.ico',
  shortcut: '/icons/altavida-logo-1.png',
  apple: '/icons/altavida-logo-1.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

