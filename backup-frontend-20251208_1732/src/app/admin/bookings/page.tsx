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

export default function AdminBookingsListPage() {
  const bookingsQ = useQuery({
    queryKey: ["admin","bookings","list"],
    queryFn: async () => {
      const data = await fetchJSON<any>("/api/bookings");
      const items = Array.isArray(data) ? data : data?.items || [];
      const total = data?.total ?? items.length;
      return { items, total };
    },
  });

  if (bookingsQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]"><Loader2 className="h-6 w-6 animate-spin"/></div>
    );
  }

  if (bookingsQ.isError) {
    return <div className="p-4 text-red-600">Failed to load bookings.</div>;
  }

  const bookings = bookingsQ.data?.items ?? [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bookings</h1>
        <div className="text-sm text-muted-foreground">Total: {bookingsQ.data?.total ?? bookings.length}</div>
      </div>

      <Card className="p-0 overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2">Customer</th>
                  <th className="p-2">Tour</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr key={b.id} className="border-t">
                    <td className="p-2">{b.customerName ?? b.user?.name ?? "-"}</td>
                    <td className="p-2">{b.tour?.title ?? b.tourTitle ?? "-"}</td>
                    <td className="p-2">{b.status ?? "-"}</td>
                    <td className="p-2">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                    <td className="p-2">
                      <div className="flex justify-end">
                        <Link className="underline" href={`/admin/bookings/${b.id}`}>View</Link>
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
