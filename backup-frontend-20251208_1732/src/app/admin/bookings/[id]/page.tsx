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

export default function AdminBookingDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const router = useRouter();
  const qc = useQueryClient();

  const bookingQ = useQuery({
    queryKey: ["admin","bookings","detail", id],
    queryFn: () => fetchJSON(`/api/bookings/${id}`),
    enabled: !!id,
  });

  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin","bookings","detail", id] });
      qc.invalidateQueries({ queryKey: ["admin","bookings","list"] });
    }
  });

  if (bookingQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]"><Loader2 className="h-6 w-6 animate-spin"/></div>
    );
  }

  if (bookingQ.isError) {
    return <div className="p-4 text-red-600">Failed to load booking.</div>;
  }

  const b = bookingQ.data as any;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Booking Detail</h1>
        <Button variant="outline" onClick={() => router.push("/admin/bookings")}>Back</Button>
      </div>

      <Card className="p-4 space-y-2">
        <div><span className="text-muted-foreground">ID:</span> {b.id}</div>
        <div><span className="text-muted-foreground">Customer:</span> {b.customerName ?? b.user?.name ?? "-"}</div>
        <div><span className="text-muted-foreground">Email:</span> {b.user?.email ?? "-"}</div>
        <div><span className="text-muted-foreground">Tour:</span> {b.tour?.title ?? b.tourTitle ?? "-"}</div>
        <div><span className="text-muted-foreground">Status:</span> {b.status ?? "-"}</div>
        <div><span className="text-muted-foreground">Created:</span> {b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</div>
        {b.totalAmount != null && <div><span className="text-muted-foreground">Amount:</span> ${b.totalAmount}</div>}
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-2">Update Status</h2>
        <div className="flex gap-2 flex-wrap">
          {['PENDING','CONFIRMED','CANCELLED','REFUNDED','COMPLETED'].map(s => (
            <Button key={s} variant={b.status === s ? 'default' : 'outline'} size="sm" onClick={() => updateStatus.mutate(s)} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : s}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
