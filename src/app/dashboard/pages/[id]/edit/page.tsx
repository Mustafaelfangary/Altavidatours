// This is a comment to force a refresh
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Page, PageStatus } from '@prisma/client';
import { toast } from 'sonner';
import ContentBlockManager from '@/components/admin/ContentBlockManager';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.nativeEnum(PageStatus),
});

export default function PageEdit() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<Page | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      status: PageStatus.DRAFT,
    },
  });

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/dashboard/pages/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch page');
        }
        const data = await response.json();
        setPage(data);
        form.reset(data);
      } catch (error) {
        console.error('Error fetching page:', error);
      }
    };
    fetchPage();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/pages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to update page');
      }

      toast.success('Page updated successfully');
      router.push('/dashboard/pages');
    } catch (error) {
      toast.error('Failed to update page');
    } finally {
      setLoading(false);
    }
  };

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Edit Page</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter page title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter page slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PageStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={PageStatus.PUBLISHED}>Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Page'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Content Blocks</h2>
        <ContentBlockManager pageId={id} />
      </div>
    </div>
  );
}