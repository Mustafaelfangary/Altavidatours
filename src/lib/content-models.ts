// Core content types for the website
export interface ContentField {
  id: string;
  name: string;
  type: 'text' | 'richText' | 'image' | 'number' | 'boolean' | 'select' | 'date' | 'url';
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>;
  description?: string;
}

export interface ContentModel {
  id: string;
  name: string;
  description: string;
  fields: ContentField[];
  isActive: boolean;
}

// Define content models for different sections
export const contentModels: ContentModel[] = [
  // Home Page
  {
    id: 'home_hero',
    name: 'Home Hero Section',
    description: 'Main hero section of the home page',
    isActive: true,
    fields: [
      {
        id: 'title',
        name: 'Main Heading',
        type: 'text',
        required: true,
        defaultValue: "Discover Egypt's Wonders with Altavida Tours.com"
      },
      {
        id: 'subtitle',
        name: 'Subheading',
        type: 'text',
        required: true,
        defaultValue: 'Experience the magic of ancient Egypt with our luxury tours'
      },
      {
        id: 'backgroundImage',
        name: 'Background Image',
        type: 'image',
        required: true
      },
      {
        id: 'ctaText',
        name: 'Button Text',
        type: 'text',
        required: true,
        defaultValue: 'Explore Tours'
      },
      {
        id: 'ctaLink',
        name: 'Button Link',
        type: 'url',
        required: true,
        defaultValue: '/tours'
      }
    ]
  },
  // Tour Model
  {
    id: 'tour',
    name: 'Tour Package',
    description: 'Tour/Excursion package details',
    isActive: true,
    fields: [
      {
        id: 'title',
        name: 'Tour Name',
        type: 'text',
        required: true
      },
      {
        id: 'slug',
        name: 'URL Slug',
        type: 'text',
        required: true,
        description: 'URL-friendly version of the tour name'
      },
      {
        id: 'description',
        name: 'Short Description',
        type: 'text',
        required: true
      },
      {
        id: 'content',
        name: 'Detailed Content',
        type: 'richText',
        required: true
      },
      {
        id: 'duration',
        name: 'Duration',
        type: 'text',
        required: true,
        description: 'e.g., "3 days / 2 nights"'
      },
      {
        id: 'price',
        name: 'Starting Price',
        type: 'number',
        required: true
      },
      {
        id: 'featuredImage',
        name: 'Featured Image',
        type: 'image',
        required: true
      },
      {
        id: 'gallery',
        name: 'Photo Gallery',
        type: 'image',
        required: false,
        description: 'Additional images for the tour gallery'
      },
      {
        id: 'isFeatured',
        name: 'Featured Tour',
        type: 'boolean',
        defaultValue: false
      },
      {
        id: 'isActive',
        name: 'Active',
        type: 'boolean',
        defaultValue: true
      }
    ]
  },
  // Site Settings
  {
    id: 'site_settings',
    name: 'Site Settings',
    description: 'Global website settings',
    isActive: true,
    fields: [
      {
        id: 'siteTitle',
        name: 'Site Title',
        type: 'text',
        required: true,
        defaultValue: 'Altavida Tours.com'
      },
      {
        id: 'siteDescription',
        name: 'Site Description',
        type: 'text',
        required: true
      },
      {
        id: 'logo',
        name: 'Logo',
        type: 'image',
        required: true
      },
      {
        id: 'contactEmail',
        name: 'Contact Email',
        type: 'text',
        required: true
      },
      {
        id: 'contactPhone',
        name: 'Contact Phone',
        type: 'text',
        required: true
      }
    ]
  }
];

// Helper function to get a content model by ID
export function getContentModel(id: string): ContentModel | undefined {
  return contentModels.find(model => model.id === id);
}

// Helper function to get all active content models
export function getActiveContentModels(): ContentModel[] {
  return contentModels.filter(model => model.isActive);
}
