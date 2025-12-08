import prisma from '@/lib/prisma';

function xmlEscape(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function response(xml: string) {
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}

const NS_URLSET = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';
  const today = new Date().toISOString().slice(0, 10);
  const name = (params.name || '').toLowerCase();

  try {
    switch (name) {
      case 'static': {
        const staticUrls = [
          { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
          { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.8 },
          { loc: `${baseUrl}/dahabiyas`, changefreq: 'weekly', priority: 0.9 },
          { loc: `${baseUrl}/packages`, changefreq: 'weekly', priority: 0.9 },
          { loc: `${baseUrl}/blogs`, changefreq: 'daily', priority: 0.8 },
          { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.7 },
          { loc: `${baseUrl}/faq`, changefreq: 'monthly', priority: 0.7 },
          { loc: `${baseUrl}/gallery`, changefreq: 'weekly', priority: 0.6 },
          { loc: `${baseUrl}/reviews`, changefreq: 'weekly', priority: 0.6 },
          { loc: `${baseUrl}/privacy`, changefreq: 'yearly', priority: 0.3 },
          { loc: `${baseUrl}/terms`, changefreq: 'yearly', priority: 0.3 },
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${NS_URLSET}\n${staticUrls
          .map((u) => `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`)
          .join('\n')}\n</urlset>`;
        return response(xml);
      }

      case 'blogs': {
        const posts = await prisma.blog.findMany({
          where: { isPublished: true },
          select: { slug: true, updatedAt: true, publishedAt: true, coverImage: true, title: true },
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          take: 5000,
        });

        const xmlItems = posts
          .map((p) => {
            const loc = `${baseUrl}/blogs/${p.slug}`;
            const lastmod = (p.updatedAt || p.publishedAt || new Date()).toISOString().slice(0, 10);
            const images: string[] = [];
            if (p.coverImage) images.push(p.coverImage);

            const imageXml = images
              .filter(Boolean)
              .map((img) => {
                const abs = img.startsWith('http') ? img : `${baseUrl}${img}`;
                const title = p.title || 'Blog image';
                return `    <image:image>\n      <image:loc>${xmlEscape(abs)}</image:loc>\n      <image:title>${xmlEscape(title)}</image:title>\n    </image:image>`;
              })
              .join('\n');

            return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${imageXml ? imageXml + '\n' : ''}  </url>`;
          })
          .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${NS_URLSET}\n${xmlItems}\n</urlset>`;
        return response(xml);
      }

      case 'dahabiyas': {
        const items = await prisma.dahabiya.findMany({
          where: { isActive: true },
          select: { slug: true, updatedAt: true, imageCover: true, images: true, name: true },
          orderBy: [{ updatedAt: 'desc' }],
          take: 5000,
        });

        const xmlItems = items
          .map((d) => {
            const loc = `${baseUrl}/dahabiyas/${d.slug}`;
            const lastmod = (d.updatedAt || new Date()).toISOString().slice(0, 10);
            const images: string[] = [];
            if (d.imageCover) images.push(d.imageCover);
            if (Array.isArray(d.images)) images.push(...d.images);

            const imageXml = images
              .filter(Boolean)
              .slice(0, 1000)
              .map((img) => {
                const abs = img.startsWith('http') ? img : `${baseUrl}${img}`;
                const title = d.name || 'Dahabiya image';
                return `    <image:image>\n      <image:loc>${xmlEscape(abs)}</image:loc>\n      <image:title>${xmlEscape(title)}</image:title>\n    </image:image>`;
              })
              .join('\n');

            return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${imageXml ? imageXml + '\n' : ''}  </url>`;
          })
          .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${NS_URLSET}\n${xmlItems}\n</urlset>`;
        return response(xml);
      }

      case 'packages': {
        const items = await prisma.package.findMany({
          select: { id: true, updatedAt: true, name: true, mainImage: true },
          orderBy: [{ updatedAt: 'desc' }],
          take: 5000,
        });

        const xmlItems = items
          .map((p) => {
            const slug = p.id; // Package pages accept id as slug or name match
            const loc = `${baseUrl}/packages/${slug}`;
            const lastmod = (p.updatedAt || new Date()).toISOString().slice(0, 10);
            const images: string[] = [];
            if (p.mainImage) images.push(p.mainImage);

            const imageXml = images
              .filter(Boolean)
              .map((img) => {
                const abs = img.startsWith('http') ? img : `${baseUrl}${img}`;
                const title = p.name || 'Package image';
                return `    <image:image>\n      <image:loc>${xmlEscape(abs)}</image:loc>\n      <image:title>${xmlEscape(title)}</image:title>\n    </image:image>`;
              })
              .join('\n');

            return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${imageXml ? imageXml + '\n' : ''}  </url>`;
          })
          .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${NS_URLSET}\n${xmlItems}\n</urlset>`;
        return response(xml);
      }

      case 'images': {
        // Image sitemap combining key media-heavy pages
        const [blogs, dahabiyas, packages] = await Promise.all([
          prisma.blog.findMany({
            where: { isPublished: true },
            select: { slug: true, coverImage: true },
            take: 5000,
          }),
          prisma.dahabiya.findMany({
            where: { isActive: true },
            select: { slug: true, imageCover: true, images: true },
            take: 5000,
          }),
          prisma.package.findMany({
            select: { id: true, mainImage: true },
            take: 5000,
          }),
        ]);

        const blogEntries = blogs
          .map((b) => {
            const loc = `${baseUrl}/blogs/${b.slug}`;
            const images = [b.coverImage].filter(Boolean) as string[];
            const imageXml = images
              .map((img) => {
                const abs = img.startsWith('http') ? img : `${baseUrl}${img}`;
                return `    <image:image>\n      <image:loc>${xmlEscape(abs)}</image:loc>\n    </image:image>`;
              })
              .join('\n');
            return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n${imageXml ? imageXml + '\n' : ''}  </url>`;
          })
          .join('\n');

        const dahabiyaEntries = dahabiyas
          .map((d) => {
            const loc = `${baseUrl}/dahabiyas/${d.slug}`;
            const images = [d.imageCover, ...(Array.isArray(d.images) ? d.images : [])].filter(Boolean) as string[];
            const imageXml = images
              .slice(0, 1000)
              .map((img) => {
                const abs = img.startsWith('http') ? img : `${baseUrl}${img}`;
                return `    <image:image>\n      <image:loc>${xmlEscape(abs)}</image:loc>\n    </image:image>`;
              })
              .join('\n');
            return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n${imageXml ? imageXml + '\n' : ''}  </url>`;
          })
          .join('\n');

        const packageEntries = packages
          .map((p) => {
            const loc = `${baseUrl}/packages/${p.id}`;
            const images = [p.mainImage].filter(Boolean) as string[];
            const imageXml = images
              .map((img) => {
                const abs = img.startsWith('http') ? img : `${baseUrl}${img}`;
                return `    <image:image>\n      <image:loc>${xmlEscape(abs)}</image:loc>\n    </image:image>`;
              })
              .join('\n');
            return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n${imageXml ? imageXml + '\n' : ''}  </url>`;
          })
          .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${NS_URLSET}\n${blogEntries}\n${dahabiyaEntries}\n${packageEntries}\n</urlset>`;
        return response(xml);
      }

      default: {
        return new Response('Not Found', { status: 404 });
      }
    }
  } catch (error) {
    // On error, return empty sitemap for the requested type
    const empty = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n${NS_URLSET}\n</urlset>`;
    return response(empty);
  }
}
