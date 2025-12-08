import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EditPackageClient from "./components/EditPackageClient";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const [packageData, dahabiyasRaw] = await Promise.all([
    prisma.package.findUnique({
      where: { id },
      include: {
        itineraryDays: {
          include: {
            images: true,
          },
          orderBy: { dayNumber: 'asc' },
        },
        selectedDahabiya: {
          select: {
            id: true,
            name: true,
            pricePerDay: true,
          },
        },
      },
    }),
    prisma.dahabiya.findMany({
      select: {
        id: true,
        name: true,
        pricePerDay: true,
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!packageData) {
    redirect("/dashboard/packages");
  }

  // Convert Decimal to number for client component
  const dahabiyas = dahabiyasRaw.map(d => ({
    id: d.id,
    name: d.name,
    pricePerDay: Number(d.pricePerDay),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-pharaoh-gold/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-nile-blue mb-2 font-serif">Edit Package</h1>
          <p className="text-ancient-stone">Update your premium Egypt package details</p>
        </div>
        <EditPackageClient
          packageData={packageData}
          dahabiyas={dahabiyas}
        />
      </div>
    </div>
  );
}