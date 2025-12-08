import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { generateSEO } from '@/lib/seo';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const slug = params.slug;

    // API converts slug from name; attempt to match by id or by case-insensitive name contains
    let pkg = await prisma.package.findUnique({ where: { id: slug } });

    if (!pkg) {
      pkg = await prisma.package.findFirst({
        where: { name: { contains: slug, mode: 'insensitive' } },
      });
    }

    if (!pkg) {
      return generateSEO({
        title: 'Egypt Travel Package',
        description: 'Discover curated Egypt travel packages with luxury Dahabiya Nile cruises and iconic destinations.',
        url: '/packages',
        type: 'product',
      });
    }

    const slugFromName = pkg.name.toLowerCase().replace(/\s+/g, '-');
    const image = pkg.mainImageUrl || '/images/default-package.jpg';
    const absImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
    const url = `/packages/${slugFromName}`;

    // Build price keywords
    const priceKeywords: string[] = [];
    if (pkg.price) {
      priceKeywords.push(`price ${pkg.price}`, `USD ${pkg.price}`, 'Egypt package price', 'Dahabiya price');
    }

    return generateSEO({
      title: `${pkg.name} - Egypt Travel Package`,
      description: pkg.description || `${pkg.name} - A curated Egyptian journey with luxury Dahabiya cruising.`,
      image: absImage,
      url,
      type: 'product',
      keywords: priceKeywords,
    });
  } catch (e) {
    return generateSEO({
      title: 'Egypt Travel Package',
      description: 'Discover curated Egypt travel packages with luxury Dahabiya Nile cruises and iconic destinations.',
      url: '/packages',
      type: 'product',
    });
  }
}

export default function PackageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
