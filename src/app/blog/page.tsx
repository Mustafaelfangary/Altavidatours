'use client';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Chip } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import imageLoader from '../../utils/imageLoader';

const categories = [
  'All',
  'Travel Tips',
  'Destinations',
  'Culture',
  'History',
  'Food & Dining',
];

const posts = [
  {
    id: 1,
    title: 'Top 10 Must-Visit Temples Along the Nile',
    excerpt: 'Discover the most magnificent temples that line the banks of the Nile, each telling a unique story of ancient Egypt.',
    category: 'Destinations',
    image: '/images/blog/temples.jpg',
    date: '2024-03-15',
  },
  {
    id: 2,
    title: 'A Guide to Traditional Egyptian Cuisine',
    excerpt: 'Explore the rich flavors and traditional dishes that make Egyptian cuisine a unique culinary experience.',
    category: 'Food & Dining',
    image: '/images/blog/food.jpg',
    date: '2024-03-10',
  },
  {
    id: 3,
    title: 'Best Time to Cruise the Nile',
    excerpt: 'Learn about the different seasons and find the perfect time for your Nile cruise adventure.',
    category: 'Travel Tips',
    image: '/images/blog/cruise.jpg',
    date: '2024-03-05',
  },
  // Add more blog posts as needed
];

function getBlogPosts(settings: any) {
  // Assume up to 10 posts
  return Array.from({ length: 10 }).map((_, i) => {
    const title = settings[`home_blog_${i+1}_title`];
    if (!title) return null;
    return {
      title,
      date: settings[`home_blog_${i+1}_date`] || '',
      excerpt: settings[`home_blog_${i+1}_excerpt`] || '',
      image: settings[`home_blog_${i+1}_image`] || '',
      category: settings[`home_blog_${i+1}_category`] || 'Dahabiyat',
      youtube: settings[`home_blog_${i+1}_youtube`] || '',
    };
  }).filter(Boolean);
}

export default function BlogPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);
  const get = (key: string, fallback = '') => settings[key] || fallback;
  const posts = getBlogPosts(settings) as Array<{ [key: string]: any }>;
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <main>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          bgcolor: 'primary.main',
        }}
      >
        <Image
          src={get('blog_hero_image', '/images/gallery/dahabiya-1.jpg')}
          alt="Blog Hero"
          fill
          style={{ objectFit: 'cover', zIndex: -1 }}
          priority
          loader={imageLoader}
        />
        <Container maxWidth="lg">
          <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
            {get('blog_hero_title', 'Blog')}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            {get('blog_hero_subtitle', 'Stories, tips, and news from Dahabiyat')}
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 900, textAlign: 'center' }}>Blog</Typography>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          {categories.map(cat => (
            <Chip key={cat} label={cat} sx={{ mx: 1, fontWeight: 700 }} />
          ))}
        </Box>
        <Grid container component="div" spacing={4}>
          {posts.map((post, i) => (
            <Box key={i} sx={{ width: '100%', maxWidth: 600, flex: '1 1 300px' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {post.youtube ? (
                  <Box sx={{ position: 'relative', pt: '56.25%' }}>
                    <iframe
                      src={post.youtube.replace('watch?v=', 'embed/')}
                      title={post.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allowFullScreen
                    />
                  </Box>
                ) : post.image ? (
                  <CardMedia>
                    <Image src={post.image} alt={post.title} width={600} height={340} loader={imageLoader} style={{ objectFit: 'cover', width: '100%', height: 220 }} />
                  </CardMedia>
                ) : null}
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{post.title}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{post.date}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{post.excerpt}</Typography>
                  <Chip label={post.category} size="small" />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Container>
    </main>
  );
}

