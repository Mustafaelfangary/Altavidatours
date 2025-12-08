import { prisma } from '@/lib/prisma';

function xmlEscape(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';

  try {
    const posts = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    });

    const channelTitle = 'Dahabiyat Nile Cruise Blog';
    const channelLink = `${baseUrl}/blog`;
    const channelDescription = 'Latest stories and tips from the Nile';

    const items = posts
      .map((post) => {
        const link = `${baseUrl}/blog/${post.slug}`;
        const pubDate = (post.publishedAt || post.createdAt || new Date()).toUTCString();
        const title = xmlEscape(post.seoTitle || post.title || 'Untitled');
        const description = xmlEscape(post.seoDescription || post.excerpt || '');
        const author = xmlEscape(post.author || 'Dahabiyat');
        return `\n      <item>\n        <title>${title}</title>\n        <link>${link}</link>\n        <guid isPermaLink="true">${link}</guid>\n        <description>${description}</description>\n        <pubDate>${pubDate}</pubDate>\n        <author>${author}</author>\n      </item>`;
      })
      .join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${xmlEscape(channelTitle)}</title>\n    <link>${channelLink}</link>\n    <description>${xmlEscape(channelDescription)}</description>\n    <language>en-us</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}\n  </channel>\n</rss>`;

    return new Response(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${xmlEscape('Dahabiyat Nile Cruise Blog')}</title>\n    <link>${baseUrl}/blog</link>\n    <description>${xmlEscape('Latest stories and tips from the Nile')}</description>\n    <language>en-us</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n  </channel>\n</rss>`;
    return new Response(fallback, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  }
}
