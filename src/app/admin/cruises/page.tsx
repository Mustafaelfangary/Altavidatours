"use client";
export const dynamic = "force-dynamic";

import { CruiseManager } from '@/components/admin/cruise-manager';
import { DashboardLayout } from '@/components/admin/dashboard-layout';

export default function CruisesPage() {
  return (
    <DashboardLayout>
      <CruiseManager />
    </DashboardLayout>
  );
} 