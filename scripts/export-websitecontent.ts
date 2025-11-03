import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const outDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:]/g, '-');
  const outFile = path.join(outDir, `website-content-${ts}.json`);

  const items = await prisma.websiteContent.findMany({
    orderBy: [{ page: 'asc' }, { section: 'asc' }, { key: 'asc' }],
  });

  const grouped: Record<string, Record<string, any[]>> = {};
  for (const it of items) {
    const page = it.page || 'global';
    const section = it.section || 'general';
    if (!grouped[page]) grouped[page] = {};
    if (!grouped[page][section]) grouped[page][section] = [];
    grouped[page][section].push({
      key: it.key,
      title: it.title,
      content: it.content,
      contentType: it.contentType,
      isActive: it.isActive,
      order: it.order,
      createdAt: it.createdAt,
      updatedAt: it.updatedAt,
    });
  }

  fs.writeFileSync(outFile, JSON.stringify({ exportedAt: new Date().toISOString(), data: grouped }, null, 2));
  console.log(`✅ Exported ${items.length} items to ${outFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
