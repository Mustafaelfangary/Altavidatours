import Head from 'next/head';
import { useSettings } from '@/hooks/useSettings';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

function toString(val: string | string[] | undefined): string {
  return typeof val === 'string' ? val : Array.isArray(val) ? val.join(', ') : '';
}

// Safe JSON parse function
function safeJsonParse(value: string | string[] | undefined, fallback: any = {}): any {
  if (!value || typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse JSON:', value, error);
    return fallback;
  }
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
}: SEOProps) {
  const { get } = useSettings();

  // Get default values from settings
  const defaultTitle = get('meta_title');
  const defaultDescription = get('meta_description');
  const defaultImage = get('og_image');
  const defaultUrl = get('canonical_url');
  const siteName = get('site_name');
  const twitterHandle = get('twitter_site');

  // Use provided values or fallback to defaults, always as string
  const seoTitle = toString(title ? `${title} | ${toString(siteName)}` : defaultTitle);
  const seoDescription = toString(description || defaultDescription);
  const seoImage = toString(image || defaultImage);
  const seoUrl = toString(url || defaultUrl);

  // Get structured data with safe parsing
  const structuredDataValue = get('structured_data');
  const structuredData = safeJsonParse(structuredDataValue, {});

  // Get alternate languages with safe parsing
  const alternateLanguagesValue = get('alternate_languages');
  const alternateLanguages = safeJsonParse(alternateLanguagesValue, []);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={toString(get('meta_keywords'))} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={toString(siteName)} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={toString(get('twitter_card'))} />
      <meta name="twitter:site" content={toString(twitterHandle)} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Language Alternates */}
      {alternateLanguages.length > 0 && (
        alternateLanguages.map((lang: string) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`${seoUrl}/${lang}`}
          />
        ))
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Google Analytics */}
      {get('google_analytics_id') && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${toString(get('google_analytics_id'))}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${toString(get('google_analytics_id'))}');
              `,
            }}
          />
        </>
      )}

      {/* Google Site Verification */}
      {get('google_verification') && (
        <meta
          name="google-site-verification"
          content={toString(get('google_verification'))}
        />
      )}
    </Head>
  );
} 

