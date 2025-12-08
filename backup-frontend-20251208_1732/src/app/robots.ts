import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';
  
  return {
    rules: [
      // Default
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
      // Major searchbots
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
      // AI crawlers / extensions
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-index.xml`],
    host: baseUrl,
  };
}
