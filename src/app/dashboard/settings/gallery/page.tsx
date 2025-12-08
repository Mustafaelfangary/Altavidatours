import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GallerySettingsClient from './GallerySettingsClient';

export const metadata: Metadata = {
  title: 'Gallery Settings | Dashboard',
  description: 'Manage gallery page content and image categories',
};

export default async function GallerySettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🖼️ Gallery Settings</h1>
        <p className="text-gray-600">
          Manage gallery page content, image categories, and display settings.
        </p>
      </div>
      
      <GallerySettingsClient />
    </div>
  );
}

