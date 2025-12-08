import { User, Booking, Review, Itinerary, Package, PageContent, TravelService, UserPreference, LoyaltyAction, Notification } from '@prisma/client';

export type AdminUser = User & {
  preferences?: UserPreference | null;
  bookings?: Booking[];
  reviews?: Review[];
  loyaltyActions?: LoyaltyAction[];
  notifications?: Notification[];
};

export type AdminItinerary = Itinerary & {
  packages?: Package[];
  bookings?: Booking[];
  // Pricing information can be added here if needed
};

// Removed Dahabiya specific type as it's not in the schema

export type AdminPackage = Package & {
  itinerary?: Itinerary;
  inclusions?: string[];
  exclusions?: string[];
};

// BlogPost type not found in schema - consider adding it to your Prisma schema if needed

export type AdminPageContent = PageContent & {
  metadata?: Record<string, any>;
};

export type AdminTravelService = TravelService & {
  // Add any additional fields specific to the admin view
  bookings?: Booking[];
};

export type AdminStats = {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeTours: number;
  upcomingTours: number;
  recentBookings: any[]; // Using any[] temporarily, will replace with proper type
  recentUsers: any[];    // Using any[] temporarily, will replace with proper type
};
