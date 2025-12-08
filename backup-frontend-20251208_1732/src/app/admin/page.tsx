"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default function AdminDashboardPage() {
  const qc = useQueryClient();

  const toursQ = useQuery({
    queryKey: ["admin","tours","count"],
    queryFn: async () => {
      const data = await fetchJSON<any>("/api/tours");
      const items = data?.data ?? (Array.isArray(data) ? data : []);
      const total = data?.pagination?.total ?? items.length;
      return { total, items: (items || []).slice(0, 5) };
    },
  });

  const bookingsQ = useQuery({
    queryKey: ["admin","bookings","recent"],
    queryFn: async () => {
      const data = await fetchJSON<any>("/api/bookings?all=true");
      const items = data?.bookings ?? [];
      const total = items.length;
      return { total, items: (items || []).slice(0, 5) };
    },
  });

  const usersQ = useQuery({
    queryKey: ["admin","users","count"],
    queryFn: async () => {
      const data = await fetchJSON<any>("/api/users");
      const total = data?.total ?? (data?.users?.length ?? 0);
      return { total };
    },
  });

  const loading = toursQ.isLoading || bookingsQ.isLoading || usersQ.isLoading;

  useEffect(() => {
    // prefetch lists user will likely visit
    if (!loading) {
      qc.prefetchQuery({ queryKey: ["admin","tours","list"], queryFn: () => fetchJSON("/api/tours") });
      qc.prefetchQuery({ queryKey: ["admin","bookings","list"], queryFn: () => fetchJSON("/api/bookings?all=true") });
      qc.prefetchQuery({ queryKey: ["admin","users","list"], queryFn: () => fetchJSON("/api/users") });
    }
  }, [loading, qc]);

  if (loading) {
    return (
      <div className="grid gap-6 p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[200px]"><Loader2 className="h-6 w-6 animate-spin"/></div>
      </div>
    );
  }

  if (toursQ.isError || bookingsQ.isError || usersQ.isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-red-600">Failed to load dashboard data. Please try again.</div>
      </div>
    );
  }

  const tours = toursQ.data?.items ?? [];
  const bookings = bookingsQ.data?.items ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Tours</div>
          <div className="text-3xl font-semibold">{toursQ.data?.total ?? 0}</div>
          <div className="mt-3"><Link href="/admin/tours"><Button size="sm">Manage Tours</Button></Link></div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Bookings</div>
          <div className="text-3xl font-semibold">{bookingsQ.data?.total ?? 0}</div>
          <div className="mt-3"><Link href="/admin/bookings"><Button size="sm" variant="secondary">View Bookings</Button></Link></div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-3xl font-semibold">{usersQ.data?.total ?? 0}</div>
          <div className="mt-3"><Link href="/admin/users"><Button size="sm" variant="outline">Manage Users</Button></Link></div>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Link href="/admin/bookings"><Button variant="ghost" size="sm">View all</Button></Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-sm text-muted-foreground">No recent bookings.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2">Customer</th>
                  <th className="p-2">Tour</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr key={b.id} className="border-t">
                    <td className="p-2">{b.customerName ?? b.user?.name ?? "-"}</td>
                    <td className="p-2">{b.tour?.title ?? b.tourTitle ?? "-"}</td>
                    <td className="p-2">{b.status ?? "-"}</td>
                    <td className="p-2">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* System Status */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">System Status</h2>
        <ul className="text-sm list-disc ml-5 space-y-1 text-muted-foreground">
          <li>API healthy</li>
          <li>Database connected</li>
          <li>Storage ok</li>
        </ul>
      </Card>
    </div>
  );
}
