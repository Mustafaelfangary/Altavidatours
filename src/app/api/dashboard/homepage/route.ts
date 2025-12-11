import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for homepage content validation
const homepageContentSchema = z.object({
  key: z.string().min(1),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
});

const updateHomepageContentSchema = z.object({
  updates: z.array(homepageContentSchema),
});

// Define homepage content structure
const HOMEPAGE_CONTENT_STRUCTURE = [
  // Hero Section
  { key: 'homepage_hero_title', title: 'Hero Title', contentType: 'TEXT', section: 'hero', order: 1 },
  { key: 'homepage_hero_subtitle', title: 'Hero Subtitle', contentType: 'TEXT', section: 'hero', order: 2 },
  { key: 'homepage_hero_description', title: 'Hero Description', contentType: 'TEXTAREA', section: 'hero', order: 3 },
  { key: 'homepage_hero_cta_text', title: 'Hero CTA Button Text', contentType: 'TEXT', section: 'hero', order: 4 },
  { key: 'homepage_hero_cta_link', title: 'Hero CTA Link', contentType: 'TEXT', section: 'hero', order: 5 },
  { key: 'homepage_hero_image', title: 'Hero Background Image', contentType: 'IMAGE', section: 'hero', order: 6 },
  { key: 'homepage_hero_video', title: 'Hero Background Video', contentType: 'VIDEO', section: 'hero', order: 7 },

  // Dahabiya Section
  { key: 'homepage_dahabiya_title', title: 'What is Dahabiya Title', contentType: 'TEXT', section: 'dahabiya', order: 1 },
  { key: 'homepage_dahabiya_content', title: 'What is Dahabiya Content', contentType: 'TEXTAREA', section: 'dahabiya', order: 2 },
  { key: 'homepage_dahabiya_image', title: 'Dahabiya Section Image', contentType: 'IMAGE', section: 'dahabiya', order: 3 },

  // Why Different Section
  { key: 'homepage_why_different_title', title: 'Why Different Title', contentType: 'TEXT', section: 'why_different', order: 1 },
  { key: 'homepage_why_different_content', title: 'Why Different Content', contentType: 'TEXTAREA', section: 'why_different', order: 2 },

  // Features Section
  { key: 'homepage_features_title', title: 'Features Section Title', contentType: 'TEXT', section: 'features', order: 1 },
  { key: 'homepage_features_subtitle', title: 'Features Section Subtitle', contentType: 'TEXT', section: 'features', order: 2 },
  { key: 'homepage_feature_1_title', title: 'Feature 1 Title', contentType: 'TEXT', section: 'features', order: 3 },
  { key: 'homepage_feature_1_description', title: 'Feature 1 Description', contentType: 'TEXTAREA', section: 'features', order: 4 },
  { key: 'homepage_feature_2_title', title: 'Feature 2 Title', contentType: 'TEXT', section: 'features', order: 5 },
  { key: 'homepage_feature_2_description', title: 'Feature 2 Description', contentType: 'TEXTAREA', section: 'features', order: 6 },
  { key: 'homepage_feature_3_title', title: 'Feature 3 Title', contentType: 'TEXT', section: 'features', order: 7 },
  { key: 'homepage_feature_3_description', title: 'Feature 3 Description', contentType: 'TEXTAREA', section: 'features', order: 8 },
  { key: 'homepage_feature_4_title', title: 'Feature 4 Title', contentType: 'TEXT', section: 'features', order: 9 },
  { key: 'homepage_feature_4_description', title: 'Feature 4 Description', contentType: 'TEXTAREA', section: 'features', order: 10 },

  // Story Section
  { key: 'homepage_story_title', title: 'Our Story Title', contentType: 'TEXT', section: 'story', order: 1 },
  { key: 'homepage_story_content', title: 'Our Story Content', contentType: 'TEXTAREA', section: 'story', order: 2 },
  { key: 'homepage_story_ceo_name', title: 'CEO Name', contentType: 'TEXT', section: 'story', order: 3 },
  { key: 'homepage_story_ceo_title', title: 'CEO Title', contentType: 'TEXT', section: 'story', order: 4 },
  { key: 'homepage_story_ceo_image', title: 'CEO Profile Image', contentType: 'IMAGE', section: 'story', order: 5 },

  // Featured Cruises Section
  { key: 'homepage_featured_title', title: 'Featured Cruises Title', contentType: 'TEXT', section: 'featured', order: 1 },
  { key: 'homepage_featured_subtitle', title: 'Featured Cruises Subtitle', contentType: 'TEXT', section: 'featured', order: 2 },
  { key: 'homepage_featured_1_title', title: 'Featured Cruise 1 Title', contentType: 'TEXT', section: 'featured', order: 3 },
  { key: 'homepage_featured_1_description', title: 'Featured Cruise 1 Description', contentType: 'TEXTAREA', section: 'featured', order: 4 },
  { key: 'homepage_featured_1_image', title: 'Featured Cruise 1 Image', contentType: 'IMAGE', section: 'featured', order: 5 },
  { key: 'homepage_featured_2_title', title: 'Featured Cruise 2 Title', contentType: 'TEXT', section: 'featured', order: 6 },
  { key: 'homepage_featured_2_description', title: 'Featured Cruise 2 Description', contentType: 'TEXTAREA', section: 'featured', order: 7 },
  { key: 'homepage_featured_2_image', title: 'Featured Cruise 2 Image', contentType: 'IMAGE', section: 'featured', order: 8 },
  { key: 'homepage_featured_3_title', title: 'Featured Cruise 3 Title', contentType: 'TEXT', section: 'featured', order: 9 },
  { key: 'homepage_featured_3_description', title: 'Featured Cruise 3 Description', contentType: 'TEXTAREA', section: 'featured', order: 10 },
  { key: 'homepage_featured_3_image', title: 'Featured Cruise 3 Image', contentType: 'IMAGE', section: 'featured', order: 11 },

  // Memories Section
  { key: 'homepage_memories_title', title: 'Memories Section Title', contentType: 'TEXT', section: 'memories', order: 1 },
  { key: 'homepage_memories_subtitle', title: 'Memories Section Subtitle', contentType: 'TEXT', section: 'memories', order: 2 },
  { key: 'homepage_memories_content', title: 'Memories Section Content', contentType: 'TEXTAREA', section: 'memories', order: 3 },
  { key: 'homepage_memories_gallery_1', title: 'Memory Gallery Image 1', contentType: 'IMAGE', section: 'memories', order: 4 },
  { key: 'homepage_memories_gallery_2', title: 'Memory Gallery Image 2', contentType: 'IMAGE', section: 'memories', order: 5 },
  { key: 'homepage_memories_gallery_3', title: 'Memory Gallery Image 3', contentType: 'IMAGE', section: 'memories', order: 6 },
  { key: 'homepage_memories_gallery_4', title: 'Memory Gallery Image 4', contentType: 'IMAGE', section: 'memories', order: 7 },

  // Testimonials Section
  { key: 'homepage_testimonials_title', title: 'Testimonials Section Title', contentType: 'TEXT', section: 'testimonials', order: 1 },
  { key: 'homepage_testimonials_subtitle', title: 'Testimonials Section Subtitle', contentType: 'TEXT', section: 'testimonials', order: 2 },
  { key: 'homepage_testimonial_1_name', title: 'Testimonial 1 Name', contentType: 'TEXT', section: 'testimonials', order: 3 },
  { key: 'homepage_testimonial_1_text', title: 'Testimonial 1 Text', contentType: 'TEXTAREA', section: 'testimonials', order: 4 },
  { key: 'homepage_testimonial_2_name', title: 'Testimonial 2 Name', contentType: 'TEXT', section: 'testimonials', order: 5 },
  { key: 'homepage_testimonial_2_text', title: 'Testimonial 2 Text', contentType: 'TEXTAREA', section: 'testimonials', order: 6 },
  { key: 'homepage_testimonial_3_name', title: 'Testimonial 3 Name', contentType: 'TEXT', section: 'testimonials', order: 7 },
  { key: 'homepage_testimonial_3_text', title: 'Testimonial 3 Text', contentType: 'TEXTAREA', section: 'testimonials', order: 8 },

  // Gallery Section
  { key: 'homepage_gallery_title', title: 'Gallery Section Title', contentType: 'TEXT', section: 'gallery', order: 1 },
  { key: 'homepage_gallery_subtitle', title: 'Gallery Section Subtitle', contentType: 'TEXT', section: 'gallery', order: 2 },

  // CTA Section
  { key: 'homepage_cta_title', title: 'CTA Section Title', contentType: 'TEXT', section: 'cta', order: 1 },
  { key: 'homepage_cta_subtitle', title: 'CTA Section Subtitle', contentType: 'TEXT', section: 'cta', order: 2 },
  { key: 'homepage_cta_button_text', title: 'CTA Button Text', contentType: 'TEXT', section: 'cta', order: 3 },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all homepage content blocks
    const contentBlocks = await prisma.websiteContent.findMany({
      where: {
        page: 'homepage',
        isActive: true,
      },
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      blocks: contentBlocks,
      structure: HOMEPAGE_CONTENT_STRUCTURE,
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Initialize homepage content blocks if they don't exist
    const existingBlocks = await prisma.websiteContent.findMany({
      where: { page: 'homepage' },
    });

    const existingKeys = new Set(existingBlocks.map(block => block.key));
    const blocksToCreate = HOMEPAGE_CONTENT_STRUCTURE.filter(
      block => !existingKeys.has(block.key)
    );

    if (blocksToCreate.length > 0) {
      await prisma.websiteContent.createMany({
        data: blocksToCreate.map(block => ({
          key: block.key,
          title: block.title,
          content: getDefaultContent(block.key),
          contentType: block.contentType as any,
          page: 'homepage',
          section: block.section,
          order: block.order,
          isActive: true,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${blocksToCreate.length} homepage content blocks`,
    });
  } catch (error) {
    console.error('Error initializing homepage content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { updates } = updateHomepageContentSchema.parse(body);

    // Update content blocks
    const updatePromises = updates.map(async (update) => {
      const updateData: any = {};
      
      if (update.content !== undefined) updateData.content = update.content;
      if (update.mediaUrl !== undefined) updateData.mediaUrl = update.mediaUrl;
      if (update.mediaType !== undefined) updateData.mediaType = update.mediaType;

      return prisma.websiteContent.upsert({
        where: {
          key: update.key,
        },
        update: updateData,
        create: {
          key: update.key,
          title: getContentTitle(update.key),
          content: update.content || '',
          mediaUrl: update.mediaUrl,
          mediaType: update.mediaType,
          contentType: getContentType(update.key) as any,
          page: 'homepage',
          section: getContentSection(update.key),
          order: getContentOrder(update.key),
          isActive: true,
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} homepage content blocks`,
    });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper functions
function getDefaultContent(key: string): string {
  const defaults: Record<string, string> = {
    'homepage_hero_title': 'Experience the Magic of the Nile',
    'homepage_hero_subtitle': 'Luxury Dahabiya Cruises Through Ancient Egypt',
    'homepage_hero_description': 'Embark on an unforgettable journey along the legendary Nile River aboard our luxurious dahabiyas.',
    'homepage_hero_cta_text': 'Explore Our Cruises',
    'homepage_hero_cta_link': '/dahabiyat',
    'homepage_dahabiya_title': 'What is a Dahabiya?',
    'homepage_dahabiya_content': 'A dahabiya is a traditional Egyptian sailing boat, once used by royalty and nobility to cruise the Nile in style.',
    'homepage_why_different_title': 'Why is Dahabiya different from the regular Nile Cruises?',
    'homepage_why_different_content': 'Unlike large cruise ships, dahabiyas offer an intimate experience with only 8-12 guests.',
    'homepage_features_title': 'Why Choose Dahabiyat',
    'homepage_features_subtitle': 'Discover what makes our Nile cruises truly exceptional',
    'homepage_story_title': 'Our Story',
    'homepage_story_content': 'Welcome to the world of authentic Nile cruising. I am Ashraf Elmasry...',
    'homepage_story_ceo_name': 'Ashraf Elmasry',
    'homepage_story_ceo_title': 'Founder & CEO',
    'homepage_featured_title': 'Our Featured Cruises',
    'homepage_featured_subtitle': 'Discover our most popular dahabiya experiences',
    'homepage_memories_title': 'Share Your Memories With Us',
    'homepage_memories_subtitle': 'Join our community of travelers and share your unforgettable moments',
    'homepage_testimonials_title': 'What Our Guests Say',
    'homepage_testimonials_subtitle': 'Discover why travelers choose Dahabiyat',
    'homepage_gallery_title': 'Gallery',
    'homepage_gallery_subtitle': 'Explore the beauty of our dahabiya cruises',
    'homepage_cta_title': 'Ready to Experience the Nile?',
    'homepage_cta_subtitle': 'Book your luxury dahabiya cruise today and create memories that will last a lifetime.',
    'homepage_cta_button_text': 'Explore Cruises',
  };
  return defaults[key] || '';
}

function getContentTitle(key: string): string {
  const structure = HOMEPAGE_CONTENT_STRUCTURE.find(item => item.key === key);
  return structure?.title || key.replace('homepage_', '').replace(/_/g, ' ');
}

function getContentType(key: string): string {
  const structure = HOMEPAGE_CONTENT_STRUCTURE.find(item => item.key === key);
  return structure?.contentType || 'TEXT';
}

function getContentSection(key: string): string {
  const structure = HOMEPAGE_CONTENT_STRUCTURE.find(item => item.key === key);
  return structure?.section || 'general';
}

function getContentOrder(key: string): number {
  const structure = HOMEPAGE_CONTENT_STRUCTURE.find(item => item.key === key);
  return structure?.order || 1;
}


