import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/settings - Get system settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    // Get all settings from database
    const settingsRecords = await prisma.setting.findMany();
    
    // Convert to key-value object
    const settings = settingsRecords.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);

    // Provide defaults for missing settings
    const defaultSettings = {
      siteName: 'Dahabiyat Nile Cruise',
      siteDescription: 'Luxury Nile River Cruises in Egypt',
      siteUrl: 'https://dahabiyat.com',
      adminEmail: 'admin@dahabiyat.com',
      supportEmail: 'support@dahabiyat.com',
      maintenanceMode: false,
      allowRegistration: true,
      emailNotifications: true,
      smsNotifications: false,
      maxBookingsPerUser: 5,
      bookingCancellationHours: 24,
      defaultCurrency: 'USD',
      timezone: 'Africa/Cairo',
      dateFormat: 'MM/DD/YYYY',
      primaryColor: '#3B82F6',
      secondaryColor: '#F59E0B',
      logoUrl: '/images/logo.png',
      faviconUrl: '/favicon.ico'
    };

    const mergedSettings = { ...defaultSettings, ...settings };

    return NextResponse.json({ settings: mergedSettings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const { settings } = await request.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    // Update each setting in the database
    const updatePromises = Object.entries(settings).map(async ([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { 
          value: typeof value === 'boolean' ? value.toString() : String(value),
          updatedAt: new Date()
        },
        create: { 
          key, 
          value: typeof value === 'boolean' ? value.toString() : String(value)
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      error: 'Failed to update settings',
      message: 'An error occurred while saving settings' 
    }, { status: 500 });
  }
}