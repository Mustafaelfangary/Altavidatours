import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ContentRef {
  page: string;
  key: string;
  fallback?: string;
  file: string;
}

function walk(dir: string, files: string[] = []): string[] {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      // skip node_modules and .next
      if (item.name === 'node_modules' || item.name === '.next') continue;
      walk(full, files);
    } else if (item.isFile()) {
      if (full.endsWith('.tsx') || full.endsWith('.ts')) {
        files.push(full);
      }
    }
  }
  return files;
}

function humanizeTitle(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function extractFromFile(filePath: string): ContentRef[] {
  const txt = fs.readFileSync(filePath, 'utf8');
  const refs: ContentRef[] = [];

  // Map local getContent function name => page
  // Matches: const { getContent } = useContent({ page: 'footer' });
  // Or: const { getContent: getGlobalContent } = useContent({ page: 'global_media' });
  const contentHookRegex = /const\s*\{\s*getContent(?:\s*:\s*([a-zA-Z0-9_]+))?\s*\}\s*=\s*useContent\(\{\s*page:\s*'([^']+)'\s*\}\)/g;
  const funcToPage = new Map<string, string>();
  let m: RegExpExecArray | null;
  while ((m = contentHookRegex.exec(txt))) {
    const alias = (m[1] || 'getContent').trim();
    const page = m[2].trim();
    funcToPage.set(alias, page);
  }

  if (funcToPage.size === 0) return refs;

  // Find getContent calls: getX('key', 'fallback') or getX('key')
  const getCallRegex = /([a-zA-Z0-9_]+)\(\s*'([^']+)'\s*(?:,\s*'([^']*)'\s*)?\)/g;
  while ((m = getCallRegex.exec(txt))) {
    const func = m[1];
    const key = m[2];
    const fallback = m[3];
    const page = funcToPage.get(func);
    if (page) {
      refs.push({ page, key, fallback, file: filePath });
    }
  }

  return refs;
}

async function upsertRefs(refs: ContentRef[]) {
  let created = 0;
  let updated = 0;
  const dedup = new Map<string, ContentRef>();

  // Deduplicate by page+key, prefer one with non-empty fallback
  for (const r of refs) {
    const id = `${r.page}::${r.key}`;
    const existing = dedup.get(id);
    if (!existing) dedup.set(id, r);
    else if ((!existing.fallback || existing.fallback.length === 0) && r.fallback) dedup.set(id, r);
  }

  for (const r of dedup.values()) {
    const title = humanizeTitle(r.key);
    const content = r.fallback ?? '';
    const res = await prisma.websiteContent.upsert({
      where: { key: r.key },
      update: {
        title,
        content,
        page: r.page,
        section: null,
        isActive: true,
      },
      create: {
        key: r.key,
        title,
        content,
        contentType: 'TEXT',
        page: r.page,
        section: null,
        isActive: true,
        order: 0,
      },
    });
    if (res.createdAt.getTime() === res.updatedAt.getTime()) created++; else updated++;
  }
  return { created, updated };
}

async function main() {
  console.log('🔎 Scanning code for WebsiteContent keys and fallbacks...');
  const srcDir = path.join(process.cwd(), 'src');
  const files = walk(srcDir);
  const all: ContentRef[] = [];
  for (const f of files) {
    try {
      const refs = extractFromFile(f);
      if (refs.length) all.push(...refs);
    } catch (e) {
      // ignore parse errors
    }
  }
  console.log(`📄 Parsed ${files.length} files, found ${all.length} key references.`);

  const { created, updated } = await upsertRefs(all);
  console.log(`✅ Upsert complete. Created: ${created}, Updated: ${updated}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
