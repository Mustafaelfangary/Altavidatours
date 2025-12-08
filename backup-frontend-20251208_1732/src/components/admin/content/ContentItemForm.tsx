'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContentModel, getContentModel } from '@/lib/content-models';
import { ContentItem } from '@/lib/content-service';
import { ContentFormField } from './ContentFormField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';

interface ContentItemFormProps {
  modelId: string;
  itemId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ContentItemForm({ modelId, itemId, onSuccess, onCancel }: ContentItemFormProps) {
  const router = useRouter();
  const [model, setModel] = useState<ContentModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load content model and item data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const contentModel = getContentModel(modelId);
        if (!contentModel) {
          throw new Error(`Content model '${modelId}' not found`);
        }
        setModel(contentModel);

        // If editing, load the existing item
        if (itemId) {
          const response = await fetch(`/api/admin/content/${modelId}/${itemId}`);
          if (!response.ok) {
            throw new Error('Failed to load content item');
          }
          const item: ContentItem = await response.json();
          setFormData(item.data || {});
        } else {
          // Initialize form with default values
          const defaults: Record<string, any> = {};
          contentModel.fields.forEach((field) => {
            if (field.defaultValue !== undefined) {
              defaults[field.id] = field.defaultValue;
            }
          });
          setFormData(defaults);
        }
      } catch (error) {
        console.error('Error loading content item:', error);
        toast.error('Failed to load content item');
        onCancel?.();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [modelId, itemId, onCancel]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when field is updated
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!model) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    model.fields.forEach((field) => {
      if (field.required && (formData[field.id] === undefined || formData[field.id] === '')) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const url = itemId 
        ? `/api/admin/content/${modelId}/${itemId}`
        : `/api/admin/content/${modelId}`;
      
      const method = itemId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save content item');
      }

      toast.success(`Content ${itemId ? 'updated' : 'created'} successfully`);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/admin/content/${modelId}`);
      }
    } catch (error) {
      console.error('Error saving content item:', error);
      toast.error('Failed to save content item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !model) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {itemId ? 'Edit' : 'Create'} {model.name}
              </CardTitle>
              <CardDescription>
                {itemId ? 'Update the content item' : 'Add a new content item'}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel || (() => router.back())}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {model.fields.map((field) => (
            <div key={field.id}>
              <ContentFormField
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleChange(field.id, value)}
                disabled={isSubmitting}
              />
              {errors[field.id] && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex justify-end space-x-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => router.back())}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {itemId ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
