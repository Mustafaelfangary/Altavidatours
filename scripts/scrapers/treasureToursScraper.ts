import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface TourPackage {
  title: string;
  url: string;
  duration: string;
  price: string;
  description: string;
  highlights: string[];
  itinerary: { day: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  imageUrl?: string;
  category?: string;
}

class TreasureToursScraper {
  private baseUrl = 'https://www.treasureegypttours.com';
  private outputDir = join(process.cwd(), 'data/tours');

  constructor() {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async scrapeAllTours() {
    try {
      console.log('Starting to scrape tour packages...');
      
      // First, get the main tours page
      const { data } = await axios.get(`${this.baseUrl}/tours`);
      const $ = cheerio.load(data);
      const tourLinks: string[] = [];

      // Extract all tour links (adjust selector as needed)
      $('a.tour-link').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          tourLinks.push(href.startsWith('http') ? href : `${this.baseUrl}${href}`);
        }
      });

      console.log(`Found ${tourLinks.length} tour links`);

      // Scrape each tour page
      const tours: TourPackage[] = [];
      for (const link of tourLinks.slice(0, 5)) { // Limit to 5 for testing
        try {
          const tour = await this.scrapeTourPage(link);
          if (tour) {
            tours.push(tour);
            await this.createTourDocx(tour);
          }
        } catch (error) {
          console.error(`Error scraping ${link}:`, error);
        }
      }

      // Save all tours to a JSON file
      writeFileSync(
        join(this.outputDir, 'all-tours.json'),
        JSON.stringify(tours, null, 2)
      );

      console.log(`Successfully scraped ${tours.length} tours`);
      return tours;
    } catch (error) {
      console.error('Error in scrapeAllTours:', error);
      throw error;
    }
  }

  private async scrapeTourPage(url: string): Promise<TourPackage | null> {
    try {
      console.log(`Scraping tour: ${url}`);
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Extract tour details (adjust selectors as needed)
      const title = $('h1.tour-title').text().trim();
      const duration = $('.tour-duration').text().trim();
      const price = $('.tour-price').text().trim();
      const description = $('.tour-description').text().trim();
      const imageUrl = $('.tour-image img').attr('src');

      const highlights: string[] = [];
      $('.tour-highlights li').each((_, el) => {
        highlights.push($(el).text().trim());
      });

      const itinerary: { day: string; description: string }[] = [];
      $('.itinerary-day').each((_, el) => {
        const day = $(el).find('.day-number').text().trim();
        const description = $(el).find('.day-description').text().trim();
        if (day && description) {
          itinerary.push({ day, description });
        }
      });

      const tour: TourPackage = {
        title,
        url,
        duration,
        price,
        description,
        highlights,
        itinerary,
        inclusions: this.extractListItems($, '.inclusions li'),
        exclusions: this.extractListItems($, '.exclusions li'),
        imageUrl: imageUrl?.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`
      };

      return tour;
    } catch (error) {
      console.error(`Error scraping tour page ${url}:`, error);
      return null;
    }
  }

  private extractListItems($: any, selector: string): string[] {
    const items: string[] = [];
    $(selector).each((_: any, el: any) => {
      items.push($(el).text().trim());
    });
    return items;
  }

  private async createTourDocx(tour: TourPackage): Promise<void> {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: tour.title,
                heading: "Heading1",
                spacing: { after: 200 }
              }),
              new Paragraph(tour.description),
              new Paragraph({
                text: "Highlights:",
                heading: "Heading2",
                spacing: { before: 400, after: 200 }
              }),
              ...tour.highlights.map(highlight => 
                new Paragraph({
                  text: ` ${highlight}`,
                  bullet: { level: 0 }
                })
              ),
              new Paragraph({
                text: "Itinerary:",
                heading: "Heading2",
                spacing: { before: 400, after: 200 }
              }),
              ...tour.itinerary.flatMap(day => [
                new Paragraph({
                  text: `Day ${day.day}`,
                  heading: "Heading3",
                  spacing: { before: 200, after: 100 }
                }),
                new Paragraph(day.description)
              ])
            ]
          }
        ]
      });

      const buffer = await Packer.toBuffer(doc);
      const fileName = `${tour.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.docx`;
      const filePath = join(this.outputDir, 'docx', fileName);
      
      if (!existsSync(join(this.outputDir, 'docx'))) {
        mkdirSync(join(this.outputDir, 'docx'), { recursive: true });
      }
      
      writeFileSync(filePath, buffer);
      console.log(`Created DOCX for: ${tour.title}`);
    } catch (error) {
      console.error(`Error creating DOCX for ${tour.title}:`, error);
    }
  }
}

// Run the scraper
const scraper = new TreasureToursScraper();
scraper.scrapeAllTours().catch(console.error);
