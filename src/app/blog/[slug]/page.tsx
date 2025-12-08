"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { Container, Typography, Chip } from '@mui/material';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Calendar, User, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';
import {
  HieroglyphicText,
  PharaohCard,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  PharaohButton,
  HieroglyphicDivider,
} from '@/components/ui/pharaonic-elements';
import UnifiedHero from '@/components/ui/UnifiedHero';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  mainImageUrl?: string;
  heroImageUrl?: string;
  author: string;
  tags: string[];
  category?: string;
  isPublished: boolean;
  featured: boolean;
  publishedAt?: string;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function IndividualBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${slug}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Blog post not found');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 text-2xl font-bold">𓇳 Loading Blog 𓇳</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-800 text-4xl mb-4">𓇳 𓊪 𓈖</div>
          <p className="text-amber-800 font-bold text-xl">Blog Not Found 𓏏</p>
          <Link href="/blogs">
            <PharaohButton variant="primary" className="mt-4">
              Return to Blogs
            </PharaohButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Egyptian Pattern Background */}
      <EgyptianPatternBackground className="opacity-5" />
      <FloatingEgyptianElements />

      {/* Unified Hero Section */}
      <UnifiedHero
        imageSrc={post.heroImageUrl || post.mainImageUrl || '/images/blog-hero-bg.jpg'}
        title={post.title}
        subtitle={post.excerpt || undefined}
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={false}
        showHieroglyphics={false}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
        mediaFit="contain"
      >
        <Container maxWidth="lg">
          <AnimatedSection animation="fade-in">
            <div className="text-center text-gray-900">
              <div className="mb-8">
                <Link href="/blogs">
                  <PharaohButton variant="secondary" className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blogs
                  </PharaohButton>
                </Link>
              </div>
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-ocean-blue mb-4">𓇳 𓈖 𓊪 𓏏 𓇳</div>
                <HieroglyphicDivider />
              </div>
              <div className="flex justify-center gap-4 mb-6">
                {post.category && (
                  <Chip label={post.category} className="bg-amber-500 text-white font-bold" />
                )}
                {post.featured && (
                  <Chip label="Featured" className="bg-orange-500 text-white font-bold" />
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200">
                  <User className="w-5 h-5 text-ocean-blue mr-2" />
                  <span className="text-gray-900 font-medium">{post.author}</span>
                </div>
                <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200">
                  <Calendar className="w-5 h-5 text-ocean-blue mr-2" />
                  <span className="text-gray-900 font-medium">{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                </div>
                {post.readTime && (
                  <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200">
                    <Clock className="w-5 h-5 text-ocean-blue mr-2" />
                    <span className="text-gray-900 font-medium">{post.readTime} min read</span>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </UnifiedHero>

      {/* Article Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-deep-blue-50/30 relative">
        <Container maxWidth="md">
          <AnimatedSection animation="slide-up">
            <PharaohCard className="overflow-hidden">
              {/* Featured Image */}
              {post.mainImageUrl && (
                <div className="relative h-96 mb-8">
                  <Image
                    src={post.mainImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-8 md:p-12">
                {/* Article Content */}
                <div className="prose prose-lg prose-amber max-w-none">
                  <div 
                    className="text-amber-800 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-amber-200">
                    <div className="flex items-center mb-4">
                      <Tag className="w-5 h-5 text-amber-600 mr-2" />
                      <Typography variant="h6" className="text-amber-800 font-bold">
                        Tags
                      </Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          className="bg-amber-100 text-amber-800 hover:bg-blue-200 transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Share2 className="w-5 h-5 text-amber-600 mr-2" />
                      <Typography variant="h6" className="text-amber-800 font-bold">
                        Share this Chronicle
                      </Typography>
                    </div>
                    <div className="flex gap-2">
                      <PharaohButton
                        variant="secondary"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: post.title,
                              text: post.excerpt || post.title,
                              url: window.location.href,
                            });
                          }
                        }}
                      >
                        Share
                      </PharaohButton>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-8 border-t border-amber-200 text-center">
                  <Link href="/blogs">
                    <PharaohButton variant="primary">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to All Blogs
                    </PharaohButton>
                  </Link>
                </div>
              </div>
            </PharaohCard>
          </AnimatedSection>
        </Container>
      </section>

      {/* Article and Breadcrumb JSON-LD */}
      {post && (
        <>
          <Script
            id="article-json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.seoTitle || post.title,
                description: post.seoDescription || post.excerpt || '',
                image: (post.heroImageUrl || post.mainImageUrl)
                  ? ((post.heroImageUrl || post.mainImageUrl).startsWith('http')
                      ? (post.heroImageUrl || post.mainImageUrl)
                      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com'}${post.heroImageUrl || post.mainImageUrl}`)
                  : undefined,
                author: post.author ? { "@type": "Person", name: post.author } : undefined,
                datePublished: post.publishedAt || post.createdAt,
                dateModified: post.updatedAt,
                mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com'}/blog/${post.slug}`,
                keywords: Array.isArray(post.tags) ? post.tags : [],
              }),
            }}
          />
          <Script
            id="breadcrumb-json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com'}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Blog",
                    item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com'}/blog`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: post.title,
                    item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com'}/blog/${post.slug}`,
                  },
                ],
              }),
            }}
          />
        </>
      )}
    </div>
  );
}
