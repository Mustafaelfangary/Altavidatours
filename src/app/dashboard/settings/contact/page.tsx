import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ContactSettingsClient from './ContactSettingsClient';

export const metadata: Metadata = {
  title: 'Contact Settings | Dashboard',
  description: 'Manage contact page content and information',
};

export default async function ContactSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Page Settings</h1>
        <p className="text-gray-600">
          Manage all content for the contact page including contact information, business hours, and form settings.
        </p>
      </div>
      
      <ContactSettingsClient />
    </div>
  );
}


