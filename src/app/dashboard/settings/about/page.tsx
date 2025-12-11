import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AboutSettingsClient from './AboutSettingsClient';

export const metadata: Metadata = {
  title: 'About Settings | Dashboard',
  description: 'Manage about page content, team members, and settings',
};

export default async function AboutSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About Page Settings</h1>
        <p className="text-gray-600">
          Manage all content for the about page including hero section, team members, and company information.
        </p>
      </div>
      
      <AboutSettingsClient />
    </div>
  );
}


