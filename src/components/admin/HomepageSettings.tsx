"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

const settingSchema = z.object({
  key: z.string(),
  value: z.string(),
  group: z.string(),
  description: z.string(),
  type: z.enum(['text', 'textarea', 'image', 'video']),
});

type Setting = z.infer<typeof settingSchema>;

const SECTIONS = {
  hero: {
    title: 'Hero Section',
    settings: ['home_hero_headline', 'home_hero_subheadline', 'home_hero_image', 'home_hero_video']
  },
  what_is_dahabiya: {
    title: 'What is Dahabiya',
    settings: [
      'home_what_is_dahabiya_title',
      'home_what_is_dahabiya_description',
      'home_what_is_dahabiya_image'
    ]
  },
  about: {
    title: 'About Section',
    settings: ['home_about_title', 'home_about_text', 'home_about_image']
  },
  memories: {
    title: 'Share Your Memories',
    settings: [
      'home_memories_headline',
      'home_memories_text',
      'home_memories_gallery_1',
      'home_memories_gallery_2',
      'home_memories_gallery_3',
      'home_memories_gallery_4',
      'home_memories_gallery_5',
      'home_memories_gallery_6'
    ]
  },
  boats: {
    title: 'Our Boats',
    settings: [
      'home_boats_section_title',
      ...Array.from({ length: 4 }).flatMap((_, i) => [
        `home_boats_${i+1}_title`,
        `home_boats_${i+1}_desc`,
        `home_boats_${i+1}_image`
      ])
    ]
  },
  tours: {
    title: 'Sailing Tours',
    settings: [
      'home_tours_section_title',
      ...Array.from({ length: 3 }).flatMap((_, i) => [
        `home_tours_${i+1}_title`,
        `home_tours_${i+1}_desc`,
        `home_tours_${i+1}_price`,
        `home_tours_${i+1}_duration`,
        `home_tours_${i+1}_cabins`,
        `home_tours_${i+1}_image`
      ])
    ]
  },
  why: {
    title: 'Why Dahabiya',
    settings: ['home_why_title', 'home_why_text']
  },
  how: {
    title: 'How it Works',
    settings: [
      'home_how_section_title',
      ...Array.from({ length: 3 }).flatMap((_, i) => [
        `home_how_${i+1}_title`,
        `home_how_${i+1}_desc`,
        `home_how_${i+1}_icon`
      ])
    ]
  },
  blog: {
    title: 'Blog',
    settings: [
      'home_blog_section_title',
      ...Array.from({ length: 3 }).flatMap((_, i) => [
        `home_blog_${i+1}_title`,
        `home_blog_${i+1}_date`,
        `home_blog_${i+1}_excerpt`,
        `home_blog_${i+1}_image`,
        `home_blog_${i+1}_category`
      ])
    ]
  },
  contact: {
    title: 'Contact/Support',
    settings: ['home_contact_title', 'home_contact_text', 'home_contact_phone', 'home_contact_email']
  },
  footer: {
    title: 'Footer',
    settings: ['home_footer_logo', 'home_footer_text', 'home_footer_company', 'home_footer_support', 'home_footer_copyright']
  },
  featured: {
    title: 'Featured Cruises',
    settings: [
      'home_featured_title',
      'home_featured_1_title',
      'home_featured_1_desc',
      'home_featured_1_image',
      'home_featured_2_title',
      'home_featured_2_desc',
      'home_featured_2_image',
      'home_featured_3_title',
      'home_featured_3_desc',
      'home_featured_3_image',
    ]
  },
  our_story: {
    title: 'Our Story',
    settings: [
      'home_our_story_title',
      'home_our_story_content',
      'home_our_story_image',
    ]
  },
};

export default function HomepageSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaSetting, setCurrentMediaSetting] = useState<Setting | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<Setting>({
    resolver: zodResolver(settingSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?group=homepage');
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const data = await response.json();
      const formattedSettings = Object.entries(data).map(([key, value]) => ({
        key,
        value: value as string,
        group: 'homepage',
        description: getSettingDescription(key),
        type: getSettingType(key)
      }));
      
      setSettings(formattedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      site_name: 'The name of your website',
      site_description: 'A brief description of your website',
      site_logo: 'Your website logo',
      site_favicon: 'Website favicon',
      hero_title: 'Main hero section title',
      hero_subtitle: 'Main hero section subtitle',
      hero_image: 'Hero section background image',
      hero_video: 'Hero section background video',
      featured_cruises_title: 'Featured cruises section title',
      featured_cruises_subtitle: 'Featured cruises section subtitle',
      why_choose_us_title: 'Why choose us section title',
      why_choose_us_subtitle: 'Why choose us section subtitle',
      why_choose_us_image: 'Why choose us section image',
      testimonials_title: 'Testimonials section title',
      testimonials_subtitle: 'Testimonials section subtitle',
      testimonials_background: 'Testimonials section background image',
      cta_title: 'Call to action section title',
      cta_subtitle: 'Call to action section subtitle',
      cta_button_text: 'Call to action button text',
      cta_background: 'Call to action section background image',
      footer_logo: 'Footer logo',
      footer_background: 'Footer background image'
    };
    return descriptions[key] || key.replace(/_/g, ' ');
  };

  const getSettingType = (key: string): 'text' | 'textarea' | 'image' | 'video' => {
    if (key.includes('image') || key.includes('logo') || key.includes('favicon')) return 'image';
    if (key.includes('video')) return 'video';
    if (key.includes('subtitle') || key.includes('content') || key.includes('description') || key.includes('desc')) return 'textarea';
    return 'text';
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          group: 'homepage',
        }),
      });

      if (!response.ok) throw new Error('Update failed');

      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  const handleMediaLibrarySelect = async (asset: any) => {
    if (!currentMediaSetting) return;

    try {
      await updateSetting(currentMediaSetting.key, asset.url);
      setShowMediaLibrary(false);
      setCurrentMediaSetting(null);
    } catch (error) {
      console.error('Error updating media:', error);
      toast.error('Failed to update media');
    }
  };

  const openMediaLibrary = (setting: Setting) => {
    setCurrentMediaSetting(setting);
    setShowMediaLibrary(true);
  };

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'textarea':
        return (
          <Textarea
            {...register(`value`)}
            defaultValue={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="min-h-[100px]"
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            {setting.value && (
              <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                <Image
                  src={setting.value}
                  alt={setting.description || setting.key}
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
        );
      case 'video':
        return (
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
        );
      default:
        return (
          <Input
            {...register(`value`)}
            defaultValue={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Homepage Settings</h2>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid grid-cols-4 gap-2 mb-6">
          {Object.entries(SECTIONS).map(([key, section]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(SECTIONS).map(([key, section]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {settings
                    .filter((setting) => section.settings.includes(setting.key))
                    .map((setting) => (
                      <div key={setting.key} className="space-y-2">
                        <label className="text-sm font-medium">
                          {setting.description}
                        </label>
                        {renderSettingInput(setting)}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
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
          currentMediaSetting?.type === 'video'
            ? ['VIDEO']
            : currentMediaSetting?.type === 'image'
            ? ['IMAGE']
            : ['IMAGE', 'VIDEO']
        }
        title={`Select ${currentMediaSetting?.type === 'video' ? 'Video' : currentMediaSetting?.type === 'image' ? 'Image' : 'Media'} for ${currentMediaSetting?.description || ''}`}
      />
    </div>
  );
}

