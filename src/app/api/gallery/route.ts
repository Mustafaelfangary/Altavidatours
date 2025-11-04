import prisma from '@/lib/prisma';

// Public: GET /api/gallery
import { NextRequest, NextResponse } from 'next/server';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  category: string;
  itemName?: string;
  itemSlug?: string;
  location?: string;
  photographer?: string;
  likes: number;
  views: number;
}

export async function GET(request: NextRequest) {
  try {
    const allImages: GalleryImage[] = [];
    const categoryStats: Record<string, number> = {};

    // 1. Get images from gallery table (uploaded via admin panel)
    try {
      const galleryImages = await prisma.galleryImage.findMany({
        orderBy: { order: 'asc' }
      });

      galleryImages.forEach(image => {
        const category = (image.category || 'gallery').toLowerCase();
        allImages.push({
          id: `gallery-${image.id}`,
          url: image.url,
          alt: image.title || 'Gallery Image',
          caption: image.title || '',
          category: category,
          itemName: image.title,
          itemSlug: undefined,
          location: 'Egypt',
          photographer: undefined,
          likes: 0,
          views: 0,
        });
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });
    } catch (err) {
      console.log('Gallery images not available:', err);
    }

    // 2. Get all media library images (if Media model exists)
    // Note: Media model may not exist in schema, skip for now
    // This can be added later if needed

    // 3. Get images from dahabiyas
    try {
      const dahabiyas = await prisma.dahabiya.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          imageCover: true,
          images: true
        }
      });

      dahabiyas.forEach(dahabiya => {
        // Add main image
        if (dahabiya.imageCover) {
          allImages.push({
            id: `dahabiya-main-${dahabiya.id}`,
            url: dahabiya.imageCover,
            alt: `${dahabiya.name} - Main Image`,
            caption: `${dahabiya.name} Dahabiya`,
            category: 'dahabiya',
            itemName: dahabiya.name,
            itemSlug: dahabiya.slug || dahabiya.id,
            location: 'Nile River, Egypt',
            likes: 0,
            views: 0,
          });
          categoryStats['dahabiya'] = (categoryStats['dahabiya'] || 0) + 1;
        }

        // Add gallery images
        if (Array.isArray(dahabiya.images)) {
          dahabiya.images.forEach((imgUrl, idx) => {
            if (imgUrl) {
              allImages.push({
                id: `dahabiya-gallery-${dahabiya.id}-${idx}`,
                url: imgUrl,
                alt: `${dahabiya.name} - Gallery Image ${idx + 1}`,
                caption: `${dahabiya.name} - Image ${idx + 1}`,
                category: 'dahabiya',
                itemName: dahabiya.name,
                itemSlug: dahabiya.slug || dahabiya.id,
                location: 'Nile River, Egypt',
                likes: 0,
                views: 0,
              });
              categoryStats['dahabiya'] = (categoryStats['dahabiya'] || 0) + 1;
            }
          });
        }
      });
    } catch (err) {
      console.log('Dahabiyas not available:', err);
    }

    // 4. Get images from packages
    try {
      const packages = await prisma.package.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          mainImage: true,
          images: true,
        }
      });

      packages.forEach(pkg => {
        // Add main image
        if (pkg.mainImage) {
          allImages.push({
            id: `package-main-${pkg.id}`,
            url: pkg.mainImage,
            alt: `${pkg.name} - Main Image`,
            caption: `${pkg.name} Package`,
            category: 'package',
            itemName: pkg.name,
            itemSlug: pkg.slug || pkg.id,
            location: 'Egypt',
            likes: 0,
            views: 0,
          });
          categoryStats['package'] = (categoryStats['package'] || 0) + 1;
        }

        // Add gallery images from package images array
        if (Array.isArray(pkg.images)) {
          pkg.images.forEach((imgUrl, idx) => {
            if (imgUrl) {
              allImages.push({
                id: `package-gallery-${pkg.id}-${idx}`,
                url: imgUrl,
                alt: `${pkg.name} - Gallery Image ${idx + 1}`,
                caption: `${pkg.name} - Image ${idx + 1}`,
                category: 'package',
                itemName: pkg.name,
                itemSlug: pkg.slug || pkg.id,
                location: 'Egypt',
                likes: 0,
                views: 0,
              });
              categoryStats['package'] = (categoryStats['package'] || 0) + 1;
            }
          });
        }
      });
    } catch (err) {
      console.log('Packages not available:', err);
    }
    // 5. Itineraries do not have image fields in current schema; skipping

    // Remove duplicates based on URL
    const uniqueImages = Array.from(
      new Map(allImages.map(img => [img.url, img])).values()
    );

    console.log(`✅ Gallery API: Found ${uniqueImages.length} unique images`);
    console.log(`📊 Categories:`, categoryStats);

    return NextResponse.json({
      images: uniqueImages,
      total: uniqueImages.length,
      categories: categoryStats
    });

  } catch (error) {
    console.error('Error fetching gallery:', error);
    
    // Return mock data if database fails - using existing images
    const mockImages = [
      {
        id: 'mock-1',
        url: '/images/1.jpg',
        alt: 'Luxury Dahabiya',
        caption: 'Princess Cleopatra sailing on the Nile',
        category: 'dahabiya',
        itemName: 'Princess Cleopatra',
        itemSlug: 'princess-cleopatra',
        location: 'Nile River, Egypt',
        photographer: 'Dahabiyat Team',
        likes: 45,
        views: 1250
      },
      {
        id: 'mock-2',
        url: '/images/destinations/karnak-temple.jpg',
        alt: 'Ancient Temple',
        caption: 'Karnak Temple Complex',
        category: 'destination',
        location: 'Luxor, Egypt',
        photographer: 'Ahmed Hassan',
        likes: 67,
        views: 2100
      },
      {
        id: 'mock-3',
        url: '/images/experiences/sunset-sailing.jpg',
        alt: 'Nile Sunset',
        caption: 'Magical sunset on the Nile',
        category: 'experience',
        location: 'Nile River, Egypt',
        photographer: 'Sarah Johnson',
        likes: 89,
        views: 1800
      },
      {
        id: 'mock-4',
        url: '/images/11i.jpg',
        alt: 'Dahabiya Experience',
        caption: 'Authentic Nile experience aboard our dahabiyas',
        category: 'package',
        itemName: 'Nile Experience',
        itemSlug: 'nile-experience',
        location: 'Egypt',
        photographer: 'Dahabiyat Team',
        likes: 34,
        views: 950
      },
      {
        id: 'mock-5',
        url: '/images/13i.jpg',
        alt: 'Dahabiya Interior',
        caption: 'Elegant interior of our luxury dahabiyas',
        category: 'dahabiya',
        itemName: 'Luxury Suite',
        itemSlug: 'luxury-suite',
        location: 'Nile River, Egypt',
        photographer: 'Dahabiyat Team',
        likes: 78,
        views: 1650
      },
      {
        id: 'mock-6',
        url: '/images/Corridor/corridor-claeopatra.jpg',
        alt: 'Dahabiya Corridor',
        caption: 'Elegant corridor aboard our dahabiyas',
        category: 'dahabiya',
        itemName: 'Cleopatra Corridor',
        itemSlug: 'cleopatra-corridor',
        location: 'Nile River, Egypt',
        photographer: 'Dahabiyat Team',
        likes: 52,
        views: 1420
      }
    ];

    return NextResponse.json({
      images: mockImages,
      total: mockImages.length,
      categories: {
        dahabiya: 3,
        package: 1,
        destination: 1,
        experience: 1,
      }
    });
  }
}
