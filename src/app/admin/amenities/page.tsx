"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Amenity {
  id: string;
  name: string;
  icon?: string;
  isActive: boolean;
}

export default function AdminAmenitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Amenity | null>(null);
  const [form, setForm] = useState({ name: '', icon: '', isActive: true });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin?callbackUrl=/admin/amenities');
      return;
    }
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }
    setIsAuthorized(true);
    setIsLoading(false);
  }, [session, status, router]);

  const loadAmenities = async () => {
    const res = await fetch('/api/admin/amenities', { cache: 'no-store' });
    if (res.ok) {
      const data: Amenity[] = await res.json();
      setAmenities(data);
    }
  };

  useEffect(() => { loadAmenities(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', icon: '', isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (a: Amenity) => {
    setEditing(a);
    setForm({ name: a.name, icon: a.icon || '', isActive: a.isActive });
    setDialogOpen(true);
  };

  const saveAmenity = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/admin/amenities/${editing.id}` : '/api/admin/amenities';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setDialogOpen(false);
      await loadAmenities();
    }
  };

  const deleteAmenity = async (id: string) => {
    if (!confirm('Delete amenity?')) return;
    const res = await fetch(`/api/admin/amenities/${id}`, { method: 'DELETE' });
    if (res.ok) await loadAmenities();
  };

  if (isLoading || status === 'loading') {
    return <div className="p-6">Loading...</div>;
  }
  if (!isAuthorized) {
    return <div className="p-6">Access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-blue-50 to-navy-blue-100">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Amenities</h1>
          <Button onClick={openCreate}>Add Amenity</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            {amenities.length === 0 ? (
              <div className="text-sm text-muted-foreground">No amenities yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {amenities.map(a => (
                  <div key={a.id} className="p-3 border rounded-md bg-white flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.icon || 'no icon'} • {a.isActive ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => openEdit(a)}>Edit</Button>
                      <Button variant="outline" className="text-red-600" onClick={() => deleteAmenity(a.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Amenity' : 'Add Amenity'}</DialogTitle>
            <DialogDescription>Define a reusable amenity.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="icon">Icon (optional)</Label>
              <Input id="icon" value={form.icon} onChange={e => setForm(s => ({ ...s, icon: e.target.value }))} />
            </div>
            <div className="flex items-center space-x-2">
              <input id="isActive" type="checkbox" className="h-4 w-4" checked={form.isActive} onChange={e => setForm(s => ({ ...s, isActive: e.target.checked }))} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveAmenity}>{editing ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
