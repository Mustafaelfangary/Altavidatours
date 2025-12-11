import { ContentBlock } from '@prisma/client';
import Link from 'next/link';

interface CallToActionBlockProps {
  block: ContentBlock;
}

export default function CallToActionBlock({ block }: CallToActionBlockProps) {
  if (typeof block.content !== 'string') {
    return null;
  }

  const { text, url } = JSON.parse(block.content);

  return (
    <div className="my-4 p-6 bg-blue-100 rounded-lg text-center">
      <Link href={url} className="text-blue-600 hover:underline font-bold text-xl">
        {text}
      </Link>
    </div>
  );
}

