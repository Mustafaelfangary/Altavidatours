"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

const TourForm = dynamic(
  () => import("@/components/forms/TourForm").then((m) => m.TourForm),
  { ssr: false }
);

export default function AdminNewTourPage() {
  const router = useRouter();

  // Creation is handled internally by TourForm; this page simply renders the form.

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Tour</h1>
        <Button variant="outline" onClick={() => router.push("/admin/tours")}>Cancel</Button>
      </div>
      <Card className="p-4">
        <TourForm />
      </Card>
    </div>
  );
}
