import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HomepageSettingsClient from './HomepageSettingsClient';

export const metadata: Metadata = {
  title: 'Homepage Settings | Dashboard',
  description: 'Manage homepage content, media, and settings',
};

export default async function HomepageSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-nile-blue">🏠 Homepage Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your homepage content, images, and sections
        </p>
      </div>
      <HomepageSettingsClient />
    </div>
  );
}


