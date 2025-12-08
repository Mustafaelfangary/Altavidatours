import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ContentBlock } from '@prisma/client';
import RichTextBlock from '@/components/content/RichTextBlock';
import ImageBlock from '@/components/content/ImageBlock';
import GalleryBlock from '@/components/content/GalleryBlock';
import VideoBlock from '@/components/content/VideoBlock';
import CallToActionBlock from '@/components/content/CallToActionBlock';

const blockComponents = {
  RichText: RichTextBlock,
  Image: ImageBlock,
  Gallery: GalleryBlock,
  Video: VideoBlock,
  CallToAction: CallToActionBlock,
};

type BlockComponent = keyof typeof blockComponents;

async function getPage(slug: string) {
  const page = await prisma.page.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      contentBlocks: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!page) {
    notFound();
  }

  return page;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      <div>
        {page.contentBlocks.map((block) => {
          const Component = blockComponents[block.type as BlockComponent];
          return Component ? <Component key={block.id} block={block as any} /> : null;
        })}
      </div>
    </div>
  );
}