'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, Search, Globe, Image as ImageIcon } from 'lucide-react';

interface SeoMeta {
  id: string;
  pageSlug: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
}

const defaultPages = [
  { slug: 'homepage', label: 'Homepage' },
  { slug: 'about', label: 'About Us' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'dahabiyat', label: 'Dahabiyat' },
  { slug: 'daily-tours', label: 'Daily Tours' },
  { slug: 'packages', label: 'Packages' },
  { slug: 'excursions', label: 'Excursions' },
  { slug: 'gallery', label: 'Gallery' },
];

export default function SeoPage() {
  const [seoItems, setSeoItems] = useState<SeoMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<SeoMeta | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emptySeo: SeoMeta = {
    id: '', pageSlug: '', title: '', description: '', keywords: '',
    canonical: '', ogTitle: '', ogDescription: '', ogImage: '',
    noIndex: false, noFollow: false,
  };

  useEffect(() => { fetchSeo(); }, []);

  const fetchSeo = async () => {
    try {
      const response = await fetch('/api/dashboard/seo');
      if (response.ok) {
        const data = await response.json();
        setSeoItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      const method = editingItem.id ? 'PUT' : 'POST';
      const url = editingItem.id ? `/api/dashboard/seo/${editingItem.id}` : '/api/dashboard/seo';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (!response.ok) throw new Error('Failed to save');
      toast.success('SEO settings saved!');
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchSeo();
    } catch (error) {
      toast.error('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const getPageSeo = (slug: string) => seoItems.find(s => s.pageSlug === slug);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-muted-foreground">Manage search engine optimization for each page</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultPages.map((page) => {
          const seo = getPageSeo(page.slug);
          return (
            <Card key={page.slug} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setEditingItem(seo || { ...emptySeo, pageSlug: page.slug }); setIsDialogOpen(true); }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{page.label}</CardTitle>
                  {seo ? <Badge className="bg-green-500">Configured</Badge> : <Badge variant="secondary">Default</Badge>}
                </div>
                <CardDescription className="text-xs">/{page.slug === 'homepage' ? '' : page.slug}</CardDescription>
              </CardHeader>
              <CardContent>
                {seo ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium line-clamp-1">{seo.title || 'No title set'}</p>
                    <p className="text-muted-foreground line-clamp-2">{seo.description || 'No description set'}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Click to configure SEO settings</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>SEO Settings - {defaultPages.find(p => p.slug === editingItem?.pageSlug)?.label || editingItem?.pageSlug}</DialogTitle></DialogHeader>
          {editingItem && (
            <Tabs defaultValue="basic" className="pt-4">
              <TabsList><TabsTrigger value="basic">Basic SEO</TabsTrigger><TabsTrigger value="social">Social Media</TabsTrigger><TabsTrigger value="advanced">Advanced</TabsTrigger></TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div><Label>Meta Title</Label><Input value={editingItem.title || ''} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} placeholder="Page title for search engines" /><p className="text-xs text-muted-foreground mt-1">{(editingItem.title?.length || 0)}/60 characters</p></div>
                <div><Label>Meta Description</Label><Textarea rows={3} value={editingItem.description || ''} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} placeholder="Brief description for search results" /><p className="text-xs text-muted-foreground mt-1">{(editingItem.description?.length || 0)}/160 characters</p></div>
                <div><Label>Keywords</Label><Input value={editingItem.keywords || ''} onChange={(e) => setEditingItem({...editingItem, keywords: e.target.value})} placeholder="keyword1, keyword2, keyword3" /></div>
              </TabsContent>
              <TabsContent value="social" className="space-y-4 pt-4">
                <div><Label>OG Title</Label><Input value={editingItem.ogTitle || ''} onChange={(e) => setEditingItem({...editingItem, ogTitle: e.target.value})} placeholder="Title for social sharing" /></div>
                <div><Label>OG Description</Label><Textarea rows={2} value={editingItem.ogDescription || ''} onChange={(e) => setEditingItem({...editingItem, ogDescription: e.target.value})} placeholder="Description for social sharing" /></div>
                <div><Label>OG Image URL</Label><Input value={editingItem.ogImage || ''} onChange={(e) => setEditingItem({...editingItem, ogImage: e.target.value})} placeholder="https://..." /></div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div><Label>Canonical URL</Label><Input value={editingItem.canonical || ''} onChange={(e) => setEditingItem({...editingItem, canonical: e.target.value})} placeholder="https://altavidatours.com/..." /></div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><Switch checked={editingItem.noIndex} onCheckedChange={(c) => setEditingItem({...editingItem, noIndex: c})} /><Label>No Index</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingItem.noFollow} onCheckedChange={(c) => setEditingItem({...editingItem, noFollow: c})} /><Label>No Follow</Label></div>
                </div>
              </TabsContent>
              <div className="flex justify-end gap-2 pt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Save SEO Settings</Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



