import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { User } from "@prisma/client";

type Column = {
  accessorKey?: keyof User;
  id?: string;
  header: string;
  cell?: (props: { row: { original: User } }) => React.ReactNode;
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const columns: Column[] = [
    {
      accessorKey: "name" as const,
      header: "Name",
    },
    {
      accessorKey: "email" as const,
      header: "Email",
    },
    {
      accessorKey: "role" as const,
      header: "Role",
      cell: ({ row }: { row: { original: User } }) => row.original.role,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: User } }) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/users/${row.original.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link href="/dashboard/users/new">
          <Button>Add User</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
