import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import ContentManager from '@/components/admin/ContentManager';

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

const validPages: string[] = [];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  
  if (!validPages.includes(page)) {
    return {
      title: 'Page Not Found | Dashboard',
    };
  }

  const pageTitle = page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
  
  return {
    title: `${pageTitle} Settings | Dashboard`,
    description: `Manage ${pageTitle.toLowerCase()} content, media, and settings`,
  };
}

export default async function PageSettingsPage({ params }: PageProps) {
  const { page } = await params;
  
  // Validate page parameter
  if (!validPages.includes(page)) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ContentManager page={page} />
    </div>
  );
}

export async function generateStaticParams() {
  return validPages.map((page) => ({
    page,
  }));
}
