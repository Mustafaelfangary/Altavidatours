"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from '@/components/admin/dashboard-layout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <DashboardOverview />
    </DashboardLayout>
  );
} 

