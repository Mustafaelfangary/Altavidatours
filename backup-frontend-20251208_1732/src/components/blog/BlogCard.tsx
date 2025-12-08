"use client";

import React from 'react';
import UnifiedCard from '@/components/ui/UnifiedCard';
import { ViewDetailsButton } from '@/components/ui/ViewDetailsButton';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  mainImageUrl?: string;
  author: string;
  publishedAt?: string;
  createdAt: string;
  readTime?: number;
  featured: boolean;
  category?: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <UnifiedCard
      type="blog"
      category={post.category}
      title={post.title}
      description={post.content.substring(0, 100) + '...'}
      shortDescription={post.excerpt}
      imageUrl={post.mainImageUrl || '/images/default-blog.jpg'}
      href={`/blogs/${post.slug}`}
      metadata={{
        author: post.author,
        publishedAt: post.publishedAt || post.createdAt,
        readTime: post.readTime,
        featured: post.featured,
        tags: post.tags,
        duration: post.readTime // This will show as "X min read" for blogs
      }}
      secondaryButton={{
        text: "Read Article",
        href: `/blogs/${post.slug}`,
        icon: <span className="text-lg">𓂋</span>
      }}
    />
  );
}
