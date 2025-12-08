import type { Prisma } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

export interface NileCruisePackageWithRelations {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: Decimal;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  cruiseId: string;
  createdAt: Date;
  updatedAt: Date;
  cruise: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      alt: string | null;
    }>;
  };
  itinerary: Array<{
    id: string;
    day: number;
    description: string;
    packageId: string;
  }>;
}

export interface NileCruisePackageFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  cruiseId: string;
  itinerary: Array<{
    day: number;
    description: string;
  }>;
}

export interface NileCruisePackageCreateInput extends Omit<NileCruisePackageFormData, 'price'> {
  price: Decimal;
}