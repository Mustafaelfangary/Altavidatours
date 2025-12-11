'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, Loader2, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

interface SiteSettings {
  // General
  site_name: string;
  site_tagline: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  // Contact
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  // Social
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  social_tiktok: string;
  // Business
  business_hours: string;
  currency: string;
  timezone: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'AltaVida Tours',
  site_tagline: 'Luxury Nile Cruises & Egyptian Adventures',
  site_description: 'Experience the magic of Egypt with our luxury Dahabiya cruises and curated tours.',
  logo_url: '/icons/altavida-logo-1.svg',
  favicon_url: '/icons/altavida-logo-1.ico',
  contact_email: 'info@altavidatours.com',
  contact_phone: '+20 123 456 7890',
  contact_whatsapp: '+20 123 456 7890',
  contact_address: 'Luxor, Egypt',
  social_facebook: 'https://facebook.com/altavidatours',
  social_instagram: 'https://instagram.com/altavidatours',
  social_twitter: '',
  social_youtube: '',
  social_tiktok: '',
  business_hours: 'Monday - Sunday: 9:00 AM - 6:00 PM',
  currency: 'USD',
  timezone: 'Africa/Cairo',
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaField, setMediaField] = useState<'logo_url' | 'favicon_url'>('logo_url');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/dashboard/site-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/dashboard/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to save');
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (asset: any) => {
    setSettings({ ...settings, [mediaField]: asset.url });
    setShowMediaSelector(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Manage your website's global settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input id="site_name" value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Tagline</Label>
                  <Input id="site_tagline" value={settings.site_tagline} onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea id="site_description" value={settings.site_description} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <MediaLibrarySelector open={showMediaSelector} onClose={() => setShowMediaSelector(false)} onSelect={handleMediaSelect} acceptedTypes={['IMAGE']} />
    </div>
  );
}



