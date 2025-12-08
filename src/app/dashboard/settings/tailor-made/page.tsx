import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TailorMadeSettingsClient from './TailorMadeSettingsClient';

export const metadata: Metadata = {
  title: 'Tailor-Made Settings | Dashboard',
  description: 'Manage tailor-made page content and features',
};

export default async function TailorMadeSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tailor-Made Page Settings</h1>
        <p className="text-gray-600">
          Manage all content for the tailor-made page including features, process steps, and call-to-action sections.
        </p>
      </div>
      
      <TailorMadeSettingsClient />
    </div>
  );
}
