export interface PackageImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  isActive: boolean;
}

export interface Activity {
  id: string;
  description: string;
  time: string;
  order: number;
}

export interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  isActive: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: Date;
  isApproved: boolean;
}

export interface PackageData {
  id: string;
  name: string;
  description: string;
  shortDescription: string | null;
  price: number;
  duration: number;
  durationDays: number;
  maxPeople: number;
  mainImageUrl: string;
  isFeaturedOnHomepage: boolean;
  homepageOrder: number;
  images: PackageImage[];
  itineraries: ItineraryDay[];
  reviews: Review[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
