'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContentList } from '@/components/admin/content/ContentList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { getContentModel } from '@/lib/content-models';

export default function ContentModelPage({ params }: { params: { modelId: string } }) {
  const { modelId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/auth/signin?callbackUrl=/admin/content/${modelId}`);
      return;
    }

    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    // Load the content model
    const contentModel = getContentModel(modelId);
    if (!contentModel) {
      router.push('/admin/content');
      return;
    }

    setModel(contentModel);
    setIsAuthorized(true);
    setIsLoading(false);
  }, [session, status, router, modelId]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-blue-50 to-navy-blue-100">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Loading content model...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized || !model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-navy-blue-100">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {!model ? 'Content Model Not Found' : 'Access Denied'}
            </h2>
            <p className="text-gray-600 mb-4">
              {!model 
                ? 'The requested content model does not exist.'
                : 'You need administrator or manager privileges to access this content.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => router.push('/admin/content')}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Content
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-blue-50 to-navy-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{model.name} Management</h1>
            <p className="text-gray-600">
              Manage your {model.name.toLowerCase()} content
              {model.description && ` - ${model.description}`}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/content')}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Models
            </Button>
            <Button
              onClick={() => router.push(`/admin/content/${modelId}/new`)}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {model.name}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ContentList modelId={modelId} />
        </div>
      </div>
    </div>
  );
}
