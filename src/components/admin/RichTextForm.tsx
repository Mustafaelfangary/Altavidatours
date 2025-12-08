'use client';

import { useState } from 'react';
import { ContentBlock } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RichTextFormProps {
  block: ContentBlock;
  onSave: (content: { text: string }) => void;
}

export default function RichTextForm({ block, onSave }: RichTextFormProps) {
  const [text, setText] = useState((block.content as { text?: string })?.text || '');

  const handleSave = () => {
    onSave({ text });
  };

  return (
    <div className="p-4 my-2 border rounded-lg space-y-4">
      <h3 className="font-bold">Rich Text Block</h3>
      <div>
        <Label htmlFor={`richtext-${block.id}`}>Content</Label>
        <Textarea
          id={`richtext-${block.id}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your rich text content..."
          className="min-h-[150px]"
        />
      </div>
      <Button onClick={handleSave}>Save Rich Text</Button>
    </div>
  );
}