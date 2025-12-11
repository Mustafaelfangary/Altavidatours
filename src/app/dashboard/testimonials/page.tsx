'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Star, Loader2, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  title?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  featured: boolean;
  isActive: boolean;
  tripType?: string;
  order: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emptyTestimonial: Testimonial = {
    id: '', name: '', title: '', company: '', content: '', rating: 5,
    avatarUrl: '', featured: false, isActive: true, tripType: '', order: 0,
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/dashboard/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingTestimonial) return;
    setSaving(true);
    try {
      const method = editingTestimonial.id ? 'PUT' : 'POST';
      const url = editingTestimonial.id 
        ? `/api/dashboard/testimonials/${editingTestimonial.id}`
        : '/api/dashboard/testimonials';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial),
      });
      if (!response.ok) throw new Error('Failed to save');
      toast.success(editingTestimonial.id ? 'Testimonial updated!' : 'Testimonial created!');
      setIsDialogOpen(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const response = await fetch(`/api/dashboard/testimonials/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage customer testimonials and reviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(emptyTestimonial)}><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingTestimonial?.id ? 'Edit' : 'Add'} Testimonial</DialogTitle></DialogHeader>
            {editingTestimonial && (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name *</Label><Input value={editingTestimonial.name} onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})} /></div>
                  <div><Label>Title/Role</Label><Input value={editingTestimonial.title || ''} onChange={(e) => setEditingTestimonial({...editingTestimonial, title: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Company</Label><Input value={editingTestimonial.company || ''} onChange={(e) => setEditingTestimonial({...editingTestimonial, company: e.target.value})} /></div>
                  <div><Label>Trip Type</Label><Input value={editingTestimonial.tripType || ''} placeholder="e.g., Dahabiya Cruise" onChange={(e) => setEditingTestimonial({...editingTestimonial, tripType: e.target.value})} /></div>
                </div>
                <div><Label>Testimonial *</Label><Textarea rows={4} value={editingTestimonial.content} onChange={(e) => setEditingTestimonial({...editingTestimonial, content: e.target.value})} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Rating</Label><Input type="number" min={1} max={5} value={editingTestimonial.rating} onChange={(e) => setEditingTestimonial({...editingTestimonial, rating: parseInt(e.target.value)})} /></div>
                  <div><Label>Order</Label><Input type="number" value={editingTestimonial.order} onChange={(e) => setEditingTestimonial({...editingTestimonial, order: parseInt(e.target.value)})} /></div>
                  <div><Label>Avatar URL</Label><Input value={editingTestimonial.avatarUrl || ''} onChange={(e) => setEditingTestimonial({...editingTestimonial, avatarUrl: e.target.value})} /></div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><Switch checked={editingTestimonial.featured} onCheckedChange={(c) => setEditingTestimonial({...editingTestimonial, featured: c})} /><Label>Featured</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingTestimonial.isActive} onCheckedChange={(c) => setEditingTestimonial({...editingTestimonial, isActive: c})} /><Label>Active</Label></div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving || !editingTestimonial.name || !editingTestimonial.content}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{editingTestimonial.id ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <Card key={t.id} className={!t.isActive ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  {t.title && <p className="text-sm text-muted-foreground">{t.title}</p>}
                </div>
                <div className="flex gap-1">
                  {t.featured && <Badge className="bg-pharaoh-gold">Featured</Badge>}
                  {!t.isActive && <Badge variant="secondary">Inactive</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Quote className="w-6 h-6 text-pharaoh-gold/30 mb-2" />
              <p className="text-sm line-clamp-3 mb-3">{t.content}</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-pharaoh-gold text-pharaoh-gold' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingTestimonial(t); setIsDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {testimonials.length === 0 && <Card><CardContent className="text-center py-12"><Quote className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-muted-foreground">No testimonials yet. Add your first one!</p></CardContent></Card>}
    </div>
  );
}



