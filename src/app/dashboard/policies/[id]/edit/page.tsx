import { PolicyForm } from "@/components/admin/PolicyForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

const EditPolicyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const policy = await prisma.policy.findUnique({
    where: {
      id,
    },
  });

  if (!policy) {
    return notFound();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PolicyForm initialData={policy} />
      </div>
    </div>
  );
};

export default EditPolicyPage;