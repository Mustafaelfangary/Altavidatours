import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import Image from 'next/image';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface GallerySlideshowProps {
  images: string[];
}

const PLACEHOLDER = '/images/gallery-placeholder.jpg';

export default function GallerySlideshow({ images }: GallerySlideshowProps) {
  const validImages = Array.isArray(images) && images.length > 0 ? images : [PLACEHOLDER];
  const [index, setIndex] = useState(0);
  const go = (dir: number) => setIndex(i => (i + dir + validImages.length) % validImages.length);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 700, mx: 'auto', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 4, boxShadow: 2 }}>
      <Image
        src={validImages[index]}
        alt={`Gallery image ${index + 1}`}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 700px) 100vw, 700px"
        priority
      />
      {validImages.length > 1 && (
        <>
          <IconButton onClick={() => go(-1)} sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', zIndex: 2 }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => go(1)} sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', zIndex: 2 }}>
            <ChevronRightIcon />
          </IconButton>
          <Box sx={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center' }}>
            {validImages.map((_, i) => (
              <Box key={i} component="span" sx={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', bgcolor: i === index ? 'primary.main' : 'grey.400', mx: 0.5 }} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
} 