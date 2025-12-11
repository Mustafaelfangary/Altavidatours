'use client';

import { useState } from 'react';
import { ContentBlock } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UploadButton } from '@/components/ui/uploadthing';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageBlockFormProps {
  block: ContentBlock;
  onSave: (content: { src: string; alt: string }) => void;
}

export default function ImageBlockForm({ block, onSave }: ImageBlockFormProps) {
  const [src, setSrc] = useState((block.content as { src?: string })?.src || '');
  const [alt, setAlt] = useState((block.content as { alt?: string })?.alt || '');

  const handleSave = () => {
    onSave({ src, alt });
  };

  return (
    <div className="p-4 my-2 border rounded-lg space-y-4">
      <h3 className="font-bold">Image Block</h3>
      <div className="space-y-2">
        <Label>Image</Label>
        <UploadButton
          endpoint="contentImage"
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              setSrc(res[0].url);
              toast.success('Image uploaded successfully');
            }
          }}
          onUploadError={(error: Error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
        />
        {src && (
          <div className="relative w-full h-48">
            <Image src={src} alt={alt || 'Uploaded image'} fill style={{ objectFit: 'contain' }} />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`alt-${block.id}`}>Alt Text</Label>
        <Input
          id={`alt-${block.id}`}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Enter alt text for the image"
        />
      </div>
      <Button onClick={handleSave}>Save Image Block</Button>
    </div>
  );
}

