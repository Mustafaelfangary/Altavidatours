// scripts/dubaiScraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import prisma from './prisma.js';

async function scrapeDubaiDestinations() {
  const url = 'https://www.memphistours.com/dubai';
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const destinations: any[] = [];
    
    $('h2, h3').each((i, el) => {
      const name = $(el).text().trim();
      if (name && !name.includes('Dubai') && name.length > 2) {
        destinations.push({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description: `Visit ${name} in Dubai`,
          country: 'UAE',
          region: 'Middle East',
          images: [],
          highlights: [],
          isActive: true,
          order: 0
        });
      }
    });
    
    return destinations;
  } catch (error) {
    console.error('Scraping error:', error);
    return [];
  }
}

async function main() {
  const destinations = await scrapeDubaiDestinations();
  console.log(`Found ${destinations.length} destinations`);
  
  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest
    });
    console.log(`Saved: ${dest.name}`);
  }
}

main().catch(console.error);