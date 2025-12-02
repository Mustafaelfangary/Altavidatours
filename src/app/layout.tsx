import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import '../styles/luxury-design.css';
import '../styles/mobile-enhancements.css';
import { Providers } from './providers';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { generateSEO, generateOrganizationSchema } from '@/lib/seo';
import { trackWebVitals } from '@/lib/performance';
import Script from 'next/script';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
// Import the client component wrapper instead of using dynamic import directly
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

export const metadata: Metadata = generateSEO();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // Enable safe area support
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        {/* Preload site logo to prevent flicker on initial paint */}
        <link rel="preload" as="image" href="/altavida-logo-1.png" />

        {/* PWA meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Altavida Tours.com" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/altavida-logo-1.png" type="image/png" />
        <link rel="apple-touch-icon" href="/altavida-logo-1.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
        {/* WebSite + SearchAction JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Altavida Tours.com",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.altavidatours.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.altavidatours.com"}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* 3D model viewer - load only when needed */}
        <Script
          src="https://unpkg.com/@google/model-viewer@v4.0.0/dist/model-viewer.min.js"
          strategy="lazyOnload"
          type="module"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} antialiased`}>
        <Providers>
          <MobileOptimizedLayout>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </MobileOptimizedLayout>
          {/* Register the service worker for PWA */}
          <ServiceWorkerRegister />
        </Providers>

        {/* Navigation loader for route transitions */}
        <NavigationLoader />
        
        {/* Global loading interceptor for API calls */}
        <GlobalLoadingInterceptor />
        
        {/* Floating AI assistant with 3D Cleopatra */}
        <CleopatraAssistantWrapper />
        
        {/* Automatic translation system */}
        <AutoTranslate />
        
        {/* Mega Menu Test Component - Remove in production */}
        {process.env.NODE_ENV === 'development' && <MegaMenuTest />}
        
        {/* Auto-refresh logos when changed in admin */}
        <LogoAutoRefresh />
        {/* Service worker registration component mounted via client component above */}

        {/* Analytics and performance monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>

            {/* Web Vitals tracking */}
            <Script id="web-vitals" strategy="afterInteractive">
              {`
                (function() {
                  try {
                    // Simple performance tracking without web-vitals dependency
                    const trackWebVitals = ${trackWebVitals.toString()};

                    // Track basic performance metrics
                    if ('performance' in window) {
                      window.addEventListener('load', function() {
                        setTimeout(function() {
                          const navigation = performance.getEntriesByType('navigation')[0];
                          if (navigation) {
                            trackWebVitals({
                              name: 'page_load',
                              value: navigation.loadEventEnd - navigation.navigationStart,
                              id: 'page-load-' + Date.now()
                            });
                          }
                        }, 0);
                      });
                    }

                    // Track CLS (Cumulative Layout Shift) manually
                    let clsValue = 0;
                    let clsEntries = [];
                    let sessionValue = 0;
                    let sessionEntries = [];

                    if ('PerformanceObserver' in window) {
                      try {
                        const observer = new PerformanceObserver(function(list) {
                          for (const entry of list.getEntries()) {
                            if (!entry.hadRecentInput) {
                              const firstSessionEntry = sessionEntries[0];
                              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                              if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
                                sessionValue += entry.value;
                                sessionEntries.push(entry);
                              } else {
                                sessionValue = entry.value;
                                sessionEntries = [entry];
                              }

                              if (sessionValue > clsValue) {
                                clsValue = sessionValue;
                                clsEntries = [...sessionEntries];
                                trackWebVitals({
                                  name: 'CLS',
                                  value: clsValue,
                                  id: 'cls-' + Date.now()
                                });
                              }
                            }
                          }
                        });
                        observer.observe({ type: 'layout-shift', buffered: true });
                      } catch (e) {
                        // PerformanceObserver not supported
                      }
                    }
                  } catch (error) {
                    console.warn('Performance tracking not available:', error);
                  }
                })();
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
