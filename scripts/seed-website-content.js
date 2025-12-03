// Seed WebsiteContent keys for homepage sections and images
// Run with: node scripts/seed-website-content.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertContent(item) {
  const {
    key,
    title,
    content,
    mediaUrl,
    contentType = 'TEXT',
    page = 'homepage',
    section = 'main',
    order = 0,
  } = item;

  return prisma.websiteContent.upsert({
    where: { key },
    update: {
      title,
      content,
      mediaUrl,
      contentType,
      page,
      section,
      order,
      isActive: true,
    },
    create: {
      key,
      title,
      content,
      mediaUrl,
      contentType,
      page,
      section,
      order,
      isActive: true,
    },
  });
}

async function main() {
  const items = [
    // Services section
    {
      key: 'services_section_title',
      title: 'Services Section Title',
      content: 'Popular Services',
      contentType: 'TEXT',
      page: 'homepage',
      section: 'services',
      order: 1,
    },
    {
      key: 'services_section_subtitle',
      title: 'Services Section Subtitle',
      content: 'Private guides, transfers, tickets, and curated experiences across Egypt.',
      contentType: 'TEXT',
      page: 'homepage',
      section: 'services',
      order: 2,
    },

    // Hero poster (uses existing image under repo images)
    {
      key: 'hero_video_poster',
      title: 'Hero Video Poster',
      mediaUrl: '/images/Royal Cleopatra/DSC_8502.jpg',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'hero',
      order: 1,
    },

    // Destination images (use existing paths seen in codebase/logs)
    {
      key: 'homepage_destination_cairo_image',
      title: 'Homepage Cairo Image',
      mediaUrl: '/images/cultural-historical/saqqara-pyramid.jpg',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'destinations',
      order: 10,
    },
    {
      key: 'homepage_destination_luxor_image',
      title: 'Homepage Luxor Image',
      mediaUrl: '/images/Alexandria/IMG_6334.JPG',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'destinations',
      order: 11,
    },
    {
      key: 'homepage_destination_aswan_image',
      title: 'Homepage Aswan Image',
      mediaUrl: '/images/desert&safary/DSC_9166.JPG',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'destinations',
      order: 12,
    },
    {
      key: 'homepage_destination_alexandria_image',
      title: 'Homepage Alexandria Image',
      mediaUrl: '/images/desert&safary/DSC_9826.JPG',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'destinations',
      order: 13,
    },
    {
      key: 'homepage_destination_hurghada_image',
      title: 'Homepage Hurghada Image',
      mediaUrl: '/images/Alexandria/IMG_6504.JPG',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'destinations',
      order: 14,
    },
    {
      key: 'homepage_destination_sharm-el-sheikh_image',
      title: 'Homepage Sharm El Sheikh Image',
      mediaUrl: '/images/cultural&historical/DSC_8401.JPG',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'destinations',
      order: 15,
    },
    {
      key: 'homepage_destination_siwa-oasis_image',
      title: 'Homepage Siwa Oasis Image',
      mediaUrl: '/images/cultural&historical/DSCF1165.JPG',
      contentType: 'IMAGE',
      page: 'homepage',
      section: 'destinations',
      order: 16,
    },
  ];

  console.log(`Seeding ${items.length} WebsiteContent items...`);
  for (const item of items) {
    try {
      const res = await upsertContent(item);
      console.log(`Upserted key: ${res.key}`);
    } catch (e) {
      console.error(`Failed upserting key ${item.key}:`, e?.message || e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
