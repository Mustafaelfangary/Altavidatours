import { ContentBlock } from '@prisma/client';

interface VideoBlockProps {
  block: ContentBlock;
}

export default function VideoBlock({ block }: VideoBlockProps) {
  if (typeof block.content !== 'string') {
    return null;
  }

  const { url } = JSON.parse(block.content);

  if (!url) {
    return null;
  }

  return (
    <div className="my-4">
      <video controls src={url} className="w-full rounded-lg" />
    </div>
  );
}

