"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

async function deleteDahabiya(id: string) {
  await fetch(`/api/dahabiyat/${id}`, { method: 'DELETE' });
}

type Dahabiya = {
  id: string;
  name: string;
  description: string;
  pricePerDay: number | string;
  capacity: number | string;
  rating: number | string;
  images: { url: string }[];
};

type DahabiyaActionsProps = {
  id: string;
  onDeleted?: () => void;
};

function DahabiyaActions({ id, onDeleted }: DahabiyaActionsProps) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="destructive"
      className="w-full"
      disabled={loading}
      onClick={async () => {
        if (!confirm('Are you sure you want to delete this dahabiya?')) return;
        setLoading(true);
        await deleteDahabiya(id);
        setLoading(false);
        if (onDeleted) onDeleted();
      }}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  );
}

interface DahabiyatDashboardClientProps {
  dahabiyat: Dahabiya[];
}

export default function DahabiyatDashboardClient({ dahabiyat }: DahabiyatDashboardClientProps) {
  const [migrating, setMigrating] = useState(false);

  // Convert Decimal values to numbers
  const serializedDahabiyat = dahabiyat.map(dahabiya => ({
    ...dahabiya,
    pricePerDay: Number(dahabiya.pricePerDay),
    capacity: Number(dahabiya.capacity),
    rating: Number(dahabiya.rating)
  }));

  const handleMigration = async () => {
    if (!confirm('This will migrate the 4 static dahabiya pages (Azhar, Princess, Queen, Royal Cleopatra) to the database. Continue?')) {
      return;
    }

    setMigrating(true);
    try {
      const response = await fetch('/api/admin/migrate-dahabiyas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        alert(`Migration completed! ${result.results.filter((r: any) => r.status === 'created').length} dahabiyas created.`);
        window.location.reload();
      } else {
        alert(`Migration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed. Check console for details.');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Dahabiyat</h1>
        <div className="flex gap-3">
          {serializedDahabiyat.length === 0 && (
            <Button
              onClick={handleMigration}
              disabled={migrating}
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              {migrating ? 'Migrating...' : 'Import Static Dahabiyas'}
            </Button>
          )}
          <Link href="/dashboard/dahabiyat/new">
            <Button>Add New Dahabiya</Button>
          </Link>
        </div>
      </div>

      {serializedDahabiyat.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">No Dahabiyas Found</h3>
            <p className="text-gray-600 mb-6">
              It looks like you don't have any dahabiyas in the database yet.
              You can import the existing static dahabiya pages or create new ones.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleMigration}
                disabled={migrating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {migrating ? 'Importing...' : 'Import Static Dahabiyas'}
              </Button>
              <Link href="/dashboard/dahabiyat/new">
                <Button variant="outline" className="w-full">
                  Create New Dahabiya
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serializedDahabiyat.map((dahabiya) => (
            <Card key={dahabiya.id}>
              <div className="relative h-48">
                <Image
                  src={dahabiya.images[0]?.url || '/placeholder.jpg'}
                  alt={dahabiya.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{dahabiya.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{dahabiya.description}</p>
                <div className="flex gap-2">
                  <Link href={`/dashboard/dahabiyat/${dahabiya.id}/edit`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/dahabiyat/${dahabiya.id}`} className="flex-1">
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <div className="flex-1">
                    <DahabiyaActions id={dahabiya.id} onDeleted={() => window.location.reload()} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 

