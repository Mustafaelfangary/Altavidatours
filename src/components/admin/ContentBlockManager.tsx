'use client';

import { useEffect, useState } from 'react';
import { ContentBlock } from '@prisma/client';
import { toast } from 'sonner';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import RichTextForm from './RichTextForm';
import ImageBlockForm from './ImageBlockForm';

const getBlockFormComponent = (block: ContentBlock, onSave: (content: any) => void) => {
  switch (block.type) {
    case 'RichText':
      return <RichTextForm block={block} onSave={onSave} />;
    case 'Image':
      return <ImageBlockForm block={block} onSave={onSave} />;
    default:
      return <div className="p-4 my-2 border rounded-lg">Unsupported block type</div>;
  }
};


export default function ContentBlockManager({ pageId }: { pageId: string }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch(`/api/dashboard/pages/${pageId}/content`);
        if (!response.ok) throw new Error('Failed to fetch content blocks.');
        const data = await response.json();
        setBlocks(data);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlocks();
  }, [pageId]);

  const handleAddBlock = async (type: 'RichText' | 'Image') => {
    try {
      const response = await fetch(`/api/dashboard/pages/${pageId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content: {} }),
      });
      if (!response.ok) throw new Error('Failed to add block.');
      const newBlock = await response.json();
      setBlocks([...blocks, newBlock]);
      toast.success('Content block added successfully.');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    // Optimistic deletion
    const originalBlocks = [...blocks];
    setBlocks(blocks.filter((b) => b.id !== blockId));

    try {
      const response = await fetch(
        `/api/dashboard/pages/${pageId}/content/${blockId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        setBlocks(originalBlocks); // Revert on failure
        throw new Error('Failed to delete block.');
      }
      toast.success('Content block deleted.');
    } catch (error) {
      setBlocks(originalBlocks); // Revert on failure
      toast.error((error as Error).message);
    }
  };

  const handleSaveBlock = async (blockId: string, content: any) => {
     try {
      const response = await fetch(`/api/dashboard/pages/${pageId}/content/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to save block.');
      const updatedBlock = await response.json();
      setBlocks(blocks.map(b => b.id === blockId ? updatedBlock : b));
      toast.success('Content block saved successfully.');
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedBlocks = Array.from(blocks);
    const [removed] = reorderedBlocks.splice(result.source.index, 1);
    reorderedBlocks.splice(result.destination.index, 0, removed);

    // Optimistic UI update
    setBlocks(reorderedBlocks);

    const blockIds = reorderedBlocks.map((block) => block.id);

    try {
      const response = await fetch(`/api/dashboard/pages/${pageId}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockIds }),
      });

      if (!response.ok) {
        // Revert if API call fails
        setBlocks(blocks);
        throw new Error('Failed to reorder blocks.');
      }
      toast.success('Content blocks reordered.');
    } catch (error) {
      // Revert on error
      setBlocks(blocks);
      toast.error((error as Error).message);
    }
  };

  if (loading) return <p>Loading content blocks...</p>;

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={() => handleAddBlock('RichText')}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Rich Text
        </Button>
        <Button onClick={() => handleAddBlock('Image')}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4"
                    >
                      {getBlockFormComponent(block, (content) => handleSaveBlock(block.id, content))}
                       <Button variant="destructive" size="sm" onClick={() => handleDeleteBlock(block.id)} className="mt-2">
                        Delete
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

