'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Itinerary } from '@prisma/client';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const columns = [
    {
      accessorKey: 'name' as const,
      header: 'Name',
    },
    {
      accessorKey: 'description' as const,
      header: 'Description',
    },
    {
      accessorKey: 'durationDays' as const,
      header: 'Duration (Days)',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Itinerary } }) => {
        const itinerary = row.original;

        const deleteItinerary = async (id: string) => {
          try {
            const res = await fetch(`/api/dashboard/itineraries/${id}`, {
              method: 'DELETE',
            });

            if (!res.ok) {
              throw new Error('Failed to delete itinerary');
            }

            toast.success('Itinerary deleted successfully');
            router.refresh();
          } catch (error) {
            toast.error('Failed to delete itinerary');
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/itineraries/${itinerary.id}/edit`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteItinerary(itinerary.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await fetch('/api/dashboard/itineraries');
        if (!res.ok) {
          throw new Error('Failed to fetch itineraries');
        }
        const data = await res.json();
        setItineraries(data);
      } catch (error) {
        toast.error('Failed to fetch itineraries');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Itineraries</h1>
        <Button onClick={() => router.push('/dashboard/itineraries/new')}>
          New Itinerary
        </Button>
      </div>
      <DataTable columns={columns} data={itineraries} />
    </div>
  );
}

