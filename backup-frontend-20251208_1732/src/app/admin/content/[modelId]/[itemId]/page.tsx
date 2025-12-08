'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContentItemForm } from '@/components/admin/content/ContentItemForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getContentModel } from '@/lib/content-models';

export default function EditContentItemPage({ 
  params 
}: { 
  params: { modelId: string; itemId: string } 
}) {
  const { modelId, itemId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/auth/signin?callbackUrl=/admin/content/${modelId}/${itemId}`);
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
      setError('Content model not found');
      setIsLoading(false);
      return;
    }

    // Load the content item
    const loadItem = async () => {
      try {
        const response = await fetch(`/api/admin/content/${modelId}/${itemId}`);
        if (!response.ok) {
          throw new Error('Failed to load content item');
        }
        const data = await response.json();
        setItem(data);
        setModel(contentModel);
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error loading content item:', err);
        setError('Failed to load content item');
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [session, status, router, modelId, itemId]);

  const handleSuccess = () => {
    router.push(`/admin/content/${modelId}`);
  };

  const handleCancel = () => {
    router.push(`/admin/content/${modelId}`);
  };

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-blue-50 to-navy-blue-100">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Loading content item...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-navy-blue-100">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => router.push(`/admin/content/${modelId}`)}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {model?.name || 'Content'}
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

  if (!isAuthorized || !model || !item) {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/content/${modelId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {model.name} List
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit {model.name}
          </h1>
          <p className="text-gray-600">
            Update the {model.name.toLowerCase()} details below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ContentItemForm 
            modelId={modelId}
            itemId={itemId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
