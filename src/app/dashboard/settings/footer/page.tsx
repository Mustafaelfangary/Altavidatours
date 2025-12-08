import { Suspense } from 'react';
import FooterSettingsClient from './FooterSettingsClient';

export default function FooterSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Footer Settings</h1>
          <p className="text-gray-600 mt-2">
            Customize your website footer content, links, social media, and branding
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <FooterSettingsClient />
      </Suspense>
    </div>
  );
}
