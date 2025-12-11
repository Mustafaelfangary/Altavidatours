import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TourDetail from '@/components/tours/TourDetail';

async function getTour(slug: string) {
  const tour = await prisma.tour.findUnique({
    where: { slug }
  });
  
  if (!tour) return null;
  return tour;
}

export default async function TourPage({ params }: { params: { slug: string } }) {
  const tour = await getTour(params.slug);
  
  if (!tour) {
    notFound();
  }
  
  return <TourDetail tour={tour} />;
}
