import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding homepage service summaries from DB (TravelService)...');
  let created = 0;
  let updated = 0;

  const services = await prisma.travelService.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 12,
  });

  for (const svc of services) {
    const id = svc.slug || svc.id;
    const base = `homepage_service_${id}`;

    const items = [
      { key: `${base}_title`, title: `${svc.title} Title`, content: svc.title, page: 'homepage', section: 'services' },
      { key: `${base}_type`, title: `${svc.title} Type`, content: svc.serviceType || '', page: 'homepage', section: 'services' },
      { key: `${base}_summary`, title: `${svc.title} Summary`, content: svc.summary || (typeof svc.description === 'string' ? svc.description.slice(0, 220) : ''), page: 'homepage', section: 'services' },
      { key: `${base}_price`, title: `${svc.title} Price`, content: svc.price != null ? String(svc.price) : '', page: 'homepage', section: 'services' },
    ];

    for (const it of items) {
      const res = await prisma.websiteContent.upsert({
        where: { key: it.key },
        update: {
          title: it.title,
          content: it.content ?? '',
          page: it.page,
          section: it.section,
          isActive: true,
        },
        create: {
          key: it.key,
          title: it.title,
          content: it.content ?? '',
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

  console.log(`✅ Services seeded. Created: ${created}, Updated: ${updated}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
