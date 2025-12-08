'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Page, PageStatus } from '@prisma/client';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const columns = [
    {
      accessorKey: 'title' as const,
      header: 'Title',
    },
    {
      accessorKey: 'slug' as const,
      header: 'Slug',
    },
    {
      accessorKey: 'status' as const,
      header: 'Status',
      cell: ({ row }: { row: { original: Page } }) => {
        const status = row.original.status;
        const variant = status === PageStatus.PUBLISHED ? 'default' : 'secondary';
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant === 'default' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{status}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Page } }) => {
        const page = row.original;

        const deletePage = async (id: string) => {
          try {
            const res = await fetch(`/api/dashboard/pages/${id}`, {
              method: 'DELETE',
            });

            if (!res.ok) {
              throw new Error('Failed to delete page');
            }

            toast.success('Page deleted successfully');
            router.refresh();
          } catch (error) {
            toast.error('Failed to delete page');
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/pages/${page.id}/edit`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deletePage(page.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/dashboard/pages');
        if (!res.ok) {
          throw new Error('Failed to fetch pages');
        }
        const data = await res.json();
        setPages(data);
      } catch (error) {
        toast.error('Failed to fetch pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Button onClick={() => router.push('/dashboard/pages/new')}>
          New Page
        </Button>
      </div>
      <DataTable columns={columns} data={pages} />
    </div>
  );
}