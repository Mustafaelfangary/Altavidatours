"use client";

import { useState } from 'react';
import { Box, Container, Typography, Button, Grid, IconButton } from '@mui/material';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Settings } from '@/types/settings';
import imageLoader from '../utils/imageLoader';

interface StorySectionProps {
  settings: {
    [key: string]: string;
  };
}

export default function StorySection({ settings }: StorySectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const storyImages = [
    '/images/story-1.jpg',
    '/images/story-2.jpg',
    '/images/story-3.jpg',
    '/images/story-4.jpg',
  ];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? storyImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === storyImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container component="div" spacing={6}>
          {/* Story Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {settings['story_section_title'] && (
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'var(--font-playfair)',
                  mb: 3,
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                {settings['story_section_title']}
              </Typography>
            )}
            {settings['story_section_subtitle'] && (
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                {settings['story_section_subtitle']}
              </Typography>
            )}
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.8,
                color: 'text.primary',
                fontSize: '1.1rem',
              }}
            >
              {expanded
                ? settings['story_section_content'] || 'Your full story content here...'
                : `${(settings['story_section_content'] || 'Your story content here...').slice(0, 300)}...`}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setExpanded(!expanded)}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              {expanded ? 'Show Less' : 'Read More'}
            </Button>
          </Box>

          {/* Image Gallery */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {settings['story_section_gallery'] && (
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '300px', md: '500px' },
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              >
                <Image
                  src={storyImages[currentImageIndex]}
                  alt="Our Story"
                  fill
                  style={{ objectFit: 'cover' }}
                  loader={imageLoader}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                    {`Image ${currentImageIndex + 1} of ${storyImages.length}`}
                  </Typography>
                </Box>
                <IconButton
                  onClick={handlePreviousImage}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    '&:hover': { bgcolor: 'white' },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    '&:hover': { bgcolor: 'white' },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

