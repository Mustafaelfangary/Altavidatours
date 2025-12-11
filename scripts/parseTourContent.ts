import { v4 as uuidv4 } from 'uuid';

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  location: string;
  activities: string[];
  meals: string[];
  highlights: string[];
}

export interface PricingTier {
  category: string;
  paxRange: string;
  price: number;
  singleSupplement?: number;
}

export interface TourData {
  title: string;
  slug: string;
  description: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  price: number;
  priceDiscount?: number;
  summary: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  startLocation: any; // GeoJSON Point
  locations: any[]; // Array of GeoJSON Points
  categories: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  pricingTiers: PricingTier[];
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function parseTourContent(content: string): TourData {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const result: Partial<TourData> = {
    maxGroupSize: 10,
    difficulty: 'moderate',
    imageCover: 'default-tour.jpg',
    images: [],
    startDates: [new Date()],
    startLocation: { type: 'Point', coordinates: [31.2357, 30.0444] }, // Default to Cairo
    locations: [],
    categories: ['Cultural', 'Historical'],
    highlights: [],
    includes: [],
    excludes: [],
    itinerary: [],
    pricingTiers: []
  };

  let currentSection: string | null = null;
  let currentDay: Partial<ItineraryDay> | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const lowerLine = trimmedLine.toLowerCase();

    // Detect sections
    if (lowerLine.includes('itinerary') || /day\s+\d+/i.test(lowerLine)) {
      currentSection = 'itinerary';
      // If we find a day in the section header, process it
      const dayMatch = lowerLine.match(/day\s+(\d+)/i);
      if (dayMatch) {
        if (currentDay) {
          result.itinerary?.push(currentDay as ItineraryDay);
        }
        currentDay = {
          dayNumber: parseInt(dayMatch[1], 10),
          title: trimmedLine,
          description: '',
          location: '',
          activities: [],
          meals: [],
          highlights: []
        };
      }
      continue;
    } else if (lowerLine.includes('includes') || lowerLine.includes('included')) {
      currentSection = 'includes';
      if (currentDay) {
        result.itinerary?.push(currentDay as ItineraryDay);
        currentDay = null;
      }
      continue;
    } else if (lowerLine.includes('excludes') || lowerLine.includes('not included')) {
      currentSection = 'excludes';
      continue;
    } else if (lowerLine.includes('highlights')) {
      currentSection = 'highlights';
      continue;
    } else if (lowerLine.includes('price') || lowerLine.includes('$')) {
      currentSection = 'pricing';
      continue;
    }

    // Process content based on current section
    if (!currentSection) {
      if (!result.title) {
        result.title = trimmedLine;
        result.slug = generateSlug(trimmedLine);
      } else if (!result.description && trimmedLine.length > 20) {
        result.description = trimmedLine;
        result.summary = trimmedLine.substring(0, 200) + (trimmedLine.length > 200 ? '...' : '');
      } else if ((lowerLine.includes('day') || lowerLine.includes('night')) && !result.duration) {
        const daysMatch = trimmedLine.match(/\d+/);
        if (daysMatch) result.duration = parseInt(daysMatch[0], 10);
      } else if (lowerLine.includes('$') && !result.price) {
        const priceMatch = trimmedLine.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
        if (priceMatch) {
          result.price = parseFloat(priceMatch[1].replace(/,/g, ''));
          // Check for discounted price
          const discountMatch = trimmedLine.match(/was\s+\$?(\d+(?:,\d+)*(?:\.\d+)?)/i);
          if (discountMatch) {
            result.priceDiscount = parseFloat(discountMatch[1].replace(/,/g, ''));
          }
        }
      }
    } else {
      switch (currentSection) {
        case 'highlights':
          if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
            result.highlights?.push(trimmedLine.substring(1).trim());
          }
          break;
        case 'includes':
          if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
            result.includes?.push(trimmedLine.substring(1).trim());
          }
          break;
        case 'excludes':
          if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
            result.excludes?.push(trimmedLine.substring(1).trim());
          }
          break;
        case 'itinerary':
          if (currentDay) {
            const dayMatch = trimmedLine.match(/day\s+(\d+)/i);
            if (dayMatch) {
              if (currentDay.dayNumber) {
                result.itinerary?.push(currentDay as ItineraryDay);
              }
              currentDay = {
                dayNumber: parseInt(dayMatch[1], 10),
                title: trimmedLine,
                description: '',
                location: '',
                activities: [],
                meals: [],
                highlights: []
              };
            } else {
              if (!currentDay.description) {
                currentDay.description = trimmedLine;
              } else {
                currentDay.description += '\n' + trimmedLine;
              }
            }
          }
          break;
        case 'pricing':
          const priceMatch = trimmedLine.match(/(\w+)\s*:\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i);
          if (priceMatch) {
            const [, category, price] = priceMatch;
            result.pricingTiers?.push({
              category: category,
              paxRange: '1-2 pax',
              price: parseFloat(price.replace(/,/g, ''))
            });
          }
          break;
      }
    }
  }

  // Push the last day if exists
  if (currentDay) {
    result.itinerary?.push(currentDay as ItineraryDay);
  }

  // Set default values for required fields
  if (!result.title) result.title = 'Untitled Tour';
  if (!result.slug) result.slug = generateSlug(result.title);
  if (!result.description) result.description = 'No description available';
  if (!result.summary) result.summary = result.description.substring(0, 200) + '...';
  if (!result.duration) result.duration = result.itinerary?.length || 1;
  if (!result.price) result.price = 0;

  return result as TourData;
}