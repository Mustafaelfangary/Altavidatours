'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, GripVertical, Menu, ExternalLink } from 'lucide-react';

interface NavigationItem {
  id: string;
  title: string;
  url: string;
  target: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  menuLocation: string;
  children?: NavigationItem[];
}

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState('header');

  const locations = [
    { id: 'header', label: 'Header Menu' },
    { id: 'footer', label: 'Footer Menu' },
    { id: 'mobile', label: 'Mobile Menu' },
  ];

  const emptyItem: NavigationItem = {
    id: '', title: '', url: '', target: '_self', icon: '',
    order: 0, isActive: true, menuLocation: activeLocation,
  };

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/dashboard/navigation');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      const method = editingItem.id ? 'PUT' : 'POST';
      const url = editingItem.id ? `/api/dashboard/navigation/${editingItem.id}` : '/api/dashboard/navigation';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (!response.ok) throw new Error('Failed to save');
      toast.success(editingItem.id ? 'Menu item updated!' : 'Menu item created!');
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      toast.error('Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await fetch(`/api/dashboard/navigation/${id}`, { method: 'DELETE' });
      toast.success('Menu item deleted');
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredItems = items.filter(i => i.menuLocation === activeLocation).sort((a, b) => a.order - b.order);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Navigation</h1>
          <p className="text-muted-foreground">Manage website navigation menus</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem({ ...emptyItem, menuLocation: activeLocation })}><Plus className="w-4 h-4 mr-2" />Add Menu Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingItem?.id ? 'Edit' : 'Add'} Menu Item</DialogTitle></DialogHeader>
            {editingItem && (
              <div className="space-y-4 pt-4">
                <div><Label>Title *</Label><Input value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} /></div>
                <div><Label>URL *</Label><Input value={editingItem.url} placeholder="/page or https://..." onChange={(e) => setEditingItem({...editingItem, url: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Target</Label>
                    <Select value={editingItem.target} onValueChange={(v) => setEditingItem({...editingItem, target: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="_self">Same Window</SelectItem><SelectItem value="_blank">New Window</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Location</Label>
                    <Select value={editingItem.menuLocation} onValueChange={(v) => setEditingItem({...editingItem, menuLocation: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{locations.map(l => <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Icon (optional)</Label><Input value={editingItem.icon || ''} placeholder="e.g., Home, Info" onChange={(e) => setEditingItem({...editingItem, icon: e.target.value})} /></div>
                  <div><Label>Order</Label><Input type="number" value={editingItem.order} onChange={(e) => setEditingItem({...editingItem, order: parseInt(e.target.value)})} /></div>
                </div>
                <div className="flex items-center gap-2"><Switch checked={editingItem.isActive} onCheckedChange={(c) => setEditingItem({...editingItem, isActive: c})} /><Label>Active</Label></div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving || !editingItem.title || !editingItem.url}>{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editingItem.id ? 'Update' : 'Create'}</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6">
        {locations.map(l => (
          <Button key={l.id} variant={activeLocation === l.id ? 'primary' : 'outline'} onClick={() => setActiveLocation(l.id)}><Menu className="w-4 h-4 mr-2" />{l.label}</Button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{locations.find(l => l.id === activeLocation)?.label}</CardTitle></CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No menu items. Add one to get started!</p>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-3 border rounded-lg ${!item.isActive && 'opacity-50'}`}>
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-muted-foreground">{item.url}</span>
                    {item.target === '_blank' && <ExternalLink className="w-3 h-3" />}
                    {!item.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

