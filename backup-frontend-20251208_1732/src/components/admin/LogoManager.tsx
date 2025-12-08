'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Trash2, Upload, Eye, EyeOff, RefreshCw, Image as ImageIcon, Check, X, Loader2, Save } from 'lucide-react';
import { notifyLogoUpdate } from '@/lib/logo-refresh';
import Image from 'next/image';

interface LogoData {
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: string;
}

export default function LogoManager() {
  const [logos, setLogos] = useState<LogoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [logoUrls, setLogoUrls] = useState({
    site_logo: '',
    navbar_logo: '',
    footer_logo: '',
    site_favicon: ''
  });

  const logoTypes = [
    { key: 'site_logo', title: 'Main Site Logo', description: 'Primary logo used across the website' },
    { key: 'navbar_logo', title: 'Navigation Logo', description: 'Logo displayed in the navigation bar' },
    { key: 'footer_logo', title: 'Footer Logo', description: 'Logo displayed in the website footer' },
    { key: 'site_favicon', title: 'Favicon', description: 'Small icon displayed in browser tabs' }
  ];

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/logo', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        const logoData = await response.json();
        setLogos(logoData);
        
        // Update local state with current logo URLs
        const urls = { ...logoUrls };
        logoData.forEach((logo: LogoData) => {
          if (logo.key in urls) {
            urls[logo.key as keyof typeof urls] = logo.content || '';
          }
        });
        setLogoUrls(urls);
      }
    } catch (error) {
      console.error('Error loading logos:', error);
      toast.error('Failed to load logos');
    } finally {
      setLoading(false);
    }
  };

  const updateLogo = async (logoType: string, logoUrl: string) => {
    if (!logoUrl || !logoUrl.trim()) {
      toast.error('Please enter a valid logo URL');
      return;
    }

    setSaving(logoType);
    try {
      // Map the logoType correctly for the API
      let apiLogoType = logoType;
      if (logoType === 'site_logo') apiLogoType = 'site';
      else if (logoType === 'navbar_logo') apiLogoType = 'navbar';
      else if (logoType === 'footer_logo') apiLogoType = 'footer';
      else if (logoType === 'site_favicon') apiLogoType = 'favicon';

      const response = await fetch('/api/admin/logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoType: apiLogoType,
          logoUrl: logoUrl.trim()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Optimistically update the state immediately (no flash)
        setLogoUrls(prev => ({
          ...prev,
          [logoType]: logoUrl.trim()
        }));
        
        // Update the logos array to keep everything in sync
        setLogos(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(logo => logo.key === logoType);
          
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              content: logoUrl.trim()
            };
          } else {
            // Add new logo entry if it doesn't exist
            updated.push({
              id: result.id || `temp-${logoType}`,
              key: logoType,
              title: logoType.charAt(0).toUpperCase() + logoType.slice(1).replace('_', ' ') + ' Logo',
              content: logoUrl.trim(),
              contentType: 'IMAGE'
            });
          }
          
          return updated;
        });
        
        toast.success(`${logoType.replace('_', ' ')} updated successfully!`);
        
        // Broadcast logo update to all tabs/windows
        try {
          const bc = new BroadcastChannel('content-updates');
          bc.postMessage({ 
            type: 'logo-updated', 
            logoType,
            logoUrl: logoUrl.trim(),
            timestamp: Date.now()
          });
          bc.close();
        } catch (broadcastError) {
          console.log('Broadcast channel not supported:', broadcastError);
        }
        
        // Trigger storage event for same-tab updates
        try {
          localStorage.setItem('logo-updated', Date.now().toString());
          localStorage.removeItem('logo-updated');
        } catch (storageError) {
          console.log('Local storage not available:', storageError);
        }
        
        // Trigger window events for immediate updates
        window.dispatchEvent(new CustomEvent('logo-updated', {
          detail: { logoType, logoUrl: logoUrl.trim(), timestamp: Date.now() }
        }));
        
        window.dispatchEvent(new CustomEvent('content-updated', {
          detail: { type: 'logo', logoType, logoUrl: logoUrl.trim() }
        }));
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update logo');
      }
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update logo');
    } finally {
      setSaving(null);
    }
  };

  const uploadLogoFile = async (logoType: string, file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB.');
      return;
    }

    setSaving(logoType);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Map the logoType correctly for the API
      let apiLogoType = logoType;
      if (logoType === 'site_logo') apiLogoType = 'site';
      else if (logoType === 'navbar_logo') apiLogoType = 'navbar';
      else if (logoType === 'footer_logo') apiLogoType = 'footer';
      else if (logoType === 'site_favicon') apiLogoType = 'favicon';
      
      formData.append('logoType', apiLogoType);

      const response = await fetch('/api/admin/logo/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the state with the new logo URL
        const newLogoUrl = result.logoUrl;
        setLogoUrls(prev => ({
          ...prev,
          [logoType]: newLogoUrl
        }));
        
        // Update the logos array
        setLogos(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(logo => logo.key === logoType);
          
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              content: newLogoUrl
            };
          } else {
            updated.push({
              id: result.logoContent.id || `temp-${logoType}`,
              key: logoType,
              title: logoType.charAt(0).toUpperCase() + logoType.slice(1).replace('_', ' ') + ' Logo',
              content: newLogoUrl,
              contentType: 'IMAGE'
            });
          }
          
          return updated;
        });
        
        toast.success(`${logoType.replace('_', ' ')} uploaded and updated successfully!`);
        
        // Notify all components to refresh logos
        await notifyLogoUpdate();
        
        // Broadcast logo update to all tabs/windows
        try {
          const bc = new BroadcastChannel('content-updates');
          bc.postMessage({ 
            type: 'logo-updated', 
            logoType,
            logoUrl: newLogoUrl,
            timestamp: Date.now()
          });
          bc.close();
        } catch (broadcastError) {
          console.log('Broadcast channel not supported:', broadcastError);
        }
        
        // Trigger storage event for same-tab updates
        try {
          localStorage.setItem('logo-updated', Date.now().toString());
          localStorage.removeItem('logo-updated');
        } catch (storageError) {
          console.log('Local storage not available:', storageError);
        }
        
        // Trigger window events for immediate updates
        window.dispatchEvent(new CustomEvent('logo-updated', {
          detail: { logoType, logoUrl: newLogoUrl, timestamp: Date.now() }
        }));
        
        window.dispatchEvent(new CustomEvent('content-updated', {
          detail: { type: 'logo', logoType, logoUrl: newLogoUrl }
        }));
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload logo');
    } finally {
      setSaving(null);
    }
  };

  const handleLogoUrlChange = (logoType: string, url: string) => {
    setLogoUrls(prev => ({
      ...prev,
      [logoType]: url
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading logos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-600" />
              Logo Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your website logos and branding elements
            </p>
          </div>
          <Button onClick={loadLogos} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logoTypes.map((logoType) => {
            const currentUrl = logoUrls[logoType.key as keyof typeof logoUrls];
            const isSaving = saving === logoType.key;
            
            return (
              <Card key={logoType.key} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    {logoType.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{logoType.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Logo Preview */}
                  {currentUrl && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Current Logo
                      </Label>
                      <div className="relative inline-block">
                        <Image
                          src={currentUrl}
                          alt={logoType.title}
                          width={logoType.key === 'site_favicon' ? 32 : 120}
                          height={logoType.key === 'site_favicon' ? 32 : 40}
                          className={`${logoType.key === 'site_favicon' ? 'w-8 h-8' : 'h-10 w-auto'} object-contain border rounded`}
                          key={`${logoType.key}-${currentUrl}`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 break-all font-mono bg-white p-2 rounded border">
                        {currentUrl}
                      </div>
                    </div>
                  )}

                  {/* Logo URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`${logoType.key}_url`} className="text-sm font-medium">
                      Logo URL
                    </Label>
                    <Input
                      id={`${logoType.key}_url`}
                      type="url"
                      value={currentUrl}
                      onChange={(e) => handleLogoUrlChange(logoType.key, e.target.value)}
                      placeholder={`Enter ${logoType.title.toLowerCase()} URL...`}
                      className="w-full"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateLogo(logoType.key, currentUrl)}
                      disabled={isSaving || !currentUrl || !currentUrl.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Logo
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Open file picker for logo upload
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            await uploadLogoFile(logoType.key, file);
                          }
                        };
                        input.click();
                      }}
                      disabled={isSaving}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isSaving ? 'Uploading...' : 'Upload File'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const defaultLogo = '/images/logo.png';
                try {
                  // Update the URLs in the state
                  Object.keys(logoUrls).forEach(key => {
                    handleLogoUrlChange(key, defaultLogo);
                  });
                  
                  // Show a success message
                  toast.success('Reset to default URLs. Click "Save Logo" on each to apply.');
                } catch (error) {
                  console.error('Error resetting logos:', error);
                  toast.error('Failed to reset logos');
                }
              }}
              disabled={saving !== null}
            >
              Reset to Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const mainLogo = logoUrls.site_logo;
                if (mainLogo && mainLogo.trim()) {
                  try {
                    handleLogoUrlChange('navbar_logo', mainLogo);
                    handleLogoUrlChange('footer_logo', mainLogo);
                    toast.success('Applied main logo to navbar and footer. Click "Save Logo" to apply.');
                  } catch (error) {
                    console.error('Error applying main logo:', error);
                    toast.error('Failed to apply main logo');
                  }
                } else {
                  toast.error('Please set a main site logo first');
                }
              }}
              disabled={saving !== null || !logoUrls.site_logo}
            >
              Use Main Logo Everywhere
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
