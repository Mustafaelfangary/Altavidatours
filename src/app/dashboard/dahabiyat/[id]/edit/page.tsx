import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import DahabiyaForm from "@/components/admin/DahabiyaForm";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  const dahabiya = await prisma.dahabiya.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!dahabiya) {
    notFound();
  }

  // Only pass serializable, plain data to the client component
  const serializedDahabiya = {
    id: dahabiya.id,
    name: dahabiya.name,
    description: dahabiya.description,
    shortDescription: dahabiya.shortDescription || "",
    advantages: dahabiya.advantages || "",
    meaning: dahabiya.meaning || "",
    pricePerDay: Number(dahabiya.pricePerDay),
    capacity: dahabiya.capacity,
    features: dahabiya.features,
    type: dahabiya.type,
    category: dahabiya.category,
    amenities: dahabiya.amenities || [],
    images: dahabiya.images.map(image => ({
      id: image.id,
      url: image.url,
      alt: image.alt || "",
      category: image.category
    })),
    mainImageUrl: dahabiya.mainImageUrl || "",
    videoUrl: dahabiya.videoUrl || ""
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <a href="/dashboard/dahabiyat" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded shadow transition">&larr; Back to Dahabiyat</a>
      </div>
      <h1 className="text-3xl font-bold mb-8">Edit Dahabiya</h1>
      <DahabiyaForm initialData={serializedDahabiya} />
    </div>
  );
} 