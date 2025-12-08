import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ContentManager from '@/components/admin/ContentManager';

export const metadata: Metadata = {
  title: 'Website Settings | Dashboard',
  description: 'Manage website content, media, and settings',
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ContentManager />
    </div>
  );
}