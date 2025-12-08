"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  contentType: string;
  section: string;
  order: number;
}

interface GroupedContent {
  [section: string]: ContentBlock[];
}

export default function DahabiyatSettingsClient() {
  const [content, setContent] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaKey, setCurrentMediaKey] = useState<string | null>(null);

  // Load content
  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/dahabiyat-page');
      if (!response.ok) throw new Error('Failed to load content');
      
      const data = await response.json();
      setContent(data.content || {});
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Handle content change
  const handleContentChange = (key: string, field: 'content' | 'mediaUrl', value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  // Handle media selection
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

  // Save changes
  const saveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/dahabiyat-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingChanges),
      });

      if (!response.ok) throw new Error('Failed to save changes');

      toast.success('Changes saved successfully');
      setPendingChanges({});
      await loadContent(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Initialize content structure
  const initializeContent = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/dahabiyat-page', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to initialize content');
      
      toast.success('Content structure initialized');
      await loadContent();
    } catch (error) {
      console.error('Error initializing content:', error);
      toast.error('Failed to initialize content');
    } finally {
      setSaving(false);
    }
  };

  // Get current value for a field
  const getCurrentValue = (block: ContentBlock, field: 'content' | 'mediaUrl') => {
    return pendingChanges[block.key]?.[field] ?? block[field] ?? '';
  };

  // Check if field has pending changes
  const hasPendingChanges = (key: string) => {
    return key in pendingChanges;
  };

  // Render input field based on content type
  const renderField = (block: ContentBlock) => {
    const isImage = block.contentType === 'IMAGE';
    const isVideo = block.contentType === 'VIDEO';
    const isTextarea = block.contentType === 'TEXTAREA';

    if (isImage || isVideo) {
      const currentUrl = getCurrentValue(block, 'mediaUrl');
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentMediaKey(block.key);
                setShowMediaLibrary(true);
              }}
            >
              Select {isImage ? 'Image' : 'Video'}
            </Button>
            {hasPendingChanges(block.key) && (
              <Badge variant="secondary" className="text-xs">
                Modified
              </Badge>
            )}
          </div>
          {currentUrl && (
            <div className="mt-2">
              {isImage ? (
                <Image
                  src={currentUrl}
                  alt={block.title}
                  width={200}
                  height={120}
                  className="rounded border object-cover"
                />
              ) : (
                <video
                  src={currentUrl}
                  width={200}
                  height={120}
                  className="rounded border"
                  controls
                />
              )}
            </div>
          )}
        </div>
      );
    }

    if (isTextarea) {
      return (
        <div className="space-y-2">
          <Textarea
            value={getCurrentValue(block, 'content')}
            onChange={(e) => handleContentChange(block.key, 'content', e.target.value)}
            placeholder={`Enter ${block.title.toLowerCase()}`}
            rows={4}
            className="w-full"
          />
          {hasPendingChanges(block.key) && (
            <Badge variant="secondary" className="text-xs">
              Modified
            </Badge>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Input
          value={getCurrentValue(block, 'content')}
          onChange={(e) => handleContentChange(block.key, 'content', e.target.value)}
          placeholder={`Enter ${block.title.toLowerCase()}`}
          className="w-full"
        />
        {hasPendingChanges(block.key) && (
          <Badge variant="secondary" className="text-xs">
            Modified
          </Badge>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dahabiyat settings...</p>
        </div>
      </div>
    );
  }

  const sections = Object.keys(content);
  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <Button
            onClick={saveChanges}
            disabled={!hasChanges || saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            onClick={initializeContent}
            variant="outline"
            disabled={saving}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Initialize Structure
          </Button>
        </div>

        {hasChanges && (
          <Badge variant="secondary">
            {Object.keys(pendingChanges).length} pending changes
          </Badge>
        )}
      </div>

      {sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No content structure found.</p>
            <Button onClick={initializeContent} disabled={saving}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Initialize Dahabiyat Content Structure
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={sections[0]} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {sections.map((section) => (
              <TabsTrigger key={section} value={section} className="capitalize">
                {section.replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section} value={section}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {section.replace('_', ' ')} Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content[section]?.map((block) => (
                    <div key={block.key} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {block.title}
                      </label>
                      {renderField(block)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Media Library Modal */}
      <MediaLibrarySelector
        open={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          setCurrentMediaKey(null);
        }}
        onSelect={handleMediaSelect}
        acceptedTypes={['IMAGE', 'VIDEO']}
        title="Select Media for Dahabiyat Page"
      />
    </div>
  );
}
