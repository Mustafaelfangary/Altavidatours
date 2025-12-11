'use client';

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Dahabiya {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  features: string[];
  type: string;
  category: string;
  amenities: string[];
  images: { id: string; url: string; alt?: string }[];
  itinerary: {
    id: string;
    name: string;
    description: string;
    durationDays: number;
  };
}

interface DahabiyaFormData {
  name: string;
  description: string;
  shortDescription?: string;
  pricePerDay: number;
  capacity: number;
  features: string[];
  type: string;
  category: string;
  amenities: string[];
  itineraryId: string;
}

export default function DahabiyatPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingDahabiya, setEditingDahabiya] = useState<Dahabiya | null>(null);
  const queryClient = useQueryClient();

  const { data: dahabiyat, isLoading } = useQuery({
    queryKey: ['dahabiyat'],
    queryFn: () => fetch('/api/dahabiyat').then(res => res.json()),
  });

  const { data: itineraries } = useQuery({
    queryKey: ['itineraries'],
    queryFn: () => fetch('/api/itineraries').then(res => res.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: DahabiyaFormData) =>
      fetch('/api/dahabiyat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dahabiyat'] });
      toast.success('Dahabiya created successfully');
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create dahabiya');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: DahabiyaFormData & { id: string }) =>
      fetch(`/api/dahabiyat/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dahabiyat'] });
      toast.success('Dahabiya updated successfully');
      setIsOpen(false);
      setEditingDahabiya(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update dahabiya');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/dahabiyat/${id}`, { method: 'DELETE' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dahabiyat'] });
      toast.success('Dahabiya deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete dahabiya');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dahabiyaData: DahabiyaFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      pricePerDay: Number(formData.get('pricePerDay')),
      capacity: Number(formData.get('capacity')),
      features: (formData.get('features') as string).split(',').map(a => a.trim()),
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      amenities: (formData.get('amenities') as string).split(',').map(a => a.trim()),
      itineraryId: formData.get('itineraryId') as string,
    };

    if (editingDahabiya) {
      updateMutation.mutate({ ...dahabiyaData, id: editingDahabiya.id });
    } else {
      createMutation.mutate(dahabiyaData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dahabiya?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dahabiyat Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDahabiya(null)}>Add New Dahabiya</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDahabiya ? 'Edit Dahabiya' : 'Add New Dahabiya'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingDahabiya?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingDahabiya?.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={editingDahabiya?.shortDescription}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerDay">Price Per Day</Label>
                  <Input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    defaultValue={editingDahabiya?.pricePerDay}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    defaultValue={editingDahabiya?.capacity}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  name="features"
                  defaultValue={editingDahabiya?.features.join(', ')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  name="amenities"
                  defaultValue={editingDahabiya?.amenities.join(', ')}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue={editingDahabiya?.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="LUXURY">Luxury</SelectItem>
                      <SelectItem value="DELUXE">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingDahabiya?.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="DELUXE">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="itineraryId">Itinerary</Label>
                <Select name="itineraryId" defaultValue={editingDahabiya?.itinerary.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select itinerary" />
                  </SelectTrigger>
                  <SelectContent>
                    {itineraries?.map((itinerary: any) => (
                      <SelectItem key={itinerary.id} value={itinerary.id}>
                        {itinerary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">
                {editingDahabiya ? 'Update Dahabiya' : 'Create Dahabiya'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Price/Day</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dahabiyat?.map((dahabiya: Dahabiya) => (
            <TableRow key={dahabiya.id}>
              <TableCell>{dahabiya.name}</TableCell>
              <TableCell>{dahabiya.type}</TableCell>
              <TableCell>{dahabiya.category}</TableCell>
              <TableCell>{dahabiya.capacity}</TableCell>
              <TableCell>${dahabiya.pricePerDay}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingDahabiya(dahabiya);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleDelete(dahabiya.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 

