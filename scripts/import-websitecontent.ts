import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: npx tsx scripts/import-websitecontent.ts <path-to-json>');
    process.exit(1);
  }
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
    process.exit(1);
  }

  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const data = json.data || json; // support raw array or grouped object

  // If grouped by page/section
  if (!Array.isArray(data)) {
    let count = 0;
    for (const page of Object.keys(data)) {
      const sections = data[page];
      for (const section of Object.keys(sections)) {
        const items = sections[section];
        for (const it of items) {
          await prisma.websiteContent.upsert({
            where: { key: it.key },
            update: {
              title: it.title ?? it.key,
              content: it.content ?? '',
              contentType: it.contentType ?? 'TEXT',
              page: page,
              section: section,
              isActive: it.isActive ?? true,
              order: typeof it.order === 'number' ? it.order : 0,
            },
            create: {
              key: it.key,
              title: it.title ?? it.key,
              content: it.content ?? '',
              contentType: it.contentType ?? 'TEXT',
              page: page,
              section: section,
              isActive: it.isActive ?? true,
              order: typeof it.order === 'number' ? it.order : 0,
            }
          });
          count++;
        }
      }
    }
    console.log(`✅ Imported/Updated ${count} items from grouped JSON.`);
  } else {
    // Flat array of items
    let count = 0;
    for (const it of data) {
      await prisma.websiteContent.upsert({
        where: { key: it.key },
        update: {
          title: it.title ?? it.key,
          content: it.content ?? '',
          contentType: it.contentType ?? 'TEXT',
          page: it.page ?? 'global',
          section: it.section ?? 'general',
          isActive: it.isActive ?? true,
          order: typeof it.order === 'number' ? it.order : 0,
        },
        create: {
          key: it.key,
          title: it.title ?? it.key,
          content: it.content ?? '',
          contentType: it.contentType ?? 'TEXT',
          page: it.page ?? 'global',
          section: it.section ?? 'general',
          isActive: it.isActive ?? true,
          order: typeof it.order === 'number' ? it.order : 0,
        }
      });
      count++;
    }
    console.log(`✅ Imported/Updated ${count} items from flat JSON array.`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
