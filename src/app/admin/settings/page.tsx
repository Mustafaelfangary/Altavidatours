"use client";
export const dynamic = "force-dynamic";

import { DashboardLayout } from '@/components/admin/dashboard-layout';
import { SettingsManagement } from '@/components/dashboard/SettingsManagement';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <SettingsManagement />
    </DashboardLayout>
  );
} 