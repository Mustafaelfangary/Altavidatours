-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "shortDescription" TEXT;

-- AlterTable
ALTER TABLE "PageContent" ADD COLUMN     "contentType" TEXT NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "page" TEXT,
ADD COLUMN     "section" TEXT;
