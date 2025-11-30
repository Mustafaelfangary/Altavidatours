import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('🚀 Seeding Altavida Tours brand content...');

  // 1) Disable obviously Dahabiya-specific homepage keys so they don't surface
  const dahabiyaPatterns = [
    'dahabiyat_%',
    'dahabiyas_%',
    'what_is_dahabiya_%',
    'why_different_%',
    'why_choose_dahabiya_%',
  ];
  for (const pattern of dahabiyaPatterns) {
    const res = await prisma.websiteContent.updateMany({
      where: { key: { startsWith: pattern.replace('%', '') } },
      data: { isActive: false },
    });
    if (res.count) console.log(`⚠️  Disabled ${res.count} keys starting with '${pattern.replace('%', '')}'`);
  }

  // 2) Brand name and global values
  const updates = [
    // Site identity
    { key: 'site_name', title: 'Site Name', content: 'Altavida Tours.com', page: 'global', section: 'global' },

    // Homepage hero
    { key: 'hero_video_title', title: 'Hero Title', content: 'Authentic Egypt Travel Experiences', page: 'homepage', section: 'hero' },
    { key: 'hero_video_subtitle', title: 'Hero Subtitle', content: 'Tailored journeys, Nile cruises, and cultural adventures by local experts', page: 'homepage', section: 'hero' },
    { key: 'hero_video_cta_text', title: 'Primary CTA', content: 'Explore Tours', page: 'homepage', section: 'hero' },
    { key: 'hero_video_secondary_cta_text', title: 'Secondary CTA', content: 'View Packages', page: 'homepage', section: 'hero' },
    { key: 'homepage_hero_description', title: 'Hero Description', content: 'Discover Egypt with locally crafted itineraries, authentic cultural experiences, and seamless planning from start to finish.', page: 'homepage', section: 'hero' },
    { key: 'hero_video_cta_link', title: 'Primary CTA Link', content: '/tours', page: 'homepage', section: 'hero' },
    { key: 'hero_video_secondary_cta_link', title: 'Secondary CTA Link', content: '/destinations', page: 'homepage', section: 'hero' },

    // Homepage sections (generic for Altavida Tours.com)
    { key: 'homepage_featured_packages_title', title: 'Featured Packages Title', content: 'Featured Packages', page: 'homepage', section: 'general' },
    { key: 'homepage_featured_packages_subtitle', title: 'Featured Packages Subtitle', content: 'Our most popular Egypt trips curated for you', page: 'homepage', section: 'general' },
    { key: 'homepage_destinations_title', title: 'Destinations Title', content: 'Top Destinations in Egypt', page: 'homepage', section: 'general' },
    { key: 'homepage_featured_experience_title', title: 'Featured Experience Title', content: 'FEATURED EXPERIENCE', page: 'homepage', section: 'general' },
    { key: 'homepage_discover_egypt_title', title: 'Discover Egypt Title', content: 'DISCOVER ANCIENT EGYPT', page: 'homepage', section: 'general' },
    { key: 'homepage_things_to_do_title', title: 'Things To Do Title', content: 'THINGS TO DO', page: 'homepage', section: 'general' },

    // Packages page
    { key: 'packages_hero_title', title: 'Packages Hero Title', content: 'Egypt Travel Packages', page: 'packages', section: 'hero' },
    { key: 'packages_hero_subtitle', title: 'Packages Hero Subtitle', content: 'Handcrafted itineraries across Cairo, Luxor, Aswan & the Red Sea', page: 'packages', section: 'hero' },
    { key: 'packages_description', title: 'Packages Description', content: 'Browse flexible packages designed by local experts. Customize any trip to match your dates and interests.', page: 'packages', section: 'content' },

    // Itineraries page
    { key: 'itineraries_hero_title', title: 'Itineraries Hero Title', content: 'Discover Egypt, Your Way', page: 'itineraries', section: 'hero' },
    { key: 'itineraries_hero_subtitle', title: 'Itineraries Hero Subtitle', content: 'From Cairo highlights to Nile journeys and desert escapes', page: 'itineraries', section: 'hero' },

    // Destinations page
    { key: 'destinations_hero_title', title: 'Destinations Hero Title', content: 'Explore Egypt’s Top Destinations', page: 'destinations', section: 'hero' },
    { key: 'destinations_hero_subtitle', title: 'Destinations Hero Subtitle', content: 'From iconic landmarks to hidden gems across Egypt', page: 'destinations', section: 'hero' },
    { key: 'destinations_section_title', title: 'Destinations Section Title', content: 'Featured Destinations', page: 'destinations', section: 'main' },

    // Services page
    { key: 'services_hero_title', title: 'Services Hero Title', content: 'Travel Services', page: 'services', section: 'hero' },
    { key: 'services_hero_subtitle', title: 'Services Hero Subtitle', content: 'Private guides, transfers, tickets, and curated experiences', page: 'services', section: 'hero' },
    { key: 'services_section_title', title: 'Services Section Title', content: 'Popular Services', page: 'services', section: 'main' },

    // About page
    { key: 'about_hero_title', title: 'About Hero Title', content: 'About Altavida Tours.com', page: 'about', section: 'hero' },
    { key: 'about_hero_subtitle', title: 'About Hero Subtitle', content: 'Locally owned. Decades of Egyptian travel expertise.', page: 'about', section: 'hero' },
    { key: 'about_story_title', title: 'Story Title', content: 'Our Story', page: 'about', section: 'story' },
    { key: 'about_story_content', title: 'Story Content', content: 'We craft authentic experiences across Egypt with safety, comfort, and cultural depth. Our team of local specialists personalizes every journey.', page: 'about', section: 'story' },

    // Contact page
    { key: 'contact_hero_title', title: 'Contact Hero Title', content: 'Contact Our Egypt Specialists', page: 'contact', section: 'hero' },
    { key: 'contact_phone', title: 'Phone', content: '+20 000 0000', page: 'contact', section: 'info' },
    { key: 'contact_email', title: 'Email', content: 'info@altavidatours.com', page: 'contact', section: 'info' },
    { key: 'contact_address', title: 'Address', content: 'Cairo, Egypt', page: 'contact', section: 'info' },

    // Footer
    { key: 'footer-company-name', title: 'Company Name', content: 'Altavida Tours.com', page: 'footer', section: 'company' },
    { key: 'footer-title', title: 'Footer Title', content: 'Altavida Tours.com', page: 'footer', section: 'company' },
    { key: 'footer-description', title: 'Footer Description', content: 'Explore Egypt with tailored journeys and local expertise by Altavida Tours.com.', page: 'footer', section: 'company' },
    { key: 'footer-link-home', title: 'Footer Link Home', content: 'Home', page: 'footer', section: 'navigation' },
    { key: 'footer-link-about', title: 'Footer Link About', content: 'About', page: 'footer', section: 'navigation' },
    { key: 'footer-link-packages', title: 'Footer Link Packages', content: 'Packages', page: 'footer', section: 'navigation' },
    { key: 'footer-link-contact', title: 'Footer Link Contact', content: 'Contact', page: 'footer', section: 'navigation' },
    // Extra footer/navigation keys used in components
    { key: 'footer-link-destinations', title: 'Footer Link Destinations', content: 'Destinations', page: 'footer', section: 'navigation' },
    { key: 'footer-link-services', title: 'Footer Link Services', content: 'Services', page: 'footer', section: 'navigation' },
    { key: 'footer_quick_links_title', title: 'Footer Quick Links Title', content: 'Quick Links', page: 'footer', section: 'navigation' },
    { key: 'footer_follow_us_title', title: 'Footer Follow Us Title', content: 'Follow Us', page: 'footer', section: 'social' },
    { key: 'footer_newsletter_title', title: 'Footer Newsletter Title', content: 'Newsletter', page: 'footer', section: 'newsletter' },
    { key: 'footer-newsletter-text', title: 'Footer Newsletter Text', content: 'Subscribe to get updates on our latest offers and journeys.', page: 'footer', section: 'newsletter' },
    { key: 'footer_subscribe_button_text', title: 'Footer Subscribe Button', content: 'Subscribe', page: 'footer', section: 'newsletter' },
    { key: 'footer-facebook', title: 'Footer Facebook URL', content: 'https://facebook.com/AltavidaTours', page: 'footer', section: 'social' },
    { key: 'footer-twitter', title: 'Footer Twitter URL', content: 'https://twitter.com/AltavidaTours', page: 'footer', section: 'social' },
    { key: 'footer-instagram', title: 'Footer Instagram URL', content: 'https://instagram.com/altavidatours', page: 'footer', section: 'social' },

    // Homepage general helpers
    { key: 'loading_text', title: 'Loading Text', content: 'Loading...', page: 'homepage', section: 'general' },
    { key: 'read_more_text', title: 'Read More Text', content: 'Read More', page: 'homepage', section: 'general' },
    { key: 'read_less_text', title: 'Read Less Text', content: 'Read Less', page: 'homepage', section: 'general' },
    { key: 'homepage_view_all_packages_text', title: 'Homepage View All Packages', content: 'View All Packages', page: 'homepage', section: 'general' },
    { key: 'homepage_view_all_articles_text', title: 'Homepage View All Articles', content: 'View All Articles', page: 'homepage', section: 'general' },

    // Contact page social links (used by CleanWebsiteContentManager contact page)
    { key: 'facebook_link', title: 'Facebook Link', content: 'https://facebook.com/AltavidaTours', page: 'contact', section: 'social_media' },
    { key: 'instagram_link', title: 'Instagram Link', content: 'https://instagram.com/altavidatours', page: 'contact', section: 'social_media' },
    { key: 'whatsapp_link', title: 'WhatsApp Link', content: 'https://wa.me/2000000000', page: 'contact', section: 'social_media' },
    { key: 'telegram_link', title: 'Telegram Link', content: 'https://t.me/treasureegypt', page: 'contact', section: 'social_media' },

    // Branding/media (used by footer for logo path)
    { key: 'footer_logo', title: 'Footer Logo URL', content: '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png', page: 'branding_settings', section: 'branding' },

    // Homepage hero media placeholders (safe defaults; admin can update)
    { key: 'hero_video_url', title: 'Hero Video URL', content: '/videos/home_hero_video.mp4', page: 'homepage', section: 'hero' },
    { key: 'hero_video_poster', title: 'Hero Video Poster', content: '/images/hero/travel-hero.jpg', page: 'homepage', section: 'hero' },
  ];

  let updated = 0;
  let created = 0;

  for (const item of updates) {
    const res = await prisma.websiteContent.upsert({
      where: { key: item.key },
      update: {
        title: item.title,
        content: item.content,
        page: item.page,
        section: item.section,
        isActive: true,
      },
      create: {
        key: item.key,
        title: item.title,
        content: item.content,
        contentType: 'TEXT',
        page: item.page,
        section: item.section,
        isActive: true,
        order: 0,
      },
    });
    if (res.createdAt.getTime() === res.updatedAt.getTime()) {
      created++;
      console.log(`✅ Created: ${item.key}`);
    } else {
      updated++;
      console.log(`🔄 Updated: ${item.key}`);
    }
  }

  console.log(`\n🎯 Done. Created ${created}, updated ${updated}.`);
}

run()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
