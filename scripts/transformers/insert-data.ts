// scripts/insert-data.ts
import { ScrapedPackage } from './scrape-treasure-egypt';
import { ScrapedDestination } from './scrape-memphistours';
import transformAndInsertPackages from './transformers/package.transformer';
import transformAndInsertDestinations from './transformers/destination.transformer';
import fs from 'fs';
import path from 'path';

async function main() {
  try {
    // Read scraped data
    const packagesPath = path.join(process.cwd(), 'scraped-packages.json');
    const destinationsPath = path.join(process.cwd(), 'scraped-destinations.json');

    if (!fs.existsSync(packagesPath) || !fs.existsSync(destinationsPath)) {
      throw new Error('Scraped data files not found. Please run the scrapers first.');
    }

    const packages: ScrapedPackage[] = JSON.parse(fs.readFileSync(packagesPath, 'utf-8'));
    const destinations: ScrapedDestination[] = JSON.parse(fs.readFileSync(destinationsPath, 'utf-8'));

    console.log(`Found ${packages.length} packages and ${destinations.length} destinations to process`);

    // Process destinations first since packages might reference them
    console.log('Processing destinations...');
    await transformAndInsertDestinations(destinations);

    // Then process packages
    console.log('Processing packages...');
    await transformAndInsertPackages(packages);

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during data import:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();