// scripts/types.d.ts
declare module '../scrape-treasure-egypt' {
  export interface ScrapedPackage {
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
}

declare module '../scrape-memphistours' {
  export interface ScrapedDestination {
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
}