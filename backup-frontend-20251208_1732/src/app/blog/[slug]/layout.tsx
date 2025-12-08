import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { generateSEO } from '@/lib/seo';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const slug = params.slug;

    const post = await prisma.blog.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isPublished: true,
      },
    });

    if (!post) {
      return generateSEO({
        title: 'Blog Article',
        description: 'Read our latest stories and tips from the Nile.',
        url: '/blog',
        type: 'article',
      });
    }

    const image = (post.heroImageUrl || post.mainImageUrl) || '/images/blog-hero-bg.jpg';
    const absImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
    const url = `/blog/${post.slug}`;

    return generateSEO({
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || post.title,
      image: absImage,
      url,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      author: post.author || 'Cleopatra Dahabiyat',
      section: post.category || 'Blog',
      tags: Array.isArray(post.tags) ? post.tags : [],
    });
  } catch (e) {
    return generateSEO({
      title: 'Blog Article',
      description: 'Read our latest stories and tips from the Nile.',
      url: '/blog',
      type: 'article',
    });
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
