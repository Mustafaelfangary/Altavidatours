"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

interface Setting {
  key: string;
  value: string;
  group: string;
}

export function SettingsManagement() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaSetting, setCurrentMediaSetting] = useState<Setting | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      
      // Convert object to array format
      const settingsArray = Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        group: 'general'
      }));
      
      setSettings(settingsArray);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, group: 'general' }),
      });

      if (!response.ok) throw new Error('Failed to update setting');
      
      toast.success('Setting updated successfully');
      fetchSettings(); // Refresh settings
    } catch (error) {
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key)?.value || '';
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev =>
      prev.map(s => s.key === key ? { ...s, value } : s)
    );
  };

  const handleMediaLibrarySelect = async (asset: any) => {
    if (!currentMediaSetting) return;

    try {
      setSaving(true);
      await handleSave(currentMediaSetting.key, asset.url);
      setShowMediaLibrary(false);
      setCurrentMediaSetting(null);
    } catch (error) {
      console.error('Error updating media:', error);
      toast.error('Failed to update media');
    } finally {
      setSaving(false);
    }
  };

  const openMediaLibrary = (setting: Setting) => {
    setCurrentMediaSetting(setting);
    setShowMediaLibrary(true);
  };

  const getSettingType = (key: string): 'text' | 'textarea' | 'image' | 'video' => {
    if (key.includes('image') || key.includes('logo') || key.includes('favicon')) return 'image';
    if (key.includes('video')) return 'video';
    if (key.includes('subtitle') || key.includes('content') || key.includes('description') || key.includes('desc')) return 'textarea';
    return 'text';
  };

  const renderSettingInput = (key: string, label: string, placeholder?: string) => {
    const setting = { key, value: getSetting(key), group: 'general' };
    const type = getSettingType(key);

    switch (type) {
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <Textarea
              value={setting.value}
              onChange={(e) => updateSetting(key, e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px]"
            />
            <Button
              onClick={() => handleSave(key, getSetting(key))}
              disabled={saving}
              className="mt-2"
            >
              Save
            </Button>
          </div>
        );
      case 'image':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div className="space-y-2">
              {setting.value && (
                <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={setting.value}
                    alt={label}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => openMediaLibrary(setting)}
                className="w-full"
              >
                {setting.value ? 'Replace Image' : 'Choose Image from Library'}
              </Button>
            </div>
          </div>
        );
      case 'video':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div className="space-y-2">
              {setting.value && (
                <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <span className="text-sm text-gray-600">Video: {setting.value.split('/').pop()}</span>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => openMediaLibrary(setting)}
                className="w-full"
              >
                {setting.value ? 'Replace Video' : 'Choose Video from Library'}
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <Input
              value={setting.value}
              onChange={(e) => updateSetting(key, e.target.value)}
              placeholder={placeholder}
            />
            <Button
              onClick={() => handleSave(key, getSetting(key))}
              disabled={saving}
              className="mt-2"
            >
              Save
            </Button>
          </div>
        );
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings Management</h1>
        <p className="text-muted-foreground">Manage your site settings and configuration</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingInput('site_name', 'Site Name', 'Dahabiyat')}
              {renderSettingInput('site_description', 'Site Description', 'Luxury dahabiya cruises on the Nile')}
              {renderSettingInput('contact_email', 'Contact Email', 'info@altavidatours.com')}
              {renderSettingInput('site_logo', 'Site Logo')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homepage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingInput('home_hero_headline', 'Hero Title', 'Experience the Magic of the Nile')}
              {renderSettingInput('home_hero_subheadline', 'Hero Subtitle', 'Luxury dahabiya cruises through ancient Egypt')}
              {renderSettingInput('home_hero_image', 'Hero Background Image')}
              {renderSettingInput('home_hero_video', 'Hero Background Video')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingInput('contact_phone', 'Phone Number', '+20 123 456 7890')}
              {renderSettingInput('contact_address', 'Address', '123 Nile Street, Cairo, Egypt')}
              {renderSettingInput('contact_email', 'Contact Email', 'info@altavidatours.com')}
              {renderSettingInput('contact_image', 'Contact Page Image')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingInput('meta_title', 'Meta Title', 'Dahabiyat - Luxury Nile Cruises')}
              {renderSettingInput('meta_description', 'Meta Description', 'Experience luxury dahabiya cruises on the Nile')}
              {renderSettingInput('meta_image', 'Meta Image (Social Media)')}
              {renderSettingInput('favicon', 'Favicon')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Media Library Selector */}
      <MediaLibrarySelector
        open={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          setCurrentMediaSetting(null);
        }}
        onSelect={handleMediaLibrarySelect}
        acceptedTypes={
          currentMediaSetting?.key.includes('video')
            ? ['VIDEO']
            : currentMediaSetting?.key.includes('image') || currentMediaSetting?.key.includes('logo') || currentMediaSetting?.key.includes('favicon')
            ? ['IMAGE']
            : ['IMAGE', 'VIDEO']
        }
        title={`Select ${currentMediaSetting?.key.includes('video') ? 'Video' : 'Image'} for ${currentMediaSetting?.key || ''}`}
      />
    </div>
  );
}

