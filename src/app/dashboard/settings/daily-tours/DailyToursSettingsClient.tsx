'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content?: string;
  contentType: string;
  page: string;
  section: string;
  order: number;
  isActive: boolean;
}

export default function DailyToursSettingsClient() {
  const [content, setContent] = useState<Record<string, ContentBlock[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/daily-tours');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data.content || {});
      
      const initialValues: Record<string, string> = {};
      Object.values(data.content || {}).flat().forEach((block: any) => {
        initialValues[block.key] = block.content || '';
      });
      setEditedValues(initialValues);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const allBlocks = Object.values(content).flat();
      
      for (const [key, value] of Object.entries(editedValues)) {
        const block = allBlocks.find(b => b.key === key);
        await fetch(`/api/settings/${key}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: value,
            page: 'daily-tours',
            section: block?.section || 'general',
            contentType: block?.contentType || 'TEXT',
          }),
        });
      }
      
      toast.success('All changes saved successfully');
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (block: ContentBlock) => {
    const value = editedValues[block.key] || '';
    
    if (block.contentType === 'TEXTAREA') {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleValueChange(block.key, e.target.value)}
          placeholder={`Enter ${block.title}`}
          rows={3}
          className="mt-2"
        />
      );
    }
    
    return (
      <Input
        value={value}
        onChange={(e) => handleValueChange(block.key, e.target.value)}
        placeholder={`Enter ${block.title}`}
        className="mt-2"
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-pharaoh-gold" />
        <span className="ml-2">Loading content...</span>
      </div>
    );
  }

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: '🎬', description: 'Main banner content' },
    { id: 'categories', label: 'Categories', icon: '📂', description: 'Tour category labels' },
    { id: 'empty', label: 'Empty State', icon: '📭', description: 'When no tours available' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="text-sm">
          {Object.values(content).flat().length} content blocks
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContent} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              <span>{section.icon}</span>
              {section.label}
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
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(content[section.id] || [])
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <div key={block.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{block.contentType}</Badge>
                        <span className="font-medium capitalize">
                          {block.key.replace(/daily-tours_|_/g, ' ').trim()}
                        </span>
                      </div>
                      {renderField(block)}
                    </div>
                  ))}
                {(!content[section.id] || content[section.id].length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    No content blocks in this section yet. Click "Refresh" to initialize.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

