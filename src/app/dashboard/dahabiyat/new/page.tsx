"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dynamically import the form to avoid SSR issues with uploadthing
const DahabiyaForm = dynamic(() => import("@/components/admin/DahabiyaForm"), {
  ssr: false,
});

export default function NewDahabiyaPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Add New Dahabiya</h1>
        <Link href="/dashboard/dahabiyat">
          <Button variant="secondary">Back to Dahabiyat</Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <DahabiyaForm />
      </div>
    </div>
  );
}


