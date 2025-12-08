'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { LocationPicker } from '@/components/location-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { ImageUpload } from '@/components/ui/image-upload';

const tourFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().min(10, 'Description is too short'),
  shortDescription: z.string().min(10, 'Short description is required'),
  duration: z.number().min(1, 'Duration is required'),
  maxGroupSize: z.number().min(1, 'Group size is required'),
  difficulty: z.enum(['EASY', 'MODERATE', 'CHALLENGING']),
  price: z.number().min(0, 'Price must be positive'),
  priceDiscount: z.number().min(0).optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  startLocation: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.string(),
    description: z.string(),
  }),
  categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
  isActive: z.boolean().default(true),
  highlights: z.array(z.string()).min(1, 'Add at least one highlight'),
  included: z.array(z.string()).min(1, 'Add at least one inclusion'),
  notIncluded: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  initialData?: Partial<TourFormValues>;
  categories: Array<{ id: string; name: string }>;
}

export function TourForm({ initialData, categories = [] }: TourFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights || ['']);
  const [included, setIncluded] = useState<string[]>(initialData?.included || ['']);
  const [notIncluded, setNotIncluded] = useState<string[]>(initialData?.notIncluded || ['']);
  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || ['']);

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      duration: 1,
      maxGroupSize: 10,
      difficulty: 'MODERATE',
      price: 0,
      images: [],
      startLocation: {
        type: 'Point',
        coordinates: [31.2357, 30.0444], // Default to Cairo
        address: '',
        description: '',
      },
      categoryIds: [],
      isActive: true,
      highlights: [],
      included: [],
      notIncluded: [],
      requirements: [],
      ...initialData,
    },
  });

  const addHighlight = () => setHighlights([...highlights, '']);
  const removeHighlight = (index: number) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setHighlights(newHighlights);
  };

  const addIncluded = () => setIncluded([...included, '']);
  const removeIncluded = (index: number) => {
    const newIncluded = [...included];
    newIncluded.splice(index, 1);
    setIncluded(newIncluded);
  };

  const addNotIncluded = () => setNotIncluded([...notIncluded, '']);
  const removeNotIncluded = (index: number) => {
    const newNotIncluded = [...notIncluded];
    newNotIncluded.splice(index, 1);
    setNotIncluded(newNotIncluded);
  };

  const addRequirement = () => setRequirements([...requirements, '']);
  const removeRequirement = (index: number) => {
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    setRequirements(newRequirements);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  };

  const onSubmit = async (data: TourFormValues) => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        highlights: highlights.filter(h => h.trim() !== ''),
        included: included.filter(i => i.trim() !== ''),
        notIncluded: notIncluded.filter(ni => ni.trim() !== ''),
        requirements: requirements.filter(r => r.trim() !== ''),
      };

      if (initialData?.id) {
        // Update existing tour
        const response = await apiRequest(`/api/tours/${initialData.id}`, 'PATCH', payload);
        if (response.success) {
          toast.success('Tour updated successfully');
          router.push('/admin/tours');
        }
      } else {
        // Create new tour
        const response = await apiRequest('/api/tours', 'POST', payload);
        if (response.success) {
          toast.success('Tour created successfully');
          router.push('/admin/tours');
        }
      }
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Failed to save tour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Tour Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              onBlur={(e) => {
                if (!form.formState.dirtyFields.slug) {
                  form.setValue('slug', generateSlug(e.target.value));
                }
              }}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...form.register('slug')} />
            {form.formState.errors.slug && (
              <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            {...form.register('shortDescription')}
            rows={2}
          />
          {form.formState.errors.shortDescription && (
            <p className="text-sm text-red-500">
              {form.formState.errors.shortDescription.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            rows={4}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              {...form.register('duration', { valueAsNumber: true })}
            />
            {form.formState.errors.duration && (
              <p className="text-sm text-red-500">
                {form.formState.errors.duration.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="maxGroupSize">Max Group Size</Label>
            <Input
              id="maxGroupSize"
              type="number"
              min={1}
              {...form.register('maxGroupSize', { valueAsNumber: true })}
            />
            {form.formState.errors.maxGroupSize && (
              <p className="text-sm text-red-500">
                {form.formState.errors.maxGroupSize.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step={0.01}
              {...form.register('price', { valueAsNumber: true })}
            />
            {form.formState.errors.price && (
              <p className="text-sm text-red-500">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Tour Images</Label>
          <ImageUpload
            value={form.watch('images')}
            onChange={(urls) => form.setValue('images', urls)}
            maxFiles={10}
          />
          {form.formState.errors.images && (
            <p className="text-sm text-red-500">
              {form.formState.errors.images.message}
            </p>
          )}
        </div>

        <div>
          <Label>Start Location</Label>
          <LocationPicker
            value={form.watch('startLocation')}
            onChange={(location) => form.setValue('startLocation', location)}
          />
          {form.formState.errors.startLocation && (
            <p className="text-sm text-red-500">
              {form.formState.errors.startLocation.message}
            </p>
          )}
        </div>

        <div>
          <Label>Categories</Label>
          <MultiSelect
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            value={form.watch('categoryIds')}
            onChange={(values) => form.setValue('categoryIds', values)}
            placeholder="Select categories..."
          />
          {form.formState.errors.categoryIds && (
            <p className="text-sm text-red-500">
              {form.formState.errors.categoryIds.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Highlights</Label>
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={highlight}
                onChange={(e) => {
                  const newHighlights = [...highlights];
                  newHighlights[index] = e.target.value;
                  setHighlights(newHighlights);
                }}
                placeholder={`Highlight ${index + 1}`}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeHighlight(index)}
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addHighlight}
          >
            Add Highlight
          </Button>
        </div>

        <div className="space-y-4">
          <Label>What's Included</Label>
          {included.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newIncluded = [...included];
                  newIncluded[index] = e.target.value;
                  setIncluded(newIncluded);
                }}
                placeholder={`Included item ${index + 1}`}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeIncluded(index)}
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIncluded}
          >
            Add Included Item
          </Button>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch('isActive')}
              onCheckedChange={(checked) => form.setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData?.id ? (
            'Update Tour'
          ) : (
            'Create Tour'
          )}
        </Button>
      </div>
    </form>
  );
}
