// scripts/scrape-treasure-egypt.ts
console.log('🚀 Script is starting...');

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface TourData {
  title: string;
  url: string;
  description: string;
  price?: string;
  duration?: string;
  country: string;
  // Add more fields as needed
}

class TourScraper {
  private baseUrl: string;
  private tours: TourData[] = [];
  private countries: string[];

  constructor(baseUrl: string = 'https://www.memphistours.com', countries: string[] = []) {
    this.baseUrl = baseUrl;
    this.countries = countries.length > 0 ? countries : ['dubai', 'turkey', 'jordan', 'egypt'];
  }

  async scrapeTours() {
    console.log('🚀 Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      for (const country of this.countries) {
        const countryUrl = `${this.baseUrl}/${country}`;
        console.log(`\n🌍 Processing country: ${country.toUpperCase()}`);
        console.log(`🌐 Navigating to: ${countryUrl}`);
        
        await page.goto(countryUrl, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        
        console.log('⏳ Waiting for content to load...');
        
        try {
          // Wait for tour elements to load
          await page.waitForSelector('.package-item, .tour-item, .package-card, .tours-grid', { 
            timeout: 10000 
          });
        } catch (error) {
          console.log(`⚠️ No tour elements found on ${country} page, trying to find links...`);
        }

        // Get all tour links
        const tourLinks = await page.$$eval('a', (links, currentCountry) => 
          links
            .map(link => ({
              href: link.href,
              text: link.textContent?.trim() || ''
            }))
            .filter(({ href, text }) => 
              href && 
              (href.includes('/tours/') || 
               href.includes(`/${currentCountry}/`) ||
               href.includes('/package/') ||
               (text && text.length > 10 && text.length < 100))
            )
            .map(({ href }) => href)
        , country); // Pass country as an argument to the page.$$eval callback

        console.log(`🔗 Found ${tourLinks.length} potential tour links for ${country}`);
        if (tourLinks.length > 0) {
          console.log('Sample links:', tourLinks.slice(0, 3));
        }

        // Scrape each tour (limited to 2 per country for testing)
        for (const link of [...new Set(tourLinks)].slice(0, 2)) {
          try {
            console.log(`\n🏨 Scraping: ${link}`);
            await page.goto(link, { 
              waitUntil: 'domcontentloaded',
              timeout: 30000
            });
            
            // Extract tour data
            const tourData = await page.evaluate((currentCountry) => {
              const getText = (selector: string) => 
                document.querySelector(selector)?.textContent?.trim() || '';

              return {
                title: document.title,
                url: window.location.href,
                description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                price: getText('.price, .amount, .tour-price'),
                duration: getText('.duration, .days, .tour-duration'),
                country: currentCountry.charAt(0).toUpperCase() + currentCountry.slice(1),
                // Add more selectors as needed
              };
            }, country);

            console.log('Scraped data:', tourData);
            this.tours.push(tourData);
            
            await new Promise(r => setTimeout(r, 2000)); // Be nice to the server
            
          } catch (error) {
            console.error(`Error scraping ${link}:`, error);
          }
        }
      }

      return this.tours;
    } catch (error) {
      console.error('Error during scraping:', error);
      return [];
    } finally {
      await browser.close();
      console.log('✅ Browser closed');
    }
  }

  async saveToFile() {
    const outputPath = path.join(process.cwd(), 'scraped-tours.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.tours, null, 2));
    console.log(`\n💾 Saved ${this.tours.length} tours to ${outputPath}`);
  }
}

// Run the scraper
async function main() {
  console.log('🚀 Starting scraper...');
  const startTime = Date.now();
  
  const countries = ['dubai', 'turkey', 'jordan', 'egypt'];
  const scraper = new TourScraper('https://www.memphistours.com', countries);
  
  try {
    await scraper.scrapeTours();
    await scraper.saveToFile();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🏁 Scraping completed in ${duration} seconds`);
  } catch (error) {
    console.error('\n❌ Error during scraping:', error);
  }
}

main().catch(console.error);