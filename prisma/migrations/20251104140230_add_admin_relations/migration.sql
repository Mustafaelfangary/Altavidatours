/*
  Warnings:

  - You are about to drop the column `days` on the `Itinerary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "days",
ADD COLUMN     "cancellationPolicy" TEXT,
ADD COLUMN     "childrenPolicy" TEXT,
ADD COLUMN     "daysJson" JSONB,
ADD COLUMN     "durationDays" INTEGER,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "included" TEXT[],
ADD COLUMN     "mainImageUrl" TEXT,
ADD COLUMN     "maxGuests" INTEGER,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "notIncluded" TEXT[],
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "ItineraryDay" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "activities" TEXT[],
    "meals" TEXT[],
    "coordinates" JSONB,
    "images" TEXT[],
    "videoUrl" TEXT,
    "highlights" TEXT[],
    "optionalTours" TEXT[],

    CONSTRAINT "ItineraryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingTier" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "paxRange" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "singleSupplement" DOUBLE PRECISION,

    CONSTRAINT "PricingTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DahabiyaImage" (
    "id" TEXT NOT NULL,
    "dahabiyaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DahabiyaImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DahabiyaItineraryStep" (
    "id" TEXT NOT NULL,
    "dahabiyaId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "DahabiyaItineraryStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DahabiyaAmenities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DahabiyaAmenities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ItineraryDay_itineraryId_dayNumber_idx" ON "ItineraryDay"("itineraryId", "dayNumber");

-- CreateIndex
CREATE INDEX "PricingTier_itineraryId_idx" ON "PricingTier"("itineraryId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "Amenity"("name");

-- CreateIndex
CREATE INDEX "DahabiyaImage_dahabiyaId_idx" ON "DahabiyaImage"("dahabiyaId");

-- CreateIndex
CREATE INDEX "DahabiyaItineraryStep_dahabiyaId_day_idx" ON "DahabiyaItineraryStep"("dahabiyaId", "day");

-- CreateIndex
CREATE INDEX "_DahabiyaAmenities_B_index" ON "_DahabiyaAmenities"("B");

-- AddForeignKey
ALTER TABLE "ItineraryDay" ADD CONSTRAINT "ItineraryDay_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingTier" ADD CONSTRAINT "PricingTier_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DahabiyaImage" ADD CONSTRAINT "DahabiyaImage_dahabiyaId_fkey" FOREIGN KEY ("dahabiyaId") REFERENCES "Dahabiya"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DahabiyaItineraryStep" ADD CONSTRAINT "DahabiyaItineraryStep_dahabiyaId_fkey" FOREIGN KEY ("dahabiyaId") REFERENCES "Dahabiya"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DahabiyaAmenities" ADD CONSTRAINT "_DahabiyaAmenities_A_fkey" FOREIGN KEY ("A") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DahabiyaAmenities" ADD CONSTRAINT "_DahabiyaAmenities_B_fkey" FOREIGN KEY ("B") REFERENCES "Dahabiya"("id") ON DELETE CASCADE ON UPDATE CASCADE;
