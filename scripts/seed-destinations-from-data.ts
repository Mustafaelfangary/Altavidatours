import { PrismaClient } from '@prisma/client';
import { destinations } from '../src/data/destinations';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding homepage destination summaries from src/data/destinations.ts ...');
  let created = 0;
  let updated = 0;

  for (const dest of destinations.slice(0, 8)) {
    const base = `homepage_destination_${dest.id}`;

    const items = [
      { key: `${base}_title`, title: `${dest.name} Title`, content: dest.name, page: 'homepage', section: 'destinations' },
      { key: `${base}_region`, title: `${dest.name} Region`, content: dest.region, page: 'homepage', section: 'destinations' },
      { key: `${base}_summary`, title: `${dest.name} Summary`, content: dest.description, page: 'homepage', section: 'destinations' },
    ];

    // add top 3 highlights
    dest.highlights.slice(0, 3).forEach((h, i) => {
      items.push({
        key: `${base}_highlight_${i + 1}`,
        title: `${dest.name} Highlight ${i + 1}`,
        content: h,
        page: 'homepage',
        section: 'destinations'
      });
    });

    for (const it of items) {
      const res = await prisma.websiteContent.upsert({
        where: { key: it.key },
        update: {
          title: it.title,
          content: it.content,
          page: it.page,
          section: it.section,
          isActive: true,
        },
        create: {
          key: it.key,
          title: it.title,
          content: it.content,
          contentType: 'TEXT',
          page: it.page,
          section: it.section,
          isActive: true,
          order: 0,
        },
      });
      if (res.createdAt.getTime() === res.updatedAt.getTime()) created++; else updated++;
    }
  }

  console.log(`✅ Destinations seeded. Created: ${created}, Updated: ${updated}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
