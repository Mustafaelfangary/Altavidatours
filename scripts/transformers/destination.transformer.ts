// scripts/transformers/destination.transformer.ts
import { PrismaClient } from '@prisma/client';

interface ScrapedDestination {
  name: string;
  slug: string;
  description: string;
  country: string;
  imageCover: string;
  images: string[];
  highlights: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
}

const prisma = new PrismaClient();

export async function transformAndInsertDestinations(scrapedDestinations: ScrapedDestination[]) {
  console.log('Transforming and inserting destinations...');
  
  const results = [];
  
  for (const dest of scrapedDestinations) {
    try {
      const destinationData = {
        name: dest.name,
        slug: dest.slug,
        description: dest.description,
        country: dest.country,
        imageCover: dest.imageCover || dest.images[0] || '',
        images: dest.images,
        highlights: dest.highlights,
        coordinates: dest.coordinates ? JSON.stringify(dest.coordinates) : null,
        isActive: dest.isActive !== undefined ? dest.isActive : true,
      };
      
      const result = await prisma.destination.upsert({
        where: { slug: dest.slug },
        update: destinationData,
        create: destinationData,
      });
      
      results.push(result);
      console.log(`Processed destination: ${dest.name}`);
      
    } catch (error) {
      console.error(`Error processing destination ${dest.name}:`, error);
    }
  }
  
  console.log(`Successfully processed ${results.length} destinations`);
  return results;
}

export default transformAndInsertDestinations;