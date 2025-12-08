import prisma from "@/lib/prisma";

const PromotionsPage = async () => {
  // Fetch all PageContent items with section 'promotion' (or similar)
  const promotions = await prisma.pageContent.findMany({
    where: { section: "promotion" },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
        <p className="text-sm text-muted-foreground mb-4">Manage your promotions (content blocks with section 'promotion').</p>
        <ul className="space-y-4">
          {promotions.map((promo) => (
            <li key={promo.id} className="border rounded p-4">
              <div className="font-semibold">{promo.title}</div>
              <div className="text-sm text-muted-foreground">{promo.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PromotionsPage;