import { ContentBlock } from '@prisma/client';
import Image from 'next/image';

interface ImageBlockProps {
  block: ContentBlock;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  if (!block.content) {
    return null;
  }

  if (typeof block.content !== 'string') {
    return null;
  }
  const { src, alt } = JSON.parse(block.content);

  return (
    <div className="my-4">
      <Image src={src} alt={alt} width={800} height={600} className="rounded-lg" />
    </div>
  );
}