import { ContentBlock } from '@prisma/client';
import Image from 'next/image';
import imageLoader from '../../utils/imageLoader';

interface GalleryBlockProps {
  block: ContentBlock;
}

export default function GalleryBlock({ block }: GalleryBlockProps) {
  if (typeof block.content !== 'string') {
    return null;
  }

  const { images } = JSON.parse(block.content);

  if (!Array.isArray(images)) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
      {images.map((image: { src: string; alt: string }, index: number) => (
        <div key={index} className="relative aspect-square">
          <Image src={image.src} alt={image.alt} fill className="rounded-lg object-cover" loader={imageLoader} />
        </div>
      ))}
    </div>
  );
}