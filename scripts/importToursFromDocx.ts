// scripts/importToursFromDocx.ts
import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as mammoth from 'mammoth';

const prisma = new PrismaClient();

interface ParsedTour {
  title: string;
  description: string;
  duration: string;
  price: string;
  highlights: string[];
  itinerary: { day: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  imageUrl?: string;
  category?: string;
}

async function parseDocx(filePath: string): Promise<ParsedTour> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const textContent = result.value;

    // Extract basic information
    const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const title = lines[0] || 'Untitled Tour';
    
    // Extract duration (looking for patterns like "X days" or "X Nights")
    let duration = 'Not specified';
    const durationMatch = textContent.match(/(\d+)\s*(day|night)s?/i);
    if (durationMatch) {
      duration = `${durationMatch[1]} ${durationMatch[2].toLowerCase()}s`;
    }

    // Extract price (looking for $, USD, or EGP)
    let price = 'Contact for price';
    const priceMatch = textContent.match(/(?:USD|\$|EGP|L\.?E\.?)\s*([\d,]+)/);
    if (priceMatch) {
      price = priceMatch[0];
    }

    // Initialize sections
    const sections: Record<string, string[]> = {
      description: [],
      itinerary: [],
      highlights: [],
      inclusions: [],
      exclusions: []
    };

    let currentSection: string | null = null;

    // Process each line
    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      // Check for section headers
      if (/(itinerary|day by day|tour plan|day [0-9])/i.test(lowerLine)) {
        currentSection = 'itinerary';
        continue;
      } else if (/(inclusions?|what'?s included|including)/i.test(lowerLine)) {
        currentSection = 'inclusions';
        continue;
      } else if (/(exclusions?|what'?s not included|not including)/i.test(lowerLine)) {
        currentSection = 'exclusions';
        continue;
      } else if (/(highlights|features|tour highlights)/i.test(lowerLine)) {
        currentSection = 'highlights';
        continue;
      } else if (/(description|overview|about)/i.test(lowerLine)) {
        currentSection = 'description';
        continue;
      }

      // Add content to the current section
      if (currentSection && line.length > 5) { // Skip very short lines
        sections[currentSection].push(line);
      } else if (line.length > 20) { // Assume it's part of the description if no section is set
        sections['description'].push(line);
      }
    }

    // Process itinerary
    const itinerary: { day: string; description: string }[] = [];
    let currentDay: { day: string; description: string } | null = null;
    
    for (const line of sections['itinerary']) {
      const dayMatch = line.match(/^(?:day\s*)?(\d+)[:.\s-]*(.*)/i);
      if (dayMatch) {
        if (currentDay) {
          itinerary.push(currentDay);
        }
        currentDay = {
          day: dayMatch[1],
          description: dayMatch[2] || 'No description available'
        };
      } else if (currentDay) {
        currentDay.description += ' ' + line;
      }
    }
    
    if (currentDay) {
      itinerary.push(currentDay);
    }

    // If no specific section content, use the first few lines
    if (sections['description'].length === 0 && lines.length > 1) {
      sections['description'] = lines.slice(1, Math.min(5, lines.length));
    }

    // Clean up sections
    const cleanSection = (arr: string[]): string[] => 
      arr
        .join(' ')
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s + '.');

    return {
      title,
      description: cleanSection(sections['description'] || []).join('\n\n') || 'No description available',
      duration,
      price,
      highlights: cleanSection(sections['highlights'] || []).slice(0, 5) || ['No highlights available'],
      itinerary: itinerary.length > 0 ? itinerary : [{
        day: '1',
        description: cleanSection(sections['description'] || []).join(' ').substring(0, 500) || 'No itinerary available'
      }],
      inclusions: cleanSection(sections['inclusions'] || []).slice(0, 10) || ['Not specified'],
      exclusions: cleanSection(sections['exclusions'] || []).slice(0, 5) || ['Not specified']
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    throw error;
  }
}

async function importTour(tourData: ParsedTour) {
  try {
    // Generate a slug from the title
    const slug = tourData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if tour with same slug already exists
    const existingTour = await prisma.package.findFirst({
      where: { slug }
    });
    
    if (existingTour) {
      console.log(`Tour "${tourData.title}" already exists, skipping...`);
      return;
    }
    
    // Extract numeric price
    const price = parseFloat(tourData.price.replace(/[^0-9.]/g, '')) || 0;
    
    // Extract duration in days
    const durationMatch = tourData.duration.match(/\d+/);
    const duration = durationMatch ? parseInt(durationMatch[0]) : 1;
    
    // Create the tour in the database
    const tour = await prisma.package.create({
      data: {
        name: tourData.title,
        description: tourData.description,
        shortDescription: tourData.description.substring(0, 200) + 
                         (tourData.description.length > 200 ? '...' : ''),
        price: price,
        duration: duration,
        destination: 'Egypt',
        isFeatured: false,
        slug: slug,
        // Add other fields as needed
      }
    });
    
    console.log(`✅ Imported: ${tourData.title} (${duration} days, $${price})`);
    return tour;
  } catch (error) {
    console.error(`❌ Error importing tour "${tourData.title}":`, error);
  }
}

async function main() {
  try {
    // Find all .docx files in the root directory
    const rootDir = process.cwd();
    const files = readdirSync(rootDir)
      .filter(file => file.endsWith('.docx') && !file.startsWith('~$'))
      .filter((_, index) => index < 5); // Limit to first 5 files for testing

    if (files.length === 0) {
      console.log('No .docx files found in the root directory');
      return;
    }
    
    console.log(`Found ${files.length} .docx files to process`);

    // Process each file
    for (const file of files) {
      try {
        console.log(`\n📄 Processing: ${file}`);
        const filePath = join(rootDir, file);
        const tourData = await parseDocx(filePath);
        console.log(`  Extracted: ${tourData.title}`);
        console.log(`  Duration: ${tourData.duration}, Price: ${tourData.price}`);
        console.log(`  Highlights: ${tourData.highlights.length}, Itinerary days: ${tourData.itinerary.length}`);
        
        await importTour(tourData);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
      }
    }
    
    console.log('\n✨ Import completed!');
  } catch (error) {
    console.error('❌ Error in main process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
main().catch(console.error);