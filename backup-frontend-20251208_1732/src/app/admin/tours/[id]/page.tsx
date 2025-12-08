"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TourForm = dynamic(
  () => import("@/components/forms/TourForm").then((m) => m.TourForm),
  { ssr: false }
);

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default function AdminEditTourPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const router = useRouter();
  const qc = useQueryClient();

  const tourQ = useQuery({
    queryKey: ["admin","tours","detail", id],
    queryFn: () => fetchJSON(`/api/tours/${id}`),
    enabled: !!id,
  });

  const updateMut = useMutation({
    mutationFn: async (values: any) => {
      const res = await fetch(`/api/tours/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update tour");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin","tours","list"] });
      router.push("/admin/tours");
    },
  });

  if (tourQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]"><Loader2 className="h-6 w-6 animate-spin"/></div>
    );
  }

  if (tourQ.isError) {
    return <div className="p-4 text-red-600">Failed to load tour.</div>;
  }

  const data = tourQ.data as any;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Tour</h1>
        <Button variant="outline" onClick={() => router.push("/admin/tours")}>Back</Button>
      </div>
      <Card className="p-4">
        <TourForm
          defaultValues={data}
          onSubmit={(values: any) => updateMut.mutate(values)}
          isSubmitting={updateMut.isLoading}
        />
        {updateMut.isLoading && (
          <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin"/> Saving changes...
          </div>
        )}
      </Card>
    </div>
  );
}
