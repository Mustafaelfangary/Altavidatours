import { PromotionForm } from "@/components/admin/PromotionForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

const EditPromotionPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const promotion = await prisma.promotion.findUnique({
    where: {
      id,
    },
  });

  if (!promotion) {
    return notFound();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PromotionForm initialData={promotion} />
      </div>
    </div>
  );
};

export default EditPromotionPage;