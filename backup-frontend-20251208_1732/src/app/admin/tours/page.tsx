"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default function AdminToursListPage() {
  const qc = useQueryClient();

  const toursQ = useQuery({
    queryKey: ["admin","tours","list"],
    queryFn: async () => {
      const data = await fetchJSON<any>("/api/tours");
      const items = Array.isArray(data) ? data : data?.items || [];
      const total = data?.total ?? items.length;
      return { items, total };
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tours/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete tour");
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin","tours","list"] });
    }
  });

  if (toursQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]"><Loader2 className="h-6 w-6 animate-spin"/></div>
    );
  }

  if (toursQ.isError) {
    return <div className="p-4 text-red-600">Failed to load tours.</div>;
  }

  const tours = toursQ.data?.items ?? [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tours</h1>
        <Link href="/admin/tours/new"><Button size="sm"><Plus className="h-4 w-4 mr-2"/>New Tour</Button></Link>
      </div>

      <Card className="p-0 overflow-hidden">
        {tours.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No tours found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((t: any) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-2">{t.title ?? "-"}</td>
                    <td className="p-2">{t.category?.name ?? t.category ?? "-"}</td>
                    <td className="p-2">{t.price != null ? `$${t.price}` : "-"}</td>
                    <td className="p-2">{t.published ? "Published" : "Draft"}</td>
                    <td className="p-2">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/tours/${t.id}`}><Button variant="outline" size="icon"><Pencil className="h-4 w-4"/></Button></Link>
                        <Button variant="destructive" size="icon" onClick={() => {
                          if (confirm("Delete this tour?")) deleteMut.mutate(t.id);
                        }} disabled={deleteMut.isLoading}>
                          {deleteMut.isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                        </Button>
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
