'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PackageForm from '@/components/admin/PackageForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface EditPackageClientProps {
  packageData: any;
  dahabiyas: Array<{
    id: string;
    name: string;
    pricePerDay: number;
  }>;
}

export default function EditPackageClient({ packageData, dahabiyas }: EditPackageClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/packages/${packageData.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/packages');
      } else {
        alert('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card className="p-4 bg-white/80 border-nile-blue/20">
        <div className="flex justify-between items-center">
          <Link href="/dashboard/packages">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Packages
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-ancient-stone">Package ID</p>
              <p className="font-mono text-sm text-nile-blue">{packageData.id}</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Package'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Package Form */}
      <PackageForm 
        initialData={packageData}
        dahabiyas={dahabiyas}
        isEditing={true}
      />
    </div>
  );
}
