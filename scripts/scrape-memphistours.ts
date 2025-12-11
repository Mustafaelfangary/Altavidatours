import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface ScrapedDestination {
  name: string;
  slug: string;
  description: string;
  country: string;
  imageCover: string;
  images: string[];
  highlights: string[];
  coordinates?: { lat: number; lng: number };
  isActive: boolean;
}

class MemphisToursScraper {
  private baseUrl = 'https://www.memphistours.com';
  private destinations: ScrapedDestination[] = [];
  private targetCountries = ['egypt', 'dubai', 'jordan', 'turkey'];

  async scrapeDestinations(): Promise<ScrapedDestination[]> {
    console.log('Starting to scrape destinations from Memphis Tours...');
    
    for (const country of this.targetCountries) {
      console.log(`Scraping ${country}...`);
      await this.scrapeCountry(country);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
    }
    
    console.log(`Successfully scraped ${this.destinations.length} destinations`);
    return this.destinations;
  }

  private async scrapeCountry(country: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/${country}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      // Find destination cards/links
      const destinationLinks: string[] = [];
      $('.destination-card a, .tour-card a, .package-card a, .card a').each((index, element) => {
        const href = $(element).attr('href');
        if (href && (href.includes('/destination') || href.includes('/tour') || href.includes('/package'))) {
          destinationLinks.push(this.baseUrl + href);
        }
      });
      
      // Also look for destination grid items
      $('.destination-item, .tour-item, .location-item').each((index, element) => {
        const link = $(element).find('a').first().attr('href');
        if (link && !destinationLinks.includes(this.baseUrl + link)) {
          destinationLinks.push(this.baseUrl + link);
        }
      });
      
      console.log(`Found ${destinationLinks.length} destination links for ${country}`);
      
      // Scrape each destination
      for (const link of destinationLinks.slice(0, 8)) { // Limit to 8 per country
        try {
          const destinationData = await this.scrapeDestinationDetail(link, country);
          if (destinationData) {
            this.destinations.push(destinationData);
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error scraping destination ${link}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error scraping country ${country}:`, error);
    }
  }

  private async scrapeDestinationDetail(url: string, country: string): Promise<ScrapedDestination | null> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      // Extract destination information
      const name = $('h1, .destination-title, .tour-title, .page-title').first().text().trim() || 'Unknown Destination';
      const description = $('.destination-description, .tour-description, .description, .page-description').first().text().trim() || '';
      
      // Extract main image
      const mainImage = $('.destination-image img, .tour-image img, .main-image img, .hero-image img').first().attr('src') || '';
      
      // Extract additional images
      const images: string[] = [];
      $('.gallery img, .destination-gallery img, .tour-gallery img, .image-gallery img').each((index, element) => {
        const src = $(element).attr('src');
        if (src && !images.includes(src)) {
          images.push(src.startsWith('http') ? src : this.baseUrl + src);
        }
      });
      
      // Extract highlights
      const highlights: string[] = [];
      $('.highlights li, .destination-highlights li, .tour-highlights li, .features li').each((index, element) => {
        const text = $(element).text().trim();
        if (text && !highlights.includes(text)) {
          highlights.push(text);
        }
      });
      
      // Generate slug
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Default coordinates (you might want to update these manually)
      const coordinates = this.getDefaultCoordinates(country);
      
      return {
        name,
        slug,
        description,
        country: this.capitalizeCountry(country),
        imageCover: mainImage.startsWith('http') ? mainImage : this.baseUrl + mainImage,
        images,
        highlights,
        coordinates,
        isActive: true
      };
    } catch (error) {
      console.error(`Error scraping destination detail from ${url}:`, error);
      return null;
    }
  }

  private getDefaultCoordinates(country: string): { lat: number; lng: number } {
    const coords: Record<string, { lat: number; lng: number }> = {
      egypt: { lat: 26.8206, lng: 30.8025 },
      dubai: { lat: 25.2048, lng: 55.2708 },
      jordan: { lat: 30.5852, lng: 36.2384 },
      turkey: { lat: 38.9637, lng: 35.2433 }
    };
    return coords[country] || { lat: 0, lng: 0 };
  }

  private capitalizeCountry(country: string): string {
    const countryMap: Record<string, string> = {
      egypt: 'Egypt',
      dubai: 'UAE',
      jordan: 'Jordan',
      turkey: 'Turkey'
    };
    return countryMap[country] || this.capitalizeFirst(country);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async saveToFile(): Promise<void> {
    const outputPath = path.join(process.cwd(), 'scraped-destinations.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.destinations, null, 2));
    console.log(`Saved ${this.destinations.length} destinations to ${outputPath}`);
  }
}

// Run the scraper
async function main() {
  const scraper = new MemphisToursScraper();
  await scraper.scrapeDestinations();
  await scraper.saveToFile();
}

if (require.main === module) {
  main().catch(console.error);
}

export default MemphisToursScraper;
