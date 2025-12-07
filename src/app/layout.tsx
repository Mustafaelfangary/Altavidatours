import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Montserrat } from 'next/font/google';
import Script from 'next/script';
import { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { trackWebVitals } from '@/lib/performance';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import CleopatraAssistantWrapper from '@/components/assistant/CleopatraAssistantWrapper';
import NavigationLoader from '@/components/ui/NavigationLoader';
import GlobalLoadingInterceptor from '@/components/ui/GlobalLoadingInterceptor';
import AutoTranslate from '@/components/AutoTranslate';
import LogoAutoRefresh from '@/components/LogoAutoRefresh';
import MegaMenuTest from '@/components/MegaMenuTest';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Altavida Tours',
  description: 'Luxury travel experiences',
  // Add other metadata properties as needed
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className="scroll-smooth">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preload critical assets */}
        <link 
          rel="preload" 
          as="image" 
          href="/logos/altavida-logo-1.png" 
          type="image/png"
        />

        {/* PWA meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Altavida Tours" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} font-sans antialiased text-asw-black bg-white`}>
        <Providers>
          <GlobalLoadingInterceptor />
          <NavigationLoader />
          <LayoutWrapper>
            <MobileOptimizedLayout>
              <AutoTranslate />
              <CleopatraAssistantWrapper />
              {children}
            </MobileOptimizedLayout>
          </LayoutWrapper>
          <ServiceWorkerRegister />
          <LogoAutoRefresh />
        </Providers>
      </body>
    </html>
  );
}