export interface Settings {
  [key: string]: string | string[];

  // ... existing settings ...

  // Dahabiya Comparison Section
  dahabiya_comparison_title: string;
  dahabiya_comparison_subtitle: string;
  dahabiya_comparison_description: string;
  dahabiya_comparison_points: string[];
  dahabiya_comparison_gallery: string[];

  // Story Section
  story_section_title: string;
  story_section_subtitle: string;
  story_section_description: string;
  story_section_cta_text: string;
  story_section_cta_link: string;
  story_section_gallery: string[];

  // Our Story Section
  home_our_story_title: string;
  home_our_story_content: string;
  home_our_story_image: string;

  // Share Your Memories Section
  home_memories_title: string;
  home_memories_subtitle: string;
  home_memories_description: string;
  home_memories_gallery_1: string;
  home_memories_gallery_2: string;
  home_memories_gallery_3: string;
  home_memories_gallery_4: string;

  // Why Dahabiya is Different Section
  home_dahabiya_difference_title: string;
  home_dahabiya_difference_description: string;
  home_dahabiya_difference_image: string;

  // Our Featured Cruises Section
  home_featured_title: string;
  home_featured_subtitle: string;
  home_featured_1_title: string;
  home_featured_1_desc: string;
  home_featured_1_image: string;
  home_featured_2_title: string;
  home_featured_2_desc: string;
  home_featured_2_image: string;
  home_featured_3_title: string;
  home_featured_3_desc: string;
  home_featured_3_image: string;
}

export interface UseSettingsReturn {
  settings: Settings;
  loading: boolean;
  error: string | null;
  get: (key: string, fallback?: string | string[]) => string | string[];
  getByCategory: (category: string) => Partial<Settings>;
  updateSettings: (newSettings: Partial<Settings>) => void;
  isLoading: boolean;
}

