import prisma from '@/lib/prisma';

export default async function FaqsPage() {
  // Use PageContent with section 'faq' instead of non-existent Faq model
  const faqs = await prisma.pageContent.findMany({
    where: { section: 'faq' },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">FAQs</h1>
      <ul className="space-y-4">
        {faqs.map(faq => (
          <li key={faq.id} className="border rounded p-4">
            <div className="font-semibold">{faq.title}</div>
            <div className="text-sm text-muted-foreground">{faq.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}