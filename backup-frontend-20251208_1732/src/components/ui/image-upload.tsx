'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 1,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || isUploading) return;
      
      const files = acceptedFiles.slice(0, maxFiles - value.length);
      if (files.length === 0) {
        toast.error(`You can only upload up to ${maxFiles} files`);
        return;
      }

      setIsUploading(true);
      const toastId = toast.loading('Uploading images...');

      try {
        const uploadPromises = files.map((file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('key', 'tour-images');

          return fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.success) throw new Error(data.error || 'Upload failed');
              return data.url;
            });
        });

        const urls = await Promise.all(uploadPromises);
        onChange([...value, ...urls]);
        toast.success('Images uploaded successfully', { id: toastId });
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload images', { id: toastId });
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, maxFiles, disabled, isUploading]
  );

  const removeImage = (url: string) => {
    onChange(value.filter((image) => image !== url));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    maxFiles: maxFiles - value.length,
    disabled: disabled || isUploading || value.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          ${(disabled || isUploading || value.length >= maxFiles) && 'opacity-50 cursor-not-allowed'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {isDragActive ? (
              <p>Drop the images here</p>
            ) : (
              <p>
                Drag & drop images here, or click to select files
              </p>
            )}
            <p className="text-xs mt-1">
              {value.length} of {maxFiles} files uploaded
            </p>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((url) => (
            <div key={url} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden bg-muted">
                <img
                  src={url}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(url);
                }}
                disabled={disabled || isUploading}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
