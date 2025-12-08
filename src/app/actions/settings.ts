'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  category: z.enum(['homepage', 'contact', 'social', 'seo', 'appearance', 'booking', 'payment', 'email']).transform(val => val.toLowerCase()),
});

export async function createSetting(formData: FormData) {
  const validated = settingSchema.parse({
    key: formData.get('key'),
    value: formData.get('value'),
    category: formData.get('category'),
  });

  try {
    const setting = await prisma.setting.create({
      data: {
        key: validated.key,
        value: validated.value,
        group: validated.category,
      },
    });

    revalidatePath('/dashboard/settings');
    return { success: true, data: setting };
  } catch (error) {
    return { success: false, error: 'Failed to create setting' };
  }
}

export async function updateSetting(formData: FormData) {
  const validated = settingSchema.parse({
    key: formData.get('key'),
    value: formData.get('value'),
    category: formData.get('category'),
  });

  try {
    // For video URLs, ensure they are properly formatted
    if (validated.key === 'home_hero_video_url') {
      const videoUrl = validated.value.trim();
      if (videoUrl && !videoUrl.startsWith('/')) {
        validated.value = `/${videoUrl}`;
      }
    }

    // Handle missing images by providing default images
    if (validated.key.includes('_image') || validated.key.includes('_logo')) {
      const imageUrl = validated.value.trim();
      if (!imageUrl) {
        // Set default images based on the key
        switch (validated.key) {
          case 'home_hero_image':
            validated.value = '/images/hero-bg.jpg';
            break;
          case 'home_story_image':
            validated.value = '/images/create-story.jpg';
            break;
          case 'home_why_dahabiya_image':
            validated.value = '/images/why-dahabiya.jpg';
            break;
          case 'home_what_is_dahabiya_image':
            validated.value = '/images/what-is-dahabiya.jpg';
            break;
          case 'home_share_memories_image':
            validated.value = '/images/share-memories.jpg';
            break;
          case 'footer_logo':
            validated.value = '/images/logo-white.png';
            break;
          default:
            validated.value = '/images/logo.png'; // Fallback to main logo
        }
      }
    }

    const setting = await prisma.setting.update({
      where: { key: validated.key },
      data: {
        value: validated.value,
        group: validated.category,
      },
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/'); // Revalidate homepage to show updated video
    return { success: true, data: setting };
  } catch (error) {
    console.error('Failed to update setting:', error);
    return { success: false, error: 'Failed to update setting' };
  }
}

export async function deleteSetting(key: string) {
  try {
    await prisma.setting.delete({
      where: { key: key },
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete setting' };
  }
}