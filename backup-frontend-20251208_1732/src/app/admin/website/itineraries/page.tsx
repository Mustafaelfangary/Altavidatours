'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Save, 
  ArrowLeft, 
  RefreshCw,
  Crown,
  Ship,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ItinerariesPageContent {
  id?: string;
  page: string;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  content: Record<string, any>;
  isActive: boolean;
}

export default function ItinerariesContentManagementPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ItinerariesPageContent>({
    page: 'ITINERARIES',
    section: 'MAIN',
    title: 'Our Itineraries',
    subtitle: 'Discover Ancient Egypt',
    description: 'Explore our carefully crafted itineraries that take you through the wonders of ancient Egypt.',
    content: {
      heroImage: '',
      backgroundImage: '',
      ctaText: 'Explore All Itineraries',
      ctaLink: '/itineraries',
      features: [
        'Expert Egyptologist guides',
        'Luxury accommodations',
        'All meals included',
        'Small group experiences'
      ]
    },
    isActive: true
  });

  // Load existing content
  useEffect(() => {
    if (status === 'authenticated') {
      loadContent();
    }
  }, [status]);

  const loadContent = async () => {
    try {
      setLoadingData(true);
      setError(null);
      
      const response = await fetch('/api/admin/page-content/itineraries', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.id) {
          setFormData(data);
        }
      } else if (response.status === 401) {
        setError('Unauthorized access. Please check your admin permissions.');
        window.location.href = '/auth/signin?callbackUrl=/admin/website/itineraries';
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to load content: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Network error loading content. Please check your connection.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/page-content/itineraries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('🏺 Itineraries page content updated successfully!');
        // Sync public website content keys used by the itineraries page
        try {
          await syncWebsiteContentWithPublicKeys();
        } catch (syncErr) {
          console.warn('Website content sync warning:', syncErr);
        }
        // Notify the site to refresh dynamic content
        try {
          // localStorage event for other tabs
          localStorage.setItem('content-updated', String(Date.now()));
          // BroadcastChannel for SPA listeners
          try {
            const bc = new BroadcastChannel('content-updates');
            bc.postMessage({ type: 'content-updated', page: 'itineraries' });
            bc.close();
          } catch (_) {}
          // Window event for in-page listeners
          window.dispatchEvent(new CustomEvent('content-updated', { detail: { page: 'itineraries', ts: Date.now() } }));
        } catch (_) {}
        loadContent(); // Refresh data
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(`Failed to update content: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Error updating content');
    } finally {
      setLoading(false);
    }
  };

  // Upsert the public website-content keys so the public itineraries page picks up the hero media
  const syncWebsiteContentWithPublicKeys = async () => {
    const updates: Array<{ key: string; title: string; content?: string; mediaUrl?: string; contentType: 'IMAGE' | 'VIDEO'; page: string; section: string; order: number; }> = [];

    const heroImage = formData.content?.heroImage?.trim();
    if (heroImage) {
      updates.push({
        key: 'itineraries_hero_image',
        title: 'Itineraries Hero Image',
        mediaUrl: heroImage,
        contentType: 'IMAGE',
        page: 'itineraries',
        section: 'hero',
        order: 0,
      });
    }

    const heroVideo = (formData.content as any)?.heroVideo?.trim?.();
    if (heroVideo) {
      updates.push({
        key: 'itineraries_hero_video',
        title: 'Itineraries Hero Video',
        mediaUrl: heroVideo,
        contentType: 'VIDEO',
        page: 'itineraries',
        section: 'hero',
        order: 1,
      });
    }

    if (updates.length === 0) return;

    // Send sequentially to ensure order and easier debugging
    for (const u of updates) {
      await fetch('/api/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u),
      });
    }
  };

  const updateContentField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...(formData.content.features || [])];
    features[index] = value;
    updateContentField('features', features);
  };

  const addFeature = () => {
    const features = [...(formData.content.features || []), ''];
    updateContentField('features', features);
  };

  const removeFeature = (index: number) => {
    const features = (formData.content.features || []).filter((_: any, i: number) => i !== index);
    updateContentField('features', features);
  };

  if (status === 'loading' || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading Content Manager...</p>
        </div>
      </div>
    );
  }

  if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h1>
          <p className="text-amber-600">Only administrators may access this content management area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 via-navy-blue-50 to-deep-blue-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-ocean-blue-600 via-navy-blue-600 to-deep-blue-700 rounded-lg shadow-lg">
          <Link
            href="/admin/website"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Website Content
          </Link>
          <div className="flex items-center gap-4">
            <Ship className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">Itineraries Page Content</h1>
              <p className="text-amber-200">Manage the main itineraries page content and settings</p>
            </div>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <Button
                onClick={() => loadContent()}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
              <CardTitle className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                Page Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-amber-800 font-semibold">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Our Itineraries"
                    required
                    className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle" className="text-amber-800 font-semibold">Page Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="e.g., Discover Ancient Egypt"
                    className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-amber-800 font-semibold">Page Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the itineraries page..."
                  className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="heroImage" className="text-amber-800 font-semibold">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    value={formData.content.heroImage || ''}
                    onChange={(e) => updateContentField('heroImage', e.target.value)}
                    placeholder="https://example.com/hero-image.jpg"
                    className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="heroVideo" className="text-amber-800 font-semibold">Hero Video URL</Label>
                  <Input
                    id="heroVideo"
                    value={(formData.content as any).heroVideo || ''}
                    onChange={(e) => updateContentField('heroVideo', e.target.value)}
                    placeholder="https://example.com/hero-video.mp4"
                    className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  />
                  <p className="text-xs text-gray-600 mt-1">Use a direct MP4/WebM URL. A matching poster image is recommended for smooth loading.</p>
                </div>
                <div>
                  <Label htmlFor="backgroundImage" className="text-amber-800 font-semibold">Background Image URL</Label>
                  <Input
                    id="backgroundImage"
                    value={formData.content.backgroundImage || ''}
                    onChange={(e) => updateContentField('backgroundImage', e.target.value)}
                    placeholder="https://example.com/background.jpg"
                    className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ctaText" className="text-amber-800 font-semibold">Call-to-Action Text</Label>
                  <Input
                    id="ctaText"
                    value={formData.content.ctaText || ''}
                    onChange={(e) => updateContentField('ctaText', e.target.value)}
                    placeholder="e.g., Explore All Itineraries"
                    className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="ctaLink" className="text-amber-800 font-semibold">Call-to-Action Link</Label>
                  <Input
                    id="ctaLink"
                    value={formData.content.ctaLink || ''}
                    onChange={(e) => updateContentField('ctaLink', e.target.value)}
                    placeholder="e.g., /itineraries"
                    className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                  />
                </div>
              </div>

              {/* Features Section */}
              <div>
                <Label className="text-amber-800 font-semibold mb-2 block">Key Features</Label>
                <div className="space-y-3">
                  {(formData.content.features || []).map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="e.g., Expert Egyptologist guides"
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="border-red-300 text-red-600 hover:bg-red-50 flex-shrink-0"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFeature}
                    className="border-amber-300 text-amber-600 hover:bg-blue-50"
                  >
                    Add Feature
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive" className="text-amber-800 font-semibold">
                  Page Active (visible to public)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => loadContent()}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Content
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}