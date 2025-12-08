import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PackagesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const packages = await prisma.package.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      durationDays: true,
      mainImageUrl: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const columns = [
    {
      accessorKey: "mainImageUrl" as const,
      header: "Image",
      cell: ({ row }: { row: any }) => (
        row.original.mainImageUrl ? (
          <img src={row.original.mainImageUrl} alt={row.original.name} className="w-16 h-12 object-cover rounded shadow" />
        ) : (
          <div className="w-16 h-12 bg-gray-200 rounded" />
        )
      ),
    },
    {
      accessorKey: "name" as const,
      header: "Name",
    },
    {
      accessorKey: "durationDays" as const,
      header: "Duration (days)",
    },
    {
      accessorKey: "price" as const,
      header: "Price",
      cell: ({ row }: { row: any }) => `$${row.original.price}`,
    },
    {
      accessorKey: "id" as const,
      header: "Actions",
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/packages/${row.original.id}`}>
            <Button size="sm" className="bg-nile-blue hover:bg-nile-blue/90">Edit</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Packages</h1>
        <Link href="/dashboard/packages/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded shadow">Add New Package</Button>
        </Link>
      </div>

      <div className="mb-8">
        <DataTable
          columns={columns}
          data={packages}
        />
      </div>
    </div>
  );
}
