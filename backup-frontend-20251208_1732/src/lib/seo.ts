import { Metadata } from 'next';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

// Function to get dynamic site name from database
async function getDynamicSiteName(): Promise<string> {
  try {
    const response = await fetch('/api/website-content?page=homepage&key=site_name');
    if (response.ok) {
      const data = await response.json();
      return data.content || 'Altavida Tours.com';
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic site name:', error);
  }
  return 'Altavida Tours.com';
}

const defaultSEO = {
  siteName: 'Altavida Tours.com', // Updated site name
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.altavidatours.com',
  defaultTitle: 'Altavida Tours.com - Authentic Egypt Travel Experiences',
  defaultDescription: 'Explore Egypt with Altavida Tours.com. Tailored Nile journeys, dahabiya cruises, cultural adventures, and luxury experiences crafted by local experts.',
  defaultImage: '/images/hero/travel-hero.jpg',
  defaultKeywords: [
    'egypt tours',
    'egypt travel',
    'nile cruise',
    'dahabiya cruise',
    'luxury egypt tours',
    'custom egypt tours',
    'cairo tours',
    'luxor and aswan',
    'cultural experiences in egypt',
    'Altavida Tours.com'
  ],
  twitterHandle: '@AltavidaTours',
  facebookPage: 'AltavidaTours',
  instagramHandle: '@altavidatours'
};

export function generateSEO(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = defaultSEO.defaultDescription,
    keywords = defaultSEO.defaultKeywords,
    image = defaultSEO.defaultImage,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = []
  } = config;

  const fullTitle = title 
    ? `${title} | ${defaultSEO.siteName}`
    : defaultSEO.defaultTitle;

  const fullUrl = url 
    ? `${defaultSEO.siteUrl}${url}`
    : defaultSEO.siteUrl;

  const fullImage = image.startsWith('http') 
    ? image 
    : `${defaultSEO.siteUrl}${image}`;

  const allKeywords = [...new Set([...keywords, ...tags])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || defaultSEO.defaultTitle,
        }
      ],
      locale: 'en_US',
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: defaultSEO.twitterHandle,
      site: defaultSEO.twitterHandle,
    },

    // Additional meta tags
    other: {
      'fb:app_id': process.env.FACEBOOK_APP_ID || '',
      'article:author': author || defaultSEO.siteName,
      'article:publisher': defaultSEO.facebookPage,
      'og:image:alt': title || defaultSEO.defaultTitle,
      'twitter:image:alt': title || defaultSEO.defaultTitle,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.BING_VERIFICATION || '',
      },
    },

    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },
  };
}

// Predefined SEO configurations for common pages
export const pageSEO = {
  home: (): Metadata => generateSEO({
    title: 'World-Class Travel Experiences',
    description: 'Discover extraordinary destinations with Altavida Tours.com. Experience personalized luxury travel with our curated adventures, cultural immersions, and unforgettable journeys.',
    keywords: ['luxury travel', 'custom tours', 'travel agency', 'vacation packages', 'worldwide destinations'],
    url: '/',
    type: 'website'
  }),

  about: (): Metadata => generateSEO({
    title: 'About Altavida Tours.com',
    description: 'Learn about our passion for creating extraordinary Egypt travel experiences. Discover why Altavida Tours.com is your trusted partner for personalized adventures.',
    keywords: ['about Altavida Tours.com', 'travel agency', 'luxury travel company', 'custom travel experiences'],
    url: '/about',
    type: 'website'
  }),

  destinations: (): Metadata => generateSEO({
    title: 'Our Travel Destinations',
    description: 'Explore our curated collection of world-class destinations, each offering unique cultural experiences and unforgettable adventures.',
    keywords: ['travel destinations', 'luxury destinations', 'worldwide travel', 'cultural experiences'],
    url: '/destinations',
    type: 'website'
  }),

  packages: (): Metadata => generateSEO({
    title: 'Travel Packages & Tours',
    description: 'Discover our curated travel packages combining luxury accommodations with iconic destinations, cultural experiences, and personalized adventures worldwide.',
    keywords: ['travel packages', 'tour packages', 'luxury travel packages', 'custom tour packages'],
    url: '/packages',
    type: 'website'
  }),

  contact: (): Metadata => generateSEO({
    title: 'Contact Us',
    description: 'Get in touch with Altavida Tours.com for your travel planning. Our expert team is ready to create your perfect personalized adventure in Egypt.',
    keywords: ['contact Altavida Tours.com', 'travel planning', 'luxury travel contact'],
    url: '/contact',
    type: 'website'
  }),

  destination: (name: string, slug: string): Metadata => generateSEO({
    title: `${name} - Travel Destination`,
    description: `Explore ${name} with Altavida Tours.com. Discover authentic cultural experiences, luxury accommodations, and unforgettable adventures in this extraordinary destination.`,
    keywords: [`${name} travel`, 'luxury destination', 'cultural experiences', 'adventure travel'],
    url: `/destinations/${slug}`,
    type: 'article'
  }),

  package: (name: string, slug: string): Metadata => generateSEO({
    title: `${name} - Luxury Travel Package`,
    description: `Experience ${name}, our carefully crafted luxury travel package combining extraordinary destinations, premium accommodations, and personalized cultural experiences.`,
    keywords: [`${name} package`, 'luxury travel package', 'custom tour package', 'adventure travel'],
    url: `/packages/${slug}`,
    type: 'article'
  })
};

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: defaultSEO.siteName,
    description: defaultSEO.defaultDescription,
    url: defaultSEO.siteUrl,
    logo: `${defaultSEO.siteUrl}/logo.png`,
    image: `${defaultSEO.siteUrl}${defaultSEO.defaultImage}`,
    telephone: '+20-000-0000',
    email: 'info@altavidatours.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Travel Plaza',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'United States'
    },
    sameAs: [
      `https://facebook.com/${defaultSEO.facebookPage}`,
      `https://twitter.com/${defaultSEO.twitterHandle}`,
      `https://instagram.com/${defaultSEO.instagramHandle}`
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    serviceType: ['Luxury Travel Packages', 'Custom Tour Planning', 'Adventure Tourism', 'Cultural Experiences', 'Destination Weddings', 'Corporate Travel']
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: product.url,
      seller: {
        '@type': 'Organization',
        name: defaultSEO.siteName
      }
    },
    brand: {
      '@type': 'Brand',
      name: defaultSEO.siteName
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${defaultSEO.siteUrl}${item.url}`
    }))
  };
}

export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished
  }));
}
