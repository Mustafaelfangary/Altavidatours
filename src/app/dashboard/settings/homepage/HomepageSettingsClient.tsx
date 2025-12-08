"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';
import { Loader2, Save, RefreshCw, Plus } from 'lucide-react';
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
}

interface ContentStructure {
  key: string;
  title: string;
  contentType: string;
  section: string;
  order: number;
}

export default function HomepageSettingsClient() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [contentStructure, setContentStructure] = useState<ContentStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaKey, setCurrentMediaKey] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  // Define sections for tabs
  const sections = [
    { id: 'hero', label: 'Hero Section', icon: '🎬' },
    { id: 'dahabiya', label: 'What is Dahabiya', icon: '⛵' },
    { id: 'why_different', label: 'Why Different', icon: '❓' },
    { id: 'features', label: 'Features', icon: '⭐' },
    { id: 'story', label: 'Our Story', icon: '📖' },
    { id: 'featured', label: 'Featured Cruises', icon: '🚢' },
    { id: 'memories', label: 'Memories', icon: '📸' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'cta', label: 'Call to Action', icon: '📢' },
  ];

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/homepage');
      
      if (!response.ok) {
        throw new Error('Failed to fetch homepage content');
      }
      
      const data = await response.json();
      setContentBlocks(data.blocks || []);
      setContentStructure(data.structure || []);
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      toast.error('Failed to fetch homepage content');
    } finally {
      setLoading(false);
    }
  };

  const initializeHomepageContent = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/homepage', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize homepage content');
      }
      
      const data = await response.json();
      toast.success(data.message);
      await fetchHomepageContent();
    } catch (error) {
      console.error('Error initializing homepage content:', error);
      toast.error('Failed to initialize homepage content');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (key: string, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: { ...prev[key], content: value }
    }));
  };

  const handleMediaSelect = (asset: { id: string; url: string; type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' }) => {
    if (currentMediaKey) {
      setPendingChanges(prev => ({
        ...prev,
        [currentMediaKey]: { ...prev[currentMediaKey], mediaUrl: asset.url, mediaType: asset.type }
      }));
      setCurrentMediaKey(null);
      setShowMediaLibrary(false);
      toast.success('Media selected successfully');
    }
  };

  const openMediaLibrary = (key: string) => {
    setCurrentMediaKey(key);
    setShowMediaLibrary(true);
  };

  const saveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      setSaving(true);
      const updates = Object.entries(pendingChanges).map(([key, changes]) => ({
        key,
        ...changes,
      }));

      const response = await fetch('/api/dashboard/homepage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      const data = await response.json();
      toast.success(data.message);
      setPendingChanges({});
      await fetchHomepageContent();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const getContentValue = (key: string, field: 'content' | 'mediaUrl'): string => {
    // Check pending changes first
    if (pendingChanges[key]?.[field] !== undefined) {
      return pendingChanges[key][field];
    }
    
    // Then check existing content blocks
    const block = contentBlocks.find(b => b.key === key);
    return block?.[field] || '';
  };

  const renderContentInput = (key: string, title: string, contentType: string) => {
    const hasChanges = pendingChanges[key];
    
    switch (contentType) {
      case 'TEXT':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {title}
              {hasChanges && <Badge variant="secondary" className="text-xs">Modified</Badge>}
            </label>
            <Input
              value={getContentValue(key, 'content')}
              onChange={(e) => handleContentChange(key, e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}`}
            />
          </div>
        );

      case 'TEXTAREA':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {title}
              {hasChanges && <Badge variant="secondary" className="text-xs">Modified</Badge>}
            </label>
            <Textarea
              value={getContentValue(key, 'content')}
              onChange={(e) => handleContentChange(key, e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}`}
              rows={4}
            />
          </div>
        );

      case 'IMAGE':
      case 'VIDEO':
        const mediaUrl = getContentValue(key, 'mediaUrl');
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              {title}
              {hasChanges && <Badge variant="secondary" className="text-xs">Modified</Badge>}
            </label>
            {mediaUrl && contentType === 'IMAGE' && (
              <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                <Image
                  src={mediaUrl}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {mediaUrl && contentType === 'VIDEO' && (
              <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-gray-600">🎥 Video: {mediaUrl.split('/').pop()}</span>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => openMediaLibrary(key)}
              className="w-full"
            >
              {mediaUrl ? `Replace ${contentType.toLowerCase()}` : `Choose ${contentType.toLowerCase()} from Library`}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const groupedBlocks = sections.reduce((acc, section) => {
    acc[section.id] = contentStructure.filter(item => item.section === section.id);
    return acc;
  }, {} as Record<string, ContentStructure[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading homepage settings...</span>
      </div>
    );
  }

  if (contentBlocks.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-semibold mb-4">No Homepage Content Found</h3>
          <p className="text-muted-foreground mb-6">
            Initialize the homepage content structure to start managing your homepage.
          </p>
          <Button onClick={initializeHomepageContent} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Initializing...
              </>
            ) : (
              'Initialize Homepage Content'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {contentBlocks.length} content blocks
          </Badge>
          {Object.keys(pendingChanges).length > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              {Object.keys(pendingChanges).length} unsaved changes
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchHomepageContent} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={initializeHomepageContent}
            disabled={saving}
            size="sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Syncing...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Sync Structure
              </>
            )}
          </Button>
          <Button
            onClick={saveChanges}
            disabled={saving || Object.keys(pendingChanges).length === 0}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1 mb-6 h-auto p-2">
          {sections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="flex flex-col items-center gap-1 p-2 text-xs min-h-[60px]"
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-center leading-tight">{section.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{section.icon}</span>
                  {section.label}
                  <Badge variant="outline">
                    {groupedBlocks[section.id]?.length || 0} fields
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {groupedBlocks[section.id]?.map((item) => (
                    <div key={item.key} className="border rounded-lg p-4">
                      {renderContentInput(item.key, item.title, item.contentType)}
                    </div>
                  ))}
                  {(!groupedBlocks[section.id] || groupedBlocks[section.id].length === 0) && (
                    <p className="text-center text-muted-foreground py-8">
                      No content fields found for this section
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Media Library Modal */}
      <MediaLibrarySelector
        open={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          setCurrentMediaKey(null);
        }}
        onSelect={handleMediaSelect}
        acceptedTypes={['IMAGE', 'VIDEO']}
        title="Select Media for Homepage"
      />
    </div>
  );
}
