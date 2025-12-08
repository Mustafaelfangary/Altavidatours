import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const logoType = formData.get('logoType') as string;

    if (!file || !logoType) {
      return NextResponse.json(
        { error: 'File and logo type are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${logoType}-${uuidv4()}.${fileExtension}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'logos');
    
    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = join(uploadDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(filePath, fileBuffer);

    // Generate URL path
    const logoUrl = `/uploads/logos/${fileName}`;

    // Map logo types to their keys
    const logoKeyMap: Record<string, string> = {
      'site': 'site_logo',
      'navbar': 'navbar_logo', 
      'footer': 'footer_logo',
      'favicon': 'site_favicon'
    };

    const key = logoKeyMap[logoType];
    if (!key) {
      return NextResponse.json(
        { error: 'Invalid logo type' },
        { status: 400 }
      );
    }

    // Update database
    const logoContent = await prisma.websiteContent.upsert({
      where: { key },
      update: {
        content: logoUrl,
        contentType: 'IMAGE',
        page: 'branding_settings',
        section: 'branding',
        isActive: true
      },
      create: {
        key,
        title: `${logoType.charAt(0).toUpperCase() + logoType.slice(1)} Logo`,
        content: logoUrl,
        contentType: 'IMAGE',
        page: 'branding_settings',
        section: 'branding',
        order: logoType === 'site' ? 1 : logoType === 'navbar' ? 2 : logoType === 'footer' ? 3 : 4,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      logoUrl,
      fileName,
      logoContent
    });

  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Failed to upload logo' },
      { status: 500 }
    );
  }
}
