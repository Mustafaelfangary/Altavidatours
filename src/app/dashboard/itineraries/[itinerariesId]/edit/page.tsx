'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Itinerary, Image } from '@prisma/client';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';
import ItineraryDayManager from '@/components/admin/ItineraryDayManager';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  durationDays: z.coerce.number().int().min(1, 'Duration is required'),
  imageId: z.string().optional(),
  imageUrl: z.string().optional(),
});

export default function EditItineraryForm() {
  const router = useRouter();
  const { itinerariesId } = useParams() as { itinerariesId: string };
  const id = itinerariesId;
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<(Itinerary & { image: Image | null }) | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      durationDays: 1,
    },
  });

  useEffect(() => {
    if (id) {
      const fetchItinerary = async () => {
        try {
          const res = await fetch(`/api/dashboard/itineraries/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch itinerary');
          }
          const data = await res.json();
          setItinerary(data);
          form.reset({
            ...data,
            imageId: data.image?.id,
            imageUrl: data.image?.url,
          });
        } catch (error) {
          toast.error('Failed to fetch itinerary');
        }
      };
      fetchItinerary();
    }
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/itineraries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to update itinerary');
      }

      toast.success('Itinerary updated successfully');
      router.push('/dashboard/itineraries');
    } catch (error) {
      toast.error('Failed to update itinerary');
    } finally {
      setLoading(false);
    }
  };

  if (!itinerary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Itinerary</h1>
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={itinerary?.image ? [{ url: itinerary.image.url, alt: itinerary.image.alt || "" }] : []}
                    onChange={(newImages) => {
                      const newImage = newImages?.[0];
                      form.setValue('imageUrl', newImage?.url);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Itinerary'}
          </Button>
        </form>
      </Form>
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Itinerary Days</h2>
        <ItineraryDayManager itineraryId={id as string} />
      </div>
    </div>
  );
}