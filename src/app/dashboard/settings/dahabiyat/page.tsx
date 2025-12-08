import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DahabiyatSettingsClient from './DahabiyatSettingsClient';

export const metadata: Metadata = {
  title: 'Dahabiyat Page Settings | Dashboard',
  description: 'Manage dahabiyat page content and sections',
};

export default async function DahabiyatSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dahabiyat Page Settings</h1>
        <p className="text-gray-600">
          Manage all content for the dahabiyat page including hero section, fleet information, and experience details.
        </p>
      </div>
      
      <DahabiyatSettingsClient />
    </div>
  );
}
