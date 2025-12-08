import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Import PackageForm as a client component
const PackageForm = dynamic(() => import("@/components/admin/PackageForm"));

export default async function NewPackagePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const cruises = await prisma.dahabiya.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Package</h1>
      <PackageForm />
    </div>
  );
}