import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { FaqForm } from '@/components/admin/FaqForm';

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({
    where: {
      id,
    },
  });

  if (!faq) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit FAQ</h1>
      <FaqForm initialData={faq} />
    </div>
  );
}