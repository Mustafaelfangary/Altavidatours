import { ContentBlock } from '@prisma/client';

interface RichTextBlockProps {
  block: ContentBlock;
}

export default function RichTextBlock({ block }: RichTextBlockProps) {
  if (!block.content) {
    return null;
  }
  // Using dangerouslySetInnerHTML because the content is trusted HTML from the CMS
  return <div dangerouslySetInnerHTML={{ __html: block.content }} />;
}