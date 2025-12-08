"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  Upload,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Anchor,
  Star,
  Heart,
  Sun,
  Waves
} from 'lucide-react';
import Image from 'next/image';
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

interface FooterSettings {
  [key: string]: string;
}

interface FooterStructure {
  [section: string]: {
    [key: string]: {
      key: string;
      type: string;
      order: number;
      defaultValue?: string;
    };
  };
}

export default function FooterSettingsClient() {
  const [settings, setSettings] = useState<FooterSettings>({});
  const [structure, setStructure] = useState<FooterStructure>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load footer settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/footer');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || {});
        setStructure(data.structure || {});
      } else {
        toast.error('Failed to load footer settings');
      }
    } catch (error) {
      console.error('Error loading footer settings:', error);
      toast.error('Error loading footer settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast.success('Footer settings saved successfully!');
      } else {
        toast.error('Failed to save footer settings');
      }
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast.error('Error saving footer settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/dashboard/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'sync' }),
      });

      if (response.ok) {
        toast.success('Footer structure synchronized!');
        await loadSettings();
      } else {
        toast.error('Failed to sync footer structure');
      }
    } catch (error) {
      console.error('Error syncing footer:', error);
      toast.error('Error syncing footer structure');
    } finally {
      setSyncing(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all footer settings to defaults? This cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset' }),
      });

      if (response.ok) {
        toast.success('Footer settings reset to defaults!');
        await loadSettings();
      } else {
        toast.error('Failed to reset footer settings');
      }
    } catch (error) {
      console.error('Error resetting footer:', error);
      toast.error('Error resetting footer settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Structure'}
        </Button>

        <Button 
          onClick={handleReset}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>

        <Button 
          onClick={() => window.open('/', '_blank')}
          variant="outline"
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Footer
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Anchor className="w-4 h-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Navigation</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Contact</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Social Media</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Information */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Anchor className="w-5 h-5 text-blue-600" />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>
                Manage your company branding, logo, and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="footer_company_name">Company Name</Label>
                  <Input
                    id="footer_company_name"
                    value={settings.footer_company_name || ''}
                    onChange={(e) => handleInputChange('footer_company_name', e.target.value)}
                    placeholder="Dahabiyat"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footer_copyright">Copyright Text</Label>
                  <Input
                    id="footer_copyright"
                    value={settings.footer_copyright || ''}
                    onChange={(e) => handleInputChange('footer_copyright', e.target.value)}
                    placeholder="All rights reserved."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_description">Company Description</Label>
                <Textarea
                  id="footer_description"
                  value={settings.footer_description || ''}
                  onChange={(e) => handleInputChange('footer_description', e.target.value)}
                  placeholder="Experience the magic of the Nile aboard our luxury dahabiyas..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_logo">Footer Logo URL</Label>
                <div className="flex space-x-4">
                  <Input
                    id="footer_logo"
                    value={settings.footer_logo || ''}
                    onChange={(e) => handleInputChange('footer_logo', e.target.value)}
                    placeholder="/images/logo-white.png"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                {settings.footer_logo && (
                  <div className="mt-2 p-4 bg-gray-900 rounded-lg">
                    <Image
                      src={settings.footer_logo}
                      alt="Footer Logo Preview"
                      width={180}
                      height={60}
                      className="filter brightness-0 invert"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Links */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-600" />
                <span>Navigation Links</span>
              </CardTitle>
              <CardDescription>
                Customize footer navigation link labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Anchor className="w-4 h-4 text-amber-500" />
                    <span>Quick Links</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="footer_link_dahabiyat">Dahabiyas Link</Label>
                      <Input
                        id="footer_link_dahabiyat"
                        value={settings.footer_link_dahabiyat || ''}
                        onChange={(e) => handleInputChange('footer_link_dahabiyat', e.target.value)}
                        placeholder="Our Dahabiyas"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footer_link_packages">Packages Link</Label>
                      <Input
                        id="footer_link_packages"
                        value={settings.footer_link_packages || ''}
                        onChange={(e) => handleInputChange('footer_link_packages', e.target.value)}
                        placeholder="Packages"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footer_link_about">About Link</Label>
                      <Input
                        id="footer_link_about"
                        value={settings.footer_link_about || ''}
                        onChange={(e) => handleInputChange('footer_link_about', e.target.value)}
                        placeholder="About Us"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footer_link_contact">Contact Link</Label>
                      <Input
                        id="footer_link_contact"
                        value={settings.footer_link_contact || ''}
                        onChange={(e) => handleInputChange('footer_link_contact', e.target.value)}
                        placeholder="Contact"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-blue-500" />
                    <span>Services Links</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="footer_link_tailor_made">Tailor Made Link</Label>
                      <Input
                        id="footer_link_tailor_made"
                        value={settings.footer_link_tailor_made || ''}
                        onChange={(e) => handleInputChange('footer_link_tailor_made', e.target.value)}
                        placeholder="Tailor Made"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footer_link_excursions">Excursions Link</Label>
                      <Input
                        id="footer_link_excursions"
                        value={settings.footer_link_excursions || ''}
                        onChange={(e) => handleInputChange('footer_link_excursions', e.target.value)}
                        placeholder="Excursions"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footer_link_gallery">Gallery Link</Label>
                      <Input
                        id="footer_link_gallery"
                        value={settings.footer_link_gallery || ''}
                        onChange={(e) => handleInputChange('footer_link_gallery', e.target.value)}
                        placeholder="Gallery"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footer_link_reviews">Reviews Link</Label>
                      <Input
                        id="footer_link_reviews"
                        value={settings.footer_link_reviews || ''}
                        onChange={(e) => handleInputChange('footer_link_reviews', e.target.value)}
                        placeholder="Reviews"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-green-600" />
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>
                Manage your contact details displayed in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+20 123 456 789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="info@altavidatours.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>Address</span>
                </Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ''}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  placeholder="Esna, Luxor, Egypt"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span>Social Media Links</span>
              </CardTitle>
              <CardDescription>
                Add your social media profiles to connect with customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footer_social_facebook" className="flex items-center space-x-2">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook URL</span>
                    </Label>
                    <Input
                      id="footer_social_facebook"
                      value={settings.footer_social_facebook || ''}
                      onChange={(e) => handleInputChange('footer_social_facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer_social_instagram" className="flex items-center space-x-2">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>Instagram URL</span>
                    </Label>
                    <Input
                      id="footer_social_instagram"
                      value={settings.footer_social_instagram || ''}
                      onChange={(e) => handleInputChange('footer_social_instagram', e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer_social_twitter" className="flex items-center space-x-2">
                      <Twitter className="w-4 h-4 text-sky-500" />
                      <span>Twitter URL</span>
                    </Label>
                    <Input
                      id="footer_social_twitter"
                      value={settings.footer_social_twitter || ''}
                      onChange={(e) => handleInputChange('footer_social_twitter', e.target.value)}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footer_social_linkedin" className="flex items-center space-x-2">
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      <span>LinkedIn URL</span>
                    </Label>
                    <Input
                      id="footer_social_linkedin"
                      value={settings.footer_social_linkedin || ''}
                      onChange={(e) => handleInputChange('footer_social_linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer_social_youtube" className="flex items-center space-x-2">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span>YouTube URL</span>
                    </Label>
                    <Input
                      id="footer_social_youtube"
                      value={settings.footer_social_youtube || ''}
                      onChange={(e) => handleInputChange('footer_social_youtube', e.target.value)}
                      placeholder="https://youtube.com/channel/yourchannel"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-2">Social Media Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use full URLs including https://</li>
                      <li>• Leave blank to hide social icons</li>
                      <li>• Icons will appear with platform colors</li>
                      <li>• Links open in new tabs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
