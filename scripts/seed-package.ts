import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { parseTourContent } from './parseTourContent.js';
import prisma from './prisma.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Helper to create or update categories
async function getOrCreateCategory(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing;

  return await prisma.category.create({
    data: {
      name,
      slug,
      description: `Tours in the ${name} category`,
    }
  });
}

// Main seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Find all DOCX files
    const files = fs.readdirSync(process.cwd())
      .filter(file => file.endsWith('.docx') && !file.startsWith('~$'))
      .map(file => path.join(process.cwd(), file));

    if (files.length === 0) {
      console.log('ℹ️ No DOCX files found in the root directory');
      return;
    }

    console.log(`Found ${files.length} DOCX files to process`);

    for (const filePath of files) {
      const fileName = path.basename(filePath);
      console.log(`\n📄 Processing file: ${fileName}`);
      
      try {
        // Parse DOCX content
        const content = await mammoth.extractRawText({ path: filePath });
        const tourData = parseTourContent(content.value);

        // Create categories first
        const categories = await Promise.all(
          (tourData.categories || ['Cultural']).map((cat: string) => 
            getOrCreateCategory(cat)
          )
        );

        // Update the tour creation in seed-package.ts
const tour = await prisma.tour.upsert({
  where: { slug: tourData.slug },
  update: {
    title: tourData.title,
    description: tourData.description,
    duration: tourData.duration || 1,
    maxGroupSize: tourData.maxGroupSize || 10,
    difficulty: tourData.difficulty || 'moderate',
    price: tourData.price || 0,
    priceDiscount: tourData.priceDiscount || null,
    summary: tourData.summary || tourData.description.substring(0, 200),
    imageCover: tourData.imageCover || 'default-tour.jpg',
    images: tourData.images || [],
    startDates: tourData.startDates || [new Date()],
    startLocation: tourData.startLocation || { 
      type: 'Point', 
      coordinates: [31.2357, 30.0444] // Default to Cairo
    },
    locations: tourData.locations || [],
    categories: {
      connect: categories.map((cat: { id: string }) => ({ id: cat.id }))
    }
  },
  create: {
    title: tourData.title,
    slug: tourData.slug,
    description: tourData.description,
    duration: tourData.duration || 1,
    maxGroupSize: tourData.maxGroupSize || 10,
    difficulty: tourData.difficulty || 'moderate',
    price: tourData.price || 0,
    priceDiscount: tourData.priceDiscount || null,
    summary: tourData.summary || tourData.description.substring(0, 200),
    imageCover: tourData.imageCover || 'default-tour.jpg',
    images: tourData.images || [],
    startDates: tourData.startDates || [new Date()],
    startLocation: tourData.startLocation || { 
      type: 'Point', 
      coordinates: [31.2357, 30.0444] // Default to Cairo
    },
    locations: tourData.locations || [],
    categories: {
      connect: categories.map((cat: { id: string }) => ({ id: cat.id }))
    }
  },
  include: {
    categories: true
  }
});

        console.log(`✅ Created tour: ${tour.title}`);
        console.log(`   - Categories: ${tour.categories.map((c: any) => c.name).join(', ')}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${fileName}:`, error);
      }
    }

    console.log('\n🌿 Database seeding completed!');
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedDatabase().catch(console.error);