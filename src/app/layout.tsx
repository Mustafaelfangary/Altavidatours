// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Providers } from './providers';
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
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}