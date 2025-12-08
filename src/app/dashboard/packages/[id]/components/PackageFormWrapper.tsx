"use client";

import dynamic from "next/dynamic";

const PackageForm = dynamic(() => import("@/components/admin/PackageForm"), {
  ssr: false,
});

export default function PackageFormWrapper() {
  return <PackageForm />;
}
