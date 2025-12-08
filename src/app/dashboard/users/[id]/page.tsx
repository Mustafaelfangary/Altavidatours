import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserForm } from "@/components/admin/UserForm";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/dashboard/users");
  }

  // Ensure the role is either 'USER' or 'ADMIN'
  const validRole = user.role === 'USER' || user.role === 'ADMIN' ? user.role : 'USER';
  const userWithValidRole = { ...user, role: validRole };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit User</h1>
      <UserForm user={userWithValidRole} />
    </div>
  );
}
