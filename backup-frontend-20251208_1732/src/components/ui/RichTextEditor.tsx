'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/50">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
        )}
      >
        <span className="font-bold">B</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          'h-8 w-8 p-0 italic',
          editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''
        )}
      >
        <em>I</em>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          'h-8 w-8 p-0 underline',
          editor.isActive('underline') ? 'bg-accent text-accent-foreground' : ''
        )}
      >
        U
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          'h-8 w-8 p-0 text-sm',
          editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''
        )}
      >
        H2
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''
        )}
      >
        •
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'h-8 w-8 p-0 text-sm',
          editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''
        )}
      >
        1.
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);
          
          if (url === null) return;
          
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }
          
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={cn(
          'h-8 w-8 p-0 text-sm',
          editor.isActive('link') ? 'bg-accent text-accent-foreground' : ''
        )}
      >
        🔗
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addImage}
        className="h-8 w-8 p-0 text-sm"
      >
        🖼️
      </Button>
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something amazing...',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full h-auto',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        placeholder={placeholder}
        className="min-h-[200px] max-h-[500px] overflow-y-auto"
      />
    </div>
  );
}
