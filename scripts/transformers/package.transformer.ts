// scripts/transformers/package.transformer.ts
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

interface ScrapedPackage {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  mainImage: string;
  images: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary?: any;
  destination: string;
}

const prisma = new PrismaClient();

export async function transformAndInsertPackages(scrapedPackages: ScrapedPackage[]) {
  console.log('Transforming and inserting packages...');
  
  const results = [];
  
  for (const pkg of scrapedPackages) {
    try {
      const slug = slugify(pkg.name, { lower: true, strict: true });
      
      const packageData = {
        name: pkg.name,
        slug,
        description: pkg.description,
        shortDescription: pkg.description.substring(0, 200) + (pkg.description.length > 200 ? '...' : ''),
        price: pkg.price || 0,
        duration: pkg.duration || 7,
        mainImage: pkg.mainImage || pkg.images[0] || '',
        category: pkg.category || 'classics',
        destination: pkg.destination || 'Egypt',
        includes: pkg.includes || [],
        excludes: pkg.excludes || [],
        highlights: pkg.highlights || [],
        maxGroupSize: 12,
        difficulty: 'moderate',
        isActive: true,
        isFeatured: false,
      };
      
      const result = await prisma.package.upsert({
        where: { slug },
        update: packageData,
        create: packageData,
      });
      
      results.push(result);
      console.log(`Processed package: ${pkg.name}`);
      
    } catch (error) {
      console.error(`Error processing package ${pkg.name}:`, error);
    }
  }
  
  console.log(`Successfully processed ${results.length} packages`);
  return results;
}

export default transformAndInsertPackages;