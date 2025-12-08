"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const router = useRouter();
  const qc = useQueryClient();

  const userQ = useQuery({
    queryKey: ["admin","users","detail", id],
    queryFn: () => fetchJSON(`/api/users/${id}`),
    enabled: !!id,
  });

  const roleMut = useMutation({
    mutationFn: async (role: string) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin","users","detail", id] });
      qc.invalidateQueries({ queryKey: ["admin","users","list"] });
    }
  });

  if (userQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]"><Loader2 className="h-6 w-6 animate-spin"/></div>
    );
  }

  if (userQ.isError) {
    return <div className="p-4 text-red-600">Failed to load user.</div>;
  }

  const u = userQ.data as any;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">User Detail</h1>
        <Button variant="outline" onClick={() => router.push("/admin/users")}>Back</Button>
      </div>

      <Card className="p-4 space-y-2">
        <div><span className="text-muted-foreground">ID:</span> {u.id}</div>
        <div><span className="text-muted-foreground">Name:</span> {u.name ?? "-"}</div>
        <div><span className="text-muted-foreground">Email:</span> {u.email ?? "-"}</div>
        <div><span className="text-muted-foreground">Role:</span> {u.role ?? "-"}</div>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-2">Update Role</h2>
        <div className="flex gap-2 flex-wrap">
          {['ADMIN','MANAGER','GUIDE','USER'].map(r => (
            <Button key={r} variant={u.role === r ? 'default' : 'outline'} size="sm" onClick={() => roleMut.mutate(r)} disabled={roleMut.isLoading}>
              {roleMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : r}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
