import type { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common questions about our luxury Dahabiya Nile cruises, itineraries, inclusions, booking process, and guest experience.',
  keywords: [
    'Dahabiya FAQ',
    'Nile cruise questions',
    'Egypt cruise FAQ',
    'Dahabiya inclusions',
    'Luxor Aswan itinerary FAQ',
  ],
  url: '/faq',
  type: 'website',
});

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
