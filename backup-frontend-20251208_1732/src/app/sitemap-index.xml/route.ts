export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';
  const today = new Date().toISOString().slice(0, 10);

  const sitemaps = [
    { loc: `${baseUrl}/sitemaps/static.xml`, lastmod: today },
    { loc: `${baseUrl}/sitemaps/blogs.xml`, lastmod: today },
    { loc: `${baseUrl}/sitemaps/dahabiyas.xml`, lastmod: today },
    { loc: `${baseUrl}/sitemaps/packages.xml`, lastmod: today },
    { loc: `${baseUrl}/sitemaps/images.xml`, lastmod: today },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps
    .map((s) => `  <sitemap>\n    <loc>${s.loc}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`)
    .join('\n')}\n</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}
