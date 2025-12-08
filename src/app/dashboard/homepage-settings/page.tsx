"use client";
export const dynamic = "force-dynamic";

import HomepageSettings from '@/components/admin/HomepageSettings';

export default function HomepageSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Homepage Settings</h1>
        <p className="text-muted-foreground">Manage your homepage content and sections</p>
      </div>
      <HomepageSettings />
    </div>
  );
} 