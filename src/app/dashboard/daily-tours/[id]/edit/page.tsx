import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import DailyTourForm from "@/components/admin/DailyTourForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDailyTourPage({ params }: EditPageProps) {
  const { id } = await params;

  const tour = await prisma.dailyTour.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!tour) {
    notFound();
  }

  const serializedTour = {
    id: tour.id,
    slug: tour.id, // Use ID as slug for now, can be updated
    name: tour.name,
    description: tour.description,
    shortDescription: tour.shortDescription || "",
    pricePerDay: Number(tour.pricePerDay),
    capacity: tour.capacity,
    features: tour.features,
    rating: tour.rating,
    type: tour.type,
    category: tour.category,
    amenities: tour.amenities,
    images: tour.images.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt || "",
      category: img.category,
    })),
    mainImageUrl: tour.mainImageUrl || "",
    videoUrl: tour.videoUrl || "",
    duration: "Full Day",
    location: "Cairo, Egypt",
    highlights: [],
    inclusions: [],
    exclusions: [],
    meetingPoint: "",
    cancellationPolicy: "Free cancellation up to 24 hours before tour",
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/daily-tours">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Daily Tour</h1>
          <p className="text-muted-foreground">Update tour details, images, and settings</p>
        </div>
      </div>
      <DailyTourForm initialData={serializedTour} />
    </div>
  );
}
