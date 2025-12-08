'use client';

// Define field types as a proper enum
export enum FieldType {
  TEXT = 'text',
  RICH_TEXT = 'richText',
  IMAGE = 'image',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  DATE = 'date',
  URL = 'url'
}
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

type ContentFormFieldProps = {
  field: any;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
};

export function ContentFormField({ field, value, onChange, disabled = false }: ContentFormFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual file upload
      // For now, we'll just create a mock URL
      const mockUrl = URL.createObjectURL(file);
      onChange(mockUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case FieldType.TEXT:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={field.placeholder}
          />
        );
      
      case FieldType.RICH_TEXT:
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={field.placeholder}
            rows={4}
          />
        );
      
      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            disabled={disabled}
            placeholder={field.placeholder}
          />
        );
      
      case FieldType.BOOLEAN:
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`field-${field.id}`}
              checked={!!value}
              onCheckedChange={(checked) => onChange(!!checked)}
              disabled={disabled}
            />
            <Label htmlFor={`field-${field.id}`} className="text-sm font-medium">
              {field.label}
            </Label>
          </div>
        );
      
      case FieldType.SELECT:
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case FieldType.IMAGE:
        return (
          <div className="space-y-2">
            {value ? (
              <div className="relative group">
                <div className="relative aspect-video overflow-hidden rounded-md border">
                  <Image
                    src={value}
                    alt={field.label || 'Image'}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onChange('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor={`file-upload-${field.id}`}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {field.accept || 'PNG, JPG, GIF up to 10MB'}
                    </p>
                  </div>
                  <input
                    id={`file-upload-${field.id}`}
                    type="file"
                    className="hidden"
                    accept={field.accept || 'image/*'}
                    onChange={handleImageUpload}
                    disabled={disabled || isUploading}
                  />
                </label>
              </div>
            )}
            {isUploading && (
              <div className="text-sm text-muted-foreground">Uploading...</div>
            )}
          </div>
        );
      
      case FieldType.RICH_TEXT:
        // TODO: Implement rich text editor
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={field.placeholder}
            rows={6}
            className="font-mono text-sm"
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={`Unsupported field type: ${field.type}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== FieldType.BOOLEAN && field.label && (
        <Label htmlFor={`field-${field.id}`} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
}
