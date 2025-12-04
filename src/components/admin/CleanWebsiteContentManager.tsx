'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import ResponsiveMediaPicker from './ResponsiveMediaPicker';
import {
  Home, Users, Phone, Package, Settings, MapPin, FileText, 
  Edit2, Save, X, RefreshCw, Image, Calendar, Ship, Globe, Video
} from 'lucide-react';

interface ContentField {
  key: string;
  title: string;
  content: string;
  contentType: 'TEXT' | 'TEXTAREA' | 'IMAGE' | 'VIDEO' | 'URL';
  description?: string;
}

interface PageContent {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: {
    [sectionName: string]: {
      label: string;
      fields: ContentField[];
    };
  };
}

// CLEAN ORGANIZED CONTENT STRUCTURE - ONLY ACTUAL FIELDS USED IN THE WEBSITE
const WEBSITE_CONTENT_STRUCTURE: PageContent[] = [
  {
    id: 'homepage',
    label: 'Homepage',
    icon: Home,
    sections: {
      hero: {
        label: 'Hero Video Section',
        fields: [
          { key: 'hero_video_url', title: 'Hero Video URL', content: '', contentType: 'VIDEO', description: 'Main hero video file' },
          { key: 'hero_video_poster', title: 'Hero Video Poster', content: '', contentType: 'IMAGE', description: 'Video poster/thumbnail' },
          { key: 'hero_video_title', title: 'Hero Title', content: 'DISCOVER EGYPT', contentType: 'TEXT', description: 'Main hero heading' },
          { key: 'hero_video_subtitle', title: 'Hero Subtitle', content: 'Land of Pharaohs & Ancient Wonders', contentType: 'TEXT', description: 'Hero subheading' },
          { key: 'homepage_hero_description', title: 'Hero Description', 
            content: 'Journey through 5,000 years of history. From the Great Pyramids to bustling bazaars, experience the magic and mystery of Egypt with our expertly crafted tours.', 
            contentType: 'TEXTAREA', 
            description: 'Paragraph under hero title' 
          },
          { key: 'hero_video_cta_text', title: 'Primary CTA Text', content: 'EXPLORE TOURS', contentType: 'TEXT', description: 'Call-to-action button text' },
          { key: 'hero_video_cta_link', title: 'Primary CTA Link', content: '/tours', contentType: 'URL', description: 'Call-to-action button link' },
          { key: 'hero_video_secondary_cta_text', title: 'Secondary CTA Text', content: 'VIEW DESTINATIONS', contentType: 'TEXT', description: 'Secondary CTA button text' },
          { key: 'hero_video_secondary_cta_link', title: 'Secondary CTA Link', content: '/destinations', contentType: 'URL', description: 'Secondary CTA button link' },
          { key: 'hero_scroll_text', title: 'Scroll Indicator Text', content: 'Scroll to explore', contentType: 'TEXT', description: 'Scroll down indicator' }
        ]
      },
      hero_side_boxes: {
        label: 'Hero Side Boxes',
        fields: [
          { key: 'hero_side_left_title', title: 'Left Box Title', content: '', contentType: 'TEXT', description: 'Headline shown in the left card beside the hero video' },
          { key: 'hero_side_left_image', title: 'Left Box Image', content: '', contentType: 'IMAGE', description: 'Image used inside the left card' },
          { key: 'hero_side_right_title', title: 'Right Box Title', content: '', contentType: 'TEXT', description: 'Headline shown in the right card beside the hero video' },
          { key: 'hero_side_right_image', title: 'Right Box Image', content: '', contentType: 'IMAGE', description: 'Image used inside the right card' }
        ]
      },
      dahabiyas: {
        label: 'Dahabiyas Section',
        fields: [
          { key: 'dahabiyat_section_title', title: 'Section Title', content: 'Our Luxury Dahabiyas', contentType: 'TEXT' },
          { key: 'dahabiyat_section_subtitle', title: 'Section Subtitle', content: 'Experience the Nile in style with our handpicked fleet of luxury dahabiyas', contentType: 'TEXT' },
          { key: 'dahabiyat_view_all_text', title: 'View All Button', content: 'View All Dahabiyas', contentType: 'TEXT' }
        ]
      },
      packages: {
        label: 'Packages Section',
        fields: [
          { key: 'packages_section_title', title: 'Section Title', content: 'Featured Packages', contentType: 'TEXT' },
          { key: 'packages_section_subtitle', title: 'Section Subtitle', content: 'Discover our most popular travel packages to Egypt\'s greatest destinations', contentType: 'TEXT' },
          { key: 'packages_view_all_text', title: 'View All Button', content: 'View All Packages', contentType: 'TEXT' },
          { key: 'days_label', title: 'Days Label', content: 'Days', contentType: 'TEXT' },
          { key: 'view_details_text', title: 'View Details Button', content: 'View Details', contentType: 'TEXT' }
        ]
      },
      about_sections: {
        label: 'About Sections',
        fields: [
          { key: 'what_is_dahabiya_title', title: 'What is Dahabiya Title', content: 'What is a Dahabiya?', contentType: 'TEXT' },
          { key: 'what_is_dahabiya_content', title: 'What is Dahabiya Content', content: 'A dahabiya is a traditional Egyptian sailing vessel that offers a more intimate and luxurious way to explore the Nile. Unlike large cruise ships, dahabiyas provide a peaceful and authentic experience with fewer passengers and more personalized service.', contentType: 'TEXTAREA' },
          { key: 'what_is_dahabiya_image_1', title: 'Image 1', content: '/images/dahabiya-1.jpg', contentType: 'IMAGE' },
          { key: 'what_is_dahabiya_image_2', title: 'Image 2', content: '/images/dahabiya-2.jpg', contentType: 'IMAGE' },
          { key: 'what_is_dahabiya_image_3', title: 'Image 3', content: '/images/dahabiya-3.jpg', contentType: 'IMAGE' },
          { key: 'why_different_title', title: 'Why Different Title', content: 'Why Choose a Dahabiya?', contentType: 'TEXT' },
          { key: 'why_different_content', title: 'Why Different Content', content: 'Our dahabiyas offer a unique way to experience the Nile, combining the romance of traditional sailing with modern comforts. With spacious cabins, gourmet dining, and expert guides, you\'ll discover Egypt\'s ancient wonders in unparalleled style and comfort.', contentType: 'TEXTAREA' },
          { key: 'why_different_image_1', title: 'Why Different Image 1', content: '/images/why-1.jpg', contentType: 'IMAGE' },
          { key: 'why_different_image_2', title: 'Why Different Image 2', content: '/images/why-2.jpg', contentType: 'IMAGE' },
          { key: 'why_different_image_3', title: 'Why Different Image 3', content: '/images/why-3.jpg', contentType: 'IMAGE' }
        ]
      },
      // Our Story Section
      story: {
        label: 'Our Story Section',
        fields: [
          { 
            key: 'our_story_title', 
            title: 'Section Title', 
            content: 'Our Story', 
            contentType: 'TEXT',
            description: 'Main heading for the story section'
          },
          { 
            key: 'our_story_subtitle', 
            title: 'Section Subtitle', 
            content: 'Discover the journey behind our passion for Egypt', 
            contentType: 'TEXT',
            description: 'Subheading that appears below the main title'
          },
          { 
            key: 'our_story_image', 
            title: 'Story Image', 
            content: '/images/our-story.jpg', 
            contentType: 'IMAGE',
            description: 'Main image for the story section'
          },
          { 
            key: 'our_story_content', 
            title: 'Main Story Content', 
            content: 'For over a decade, we have been curating unforgettable journeys through Egypt. Our passion for this ancient land and its rich history drives us to create experiences that go beyond the ordinary.', 
            contentType: 'TEXTAREA',
            description: 'Main content of the story section'
          },
          { 
            key: 'our_mission_title', 
            title: 'Mission Title', 
            content: 'Our Mission', 
            contentType: 'TEXT',
            description: 'Title for the mission section'
          },
          { 
            key: 'our_mission_content', 
            title: 'Mission Content', 
            content: 'To provide authentic, immersive, and sustainable travel experiences that showcase the best of Egypt while preserving its cultural heritage and supporting local communities.', 
            contentType: 'TEXTAREA',
            description: 'Content describing the company mission'
          },
          { 
            key: 'our_values_title', 
            title: 'Values Title', 
            content: 'Our Values', 
            contentType: 'TEXT',
            description: 'Title for the values section'
          },
          { 
            key: 'our_values_content', 
            title: 'Values Content', 
            content: '• Authenticity: We believe in genuine experiences that connect you with the real Egypt\n• Excellence: We strive for the highest standards in everything we do\n• Sustainability: We\'re committed to responsible tourism practices\n• Passion: Our love for Egypt shines through in every journey we create', 
            contentType: 'TEXTAREA',
            description: 'Company values in bullet points (use • for bullets)'
          },
          { key: 'founder_name', title: 'Founder Name', content: '', contentType: 'TEXT' },
          { key: 'founder_title', title: 'Founder Title', content: '', contentType: 'TEXT' },
          { key: 'founder_quote', title: 'Founder Quote', content: '', contentType: 'TEXTAREA' },
          { key: 'founder_image', title: 'Founder Image', content: '', contentType: 'IMAGE' }
        ]
      },
      memories: {
        label: 'Share Memories Section',
        fields: [
          { key: 'share_memories_title', title: 'Section Title', content: '', contentType: 'TEXT' },
          { key: 'share_memories_content', title: 'Section Content', content: '', contentType: 'TEXTAREA' },
          { key: 'share_memories_image_1', title: 'Memory Image 1', content: '', contentType: 'IMAGE' },
          { key: 'share_memories_image_2', title: 'Memory Image 2', content: '', contentType: 'IMAGE' },
          { key: 'share_memories_image_3', title: 'Memory Image 3', content: '', contentType: 'IMAGE' }
        ]
      },
      gallery: {
        label: 'Gallery Section',
        fields: [
          { key: 'gallery_section_title', title: 'Gallery Title', content: '', contentType: 'TEXT' },
          { key: 'gallery_section_subtitle', title: 'Gallery Subtitle', content: '', contentType: 'TEXT' },
          { key: 'gallery_view_all_text', title: 'View All Button', content: '', contentType: 'TEXT' }
        ]
      },
      blog: {
        label: 'Blog Section',
        fields: [
          { key: 'blog_section_title', title: 'Blog Title', content: '', contentType: 'TEXT' },
          { key: 'blog_section_subtitle', title: 'Blog Subtitle', content: '', contentType: 'TEXT' },
          { key: 'blog_view_all_text', title: 'View All Button', content: '', contentType: 'TEXT' }
        ]
      },
      safety: {
        label: 'Safety Section',
        fields: [
          { key: 'safety_title', title: 'Safety Title', content: '', contentType: 'TEXT' },
          { key: 'safety_subtitle', title: 'Safety Subtitle', content: '', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'cta_title', title: 'CTA Title', content: '', contentType: 'TEXT' },
          { key: 'cta_description', title: 'CTA Description', content: '', contentType: 'TEXTAREA' },
          { key: 'cta_book_text', title: 'Book Button', content: '', contentType: 'TEXT' },
          { key: 'cta_contact_text', title: 'Contact Button', content: '', contentType: 'TEXT' }
        ]
      },
      general: {
        label: 'General Elements',
        fields: [
          { key: 'loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' },
          { key: 'read_more_text', title: 'Read More Text', content: '', contentType: 'TEXT' },
          { key: 'read_less_text', title: 'Read Less Text', content: '', contentType: 'TEXT' },
          // Homepage section headings and buttons
          { key: 'homepage_things_to_do_title', title: 'Things To Do Title', content: 'THINGS TO DO', contentType: 'TEXT' },
          { key: 'homepage_featured_packages_title', title: 'Featured Packages Title', content: 'FEATURED', contentType: 'TEXT' },
          { key: 'homepage_featured_packages_subtitle', title: 'Featured Packages Subtitle', content: 'Discover our most popular Egypt tour packages, carefully crafted to give you the best experience of this magnificent country.', contentType: 'TEXTAREA' },
          { key: 'homepage_featured_experience_title', title: 'Featured Experience Title', content: 'FEATURED EXPERIENCE', contentType: 'TEXT' },
          { key: 'homepage_discover_egypt_title', title: 'Discover Egypt Title', content: 'DISCOVER ANCIENT EGYPT', contentType: 'TEXT' },
          { key: 'homepage_destinations_title', title: 'Destinations Title', content: 'DESTINATIONS', contentType: 'TEXT' },
          { key: 'homepage_view_all_packages_text', title: 'View All Packages Button', content: 'View All Packages', contentType: 'TEXT' },
          { key: 'homepage_view_all_articles_text', title: 'View All Articles Button', content: 'View All Articles', contentType: 'TEXT' },
          { key: 'services_section_title', title: 'Services Section Title', content: 'Popular Services', contentType: 'TEXT' },
          { key: 'services_section_subtitle', title: 'Services Section Subtitle', content: 'Private guides, transfers, tickets, and curated experiences across Egypt.', contentType: 'TEXT' }
        ]
      },
      category_navigation: {
        label: 'Category Navigation (Things To Do)',
        fields: [
          { key: 'category_1_icon', title: 'Category 1 Icon', content: '🔺', contentType: 'TEXT' },
          { key: 'category_1_title', title: 'Category 1 Title', content: 'PYRAMIDS', contentType: 'TEXT' },
          { key: 'category_1_subtitle', title: 'Category 1 Subtitle', content: '& SPHINX', contentType: 'TEXT' },
          { key: 'category_1_link', title: 'Category 1 Link', content: '/attractions/pyramids', contentType: 'URL' },
          { key: 'category_2_icon', title: 'Category 2 Icon', content: '🏛️', contentType: 'TEXT' },
          { key: 'category_2_title', title: 'Category 2 Title', content: 'ANCIENT', contentType: 'TEXT' },
          { key: 'category_2_subtitle', title: 'Category 2 Subtitle', content: 'TEMPLES', contentType: 'TEXT' },
          { key: 'category_2_link', title: 'Category 2 Link', content: '/attractions/temples', contentType: 'URL' },
          { key: 'category_3_icon', title: 'Category 3 Icon', content: '🏺', contentType: 'TEXT' },
          { key: 'category_3_title', title: 'Category 3 Title', content: 'MUSEUMS', contentType: 'TEXT' },
          { key: 'category_3_subtitle', title: 'Category 3 Subtitle', content: '& ARTIFACTS', contentType: 'TEXT' },
          { key: 'category_3_link', title: 'Category 3 Link', content: '/attractions/museums', contentType: 'URL' },
          { key: 'category_4_icon', title: 'Category 4 Icon', content: '🐪', contentType: 'TEXT' },
          { key: 'category_4_title', title: 'Category 4 Title', content: 'DESERT', contentType: 'TEXT' },
          { key: 'category_4_subtitle', title: 'Category 4 Subtitle', content: 'SAFARI', contentType: 'TEXT' },
          { key: 'category_4_link', title: 'Category 4 Link', content: '/services/adventure-tours', contentType: 'URL' },
          { key: 'category_5_icon', title: 'Category 5 Icon', content: '🤿', contentType: 'TEXT' },
          { key: 'category_5_title', title: 'Category 5 Title', content: 'RED SEA', contentType: 'TEXT' },
          { key: 'category_5_subtitle', title: 'Category 5 Subtitle', content: 'DIVING', contentType: 'TEXT' },
          { key: 'category_5_link', title: 'Category 5 Link', content: '/experiences/diving', contentType: 'URL' },
          { key: 'category_6_icon', title: 'Category 6 Icon', content: '⛵', contentType: 'TEXT' },
          { key: 'category_6_title', title: 'Category 6 Title', content: 'NILE', contentType: 'TEXT' },
          { key: 'category_6_subtitle', title: 'Category 6 Subtitle', content: 'CRUISES', contentType: 'TEXT' },
          { key: 'category_6_link', title: 'Category 6 Link', content: '/hotels/nile-cruises', contentType: 'URL' },
          { key: 'category_7_icon', title: 'Category 7 Icon', content: '🎭', contentType: 'TEXT' },
          { key: 'category_7_title', title: 'Category 7 Title', content: 'CULTURAL', contentType: 'TEXT' },
          { key: 'category_7_subtitle', title: 'Category 7 Subtitle', content: 'TOURS', contentType: 'TEXT' },
          { key: 'category_7_link', title: 'Category 7 Link', content: '/experiences/cultural', contentType: 'URL' },
          { key: 'category_8_icon', title: 'Category 8 Icon', content: '🍽️', contentType: 'TEXT' },
          { key: 'category_8_title', title: 'Category 8 Title', content: 'EGYPTIAN', contentType: 'TEXT' },
          { key: 'category_8_subtitle', title: 'Category 8 Subtitle', content: 'CUISINE', contentType: 'TEXT' },
          { key: 'category_8_link', title: 'Category 8 Link', content: '/experiences/food', contentType: 'URL' }
        ]
      },
      featured_article: {
        label: 'Featured Article Section',
        fields: [
          { key: 'featured_article_image', title: 'Featured Article Image', content: '/images/Royal Cleopatra/DSC_8568.jpg', contentType: 'IMAGE' },
          { key: 'featured_article_title', title: 'Featured Article Title', content: 'Egypt: The Ultimate Travel Destination', contentType: 'TEXT' },
          { key: 'featured_article_content', title: 'Featured Article Content', content: 'From the iconic Pyramids of Giza to the vibrant coral reefs of the Red Sea, Egypt offers an incredible diversity of experiences. Explore ancient pharaonic treasures, dive into crystal-clear waters, and immerse yourself in a culture that spans millennia.', contentType: 'TEXTAREA' },
          { key: 'featured_article_cta_text', title: 'Featured Article CTA Text', content: 'Explore Tours', contentType: 'TEXT' },
          { key: 'featured_article_cta_link', title: 'Featured Article CTA Link', content: '/tours/classic', contentType: 'URL' }
        ]
      },
      destination_links: {
        label: 'Destination Quick Links',
        fields: [
          { key: 'destinations_section_title', title: 'Section Title', content: 'DESTINATIONS', contentType: 'TEXT', description: 'Title for the destinations section header' },
          { key: 'dest_link_1_icon', title: 'Link 1 Icon', content: '📍', contentType: 'TEXT' },
          { key: 'dest_link_1_title', title: 'Link 1 Title', content: 'FIND A', contentType: 'TEXT' },
          { key: 'dest_link_1_subtitle', title: 'Link 1 Subtitle', content: 'DESTINATION', contentType: 'TEXT' },
          { key: 'dest_link_1_url', title: 'Link 1 URL', content: '/find-destination', contentType: 'URL' },
          { key: 'dest_link_2_icon', title: 'Link 2 Icon', content: '🏨', contentType: 'TEXT' },
          { key: 'dest_link_2_title', title: 'Link 2 Title', content: 'BOOK A HOTEL', contentType: 'TEXT' },
          { key: 'dest_link_2_subtitle', title: 'Link 2 Subtitle', content: 'OR LODGE', contentType: 'TEXT' },
          { key: 'dest_link_2_url', title: 'Link 2 URL', content: '/book-hotel', contentType: 'URL' },
          { key: 'dest_link_3_icon', title: 'Link 3 Icon', content: '🎪', contentType: 'TEXT' },
          { key: 'dest_link_3_title', title: 'Link 3 Title', content: 'BOOK AN', contentType: 'TEXT' },
          { key: 'dest_link_3_subtitle', title: 'Link 3 Subtitle', content: 'EVENT', contentType: 'TEXT' },
          { key: 'dest_link_3_url', title: 'Link 3 URL', content: '/book-event', contentType: 'URL' },
          { key: 'dest_link_4_icon', title: 'Link 4 Icon', content: '🚢', contentType: 'TEXT' },
          { key: 'dest_link_4_title', title: 'Link 4 Title', content: 'BOOK A', contentType: 'TEXT' },
          { key: 'dest_link_4_subtitle', title: 'Link 4 Subtitle', content: 'CRUISE', contentType: 'TEXT' },
          { key: 'dest_link_4_url', title: 'Link 4 URL', content: '/book-cruise', contentType: 'URL' },
          { key: 'dest_link_5_icon', title: 'Link 5 Icon', content: '📅', contentType: 'TEXT' },
          { key: 'dest_link_5_title', title: 'Link 5 Title', content: 'DESTINATION', contentType: 'TEXT' },
          { key: 'dest_link_5_subtitle', title: 'Link 5 Subtitle', content: 'EVENTS', contentType: 'TEXT' },
          { key: 'dest_link_5_url', title: 'Link 5 URL', content: '/events', contentType: 'URL' },
          { key: 'dest_link_6_icon', title: 'Link 6 Icon', content: '📱', contentType: 'TEXT' },
          { key: 'dest_link_6_title', title: 'Link 6 Title', content: 'ALTAVIDA APP', contentType: 'TEXT' },
          { key: 'dest_link_6_subtitle', title: 'Link 6 Subtitle', content: '', contentType: 'TEXT' },
          { key: 'dest_link_6_url', title: 'Link 6 URL', content: '/app', contentType: 'URL' }
        ]
      },
      heritage_sites: {
        label: 'Heritage Sites Section',
        fields: [
          { key: 'heritage_sites_title', title: 'Heritage Sites Title', content: 'Ancient Egyptian Heritage Sites', contentType: 'TEXT' },
          { key: 'heritage_sites_image', title: 'Heritage Sites Image', content: '/images/Royal Cleopatra/DSC_8507.jpg', contentType: 'IMAGE' },
          { key: 'heritage_sites_location', title: 'Heritage Sites Location', content: 'Karnak Temple Complex, Luxor', contentType: 'TEXT' },
          { key: 'heritage_sites_description', title: 'Heritage Sites Description', content: 'Explore the magnificent ancient Egyptian temple complex, one of the largest religious buildings ever constructed.', contentType: 'TEXTAREA' }
        ]
      },
      nile_experiences: {
        label: 'Nile Experiences Section',
        fields: [
          { key: 'nile_experiences_title', title: 'Nile Experiences Title', content: 'Nile River Experiences', contentType: 'TEXT' },
          { key: 'nile_experiences_image', title: 'Nile Experiences Image', content: '/images/Royal Cleopatra/DSC_8628.jpg', contentType: 'IMAGE' },
          { key: 'nile_experiences_description', title: 'Nile Experiences Description', content: 'Experience the magic of the Nile River with sunset sailing, traditional felucca rides, and luxury dahabiya cruises.', contentType: 'TEXTAREA' }
        ]
      }
    }
  },
  // Dahabiyas Page Content
  {
    id: 'dahabiyas',
    label: 'Dahabiyas',
    icon: Ship,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'dahabiyas_hero_title', title: 'Hero Title', content: 'Luxury Dahabiya Fleet', contentType: 'TEXT', description: 'Main heading for the dahabiyas page' },
          { key: 'dahabiyas_hero_subtitle', title: 'Hero Subtitle', content: 'Premium Traditional Sailing Vessels on the Nile', contentType: 'TEXT', description: 'Subheading that appears below the main title' },
          { key: 'dahabiyas_hero_description', title: 'Hero Description', content: 'Handcrafted dahabiyas combining authentic Egyptian heritage with modern luxury amenities', contentType: 'TEXTAREA', description: 'Brief description that appears in the hero section' },
          { key: 'dahabiyas_hero_image', title: 'Hero Background Image', content: '/images/Royal Cleopatra/DSC_8502.jpg', contentType: 'IMAGE', description: 'Background image for the hero section' }
        ]
      },
      search: {
        label: 'Search Section',
        fields: [
          { key: 'dahabiyas_search_placeholder', title: 'Search Placeholder', content: 'Search dahabiyas by name, category, or amenities...', contentType: 'TEXT' },
          { key: 'dahabiyas_vessel_singular', title: 'Vessel Singular', content: 'vessel', contentType: 'TEXT' },
          { key: 'dahabiyas_vessel_plural', title: 'Vessel Plural', content: 'vessels', contentType: 'TEXT' },
          { key: 'dahabiyas_in_fleet', title: 'In Fleet Label', content: 'in our fleet', contentType: 'TEXT' }
        ]
      },
      fleet_advantages: {
        label: 'Fleet Advantages Section',
        fields: [
          { key: 'dahabiyas_advantages_title', title: 'Section Title', content: 'Why Choose Our Dahabiya Fleet', contentType: 'TEXT' },
          { key: 'dahabiyas_advantages_subtitle', title: 'Section Subtitle', content: 'Traditional sailing vessels that offer authentic Nile experiences with modern luxury standards', contentType: 'TEXT' },
          { key: 'dahabiyas_advantage_1_title', title: 'Advantage 1 Title', content: 'Authentic Traditional Design', contentType: 'TEXT' },
          { key: 'dahabiyas_advantage_1_description', title: 'Advantage 1 Description', content: 'Handcrafted dahabiyas built using traditional methods while incorporating modern safety and comfort features.', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_advantage_2_title', title: 'Advantage 2 Title', content: 'Premium Safety Standards', contentType: 'TEXT' },
          { key: 'dahabiyas_advantage_2_description', title: 'Advantage 2 Description', content: 'All vessels meet international maritime safety standards with modern navigation equipment and emergency protocols.', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_advantage_3_title', title: 'Advantage 3 Title', content: 'Expert Crew & Guides', contentType: 'TEXT' },
          { key: 'dahabiyas_advantage_3_description', title: 'Advantage 3 Description', content: 'Experienced captains and certified Egyptologist guides providing personalized service and cultural insights.', contentType: 'TEXTAREA' }
        ]
      },
      cta: {
        label: 'Call to Action Section',
        fields: [
          { key: 'dahabiyas_cta_title', title: 'CTA Title', content: 'Ready to Board Your Dahabiya?', contentType: 'TEXT' },
          { key: 'dahabiyas_cta_description', title: 'CTA Description', content: 'Experience the timeless elegance of traditional Nile sailing with modern luxury accommodations', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_cta_book_btn', title: 'Book Button Text', content: 'Book Your Cruise', contentType: 'TEXT' },
          { key: 'dahabiyas_cta_packages_btn', title: 'Packages Button Text', content: 'View Packages', contentType: 'TEXT' }
        ]
      },
      card_labels: {
        label: 'Card Labels',
        fields: [
          { key: 'dahabiyas_guests_label', title: 'Guests Label', content: 'Up to {count} guests', contentType: 'TEXT' },
          { key: 'dahabiyas_from_label', title: 'From Label', content: 'From', contentType: 'TEXT' },
          { key: 'dahabiyas_per_night_label', title: 'Per Night Label', content: '/night', contentType: 'TEXT' },
          { key: 'dahabiyas_view_details', title: 'View Details Button', content: 'View Details', contentType: 'TEXT' }
        ]
      },
      fallback_dahabiyas: {
        label: 'Fallback Dahabiyas (when API fails)',
        fields: [
          { key: 'fallback_dahabiya_1_name', title: 'Dahabiya 1 Name', content: 'Nefertiti Premium', contentType: 'TEXT' },
          { key: 'fallback_dahabiya_1_description', title: 'Dahabiya 1 Description', content: 'Luxury dahabiya featuring panoramic suites, gourmet dining, and personalized concierge service for the ultimate Nile experience.', contentType: 'TEXTAREA' },
          { key: 'fallback_dahabiya_1_image', title: 'Dahabiya 1 Image', content: '/images/Royal Cleopatra/DSC_8568.jpg', contentType: 'IMAGE' },
          { key: 'fallback_dahabiya_2_name', title: 'Dahabiya 2 Name', content: 'Cleopatra Royal', contentType: 'TEXT' },
          { key: 'fallback_dahabiya_2_description', title: 'Dahabiya 2 Description', content: 'Intimate sailing yacht with traditional design, modern amenities, and dedicated crew ensuring exceptional comfort throughout your journey.', contentType: 'TEXTAREA' },
          { key: 'fallback_dahabiya_2_image', title: 'Dahabiya 2 Image', content: '/images/Princess Cleopatra Dahabiya (1).jpg', contentType: 'IMAGE' },
          { key: 'fallback_dahabiya_3_name', title: 'Dahabiya 3 Name', content: "Pharaoh's Dream", contentType: 'TEXT' },
          { key: 'fallback_dahabiya_3_description', title: 'Dahabiya 3 Description', content: 'Premium vessel offering spacious accommodations, fine dining, spa services, and curated cultural experiences along ancient Egypt.', contentType: 'TEXTAREA' },
          { key: 'fallback_dahabiya_3_image', title: 'Dahabiya 3 Image', content: '/images/Princess Cleopatra Dahabiya (2).jpg', contentType: 'IMAGE' }
        ]
      }
    }
  },
  {
    id: 'packages',
    label: 'Packages Page',
    icon: Package,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'packages_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'packages_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'packages_hero_description', title: 'Hero Description', content: '', contentType: 'TEXTAREA' },
          { key: 'packages_hero_image', title: 'Hero Background Image', content: '', contentType: 'IMAGE' },
          { key: 'packages_hero_video', title: 'Hero Background Video', content: '', contentType: 'VIDEO' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'packages_cta_title', title: 'CTA Title', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_description', title: 'CTA Description', content: '', contentType: 'TEXTAREA' },
          { key: 'packages_cta_book_title', title: 'Book Button Title', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_book_subtitle', title: 'Book Button Subtitle', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_dahabiyas_title', title: 'Dahabiyas Button Title', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_dahabiyas_subtitle', title: 'Dahabiyas Button Subtitle', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'schedule-and-rates',
    label: 'Schedule & Rates',
    icon: Calendar,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'page_title', title: 'Page Title', content: '', contentType: 'TEXT' },
          { key: 'page_subtitle', title: 'Page Subtitle', content: '', contentType: 'TEXT' },
          { key: 'hero_background_image', title: 'Hero Background', content: '', contentType: 'IMAGE' }
        ]
      },
      intro: {
        label: 'Introduction',
        fields: [
          { key: 'intro_section_title', title: 'Intro Title', content: '', contentType: 'TEXT' },
          { key: 'schedule_intro_text', title: 'Intro Text (Editable)', content: '', contentType: 'TEXTAREA', description: 'This field is editable by admins on the page' }
        ]
      },
      schedule: {
        label: 'Schedule Section',
        fields: [
          { key: 'schedule_title', title: 'Schedule Title', content: '', contentType: 'TEXT' },
          { key: 'schedule_subtitle', title: 'Schedule Subtitle', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'contact',
    label: 'Contact Page',
    icon: Phone,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'contact_hero_title', title: 'Hero Title', content: '🛥️ Contact AltaVida Tours', contentType: 'TEXT' },
          { key: 'contact_hero_subtitle', title: 'Hero Subtitle', content: 'Ready to embark on your Egyptian dahabiya adventure? Get in touch with our travel experts.', contentType: 'TEXT' },
          { key: 'contact_hero_image', title: 'Hero Background Image', content: '', contentType: 'IMAGE' },
          { key: 'contact_hero_video', title: 'Hero Background Video', content: '', contentType: 'VIDEO' },
          { key: 'contact_feature_1', title: 'Feature 1', content: '24/7 Support', contentType: 'TEXT' },
          { key: 'contact_feature_2', title: 'Feature 2', content: 'Expert Guidance', contentType: 'TEXT' },
          { key: 'contact_feature_3', title: 'Feature 3', content: 'Personalized Service', contentType: 'TEXT' }
        ]
      },
      quick_contact: {
        label: 'Quick Contact Section',
        fields: [
          { key: 'contact_instant_title', title: 'Section Title', content: '🚀 Prefer Instant Communication?', contentType: 'TEXT' },
          { key: 'contact_instant_subtitle', title: 'Section Subtitle', content: 'Connect with us instantly through your favorite platform', contentType: 'TEXT' },
          { key: 'contact_whatsapp_title', title: 'WhatsApp Title', content: 'WhatsApp', contentType: 'TEXT' },
          { key: 'contact_whatsapp_desc', title: 'WhatsApp Description', content: 'Instant messaging', contentType: 'TEXT' },
          { key: 'contact_whatsapp_btn', title: 'WhatsApp Button', content: '💬 Chat Now', contentType: 'TEXT' },
          { key: 'contact_telegram_title', title: 'Telegram Title', content: 'Telegram', contentType: 'TEXT' },
          { key: 'contact_telegram_desc', title: 'Telegram Description', content: 'Quick updates', contentType: 'TEXT' },
          { key: 'contact_telegram_btn', title: 'Telegram Button', content: '🚀 Join Channel', contentType: 'TEXT' },
          { key: 'contact_facebook_title', title: 'Facebook Title', content: 'Facebook', contentType: 'TEXT' },
          { key: 'contact_facebook_desc', title: 'Facebook Description', content: 'Community & reviews', contentType: 'TEXT' },
          { key: 'contact_facebook_btn', title: 'Facebook Button', content: '👥 Follow Us', contentType: 'TEXT' },
          { key: 'contact_instagram_title', title: 'Instagram Title', content: 'Instagram', contentType: 'TEXT' },
          { key: 'contact_instagram_desc', title: 'Instagram Description', content: 'Visual inspiration', contentType: 'TEXT' },
          { key: 'contact_instagram_btn', title: 'Instagram Button', content: '📸 Follow', contentType: 'TEXT' }
        ]
      },
      contact_info: {
        label: 'Contact Information',
        fields: [
          { key: 'contact_phone_title', title: 'Phone Section Title', content: '', contentType: 'TEXT' },
          { key: 'contact_phone', title: 'Phone Number', content: '', contentType: 'TEXT' },
          { key: 'contact_email_title', title: 'Email Section Title', content: '', contentType: 'TEXT' },
          { key: 'contact_email', title: 'Email Address', content: '', contentType: 'TEXT' },
          { key: 'contact_location_title', title: 'Location Section Title', content: '', contentType: 'TEXT' },
          { key: 'contact_address', title: 'Address', content: '', contentType: 'TEXTAREA' }
        ]
      },
      social_media: {
        label: 'Social Media Links',
        fields: [
          // Keys used by the live Contact page
          { key: 'whatsapp_link', title: 'WhatsApp URL', content: '', contentType: 'URL' },
          { key: 'telegram_link', title: 'Telegram URL', content: '', contentType: 'URL' },
          { key: 'facebook_link', title: 'Facebook URL', content: '', contentType: 'URL' },
          { key: 'instagram_link', title: 'Instagram URL', content: '', contentType: 'URL' },

          // Backwards-compatible keys (still editable if present)
          { key: 'contact_facebook', title: 'Facebook URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_instagram', title: 'Instagram URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_x', title: 'X (Twitter) URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_youtube', title: 'YouTube URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_tiktok', title: 'TikTok URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_pinterest', title: 'Pinterest URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_tripadvisor', title: 'TripAdvisor URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_whatsapp', title: 'WhatsApp URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_telegram', title: 'Telegram URL (legacy)', content: '', contentType: 'URL' },
          { key: 'contact_wechat', title: 'WeChat ID (legacy)', content: '', contentType: 'TEXT' },
          { key: 'contact_vk', title: 'VK URL (legacy)', content: '', contentType: 'URL' }
        ]
      },
      general: {
        label: 'General',
        fields: [
          { key: 'contact_loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'about',
    label: 'About Page',
    icon: Users,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'about_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'about_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'about_hero_image', title: 'Hero Background', content: '', contentType: 'IMAGE' },
          { key: 'about_loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' }
        ]
      },
      story: {
        label: 'Our Story',
        fields: [
          { key: 'about_story_title', title: 'Story Title', content: '', contentType: 'TEXT' },
          { key: 'about_story_content', title: 'Story Content', content: '', contentType: 'TEXTAREA' },
          { key: 'about_story_image', title: 'Story Image', content: '', contentType: 'IMAGE' }
        ]
      },
      mission_vision: {
        label: 'Mission & Vision',
        fields: [
          { key: 'about_mission_title', title: 'Mission Title', content: '', contentType: 'TEXT' },
          { key: 'about_mission_content', title: 'Mission Content', content: '', contentType: 'TEXTAREA' },
          { key: 'about_vision_title', title: 'Vision Title', content: '', contentType: 'TEXT' },
          { key: 'about_vision_content', title: 'Vision Content', content: '', contentType: 'TEXTAREA' }
        ]
      },
      values: {
        label: 'Values & Team',
        fields: [
          { key: 'about_values_title', title: 'Values Title', content: '', contentType: 'TEXT' },
          { key: 'about_values', title: 'Values Content', content: '', contentType: 'TEXTAREA' },
          { key: 'about_team_title', title: 'Team Title', content: '', contentType: 'TEXT' },
          { key: 'about_team_description', title: 'Team Description', content: '', contentType: 'TEXTAREA' }
        ]
      },
      stats: {
        label: 'Statistics',
        fields: [
          { key: 'about_stat_years', title: 'Years Count', content: '', contentType: 'TEXT' },
          { key: 'about_stat_years_label', title: 'Years Label', content: '', contentType: 'TEXT' },
          { key: 'about_stat_guests', title: 'Guests Count', content: '', contentType: 'TEXT' },
          { key: 'about_stat_guests_label', title: 'Guests Label', content: '', contentType: 'TEXT' },
          { key: 'about_stat_countries', title: 'Countries Count', content: '', contentType: 'TEXT' },
          { key: 'about_stat_countries_label', title: 'Countries Label', content: '', contentType: 'TEXT' },
          { key: 'about_stat_safety', title: 'Safety Rating', content: '', contentType: 'TEXT' },
          { key: 'about_stat_safety_label', title: 'Safety Label', content: '', contentType: 'TEXT' }
        ]
      },
      contact: {
        label: 'Contact Section',
        fields: [
          { key: 'about_contact_title', title: 'Contact Title', content: '', contentType: 'TEXT' },
          { key: 'about_contact_description', title: 'Contact Description', content: '', contentType: 'TEXTAREA' },
          { key: 'about_contact_phone', title: 'Contact Phone', content: '', contentType: 'TEXT' },
          { key: 'about_contact_email', title: 'Contact Email', content: '', contentType: 'TEXT' },
          { key: 'about_contact_address', title: 'Contact Address', content: '', contentType: 'TEXTAREA' },
          { key: 'about_egypt_label', title: 'Egypt Label', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'itineraries',
    label: 'Itineraries Page',
    icon: MapPin,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'itineraries_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'itineraries_hero_description', title: 'Hero Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_hero_background_image', title: 'Hero Background Image (legacy)', content: '', contentType: 'IMAGE' },
          { key: 'itineraries_hero_background_video', title: 'Hero Background Video (legacy)', content: '', contentType: 'VIDEO' },
          { key: 'itineraries_hero_image', title: 'Hero Image', content: '', contentType: 'IMAGE' },
          { key: 'itineraries_hero_video', title: 'Hero Video', content: '', contentType: 'VIDEO' }
        ]
      },
      content: {
        label: 'Main Content',
        fields: [
          { key: 'itineraries_page_title', title: 'Page Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_page_subtitle', title: 'Page Subtitle', content: '', contentType: 'TEXT' },
          { key: 'itineraries_page_description', title: 'Page Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_filter_all_text', title: 'Filter All Text', content: '', contentType: 'TEXT' },
          { key: 'itineraries_filter_featured_text', title: 'Filter Featured Text', content: '', contentType: 'TEXT' },
          { key: 'itineraries_filter_short_text', title: 'Filter Short Text', content: '', contentType: 'TEXT' },
          { key: 'itineraries_filter_long_text', title: 'Filter Long Text', content: '', contentType: 'TEXT' },
          { key: 'itineraries_view_details_text', title: 'View Details Button', content: '', contentType: 'TEXT' },
          { key: 'itineraries_days_label', title: 'Days Label', content: '', contentType: 'TEXT' },
          { key: 'itineraries_from_label', title: 'From Price Label', content: '', contentType: 'TEXT' },
          { key: 'itineraries_loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'itineraries_cta_title', title: 'CTA Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_description', title: 'CTA Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_cta_book_title', title: 'Book Button Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_book_subtitle', title: 'Book Button Subtitle', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_contact_title', title: 'Contact Button Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_contact_subtitle', title: 'Contact Button Subtitle', content: '', contentType: 'TEXT' },
          { key: 'itineraries_hero_cta_text', title: 'Hero CTA Button Text', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_primary_text', title: 'Primary CTA Button Text', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_secondary_text', title: 'Secondary CTA Button Text', content: '', contentType: 'TEXT' }
        ]
      },
      features: {
        label: 'Features Section',
        fields: [
          { key: 'itineraries_features_title', title: 'Features Section Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_1_title', title: 'Feature 1 Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_1_description', title: 'Feature 1 Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_feature_2_title', title: 'Feature 2 Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_2_description', title: 'Feature 2 Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_feature_3_title', title: 'Feature 3 Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_3_description', title: 'Feature 3 Description', content: '', contentType: 'TEXTAREA' }
        ]
      }
    }
  },
  {
    id: 'packages',
    label: 'Packages Page',
    icon: Package,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'packages_hero_title', title: 'Hero Title', content: 'Luxury Travel Packages', contentType: 'TEXT' },
          { key: 'packages_hero_subtitle', title: 'Hero Subtitle', content: 'Curated Egyptian Adventures & Premium Nile Experiences', contentType: 'TEXT' },
          { key: 'packages_hero_description', title: 'Hero Description', content: 'From intimate cruises to comprehensive cultural journeys, discover your perfect Egyptian adventure', contentType: 'TEXTAREA' }
        ]
      },
      search: {
        label: 'Search Section',
        fields: [
          { key: 'packages_search_placeholder', title: 'Search Placeholder', content: 'Search packages by name, destination, or description...', contentType: 'TEXT' },
          { key: 'packages_singular', title: 'Package Singular', content: 'package', contentType: 'TEXT' },
          { key: 'packages_plural', title: 'Package Plural', content: 'packages', contentType: 'TEXT' },
          { key: 'packages_available', title: 'Available Text', content: 'available', contentType: 'TEXT' }
        ]
      },
      features: {
        label: 'Why Choose Section',
        fields: [
          { key: 'packages_why_title', title: 'Section Title', content: 'Why Choose Our Travel Packages', contentType: 'TEXT' },
          { key: 'packages_why_subtitle', title: 'Section Subtitle', content: 'Every package is carefully crafted to deliver exceptional value and unforgettable experiences', contentType: 'TEXT' },
          { key: 'packages_feature_1_title', title: 'Feature 1 Title', content: 'All-Inclusive Excellence', contentType: 'TEXT' },
          { key: 'packages_feature_1_description', title: 'Feature 1 Description', content: 'Everything included from luxury accommodations to expert guides, meals, and entrance fees - no hidden costs.', contentType: 'TEXTAREA' },
          { key: 'packages_feature_2_title', title: 'Feature 2 Title', content: 'Travel Protection', contentType: 'TEXT' },
          { key: 'packages_feature_2_description', title: 'Feature 2 Description', content: 'Comprehensive travel insurance, 24/7 support, and flexible booking policies for complete peace of mind.', contentType: 'TEXTAREA' },
          { key: 'packages_feature_3_title', title: 'Feature 3 Title', content: 'Expert Local Guides', contentType: 'TEXT' },
          { key: 'packages_feature_3_description', title: 'Feature 3 Description', content: 'Certified Egyptologists and local specialists bringing ancient history to life with insider knowledge and stories.', contentType: 'TEXTAREA' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'packages_cta_title', title: 'CTA Title', content: 'Ready to Book Your Adventure?', contentType: 'TEXT' },
          { key: 'packages_cta_subtitle', title: 'CTA Subtitle', content: "Join thousands of satisfied travelers who've discovered Egypt with our expertly crafted travel packages", contentType: 'TEXT' },
          { key: 'packages_cta_book_btn', title: 'Book Button', content: 'Book Now', contentType: 'TEXT' },
          { key: 'packages_cta_contact_btn', title: 'Contact Button', content: 'Contact Us', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'booking',
    label: 'Booking Page',
    icon: Calendar,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'booking_hero_title', title: 'Hero Title', content: '𓊪𓈖𓇳 Booking Portal 𓇳𓈖𓊪', contentType: 'TEXT' },
          { key: 'booking_loading', title: 'Loading Text', content: 'Loading vessels...', contentType: 'TEXT' }
        ]
      },
      dahabiya: {
        label: 'Dahabiya Booking',
        fields: [
          { key: 'booking_dahabiya_subtitle', title: 'Dahabiya Subtitle', content: 'Reserve Your Sacred Nile Journey', contentType: 'TEXT' },
          { key: 'booking_selected_label', title: 'Selected Label', content: 'Booking:', contentType: 'TEXT' },
          { key: 'booking_selected_message', title: 'Selected Message', content: "You've selected this vessel for your Nile journey", contentType: 'TEXT' }
        ]
      },
      package: {
        label: 'Package Booking',
        fields: [
          { key: 'booking_package_subtitle', title: 'Package Subtitle', content: 'Reserve Your Royal Egyptian Adventure', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: Globe,
    sections: {
      company: {
        label: 'Company Info',
        fields: [
          { key: 'footer-title', title: 'Footer Title', content: '', contentType: 'TEXT' },
          { key: 'footer-company-name', title: 'Company Name', content: '', contentType: 'TEXT' },
          { key: 'footer-description', title: 'Description', content: '', contentType: 'TEXTAREA' },
          { key: 'footer-phone', title: 'Phone', content: '', contentType: 'TEXT' },
          { key: 'footer-email', title: 'Email', content: '', contentType: 'TEXT' },
          { key: 'footer-address', title: 'Address', content: '', contentType: 'TEXTAREA' }
        ]
      },
      navigation: {
        label: 'Quick Links',
        fields: [
          { key: 'footer_quick_links_title', title: 'Quick Links Title', content: '', contentType: 'TEXT' },
          { key: 'footer-link-home', title: 'Home Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-about', title: 'About Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-dahabiyat', title: 'Dahabiyat Link (legacy)', content: '', contentType: 'TEXT' },
          { key: 'footer-link-dahabiyas', title: 'Dahabiyas Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-itineraries', title: 'Itineraries Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-destinations', title: 'Destinations Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-packages', title: 'Packages Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-contact', title: 'Contact Link', content: '', contentType: 'TEXT' }
        ]
      },
      social: {
        label: 'Social Media',
        fields: [
          { key: 'footer_follow_us_title', title: 'Follow Us Title', content: '', contentType: 'TEXT' },
          { key: 'footer-facebook', title: 'Facebook URL', content: '', contentType: 'URL' },
          { key: 'footer-instagram', title: 'Instagram URL', content: '', contentType: 'URL' },
          { key: 'footer-twitter', title: 'Twitter URL', content: '', contentType: 'URL' }
        ]
      },
      newsletter: {
        label: 'Newsletter',
        fields: [
          { key: 'footer_newsletter_title', title: 'Newsletter Title', content: '', contentType: 'TEXT' },
          { key: 'footer-newsletter-text', title: 'Newsletter Text', content: '', contentType: 'TEXTAREA' },
          { key: 'footer_subscribe_button_text', title: 'Subscribe Button', content: '', contentType: 'TEXT' }
        ]
      },
      developer: {
        label: 'Developer Info',
        fields: [
          { key: 'footer_developer_logo', title: 'Developer Logo', content: '', contentType: 'IMAGE' },
          { key: 'footer_developer_contact_text', title: 'Developer Contact Text', content: '', contentType: 'TEXT' },
          { key: 'footer_developer_contact_url', title: 'Developer Contact URL', content: '', contentType: 'URL' },
          { key: 'footer_developer_phone', title: 'Developer Phone', content: '', contentType: 'TEXT' },
          { key: 'footer_developer_phone_url', title: 'Developer Phone URL', content: '', contentType: 'URL' },
          { key: 'footer_developer_contact_modal_title', title: 'Developer Contact Modal Title', content: '', contentType: 'TEXT' }
        ]
      },
      general: {
        label: 'General',
        fields: [
          { key: 'footer_loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Services Page Content
  {
    id: 'services',
    label: 'Services Page',
    icon: Package,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'services_hero_title', title: 'Hero Title', content: 'Travel Services', contentType: 'TEXT', description: 'Main heading for the services page' },
          { key: 'services_hero_subtitle', title: 'Hero Subtitle', content: 'Comprehensive Travel Solutions Tailored to Your Perfect Journey', contentType: 'TEXT', description: 'Subheading below the main title' },
          { key: 'services_hero_description', title: 'Hero Description', content: 'From adventure seekers to luxury travelers, families to cultural enthusiasts - discover our comprehensive range of travel services designed to create unforgettable experiences.', contentType: 'TEXTAREA', description: 'Description paragraph in hero section' },
          { key: 'services_hero_image', title: 'Hero Background Image', content: '/images/Royal Cleopatra/DSC_8568.jpg', contentType: 'IMAGE', description: 'Background image for the hero section' },
          { key: 'services_hero_cta_primary', title: 'Primary CTA Text', content: 'Explore Services', contentType: 'TEXT' },
          { key: 'services_hero_cta_secondary', title: 'Secondary CTA Text', content: 'Custom Planning', contentType: 'TEXT' }
        ]
      },
      section_header: {
        label: 'Section Header',
        fields: [
          { key: 'services_section_title', title: 'Section Title', content: 'Travel Services', contentType: 'TEXT' },
          { key: 'services_section_subtitle', title: 'Section Subtitle', content: 'Choose from our specialized travel services, each designed to cater to different travel styles and preferences.', contentType: 'TEXTAREA' }
        ]
      },
      service_1: {
        label: 'Adventure Tours Service',
        fields: [
          { key: 'service_adventure_name', title: 'Service Name', content: 'Adventure Tours', contentType: 'TEXT' },
          { key: 'service_adventure_icon', title: 'Service Icon', content: '🏔️', contentType: 'TEXT' },
          { key: 'service_adventure_description', title: 'Description', content: 'Experience heart-pumping adventures from mountain climbing to desert expeditions and extreme sports.', contentType: 'TEXTAREA' },
          { key: 'service_adventure_image', title: 'Service Image', content: '/images/Royal Cleopatra/DSC_8750.jpg', contentType: 'IMAGE' },
          { key: 'service_adventure_pricing', title: 'Pricing Text', content: 'From $800', contentType: 'TEXT' },
          { key: 'service_adventure_services', title: 'Services List (comma-separated)', content: 'Mountain Climbing,Desert Safari,Extreme Sports,Wildlife Expeditions', contentType: 'TEXT' },
          { key: 'service_adventure_highlights', title: 'Highlights (comma-separated)', content: 'Adrenaline Rush,Expert Guides,Safety First,Unique Experiences', contentType: 'TEXT' }
        ]
      },
      service_2: {
        label: 'Cultural Experiences Service',
        fields: [
          { key: 'service_cultural_name', title: 'Service Name', content: 'Cultural Experiences', contentType: 'TEXT' },
          { key: 'service_cultural_icon', title: 'Service Icon', content: '🏛️', contentType: 'TEXT' },
          { key: 'service_cultural_description', title: 'Description', content: 'Immerse yourself in local cultures, traditions, and historic sites with expert cultural guides.', contentType: 'TEXTAREA' },
          { key: 'service_cultural_image', title: 'Service Image', content: '/images/Royal Cleopatra/DSC_8568.jpg', contentType: 'IMAGE' },
          { key: 'service_cultural_pricing', title: 'Pricing Text', content: 'From $600', contentType: 'TEXT' },
          { key: 'service_cultural_services', title: 'Services List (comma-separated)', content: 'Historical Tours,Local Immersion,Art & Museums,Traditional Workshops', contentType: 'TEXT' },
          { key: 'service_cultural_highlights', title: 'Highlights (comma-separated)', content: 'Authentic Culture,Local Experts,Educational,Heritage Sites', contentType: 'TEXT' }
        ]
      },
      service_3: {
        label: 'Luxury Travel Service',
        fields: [
          { key: 'service_luxury_name', title: 'Service Name', content: 'Luxury Travel', contentType: 'TEXT' },
          { key: 'service_luxury_icon', title: 'Service Icon', content: '✨', contentType: 'TEXT' },
          { key: 'service_luxury_description', title: 'Description', content: 'Indulge in premium accommodations, fine dining, and exclusive experiences tailored for discerning travelers.', contentType: 'TEXTAREA' },
          { key: 'service_luxury_image', title: 'Service Image', content: '/images/Royal Cleopatra/DSC_8502.jpg', contentType: 'IMAGE' },
          { key: 'service_luxury_pricing', title: 'Pricing Text', content: 'From $2,500', contentType: 'TEXT' },
          { key: 'service_luxury_services', title: 'Services List (comma-separated)', content: '5-Star Hotels,Private Jets,Exclusive Access,Personal Concierge', contentType: 'TEXT' },
          { key: 'service_luxury_highlights', title: 'Highlights (comma-separated)', content: 'Ultimate Comfort,Premium Service,Exclusive Access,Personalized', contentType: 'TEXT' }
        ]
      },
      service_4: {
        label: 'Family Vacations Service',
        fields: [
          { key: 'service_family_name', title: 'Service Name', content: 'Family Vacations', contentType: 'TEXT' },
          { key: 'service_family_icon', title: 'Service Icon', content: '👨‍👩‍👧‍👦', contentType: 'TEXT' },
          { key: 'service_family_description', title: 'Description', content: 'Create lasting memories with family-friendly activities, accommodations, and experiences for all ages.', contentType: 'TEXTAREA' },
          { key: 'service_family_image', title: 'Service Image', content: '/images/Royal Cleopatra/DSC_8625.jpg', contentType: 'IMAGE' },
          { key: 'service_family_pricing', title: 'Pricing Text', content: 'From $400', contentType: 'TEXT' },
          { key: 'service_family_services', title: 'Services List (comma-separated)', content: 'Kids Activities,Family Hotels,Educational Tours,Safe Adventures', contentType: 'TEXT' },
          { key: 'service_family_highlights', title: 'Highlights (comma-separated)', content: 'All Ages Fun,Safe Environment,Educational,Memory Making', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'Call to Action Section',
        fields: [
          { key: 'services_cta_title', title: 'CTA Title', content: 'Ready to Plan Your Perfect Trip?', contentType: 'TEXT' },
          { key: 'services_cta_description', title: 'CTA Description', content: 'Let our travel experts help you choose the perfect services for your dream vacation.', contentType: 'TEXTAREA' },
          { key: 'services_cta_primary_text', title: 'Primary Button Text', content: 'Start Planning', contentType: 'TEXT' },
          { key: 'services_cta_secondary_text', title: 'Secondary Button Text', content: 'Contact Us', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Gallery Page Content
  {
    id: 'gallery',
    label: 'Gallery Page',
    icon: Image,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'gallery_hero_title', title: 'Hero Title', content: 'Gallery', contentType: 'TEXT', description: 'Main heading for the gallery page' },
          { key: 'gallery_hero_subtitle', title: 'Hero Subtitle', content: 'Captured Moments of Egyptian Splendor', contentType: 'TEXT', description: 'Subheading below the main title' },
          { key: 'gallery_hero_image', title: 'Hero Background Image', content: '/images/Royal Cleopatra/DSC_8568.jpg', contentType: 'IMAGE', description: 'Background image for the hero section' }
        ]
      },
      content: {
        label: 'Main Content',
        fields: [
          { key: 'gallery_page_title', title: 'Page Title', content: 'Gallery', contentType: 'TEXT' },
          { key: 'gallery_description', title: 'Gallery Description', content: 'Explore our collection of stunning photographs showcasing the beauty of our dahabiyat, the majesty of ancient Egypt, and unforgettable travel experiences', contentType: 'TEXTAREA' },
          { key: 'gallery_photos_label', title: 'Photos Label', content: 'Photos', contentType: 'TEXT' },
          { key: 'gallery_views_label', title: 'Views Label', content: 'Views', contentType: 'TEXT' },
          { key: 'gallery_filter_all', title: 'Filter All Text', content: 'All', contentType: 'TEXT' },
          { key: 'gallery_no_images_title', title: 'No Images Title', content: 'No Images Found', contentType: 'TEXT' },
          { key: 'gallery_no_images_text', title: 'No Images Text', content: 'No images match your current filter. Try adjusting your selection.', contentType: 'TEXT' },
          { key: 'gallery_loading_text', title: 'Loading Text', content: 'Loading gallery...', contentType: 'TEXT' }
        ]
      }
    }
  },
  // FAQ Page Content
  {
    id: 'faq',
    label: 'FAQ Page',
    icon: FileText,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'faq_hero_title', title: 'Hero Title', content: 'Frequently Asked Questions', contentType: 'TEXT', description: 'Main heading for the FAQ page' },
          { key: 'faq_hero_subtitle', title: 'Hero Subtitle', content: 'Find answers to common questions about our cruises', contentType: 'TEXT', description: 'Subheading below the main title' },
          { key: 'faq_hero_image', title: 'Hero Background Image', content: '/images/faq-hero-bg.jpg', contentType: 'IMAGE', description: 'Background image for the hero section' }
        ]
      },
      faqs: {
        label: 'FAQ Items',
        fields: [
          { key: 'faq_1_question', title: 'FAQ 1 Question', content: 'What is a Dahabiya?', contentType: 'TEXT' },
          { key: 'faq_1_answer', title: 'FAQ 1 Answer', content: 'A Dahabiya is a traditional Egyptian sailing vessel that offers a more intimate and luxurious way to explore the Nile River.', contentType: 'TEXTAREA' },
          { key: 'faq_2_question', title: 'FAQ 2 Question', content: 'How long are the cruises?', contentType: 'TEXT' },
          { key: 'faq_2_answer', title: 'FAQ 2 Answer', content: 'Our cruises typically range from 3 to 7 nights, depending on the itinerary you choose.', contentType: 'TEXTAREA' },
          { key: 'faq_3_question', title: 'FAQ 3 Question', content: 'What is included in the cruise?', contentType: 'TEXT' },
          { key: 'faq_3_answer', title: 'FAQ 3 Answer', content: 'All cruises include accommodation, meals, guided tours, and transfers. Some packages also include flights.', contentType: 'TEXTAREA' },
          { key: 'faq_4_question', title: 'FAQ 4 Question', content: 'What is the best time to visit Egypt?', contentType: 'TEXT' },
          { key: 'faq_4_answer', title: 'FAQ 4 Answer', content: 'The best time to visit Egypt is from October to April when the weather is cooler and more comfortable for sightseeing.', contentType: 'TEXTAREA' },
          { key: 'faq_5_question', title: 'FAQ 5 Question', content: 'How do I book a cruise?', contentType: 'TEXT' },
          { key: 'faq_5_answer', title: 'FAQ 5 Answer', content: 'You can book directly through our website or contact our team for personalized assistance.', contentType: 'TEXTAREA' }
        ]
      }
    }
  },
  // Terms Page Content
  {
    id: 'terms',
    label: 'Terms Page',
    icon: FileText,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'terms_hero_title', title: 'Hero Title', content: 'Terms and Conditions', contentType: 'TEXT', description: 'Main heading for the terms page' },
          { key: 'terms_hero_subtitle', title: 'Hero Subtitle', content: 'Royal Covenant of Service', contentType: 'TEXT', description: 'Subheading below the main title' },
          { key: 'terms_hero_image', title: 'Hero Background Image', content: '/images/dahabiya-sunset.jpg', contentType: 'IMAGE', description: 'Background image for the hero section' }
        ]
      },
      content: {
        label: 'Terms Content',
        fields: [
          { key: 'terms_content', title: 'Terms Content (HTML)', content: '', contentType: 'TEXTAREA', description: 'Full terms and conditions content (supports HTML)' },
          { key: 'terms_last_updated', title: 'Last Updated Date', content: '', contentType: 'TEXT', description: 'Date when terms were last updated' }
        ]
      }
    }
  },
  // Privacy Page Content
  {
    id: 'privacy',
    label: 'Privacy Page',
    icon: FileText,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'privacy_hero_title', title: 'Hero Title', content: 'Privacy Policy', contentType: 'TEXT', description: 'Main heading for the privacy page' },
          { key: 'privacy_hero_subtitle', title: 'Hero Subtitle', content: 'Royal Decree of Privacy Protection', contentType: 'TEXT', description: 'Subheading below the main title' },
          { key: 'privacy_hero_image', title: 'Hero Background Image', content: '/images/privacy-hero-bg.jpg', contentType: 'IMAGE', description: 'Background image for the hero section' }
        ]
      },
      content: {
        label: 'Privacy Content',
        fields: [
          { key: 'privacy_content', title: 'Privacy Content (HTML)', content: '', contentType: 'TEXTAREA', description: 'Full privacy policy content (supports HTML)' },
          { key: 'privacy_last_updated', title: 'Last Updated Date', content: '', contentType: 'TEXT', description: 'Date when privacy policy was last updated' }
        ]
      }
    }
  },
  // Testimonials Page Content
  {
    id: 'testimonials',
    label: 'Testimonials Page',
    icon: Users,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'testimonials_hero_title', title: 'Hero Title', content: 'Guest Testimonials', contentType: 'TEXT', description: 'Main heading for the testimonials page' },
          { key: 'testimonials_hero_subtitle', title: 'Hero Subtitle', content: 'Discover authentic experiences from our guests who have sailed the Nile aboard our luxury dahabiyas.', contentType: 'TEXTAREA', description: 'Description paragraph in hero section' },
          { key: 'testimonials_hero_image', title: 'Hero Background Image', content: '', contentType: 'IMAGE', description: 'Background image for the hero section' }
        ]
      },
      stats: {
        label: 'Statistics',
        fields: [
          { key: 'testimonials_total_reviews_label', title: 'Total Reviews Label', content: 'Total Reviews', contentType: 'TEXT' },
          { key: 'testimonials_average_rating_label', title: 'Average Rating Label', content: 'Average Rating', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'testimonials_share_button', title: 'Share Review Button', content: 'Share Your Review', contentType: 'TEXT' },
          { key: 'testimonials_cta_title', title: 'CTA Title', content: 'Share Your Nile Experience', contentType: 'TEXT' },
          { key: 'testimonials_cta_description', title: 'CTA Description', content: 'Have you sailed with us? Your review helps future travelers discover the magic of a luxury Nile dahabiya journey.', contentType: 'TEXTAREA' },
          { key: 'testimonials_write_review_button', title: 'Write Review Button', content: 'Write a Review', contentType: 'TEXT' },
          { key: 'testimonials_explore_fleet_button', title: 'Explore Fleet Button', content: 'Explore Our Fleet', contentType: 'TEXT' }
        ]
      },
      filters: {
        label: 'Filter Labels',
        fields: [
          { key: 'testimonials_search_placeholder', title: 'Search Placeholder', content: 'Search testimonials...', contentType: 'TEXT' },
          { key: 'testimonials_all_dahabiyas', title: 'All Dahabiyas Label', content: 'All Dahabiyas', contentType: 'TEXT' },
          { key: 'testimonials_all_ratings', title: 'All Ratings Label', content: 'All Ratings', contentType: 'TEXT' },
          { key: 'testimonials_no_reviews_title', title: 'No Reviews Title', content: 'No Reviews Found', contentType: 'TEXT' },
          { key: 'testimonials_no_reviews_text', title: 'No Reviews Text', content: 'Try adjusting your filters to see more reviews.', contentType: 'TEXT' },
          { key: 'testimonials_loading_text', title: 'Loading Text', content: 'Loading testimonials...', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Cancellation Policy Page Content
  {
    id: 'cancellation-policy',
    label: 'Cancellation Policy',
    icon: FileText,
    sections: {
      content: {
        label: 'Page Content',
        fields: [
          { key: 'cancellation_policy_title', title: 'Page Title', content: 'Royal Cancellation Policy', contentType: 'TEXT' },
          { key: 'cancellation_policy_subtitle', title: 'Page Subtitle', content: 'Fair and transparent terms for your journey', contentType: 'TEXT' },
          { key: 'cancellation_policy_description', title: 'Description', content: 'We understand that sometimes the gods may change your travel plans. Our cancellation policy is designed to be fair and transparent while protecting both our guests and our vessels.', contentType: 'TEXTAREA' },
          { key: 'cancellation_policy_hero_image', title: 'Hero Image', content: '/images/policy-hero.jpg', contentType: 'IMAGE' },
          { key: 'cancellation_policy_features', title: 'Features (comma-separated)', content: 'Flexible Cancellation Terms,Transparent Refund Process,Travel Insurance Options,Emergency Cancellation,Rebooking Opportunities,Force Majeure Protection,Clear Timeline Guidelines,Customer Support', contentType: 'TEXTAREA' },
          { key: 'cancellation_policy_advantages', title: 'Advantages', content: 'Our cancellation policy balances flexibility with fairness, offering reasonable refund terms while protecting the interests of all parties involved in your royal journey.', contentType: 'TEXTAREA' },
          { key: 'cancellation_policy_meaning', title: 'Meaning', content: 'Like the ancient contracts blessed by the gods, our cancellation policy is built on principles of fairness, transparency, and mutual respect.', contentType: 'TEXTAREA' }
        ]
      }
    }
  },
  {
    id: 'branding',
    label: 'Branding & Settings',
    icon: Settings,
    sections: {
      logos: {
        label: 'Logos & Branding',
        fields: [
          { key: 'site_name', title: 'Site Name', content: '', contentType: 'TEXT', description: 'Main website name' },
          { key: 'site_logo', title: 'Main Logo', content: '', contentType: 'IMAGE', description: 'Primary site logo' },
          { key: 'navbar_logo', title: 'Navbar Logo', content: '', contentType: 'IMAGE', description: 'Logo in navigation bar' },
          { key: 'footer_logo', title: 'Footer Logo', content: '', contentType: 'IMAGE', description: 'Logo in footer' },
          { key: 'site_favicon', title: 'Favicon', content: '', contentType: 'IMAGE', description: 'Browser tab icon' }
        ]
      }
    }
  },
  {
    id: 'global_media',
    label: 'Global Media',
    icon: Image,
    sections: {
      hero: {
        label: 'Hero Fallbacks',
        fields: [
          { key: 'hero_fallback_image', title: 'Hero Fallback Image', content: '', contentType: 'IMAGE' }
        ]
      },
      developer: {
        label: 'Developer Contact',
        fields: [
          { key: 'footer_developer_logo', title: 'Developer Logo', content: '', contentType: 'IMAGE' },
          { key: 'footer_developer_contact_text', title: 'Developer Contact Text', content: '', contentType: 'TEXT' },
          { key: 'footer_developer_contact_url', title: 'Developer Contact URL', content: '', contentType: 'URL' },
          { key: 'footer_developer_phone', title: 'Developer Phone', content: '', contentType: 'TEXT' },
          { key: 'footer_developer_phone_url', title: 'Developer Phone URL', content: '', contentType: 'URL' },
          { key: 'footer_developer_contact_modal_title', title: 'Developer Contact Modal Title', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Itinerary Aswan-Luxor Page
  {
    id: 'itinerary_aswan_luxor',
    label: 'Itinerary: Aswan-Luxor',
    icon: MapPin,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'aswan_luxor_title', title: 'Page Title', content: 'Aswan to Luxor', contentType: 'TEXT' },
          { key: 'aswan_luxor_subtitle', title: 'Page Subtitle', content: 'Downstream Nile Journey', contentType: 'TEXT' },
          { key: 'aswan_luxor_back_btn', title: 'Back Button', content: 'Back to Itineraries', contentType: 'TEXT' },
          { key: 'aswan_luxor_hero_title', title: 'Hero Title', content: 'Aswan to Luxor Journey', contentType: 'TEXT' },
          { key: 'aswan_luxor_hero_desc', title: 'Hero Description', content: 'Experience the classic downstream Nile cruise from Aswan to Luxor, following the ancient path of pharaohs and explorers.', contentType: 'TEXTAREA' },
          { key: 'aswan_luxor_duration', title: 'Duration', content: '4-5 Days', contentType: 'TEXT' },
          { key: 'aswan_luxor_route', title: 'Route', content: 'Aswan → Luxor', contentType: 'TEXT' },
          { key: 'aswan_luxor_group_size', title: 'Group Size', content: '12-20 Guests', contentType: 'TEXT' }
        ]
      },
      overview: {
        label: 'Overview Section',
        fields: [
          { key: 'aswan_luxor_overview_title', title: 'Overview Title', content: 'Journey Overview', contentType: 'TEXT' },
          { key: 'aswan_luxor_overview_p1', title: 'Overview Paragraph 1', content: 'The Aswan to Luxor route is the most popular Nile cruise itinerary, taking you downstream through some of Egypt\'s most spectacular ancient sites.', contentType: 'TEXTAREA' },
          { key: 'aswan_luxor_overview_p2', title: 'Overview Paragraph 2', content: 'This journey follows the natural flow of the Nile, allowing for a relaxed pace as you explore temples, tombs, and traditional villages along the way.', contentType: 'TEXTAREA' }
        ]
      },
      booking: {
        label: 'Booking Section',
        fields: [
          { key: 'aswan_luxor_itinerary_title', title: 'Itinerary Title', content: 'Daily Itinerary', contentType: 'TEXT' },
          { key: 'aswan_luxor_booking_title', title: 'Booking Title', content: 'Book This Route', contentType: 'TEXT' },
          { key: 'aswan_luxor_duration_label', title: 'Duration Label', content: 'Duration', contentType: 'TEXT' },
          { key: 'aswan_luxor_dahabiya_label', title: 'Dahabiya Label', content: 'Select Dahabiya', contentType: 'TEXT' },
          { key: 'aswan_luxor_date_label', title: 'Date Label', content: 'Preferred Date', contentType: 'TEXT' },
          { key: 'aswan_luxor_check_btn', title: 'Check Button', content: 'Check Availability', contentType: 'TEXT' }
        ]
      },
      highlights: {
        label: 'Highlights Section',
        fields: [
          { key: 'aswan_luxor_highlights_title', title: 'Highlights Title', content: 'Route Highlights', contentType: 'TEXT' }
        ]
      },
      facts: {
        label: 'Facts Section',
        fields: [
          { key: 'aswan_luxor_facts_title', title: 'Facts Title', content: 'Quick Facts', contentType: 'TEXT' },
          { key: 'aswan_luxor_fact_1', title: 'Fact 1', content: 'Best time: October to April', contentType: 'TEXT' },
          { key: 'aswan_luxor_fact_2', title: 'Fact 2', content: 'Distance: ~200 km', contentType: 'TEXT' },
          { key: 'aswan_luxor_fact_3', title: 'Fact 3', content: 'Sailing direction: Downstream', contentType: 'TEXT' },
          { key: 'aswan_luxor_fact_4', title: 'Fact 4', content: 'Major stops: 5-7 sites', contentType: 'TEXT' },
          { key: 'aswan_luxor_fact_5', title: 'Fact 5', content: 'Includes: All meals & tours', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'CTA Section',
        fields: [
          { key: 'aswan_luxor_cta_title', title: 'CTA Title', content: 'Ready to Experience This Journey?', contentType: 'TEXT' },
          { key: 'aswan_luxor_cta_desc', title: 'CTA Description', content: 'Book your Aswan to Luxor cruise and discover the wonders of ancient Egypt', contentType: 'TEXT' },
          { key: 'aswan_luxor_cta_book_btn', title: 'Book Button', content: 'Book Now', contentType: 'TEXT' },
          { key: 'aswan_luxor_cta_view_btn', title: 'View Button', content: 'View All Itineraries', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Itinerary Luxor-Aswan Page
  {
    id: 'itinerary_luxor_aswan',
    label: 'Itinerary: Luxor-Aswan',
    icon: MapPin,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'luxor_aswan_title', title: 'Page Title', content: 'Luxor to Aswan', contentType: 'TEXT' },
          { key: 'luxor_aswan_subtitle', title: 'Page Subtitle', content: 'Upstream Nile Journey', contentType: 'TEXT' },
          { key: 'luxor_aswan_back_btn', title: 'Back Button', content: 'Back to Itineraries', contentType: 'TEXT' },
          { key: 'luxor_aswan_hero_title', title: 'Hero Title', content: 'Luxor to Aswan Journey', contentType: 'TEXT' },
          { key: 'luxor_aswan_hero_desc', title: 'Hero Description', content: 'Sail upstream against the Nile\'s current, discovering ancient wonders as you journey from Luxor to Aswan.', contentType: 'TEXTAREA' },
          { key: 'luxor_aswan_duration', title: 'Duration', content: '5-6 Days', contentType: 'TEXT' },
          { key: 'luxor_aswan_route', title: 'Route', content: 'Luxor → Aswan', contentType: 'TEXT' },
          { key: 'luxor_aswan_group_size', title: 'Group Size', content: '12-20 Guests', contentType: 'TEXT' }
        ]
      },
      overview: {
        label: 'Overview Section',
        fields: [
          { key: 'luxor_aswan_overview_title', title: 'Overview Title', content: 'Journey Overview', contentType: 'TEXT' },
          { key: 'luxor_aswan_overview_p1', title: 'Overview Paragraph 1', content: 'The Luxor to Aswan route offers a unique upstream journey, sailing against the Nile\'s gentle current while exploring Egypt\'s most treasured ancient sites.', contentType: 'TEXTAREA' },
          { key: 'luxor_aswan_overview_p2', title: 'Overview Paragraph 2', content: 'This route allows for a more leisurely pace with additional time at each destination, perfect for those who want to deeply immerse themselves in Egyptian history.', contentType: 'TEXTAREA' }
        ]
      },
      cta: {
        label: 'CTA Section',
        fields: [
          { key: 'luxor_aswan_cta_title', title: 'CTA Title', content: 'Ready to Experience This Journey?', contentType: 'TEXT' },
          { key: 'luxor_aswan_cta_desc', title: 'CTA Description', content: 'Book your Luxor to Aswan cruise and discover the wonders of ancient Egypt', contentType: 'TEXT' },
          { key: 'luxor_aswan_cta_book_btn', title: 'Book Button', content: 'Book Now', contentType: 'TEXT' },
          { key: 'luxor_aswan_cta_view_btn', title: 'View Button', content: 'View All Itineraries', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Itinerary Map Page
  {
    id: 'itinerary_map',
    label: 'Itinerary: Map',
    icon: MapPin,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'map_title', title: 'Page Title', content: 'Route Map', contentType: 'TEXT' },
          { key: 'map_subtitle', title: 'Page Subtitle', content: 'Interactive Nile Journey Map', contentType: 'TEXT' },
          { key: 'map_back_btn', title: 'Back Button', content: 'Back to Itineraries', contentType: 'TEXT' },
          { key: 'map_hero_title', title: 'Hero Title', content: 'Explore Our Nile Routes', contentType: 'TEXT' },
          { key: 'map_hero_desc', title: 'Hero Description', content: 'Discover the ancient paths along the Nile with our interactive route maps.', contentType: 'TEXTAREA' }
        ]
      },
      features: {
        label: 'Features Section',
        fields: [
          { key: 'map_feature_1', title: 'Feature 1', content: 'Interactive Maps', contentType: 'TEXT' },
          { key: 'map_feature_2', title: 'Feature 2', content: 'Detailed Routes', contentType: 'TEXT' },
          { key: 'map_feature_3', title: 'Feature 3', content: 'Site Information', contentType: 'TEXT' },
          { key: 'map_routes_title', title: 'Routes Title', content: 'Available Routes', contentType: 'TEXT' },
          { key: 'map_view_route_btn', title: 'View Route Button', content: 'View Route', contentType: 'TEXT' },
          { key: 'map_features_title', title: 'Features Title', content: 'Map Features', contentType: 'TEXT' }
        ]
      },
      legend: {
        label: 'Map Legend',
        fields: [
          { key: 'map_legend_title', title: 'Legend Title', content: 'Map Legend', contentType: 'TEXT' },
          { key: 'map_site_types_title', title: 'Site Types Title', content: 'Site Types', contentType: 'TEXT' },
          { key: 'map_site_temples', title: 'Temples Label', content: 'Temples', contentType: 'TEXT' },
          { key: 'map_site_tombs', title: 'Tombs Label', content: 'Tombs', contentType: 'TEXT' },
          { key: 'map_site_museums', title: 'Museums Label', content: 'Museums', contentType: 'TEXT' },
          { key: 'map_site_cities', title: 'Cities Label', content: 'Cities', contentType: 'TEXT' },
          { key: 'map_route_info_title', title: 'Route Info Title', content: 'Route Information', contentType: 'TEXT' },
          { key: 'map_route_downstream', title: 'Downstream Label', content: 'Downstream Route', contentType: 'TEXT' },
          { key: 'map_route_upstream', title: 'Upstream Label', content: 'Upstream Route', contentType: 'TEXT' },
          { key: 'map_route_short', title: 'Short Route Label', content: 'Short Route', contentType: 'TEXT' },
          { key: 'map_route_extended', title: 'Extended Route Label', content: 'Extended Route', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'CTA Section',
        fields: [
          { key: 'map_cta_title', title: 'CTA Title', content: 'Ready to Plan Your Route?', contentType: 'TEXT' },
          { key: 'map_cta_desc', title: 'CTA Description', content: 'Use our route maps to plan your perfect Nile cruise itinerary', contentType: 'TEXT' },
          { key: 'map_cta_plan_btn', title: 'Plan Button', content: 'Plan Your Cruise', contentType: 'TEXT' },
          { key: 'map_cta_view_btn', title: 'View Button', content: 'View All Itineraries', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Packages Luxury Page
  {
    id: 'packages_luxury',
    label: 'Packages: Luxury',
    icon: Package,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'luxury_loading', title: 'Loading Text', content: 'Loading Luxury Experiences...', contentType: 'TEXT' },
          { key: 'luxury_hero_image', title: 'Hero Image', content: '/Royal Cleopatra/DSC_8502.jpg', contentType: 'IMAGE' },
          { key: 'luxury_hero_title', title: 'Hero Title', content: 'Luxury Packages', contentType: 'TEXT' },
          { key: 'luxury_hero_subtitle', title: 'Hero Subtitle', content: 'Experience Egypt in Ultimate Elegance & Comfort', contentType: 'TEXT' },
          { key: 'luxury_hero_desc', title: 'Hero Description', content: "Indulge in the finest Egyptian experiences with our luxury packages featuring presidential suites, private chefs, personal butlers, and exclusive access to Egypt's most treasured sites.", contentType: 'TEXTAREA' },
          { key: 'luxury_view_btn', title: 'View Button', content: 'View Luxury Packages', contentType: 'TEXT' },
          { key: 'luxury_quote_btn', title: 'Quote Button', content: 'Request Custom Quote', contentType: 'TEXT' }
        ]
      },
      amenities: {
        label: 'Amenities Section',
        fields: [
          { key: 'luxury_amenities_title', title: 'Amenities Title', content: 'Luxury', contentType: 'TEXT' },
          { key: 'luxury_amenities_highlight', title: 'Amenities Highlight', content: 'Amenities', contentType: 'TEXT' },
          { key: 'luxury_amenities_desc', title: 'Amenities Description', content: 'Every detail crafted for the discerning traveler seeking the pinnacle of Egyptian hospitality.', contentType: 'TEXT' },
          { key: 'luxury_feature_1_title', title: 'Feature 1 Title', content: 'Presidential Suites', contentType: 'TEXT' },
          { key: 'luxury_feature_1_desc', title: 'Feature 1 Description', content: 'Spacious accommodations with premium furnishings', contentType: 'TEXT' },
          { key: 'luxury_feature_2_title', title: 'Feature 2 Title', content: 'Personal Butler', contentType: 'TEXT' },
          { key: 'luxury_feature_2_desc', title: 'Feature 2 Description', content: '24/7 dedicated service for your every need', contentType: 'TEXT' },
          { key: 'luxury_feature_3_title', title: 'Feature 3 Title', content: 'Gourmet Dining', contentType: 'TEXT' },
          { key: 'luxury_feature_3_desc', title: 'Feature 3 Description', content: 'World-class cuisine prepared by master chefs', contentType: 'TEXT' },
          { key: 'luxury_feature_4_title', title: 'Feature 4 Title', content: 'Exclusive Access', contentType: 'TEXT' },
          { key: 'luxury_feature_4_desc', title: 'Feature 4 Description', content: 'Private tours of temples and monuments', contentType: 'TEXT' }
        ]
      },
      gallery: {
        label: 'Gallery Section',
        fields: [
          { key: 'luxury_gallery_title', title: 'Gallery Title', content: 'Luxury', contentType: 'TEXT' },
          { key: 'luxury_gallery_highlight', title: 'Gallery Highlight', content: 'Gallery', contentType: 'TEXT' },
          { key: 'luxury_gallery_desc', title: 'Gallery Description', content: 'A glimpse into the opulent world of our luxury Egyptian experiences.', contentType: 'TEXT' }
        ]
      },
      packages: {
        label: 'Packages Section',
        fields: [
          { key: 'luxury_packages_title', title: 'Packages Title', content: 'Featured', contentType: 'TEXT' },
          { key: 'luxury_packages_highlight', title: 'Packages Highlight', content: 'Luxury Packages', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Packages Family Page
  {
    id: 'packages_family',
    label: 'Packages: Family',
    icon: Users,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'family_loading', title: 'Loading Text', content: 'Loading Family Experiences...', contentType: 'TEXT' },
          { key: 'family_hero_image', title: 'Hero Image', content: '/images/Royal Cleopatra/DSC_8625.jpg', contentType: 'IMAGE' },
          { key: 'family_hero_title', title: 'Hero Title', content: 'Family Packages', contentType: 'TEXT' },
          { key: 'family_hero_subtitle', title: 'Hero Subtitle', content: 'Create Unforgettable Memories with Multi-Generational Egyptian Adventures', contentType: 'TEXT' },
          { key: 'family_hero_desc', title: 'Hero Description', content: 'Discover Egypt together as a family with specially crafted experiences that delight both children and adults. Safe, educational, and fun adventures perfect for creating lifelong memories.', contentType: 'TEXTAREA' },
          { key: 'family_adventures_btn', title: 'Adventures Button', content: 'Family Adventures', contentType: 'TEXT' },
          { key: 'family_custom_btn', title: 'Custom Button', content: 'Custom Family Trip', contentType: 'TEXT' }
        ]
      },
      experience: {
        label: 'Experience Section',
        fields: [
          { key: 'family_experience_title', title: 'Experience Title', content: 'Family', contentType: 'TEXT' },
          { key: 'family_experience_highlight', title: 'Experience Highlight', content: 'Experience', contentType: 'TEXT' },
          { key: 'family_experience_desc', title: 'Experience Description', content: 'Every aspect of our family packages is designed with safety, education, and fun in mind for all family members.', contentType: 'TEXT' },
          { key: 'family_feature_1_title', title: 'Feature 1 Title', content: 'All Ages Welcome', contentType: 'TEXT' },
          { key: 'family_feature_1_desc', title: 'Feature 1 Description', content: 'Programs suitable for children, teens, and grandparents', contentType: 'TEXT' },
          { key: 'family_feature_2_title', title: 'Feature 2 Title', content: 'Safety First', contentType: 'TEXT' },
          { key: 'family_feature_2_desc', title: 'Feature 2 Description', content: 'Comprehensive safety measures and child-friendly environments', contentType: 'TEXT' },
          { key: 'family_feature_3_title', title: 'Feature 3 Title', content: 'Interactive Learning', contentType: 'TEXT' },
          { key: 'family_feature_3_desc', title: 'Feature 3 Description', content: 'Educational games, treasure hunts, and hands-on activities', contentType: 'TEXT' },
          { key: 'family_feature_4_title', title: 'Feature 4 Title', content: 'Family Bonding', contentType: 'TEXT' },
          { key: 'family_feature_4_desc', title: 'Feature 4 Description', content: 'Shared experiences that bring families closer together', contentType: 'TEXT' }
        ]
      },
      gallery: {
        label: 'Gallery Section',
        fields: [
          { key: 'family_gallery_title', title: 'Gallery Title', content: 'Family', contentType: 'TEXT' },
          { key: 'family_gallery_highlight', title: 'Gallery Highlight', content: 'Gallery', contentType: 'TEXT' },
          { key: 'family_gallery_desc', title: 'Gallery Description', content: 'See families enjoying Egypt together through safe, fun, and educational experiences designed for all ages.', contentType: 'TEXT' }
        ]
      },
      packages: {
        label: 'Packages Section',
        fields: [
          { key: 'family_packages_title', title: 'Packages Title', content: 'Featured', contentType: 'TEXT' },
          { key: 'family_packages_highlight', title: 'Packages Highlight', content: 'Family Packages', contentType: 'TEXT' }
        ]
      }
    }
  },
  // Packages Romantic Page
  {
    id: 'packages_romantic',
    label: 'Packages: Romantic',
    icon: Package,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'romantic_title', title: 'Page Title', content: 'Romantic Getaways', contentType: 'TEXT' },
          { key: 'romantic_subtitle', title: 'Page Subtitle', content: 'Perfect couples retreat on the Nile', contentType: 'TEXT' },
          { key: 'romantic_back_btn', title: 'Back Button', content: 'Back to Packages', contentType: 'TEXT' },
          { key: 'romantic_hero_title', title: 'Hero Title', content: 'Perfect Couples Retreat', contentType: 'TEXT' },
          { key: 'romantic_hero_desc', title: 'Hero Description', content: 'Create unforgettable memories with our romantic Nile cruise getaways. Experience intimate luxury, private dining, and magical moments together.', contentType: 'TEXTAREA' },
          { key: 'romantic_badge_1', title: 'Badge 1', content: 'Couples Only', contentType: 'TEXT' },
          { key: 'romantic_badge_2', title: 'Badge 2', content: 'Romantic Amenities', contentType: 'TEXT' },
          { key: 'romantic_badge_3', title: 'Badge 3', content: 'Private Service', contentType: 'TEXT' }
        ]
      },
      packages: {
        label: 'Packages Section',
        fields: [
          { key: 'romantic_packages_title', title: 'Packages Title', content: 'Romantic Packages', contentType: 'TEXT' },
          { key: 'romantic_pkg_1_name', title: 'Package 1 Name', content: 'Honeymoon Paradise', contentType: 'TEXT' },
          { key: 'romantic_pkg_1_duration', title: 'Package 1 Duration', content: '7 Days', contentType: 'TEXT' },
          { key: 'romantic_pkg_1_price', title: 'Package 1 Price', content: 'From $2,500', contentType: 'TEXT' },
          { key: 'romantic_pkg_1_desc', title: 'Package 1 Description', content: 'Ultimate romantic experience with private dinners and couples spa treatments', contentType: 'TEXT' },
          { key: 'romantic_pkg_2_name', title: 'Package 2 Name', content: 'Anniversary Celebration', contentType: 'TEXT' },
          { key: 'romantic_pkg_2_duration', title: 'Package 2 Duration', content: '5 Days', contentType: 'TEXT' },
          { key: 'romantic_pkg_2_price', title: 'Package 2 Price', content: 'From $1,800', contentType: 'TEXT' },
          { key: 'romantic_pkg_2_desc', title: 'Package 2 Description', content: 'Celebrate your love with special anniversary packages and romantic surprises', contentType: 'TEXT' },
          { key: 'romantic_pkg_3_name', title: 'Package 3 Name', content: "Valentine's Special", contentType: 'TEXT' },
          { key: 'romantic_pkg_3_duration', title: 'Package 3 Duration', content: '4 Days', contentType: 'TEXT' },
          { key: 'romantic_pkg_3_price', title: 'Package 3 Price', content: 'From $1,500', contentType: 'TEXT' },
          { key: 'romantic_pkg_3_desc', title: 'Package 3 Description', content: "Perfect Valentine's Day escape with romantic activities and intimate moments", contentType: 'TEXT' },
          { key: 'romantic_book_btn', title: 'Book Button', content: 'Book This Package', contentType: 'TEXT' }
        ]
      },
      features: {
        label: 'Features Section',
        fields: [
          { key: 'romantic_features_title', title: 'Features Title', content: 'Romantic Features', contentType: 'TEXT' },
          { key: 'romantic_feature_1_title', title: 'Feature 1 Title', content: 'Private Dining', contentType: 'TEXT' },
          { key: 'romantic_feature_1_desc', title: 'Feature 1 Description', content: 'Intimate dinners under the stars with personalized menus', contentType: 'TEXT' },
          { key: 'romantic_feature_2_title', title: 'Feature 2 Title', content: 'Romantic Photography', contentType: 'TEXT' },
          { key: 'romantic_feature_2_desc', title: 'Feature 2 Description', content: 'Professional couple photos to capture your special moments', contentType: 'TEXT' },
          { key: 'romantic_feature_3_title', title: 'Feature 3 Title', content: 'Couples Cooking', contentType: 'TEXT' },
          { key: 'romantic_feature_3_desc', title: 'Feature 3 Description', content: 'Learn to cook traditional Egyptian dishes together', contentType: 'TEXT' },
          { key: 'romantic_feature_4_title', title: 'Feature 4 Title', content: 'Sunset Cruises', contentType: 'TEXT' },
          { key: 'romantic_feature_4_desc', title: 'Feature 4 Description', content: 'Private sunset sailing with champagne and canapés', contentType: 'TEXT' }
        ]
      },
      why_choose: {
        label: 'Why Choose Section',
        fields: [
          { key: 'romantic_why_title', title: 'Why Choose Title', content: 'Why Choose Our Romantic Getaways?', contentType: 'TEXT' },
          { key: 'romantic_intimate_title', title: 'Intimate Title', content: 'Intimate Experience', contentType: 'TEXT' },
          { key: 'romantic_intimate_1', title: 'Intimate Point 1', content: 'Private cabins with romantic decorations', contentType: 'TEXT' },
          { key: 'romantic_intimate_2', title: 'Intimate Point 2', content: 'Personal butler service for couples', contentType: 'TEXT' },
          { key: 'romantic_intimate_3', title: 'Intimate Point 3', content: 'Intimate dining experiences', contentType: 'TEXT' },
          { key: 'romantic_intimate_4', title: 'Intimate Point 4', content: 'Couples-only activities and excursions', contentType: 'TEXT' },
          { key: 'romantic_special_title', title: 'Special Title', content: 'Special Touches', contentType: 'TEXT' },
          { key: 'romantic_special_1', title: 'Special Point 1', content: 'Rose petal decorations', contentType: 'TEXT' },
          { key: 'romantic_special_2', title: 'Special Point 2', content: 'Champagne and chocolate surprises', contentType: 'TEXT' },
          { key: 'romantic_special_3', title: 'Special Point 3', content: 'Romantic music and ambiance', contentType: 'TEXT' },
          { key: 'romantic_special_4', title: 'Special Point 4', content: 'Memory keepsakes and photos', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'CTA Section',
        fields: [
          { key: 'romantic_cta_title', title: 'CTA Title', content: 'Ready to Create Magic Together?', contentType: 'TEXT' },
          { key: 'romantic_cta_desc', title: 'CTA Description', content: 'Book your romantic getaway and create unforgettable memories on the Nile', contentType: 'TEXT' },
          { key: 'romantic_cta_book_btn', title: 'Book Button', content: 'Book Your Romantic Getaway', contentType: 'TEXT' },
          { key: 'romantic_cta_view_btn', title: 'View Button', content: 'View All Packages', contentType: 'TEXT' }
        ]
      }
    }
  }
];

export default function CleanWebsiteContentManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const contentMap: Record<string, string> = {};

      // Load content for each page
      for (const page of WEBSITE_CONTENT_STRUCTURE) {
        const pageId = page.id === 'branding' ? 'branding_settings' : page.id;
        
        try {
          const response = await fetch(`/api/website-content?page=${pageId}&t=${Date.now()}`);
          if (response.ok) {
            const data = await response.json();
            data.forEach((item: any) => {
              contentMap[item.key] = item.content || '';
            });
          }
        } catch (error) {
          console.error(`Error loading ${page.id}:`, error);
        }
      }

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key: string, currentValue: string) => {
    setEditingField(key);
    setEditValue(currentValue);
  };

  const handleSave = async (key: string, field: ContentField, pageId: string) => {
    setSaving(key);
    try {
      const response = await fetch('/api/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          content: editValue,
          title: field.title,
          contentType: field.contentType,
          page: pageId === 'branding' ? 'branding_settings' : pageId,
          section: 'general'
        })
      });

      if (response.ok) {
        setContent(prev => ({ ...prev, [key]: editValue }));
        setEditingField(null);
        setEditValue('');
        toast.success('Content updated successfully');
        
        // Broadcast content update to all tabs/windows for immediate refresh
        try {
          const bc = new BroadcastChannel('content-updates');
          bc.postMessage({ 
            type: 'content-updated', 
            key,
            content: editValue,
            page: pageId === 'branding' ? 'branding_settings' : pageId,
            timestamp: Date.now()
          });
          bc.close();
        } catch (broadcastError) {
          console.log('Broadcast channel not supported:', broadcastError);
        }
        
        // Trigger storage event for same-tab updates
        try {
          localStorage.setItem('content-updated', Date.now().toString());
          localStorage.removeItem('content-updated');
        } catch (storageError) {
          console.log('Local storage not available:', storageError);
        }
        
        // Trigger window events for immediate updates
        window.dispatchEvent(new CustomEvent('content-updated', {
          detail: { key, content: editValue, page: pageId === 'branding' ? 'branding_settings' : pageId }
        }));
        
        // Special handling for logo updates
        if (key.includes('logo') || key.includes('favicon') || key.includes('site_name')) {
          window.dispatchEvent(new CustomEvent('logo-updated', {
            detail: { logoType: key, logoUrl: editValue, timestamp: Date.now() }
          }));
        }
        
        // Force a hard refresh of content across the application
        setTimeout(() => {
          // Dispatch content refresh event
          window.dispatchEvent(new CustomEvent('content-refresh', {
            detail: { key, content: editValue, timestamp: Date.now() }
          }));
          
          // Try to refresh any open tabs showing the website
          try {
            const bc = new BroadcastChannel('website-refresh');
            bc.postMessage({ 
              type: 'content-changed', 
              key,
              page: pageId === 'branding' ? 'branding_settings' : pageId,
              timestamp: Date.now()
            });
            bc.close();
          } catch (error) {
            console.log('Could not broadcast to other tabs:', error);
          }
        }, 100);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderField = (field: ContentField, pageId: string) => {
    const currentValue = content[field.key] || '';
    const isEditing = editingField === field.key;
    const isSaving = saving === field.key;

    return (
      <div key={field.key} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{field.title}</h4>
            {field.description && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
          <Badge variant="secondary" className="self-start sm:ml-2 flex-shrink-0 text-xs">
            {field.contentType}
          </Badge>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {field.contentType === 'IMAGE' || field.contentType === 'VIDEO' ? (
              <ResponsiveMediaPicker
                label={field.title}
                value={editValue}
                onChange={setEditValue}
                accept={field.contentType === 'IMAGE' ? 'image/*' : 'video/*'}
                placeholder={`Select ${field.contentType.toLowerCase()} file...`}
                helperText={field.description}
                className="w-full"
              />
            ) : field.contentType === 'TEXTAREA' ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${field.title.toLowerCase()}...`}
                rows={4}
                className="w-full"
              />
            ) : (
              <Input
                type={field.contentType === 'URL' ? 'url' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${field.title.toLowerCase()}...`}
                className="w-full"
              />
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                onClick={() => handleSave(field.key, field, pageId)}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="ml-1 sm:ml-2">{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                <X className="w-4 h-4" />
                <span className="ml-1 sm:ml-2">Cancel</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {field.contentType === 'IMAGE' && currentValue ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border text-sm">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 break-all">{currentValue}</span>
                </div>
                <div className="border rounded-lg p-2 bg-white">
                  <img
                    src={currentValue}
                    alt={field.title}
                    className="max-w-full h-32 object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'flex items-center justify-center h-32 bg-gray-100 text-gray-500 text-sm rounded';
                      errorDiv.textContent = 'Failed to load image';
                      target.parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
              </div>
            ) : field.contentType === 'VIDEO' && currentValue ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border text-sm">
                  <Video className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 break-all">{currentValue}</span>
                </div>
                <div className="border rounded-lg p-2 bg-white">
                  <video
                    src={currentValue}
                    controls
                    className="max-w-full h-32 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'flex items-center justify-center h-32 bg-gray-100 text-gray-500 text-sm rounded';
                      errorDiv.textContent = 'Failed to load video';
                      target.parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="min-h-[2rem] p-2 bg-gray-100 rounded border text-sm">
                {currentValue ? (
                  <span className="text-gray-900 break-all">{currentValue}</span>
                ) : (
                  <span className="text-gray-400 italic">No content set</span>
                )}
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(field.key, currentValue)}
              className="w-full"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Website Content Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage all your website content in one place. Only actual fields used in your website are shown.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadContent} variant="outline" className="self-start sm:self-auto">
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log('Current content state:', content);
              console.log('Content keys:', Object.keys(content));
              toast.success(`Content state logged. Found ${Object.keys(content).length} items.`);
            }}
          >
            Debug
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/seed-test-content', { method: 'POST' });
                const data = await response.json();
                if (response.ok) {
                  toast.success(data.message);
                  loadContent(); // Reload content after seeding
                } else {
                  toast.error(data.error || 'Failed to seed content');
                }
              } catch (error) {
                toast.error('Failed to seed test content');
              }
            }}
          >
            Seed Test Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue={WEBSITE_CONTENT_STRUCTURE[0].id} className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-1 min-w-max w-full">
            {WEBSITE_CONTENT_STRUCTURE.map((page) => {
              const Icon = page.icon;
              return (
                <TabsTrigger key={page.id} value={page.id} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 whitespace-nowrap">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm hidden xs:inline">{page.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {WEBSITE_CONTENT_STRUCTURE.map((page) => (
          <TabsContent key={page.id} value={page.id}>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <page.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{page.label}</h2>
              </div>

              {Object.entries(page.sections).map(([sectionKey, section]) => (
                <Card key={sectionKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.label}
                      <Badge variant="outline">{section.fields.length} fields</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                      {section.fields.map((field) => renderField(field, page.id))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}