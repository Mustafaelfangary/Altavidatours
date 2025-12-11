"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Video, Trash2, Edit, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  contentType: 'TEXT' | 'TEXTAREA' | 'RICH_TEXT' | 'IMAGE' | 'VIDEO' | 'GALLERY' | 'TESTIMONIAL' | 'FEATURE' | 'CTA';
  page: string;
  section: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContentManagerProps {
  page?: string;
}

export default function ContentManager({ page }: ContentManagerProps) {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ContentBlock>>({});
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaBlock, setCurrentMediaBlock] = useState<ContentBlock | null>(null);

  const pages = [
    { id: 'homepage', label: 'Homepage', icon: '🏠' },
    { id: 'about', label: 'About', icon: '📖' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'footer', label: 'Footer', icon: '🦶' },
    { id: 'tailor-made', label: 'Tailor-Made', icon: '✂️' },
    { id: 'dahabiyat', label: 'Dahabiyat', icon: '⛵' },
    { id: 'excursions', label: 'Excursions', icon: '🏛️' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  ];

  useEffect(() => {
    fetchContentBlocks();
  }, [page]);

  const fetchContentBlocks = async () => {
    try {
      setLoading(true);
      const url = page ? `/api/settings?page=${page}` : '/api/settings';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContentBlocks(data.blocks || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (block: ContentBlock) => {
    try {
      setSaving(block.id);
      const response = await fetch(`/api/settings/${block.key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      toast.success('Content updated successfully');
      setEditingBlock(null);
      setEditValues({});
      fetchContentBlocks();
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    } finally {
      setSaving(null);
    }
  };

  const handleMediaUpload = async (block: ContentBlock, file: File) => {
    try {
      setSaving(block.id);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contentKey', block.key);
      if (block.mediaUrl) {
        formData.append('oldMediaUrl', block.mediaUrl);
      }

      const response = await fetch('/api/content-media', {
        method: block.mediaUrl ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload media');
      
      toast.success('Media uploaded successfully');
      fetchContentBlocks();
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setSaving(null);
    }
  };

  const handleMediaLibrarySelect = async (asset: any) => {
    if (!currentMediaBlock) return;

    try {
      setSaving(currentMediaBlock.id);
      const response = await fetch(`/api/settings/${currentMediaBlock.key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaUrl: asset.url }),
      });

      if (!response.ok) throw new Error('Failed to update media');

      toast.success('Media updated successfully');
      fetchContentBlocks();
      setShowMediaLibrary(false);
      setCurrentMediaBlock(null);
    } catch (error) {
      console.error('Error updating media:', error);
      toast.error('Failed to update media');
    } finally {
      setSaving(null);
    }
  };

  const openMediaLibrary = (block: ContentBlock) => {
    setCurrentMediaBlock(block);
    setShowMediaLibrary(true);
  };

  const handleMediaDelete = async (block: ContentBlock) => {
    if (!block.mediaUrl) return;

    try {
      setSaving(block.id);
      const response = await fetch(`/api/content-media?contentKey=${block.key}&mediaUrl=${block.mediaUrl}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete media');
      
      toast.success('Media deleted successfully');
      fetchContentBlocks();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    } finally {
      setSaving(null);
    }
  };

  const startEditing = (block: ContentBlock) => {
    setEditingBlock(block.id);
    setEditValues({
      title: block.title,
      content: block.content,
    });
  };

  const cancelEditing = () => {
    setEditingBlock(null);
    setEditValues({});
  };

  const renderContentInput = (block: ContentBlock) => {
    const isEditing = editingBlock === block.id;
    
    if (!isEditing) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{block.title}</h3>
          </div>
          {block.content && (
            <p className="text-gray-600 text-sm line-clamp-3">{block.content}</p>
          )}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => startEditing(block)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Content
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={editValues.title || ''}
            onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
            placeholder="Enter title"
          />
        </div>
        
        {block.contentType === 'TEXTAREA' || block.contentType === 'RICH_TEXT' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea
              value={editValues.content || ''}
              onChange={(e) => setEditValues({ ...editValues, content: e.target.value })}
              placeholder="Enter content"
              rows={4}
            />
          </div>
        ) : block.contentType === 'TEXT' && (
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Input
              value={editValues.content || ''}
              onChange={(e) => setEditValues({ ...editValues, content: e.target.value })}
              placeholder="Enter content"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => handleSave(block)}
            disabled={saving === block.id}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving === block.id ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outline"
            onClick={cancelEditing}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderMediaSection = (block: ContentBlock) => {
    if (!['IMAGE', 'VIDEO', 'GALLERY'].includes(block.contentType)) {
      return null;
    }

    return (
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Media</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={saving === block.id}
              onClick={() => openMediaLibrary(block)}
            >
              <Upload className="w-4 h-4" />
              {block.mediaUrl ? 'Replace' : 'Choose from Media Library'}
            </Button>
            {block.mediaUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMediaDelete(block)}
                disabled={saving === block.id}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {block.mediaUrl && (
          <div className="relative">
            {block.mediaType === 'IMAGE' ? (
              <img
                src={block.mediaUrl}
                alt={block.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : block.mediaType === 'VIDEO' ? (
              <video
                src={block.mediaUrl}
                className="w-full h-32 object-cover rounded-lg"
                controls
              />
            ) : null}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading content...</div>;
  }

  const groupedBlocks = contentBlocks.reduce((acc, block) => {
    if (!acc[block.page]) acc[block.page] = {};
    if (!acc[block.page][block.section]) acc[block.page][block.section] = [];
    acc[block.page][block.section].push(block);
    return acc;
  }, {} as Record<string, Record<string, ContentBlock[]>>);

  // If a specific page is provided, show only that page's content
  if (page) {
    const pageInfo = pages.find(p => p.id === page);
    const pageBlocks = groupedBlocks[page];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {pageInfo?.icon} {pageInfo?.label} Settings
          </h1>
          <Badge variant="secondary">
            {contentBlocks.filter(block => block.page === page).length} content blocks
          </Badge>
        </div>

        <div className="space-y-6">
          {pageBlocks ? (
            Object.entries(pageBlocks).map(([section, blocks]) => (
              <Card key={section}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center gap-2">
                    {section.replace('_', ' ')}
                    <Badge variant="outline">{blocks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div key={block.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{block.contentType}</Badge>
                          <Badge variant="outline">{block.key}</Badge>
                          {!block.isActive && <Badge variant="destructive">Inactive</Badge>}
                        </div>

                        {renderContentInput(block)}
                        {renderMediaSection(block)}
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No content blocks found for {pageInfo?.label}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show all pages with tabs (for main settings page)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Badge variant="secondary">
          {contentBlocks.length} content blocks
        </Badge>
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="flex flex-wrap gap-2 h-auto p-2">
          {pages.map((p) => (
            <TabsTrigger key={p.id} value={p.id} className="flex items-center gap-2 px-4 py-2">
              <span>{p.icon}</span>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map((p) => (
          <TabsContent key={p.id} value={p.id} className="space-y-6">
            {groupedBlocks[p.id] ? (
              Object.entries(groupedBlocks[p.id]).map(([section, blocks]) => (
                <Card key={section}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      {section.replace('_', ' ')}
                      <Badge variant="outline">{blocks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {blocks
                      .sort((a, b) => a.order - b.order)
                      .map((block) => (
                        <div key={block.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary">{block.contentType}</Badge>
                            <Badge variant="outline">{block.key}</Badge>
                            {!block.isActive && <Badge variant="destructive">Inactive</Badge>}
                          </div>

                          {renderContentInput(block)}
                          {renderMediaSection(block)}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No content blocks found for {p.label}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Media Library Selector */}
      <MediaLibrarySelector
        open={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          setCurrentMediaBlock(null);
        }}
        onSelect={handleMediaLibrarySelect}
        acceptedTypes={
          currentMediaBlock?.contentType === 'VIDEO'
            ? ['VIDEO']
            : currentMediaBlock?.contentType === 'IMAGE'
            ? ['IMAGE']
            : ['IMAGE', 'VIDEO']
        }
        title={`Select ${currentMediaBlock?.contentType === 'VIDEO' ? 'Video' : currentMediaBlock?.contentType === 'IMAGE' ? 'Image' : 'Media'} for ${currentMediaBlock?.title || ''}`}
      />
    </div>
  );
}


