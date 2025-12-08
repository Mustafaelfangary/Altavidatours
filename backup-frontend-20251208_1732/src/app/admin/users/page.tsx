"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default function AdminUsersListPage() {
  const usersQ = useQuery({
    queryKey: ["admin","users","list"],
    queryFn: async () => {
      const data = await fetchJSON<any>("/api/users");
      const items = Array.isArray(data) ? data : data?.items || [];
      const total = data?.total ?? items.length;
      return { items, total };
    },
  });

  if (usersQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]"><Loader2 className="h-6 w-6 animate-spin"/></div>
    );
  }

  if (usersQ.isError) {
    return <div className="p-4 text-red-600">Failed to load users.</div>;
  }

  const users = usersQ.data?.items ?? [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <div className="text-sm text-muted-foreground">Total: {usersQ.data?.total ?? users.length}</div>
      </div>

      <Card className="p-0 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.name ?? "-"}</td>
                    <td className="p-2">{u.email ?? "-"}</td>
                    <td className="p-2">{u.role ?? "-"}</td>
                    <td className="p-2">
                      <div className="flex justify-end">
                        <Link className="underline" href={`/admin/users/${u.id}`}>Manage</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
