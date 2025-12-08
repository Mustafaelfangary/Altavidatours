import { PolicyManagement } from "@/components/dashboard/PolicyManagement";
import prisma from "@/lib/prisma";

const PoliciesPage = async () => {
  // There is no Policy model in the Prisma schema. Use PageContent for policies.
  const policies = await prisma.pageContent.findMany({
    where: { section: "policy" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PolicyManagement policies={policies} />
      </div>
    </div>
  );
};

export default PoliciesPage;