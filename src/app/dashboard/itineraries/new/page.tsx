'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  durationDays: z.coerce.number().int().min(1, 'Duration is required'),
  imageId: z.string().optional(),
});

export default function NewItineraryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      durationDays: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to create itinerary');
      }

      toast.success('Itinerary created successfully');
      router.push('/dashboard/itineraries');
    } catch (error) {
      toast.error('Failed to create itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">New Itinerary</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter itinerary name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter itinerary description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Days)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter duration in days" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={
                      typeof field.value === "string" && field.value
                        ? [{ url: field.value, alt: "" }]
                        : Array.isArray(field.value)
                          ? field.value
                          : []
                    }
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Itinerary'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

