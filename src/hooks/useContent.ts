"use client";

import { useState, useEffect } from 'react';

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  contentType: 'TEXT' | 'TEXTAREA' | 'RICH_TEXT' | 'IMAGE' | 'VIDEO' | 'GALLERY' | 'TESTIMONIAL' | 'FEATURE' | 'CTA';
  page: string;
  section: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseContentOptions {
  page?: string;
  section?: string;
}

interface UseContentReturn {
  content: ContentBlock[];
  loading: boolean;
  error: string | null;
  getContent: (key: string, fallback?: string) => string;
  getContentBlock: (key: string) => ContentBlock | undefined;
  refetch: () => void;
}

export function useContent(options: UseContentOptions = {}): UseContentReturn {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.section) params.append('section', options.section);
      
      const url = `/api/settings${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
      const data = await response.json();
      setContent(data.blocks || []);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [options.page, options.section]);

  const getContent = (key: string, fallback = ''): string => {
    const block = content.find(c => c.key === key);
    if (!block) return fallback;
    return block.content || block.mediaUrl || fallback;
  };

  const getContentBlock = (key: string): ContentBlock | undefined => {
    return content.find(c => c.key === key);
  };

  const refetch = () => {
    fetchContent();
  };

  return {
    content,
    loading,
    error,
    getContent,
    getContentBlock,
    refetch,
  };
}

// Backward compatibility hook for settings
export function useSettings() {
  const { content, loading, error, getContent, refetch } = useContent();
  
  // Convert content blocks to settings object for backward compatibility
  const settings = content.reduce((acc, block) => {
    acc[block.key] = block.content || block.mediaUrl || '';
    return acc;
  }, {} as Record<string, string>);

  return {
    settings,
    loading,
    error,
    get: getContent,
    refetch,
  };
}
