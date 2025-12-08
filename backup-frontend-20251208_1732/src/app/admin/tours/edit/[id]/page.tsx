'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Image as ImageIcon, MapPin, Calendar, Clock, Users, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Map from '@/components/ui/Map';

// Reuse the schema from the new tour page
const tourFormSchema = z.object({
  id: z.string(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  duration: z.string().min(1, 'Duration is required'),
  maxGroupSize: z.number().min(1, 'Group size must be at least 1'),
  difficulty: z.enum(['easy', 'medium', 'difficult']),
  price: z.number().min(0, 'Price cannot be negative'),
  priceDiscount: z.number().min(0, 'Discount cannot be negative').optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  startLocation: z.object({
    description: z.string().min(5, 'Location description is required'),
    address: z.string().min(5, 'Address is required'),
    coordinates: z.tuple([z.number(), z.number()])
  }),
  locations: z.array(z.object({
    description: z.string().min(5, 'Location description is required'),
    day: z.number().min(1, 'Day must be at least 1'),
    coordinates: z.tuple([z.number(), z.number()])
  })).min(1, 'At least one location is required'),
  startDates: z.array(z.string()).min(1, 'At least one start date is required'),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).optional(),
  guides: z.array(z.string()).optional(),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

// Mock data for guides (replace with actual API call)
const mockGuides = [
  { id: '1', name: 'Ahmed Hassan', email: 'ahmed@example.com' },
  { id: '2', name: 'Mohamed Ali', email: 'mohamed@example.com' },
  { id: '3', name: 'Fatima Mahmoud', email: 'fatima@example.com' },
];

// Mock categories (replace with actual categories from your database)
const categories = [
  'Adventure', 'Cultural', 'Luxury', 'Family', 'Historical', 'Nature', 'Food & Drink', 'Photography'
];

export default function EditTourPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [availableGuides, setAvailableGuides] = useState(mockGuides);
  const [selectedGuides, setSelectedGuides] = useState<Array<{ id: string; name: string }>>([]);
  const [searchGuide, setSearchGuide] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      id: id as string,
      difficulty: 'medium',
      startLocation: {
        description: '',
        address: '',
        coordinates: [31.2357, 30.0444] // Default to Cairo
      },
      locations: [],
      startDates: [],
      isActive: true,
      images: [],
      categories: [],
      tags: [],
      guides: []
    }
  });

  const locations = watch('locations') || [];
  const startDates = watch('startDates') || [];
  const images = watch('images') || [];
  const currentCategories = watch('categories') || [];
  const currentTags = watch('tags') || [];

  // Load tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        // const response = await fetch(`/api/admin/tours/${id}`);
        // const data = await response.json();
        
        // Mock data - replace with actual data from API
        const mockTourData = {
          id,
          title: 'Pyramids of Giza & Sphinx',
          slug: 'pyramids-giza-sphinx',
          duration: '4 hours',
          maxGroupSize: 20,
          difficulty: 'easy',
          price: 75,
          priceDiscount: 65,
          summary: 'Explore the ancient wonders of Egypt',
          description: 'Full description of the tour...',
          startLocation: {
            description: 'Giza Plateau, Cairo',
            address: 'Al Haram, Giza Governorate, Egypt',
            coordinates: [31.1325, 29.9753]
          },
          locations: [
            {
              description: 'Great Pyramid of Giza',
              day: 1,
              coordinates: [31.1325, 29.9753]
            },
            {
              description: 'Sphinx',
              day: 1,
              coordinates: [31.1375, 29.9752]
            }
          ],
          startDates: [
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          ],
          isActive: true,
          images: [
            '/images/tours/pyramids-1.jpg',
            '/images/tours/pyramids-2.jpg'
          ],
          categories: ['Cultural', 'Historical'],
          tags: ['popular', 'family-friendly'],
          guides: ['1', '2']
        };

        // Set form values
        reset(mockTourData);
        setImagePreviews(mockTourData.images);
        setSelectedCategories(mockTourData.categories);
        
        // Set selected guides
        const guides = mockGuides.filter(guide => 
          mockTourData.guides?.includes(guide.id)
        );
        setSelectedGuides(guides);
        
      } catch (error) {
        console.error('Error fetching tour:', error);
        toast.error('Failed to load tour data');
        router.push('/admin/tours');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id, router, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImageFiles = Array.from(files);
    setImageFiles([...imageFiles, ...newImageFiles]);

    // Create preview URLs
    const newImagePreviews = newImageFiles.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...imagePreviews, ...newImagePreviews];
    setImagePreviews(updatedPreviews);
    setValue('images', updatedPreviews);
  };

  const removeImage = (index: number) => {
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];
    
    newImageFiles.splice(index, 1);
    newImagePreviews.splice(index, 1);
    
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
    setValue('images', newImagePreviews);
  };

  const addLocation = () => {
    if (!newLocation.trim()) return;
    
    const newLocations = [...locations, {
      description: newLocation,
      day: locations.length + 1,
      coordinates: [0, 0] as [number, number]
    }];
    
    setValue('locations', newLocations);
    setNewLocation('');
  };

  const removeLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setValue('locations', newLocations);
  };

  const addStartDate = () => {
    if (!newDate) return;
    
    const newDates = [...startDates, newDate];
    setValue('startDates', newDates);
    setNewDate('');
  };

  const removeStartDate = (index: number) => {
    const newDates = [...startDates];
    newDates.splice(index, 1);
    setValue('startDates', newDates);
  };

  const toggleCategory = (category: string) => {
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    setSelectedCategories(newCategories);
    setValue('categories', newCategories);
  };

  const addTag = () => {
    if (!newTag.trim() || currentTags.includes(newTag.trim())) return;
    
    const updatedTags = [...currentTags, newTag.trim()];
    setValue('tags', updatedTags);
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setValue('tags', updatedTags);
  };

  const addGuide = (guide: { id: string; name: string }) => {
    if (!selectedGuides.some(g => g.id === guide.id)) {
      const updatedGuides = [...selectedGuides, guide];
      setSelectedGuides(updatedGuides);
      setValue('guides', updatedGuides.map(g => g.id));
    }
  };

  const removeGuide = (guideId: string) => {
    const updatedGuides = selectedGuides.filter(g => g.id !== guideId);
    setSelectedGuides(updatedGuides);
    setValue('guides', updatedGuides.map(g => g.id));
  };

  const filteredGuides = availableGuides.filter(
    guide =>
      guide.name.toLowerCase().includes(searchGuide.toLowerCase()) ||
      guide.email.toLowerCase().includes(searchGuide.toLowerCase())
  );

  const onSubmit = async (data: TourFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload new images to a server first
      // and then submit the form with the updated image URLs
      
      // Example API call:
      // const formData = new FormData();
      // imageFiles.forEach((file) => {
      //   formData.append('images', file);
      // });
      // const uploadResponse = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const { imageUrls } = await uploadResponse.json();
      
      // const tourData = {
      //   ...data,
      //   images: [...data.images, ...imageUrls],
      // };
      
      // const response = await fetch(`/api/admin/tours/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(tourData),
      // });
      
      // if (!response.ok) throw new Error('Failed to update tour');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Tour updated successfully!');
      router.push('/admin/tours');
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Tour</h1>
          <p className="text-muted-foreground">
            Update the details of this tour
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the basic details about your tour
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Pyramids of Giza & Sphinx Tour"
                    {...register('title')}
                    error={errors.title?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="e.g., pyramids-giza-tour"
                      {...register('slug')}
                      error={errors.slug?.message}
                    />
                    <p className="text-xs text-muted-foreground">
                      Used in the URL (e.g., yoursite.com/tours/pyramids-giza-tour)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Controller
                      name="difficulty"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="difficult">Difficult</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.difficulty && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.difficulty.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="duration"
                        placeholder="e.g., 4 hours"
                        className="pl-9"
                        {...register('duration')}
                        error={errors.duration?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxGroupSize">Max Group Size *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="maxGroupSize"
                        type="number"
                        min="1"
                        className="pl-9"
                        {...register('maxGroupSize', { valueAsNumber: true })}
                        error={errors.maxGroupSize?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...register('price', { valueAsNumber: true })}
                      error={errors.price?.message}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceDiscount">Discount Price (optional)</Label>
                  <Input
                    id="priceDiscount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...register('priceDiscount', { valueAsNumber: true })}
                    error={errors.priceDiscount?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Short Summary *</Label>
                  <Textarea
                    id="summary"
                    placeholder="A brief summary of the tour (appears in listings)"
                    rows={2}
                    {...register('summary')}
                    error={errors.summary?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the tour"
                    rows={6}
                    {...register('description')}
                    error={errors.description?.message}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Upload high-quality images of your tour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden border">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <label
                    htmlFor="tour-images" 
                    className="flex aspect-square items-center justify-center rounded-md border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Add Images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (Click to upload)
                      </p>
                    </div>
                    <input
                      id="tour-images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {errors.images && (
                  <p className="mt-2 text-sm font-medium text-destructive">
                    {errors.images.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
                <CardDescription>
                  Add the locations included in this tour
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Location</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Great Pyramid of Giza"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addLocation}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {locations.length > 0 && (
                  <div className="border rounded-md divide-y">
                    {locations.map((location, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Day {location.day}</p>
                          <p className="text-sm text-muted-foreground">
                            {location.description}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeLocation(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.locations && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.locations.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Tour Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {watch('isActive') ? 'Active' : 'Draft'}
                    </p>
                  </div>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating Tour...' : 'Update Tour'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Select categories that describe your tour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={currentCategories.includes(category) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                {errors.categories && (
                  <p className="mt-2 text-sm font-medium text-destructive">
                    {errors.categories.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to help users find your tour
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., family-friendly"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {currentTags.map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tour Guides</CardTitle>
                <CardDescription>
                  Assign guides to this tour
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Guides</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search by name or email"
                      value={searchGuide}
                      onChange={(e) => setSearchGuide(e.target.value)}
                    />
                    {searchGuide && (
                      <button
                        type="button"
                        onClick={() => setSearchGuide('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {searchGuide && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {filteredGuides.length > 0 ? (
                      filteredGuides.map((guide) => (
                        <div
                          key={guide.id}
                          className="p-2 hover:bg-muted cursor-pointer"
                          onClick={() => addGuide(guide)}
                        >
                          <p className="font-medium">{guide.name}</p>
                          <p className="text-sm text-muted-foreground">{guide.email}</p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground text-center">
                        No guides found
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Assigned Guides ({selectedGuides.length})</Label>
                  {selectedGuides.length > 0 ? (
                    <div className="space-y-2">
                      {selectedGuides.map((guide) => (
                        <div
                          key={guide.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div>
                            <p className="font-medium">{guide.name}</p>
                            <p className="text-xs text-muted-foreground">{guide.email}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeGuide(guide.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No guides assigned yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Start Dates</CardTitle>
                <CardDescription>
                  When is this tour available?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Start Date</Label>
                  <div className="flex gap-2">
                    <Input
                      type="datetime-local"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addStartDate}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {startDates.length > 0 && (
                  <div className="space-y-2">
                    <Label>Upcoming Tour Dates</Label>
                    <div className="border rounded-md divide-y">
                      {startDates
                        .sort()
                        .map((date, index) => (
                          <div key={index} className="p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {new Date(date).toLocaleString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeStartDate(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {errors.startDates && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.startDates.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
