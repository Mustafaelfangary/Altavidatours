import prisma from "@/lib/prisma";
import DahabiyatDashboardClient from "./DahabiyatDashboardClient";

export default async function AdminDahabiyatPage() {
  const dahabiyat = await prisma.dahabiya.findMany({
    include: {
      amenityItems: true,
      imageItems: true,
      itineraries: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map to the shape expected by DahabiyatDashboardClient
  const mappedDahabiyat = dahabiyat.map(dahabiya => ({
    id: dahabiya.id,
    name: dahabiya.name,
    description: dahabiya.description,
    pricePerDay: 0, // Placeholder, not in schema
    capacity: dahabiya.capacity,
    rating: 0, // Placeholder, not in schema
    images: dahabiya.imageItems.map(img => ({ url: img.url })),
  }));

  return <DahabiyatDashboardClient dahabiyat={mappedDahabiyat} />;
}