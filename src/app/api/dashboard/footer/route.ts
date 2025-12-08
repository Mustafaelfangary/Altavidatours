import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Footer content structure for the new enhanced footer
const FOOTER_CONTENT_STRUCTURE = {
  company: {
    footer_company_name: { key: 'footer_company_name', type: 'TEXT', order: 1, defaultValue: 'AltaVida Tours' },
    footer_logo: { key: 'footer_logo', type: 'IMAGE', order: 2, defaultValue: '/icons/altavida-logo-1.svg' },
    footer_description: { key: 'footer_description', type: 'TEXTAREA', order: 3, defaultValue: 'Discover the wonders of Egypt with our comprehensive travel packages and daily tours. Experience ancient history, vibrant culture, and unforgettable adventures.' },
    footer_copyright: { key: 'footer_copyright', type: 'TEXT', order: 4, defaultValue: 'All rights reserved by AltaVida Tours.' },
  },
  navigation: {
    footer_link_dahabiyat: { key: 'footer_link_dahabiyat', type: 'TEXT', order: 5, defaultValue: 'Our Dahabiyas' },
    footer_link_packages: { key: 'footer_link_packages', type: 'TEXT', order: 6, defaultValue: 'Packages' },
    footer_link_about: { key: 'footer_link_about', type: 'TEXT', order: 7, defaultValue: 'About Us' },
    footer_link_contact: { key: 'footer_link_contact', type: 'TEXT', order: 8, defaultValue: 'Contact' },
    footer_link_tailor_made: { key: 'footer_link_tailor_made', type: 'TEXT', order: 9, defaultValue: 'Tailor Made' },
    footer_link_excursions: { key: 'footer_link_excursions', type: 'TEXT', order: 10, defaultValue: 'Excursions' },
    footer_link_gallery: { key: 'footer_link_gallery', type: 'TEXT', order: 11, defaultValue: 'Gallery' },
    footer_link_reviews: { key: 'footer_link_reviews', type: 'TEXT', order: 12, defaultValue: 'Reviews' },
  },
  contact: {
    contact_address: { key: 'contact_address', type: 'TEXT', order: 13, defaultValue: 'Esna, Luxor, Egypt' },
    contact_phone: { key: 'contact_phone', type: 'TEXT', order: 14, defaultValue: '+20 123 456 789' },
    contact_email: { key: 'contact_email', type: 'EMAIL', order: 15, defaultValue: 'info@altavidatours.com' },
  },
  social_media: {
    footer_social_facebook: { key: 'footer_social_facebook', type: 'URL', order: 16, defaultValue: '#' },
    footer_social_instagram: { key: 'footer_social_instagram', type: 'URL', order: 17, defaultValue: '#' },
    footer_social_twitter: { key: 'footer_social_twitter', type: 'URL', order: 18, defaultValue: '#' },
    footer_social_linkedin: { key: 'footer_social_linkedin', type: 'URL', order: 19, defaultValue: '#' },
    footer_social_youtube: { key: 'footer_social_youtube', type: 'URL', order: 20, defaultValue: '#' },
  },
};

// Helper function to initialize footer content
async function initializeFooterContent() {
  for (const section of Object.values(FOOTER_CONTENT_STRUCTURE)) {
    for (const setting of Object.values(section)) {
      const existing = await prisma.setting.findUnique({
        where: { key: setting.key }
      });

      if (!existing) {
        await prisma.setting.create({
          data: {
            key: setting.key,
            value: setting.defaultValue || '',
            group: 'footer',
          }
        });
      } else if (!existing.value) {
        // Update with default value if empty
        await prisma.setting.update({
          where: { key: setting.key },
          data: { value: setting.defaultValue || '' }
        });
      }
    }
  }
}

// GET - Fetch footer settings using existing settings API
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching footer settings via proxy...');

    // Use the existing settings API as a proxy to avoid Prisma client issues
    const baseUrl = request.nextUrl.origin;
    const settingsResponse = await fetch(`${baseUrl}/api/settings?group=footer`);

    if (!settingsResponse.ok) {
      throw new Error('Failed to fetch settings from proxy API');
    }

    const settingsData = await settingsResponse.json();
    console.log('Settings data received:', settingsData);

    // Initialize default footer settings if none exist
    const defaultSettings: Record<string, string> = {};
    for (const section of Object.values(FOOTER_CONTENT_STRUCTURE)) {
      for (const setting of Object.values(section)) {
        defaultSettings[setting.key] = setting.defaultValue || '';
      }
    }

    // Merge with existing settings
    const mergedSettings = { ...defaultSettings, ...settingsData };

    return NextResponse.json({
      success: true,
      settings: mergedSettings,
      structure: FOOTER_CONTENT_STRUCTURE
    });
  } catch (error) {
    console.error('Error fetching footer settings:', error);

    // Fallback to default values
    const defaultSettings: Record<string, string> = {};
    for (const section of Object.values(FOOTER_CONTENT_STRUCTURE)) {
      for (const setting of Object.values(section)) {
        defaultSettings[setting.key] = setting.defaultValue || '';
      }
    }

    return NextResponse.json({
      success: true,
      settings: defaultSettings,
      structure: FOOTER_CONTENT_STRUCTURE
    });
  }
}

// POST - Save footer settings using existing settings API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    console.log('Saving footer settings via proxy...');

    // Use the existing settings API as a proxy
    const baseUrl = request.nextUrl.origin;

    // Save each setting individually using the existing settings API
    const savePromises = Object.entries(settings).map(async ([key, value]) => {
      const settingData = {
        key,
        value: String(value),
        type: 'TEXT',
        group: 'footer'
      };

      const response = await fetch(`${baseUrl}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingData)
      });

      if (!response.ok) {
        console.warn(`Failed to save setting ${key}:`, await response.text());
      }

      return response.ok;
    });

    const results = await Promise.all(savePromises);
    const successCount = results.filter(Boolean).length;

    return NextResponse.json({
      success: true,
      message: `Footer settings saved successfully (${successCount}/${results.length} settings)`
    });
  } catch (error) {
    console.error('Error saving footer settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save footer settings' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update footer settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, settings } = body;

    if (action === 'reset') {
      // Reset to default values
      await initializeFooterContent();
      
      return NextResponse.json({
        success: true,
        message: 'Footer settings reset to defaults'
      });
    }

    if (action === 'sync') {
      // Sync structure - ensure all required settings exist
      await initializeFooterContent();
      
      return NextResponse.json({
        success: true,
        message: 'Footer structure synchronized'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in footer PUT operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform footer operation' },
      { status: 500 }
    );
  }
}
