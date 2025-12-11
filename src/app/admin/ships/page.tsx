'use client';

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

interface Ship {
  id: string;
  name: string;
  imageUrl?: string;
  capacity: number;
  yearBuilt?: number;
  specifications?: any;
}

export default function ShipsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
  const queryClient = useQueryClient();

  const { data: ships, isLoading } = useQuery<Ship[]>({
    queryKey: ['ships'],
    queryFn: async () => {
      const response = await fetch('/api/ships');
      if (!response.ok) throw new Error('Failed to fetch ships');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (ship: Omit<Ship, 'id'>) => {
      const response = await fetch('/api/ships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ship),
      });
      if (!response.ok) throw new Error('Failed to create ship');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      toast.success('Ship created successfully');
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Failed to create ship');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (ship: Ship) => {
      const response = await fetch(`/api/ships/${ship.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ship),
      });
      if (!response.ok) throw new Error('Failed to update ship');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      toast.success('Ship updated successfully');
      setIsOpen(false);
      setEditingShip(null);
    },
    onError: () => {
      toast.error('Failed to update ship');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/ships/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete ship');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      toast.success('Ship deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete ship');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shipData = {
      name: formData.get('name') as string,
      imageUrl: formData.get('imageUrl') as string,
      capacity: parseInt(formData.get('capacity') as string),
      yearBuilt: parseInt(formData.get('yearBuilt') as string) || undefined,
      specifications: formData.get('specifications') ? JSON.parse(formData.get('specifications') as string) : undefined,
    };

    if (editingShip) {
      updateMutation.mutate({ ...shipData, id: editingShip.id });
    } else {
      createMutation.mutate(shipData);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ships Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingShip(null)}>Add New Ship</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingShip ? 'Edit Ship' : 'Add New Ship'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingShip?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingShip?.imageUrl}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  defaultValue={editingShip?.capacity}
                  required
                />
              </div>
              <div>
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  name="yearBuilt"
                  type="number"
                  defaultValue={editingShip?.yearBuilt}
                />
              </div>
              <div>
                <Label htmlFor="specifications">Specifications (JSON)</Label>
                <Textarea
                  id="specifications"
                  name="specifications"
                  defaultValue={editingShip?.specifications ? JSON.stringify(editingShip.specifications, null, 2) : ''}
                />
              </div>
              <Button type="submit">
                {editingShip ? 'Update Ship' : 'Create Ship'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Year Built</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ships?.map((ship) => (
            <TableRow key={ship.id}>
              <TableCell>{ship.name}</TableCell>
              <TableCell>{ship.capacity}</TableCell>
              <TableCell>{ship.yearBuilt}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingShip(ship);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this ship?')) {
                      deleteMutation.mutate(ship.id);
                    }
                  }}
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

