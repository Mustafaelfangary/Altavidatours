'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Save, X, Loader2, Plus, MailCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmailTemplate } from './EmailTemplatesManager';

interface EmailTemplateEditorProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
  isSaving: boolean;
  previewData: string;
  onPreviewDataChange: (data: string) => void;
}

export function EmailTemplateEditor({
  template,
  onSave,
  onCancel,
  isSaving,
  previewData,
  onPreviewDataChange,
}: EmailTemplateEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Start writing your email here...',
      }),
    ],
    content: template.content,
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Template Editor</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTestEmail(true)}
          >
            <MailCheck className="w-4 h-4 mr-2" />
            Send Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Template Name</Label>
          <Input
            value={template.name}
            onChange={(e) => onSave({ ...template, name: e.target.value })}
            className="mb-4"
          />

          <Label>Email Subject</Label>
          <Input
            value={template.subject}
            onChange={(e) => onSave({ ...template, subject: e.target.value })}
            className="mb-4"
          />
        </div>

        <div>
          <Label>Variables</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {template.variables?.map((variable) => (
              <Button
                key={variable}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  editor.chain().focus().insertContent(`{{${variable}}}`).run();
                }}
              >
                {`{{${variable}}}`}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-2 bg-gray-50 border-b flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              I
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              U
            </Button>
          </div>
        </div>

        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(template)} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
