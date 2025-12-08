import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const seoSchema = z.object({
  metaTitle: z.string().max(60, 'Title should be 60 characters or less'),
  metaDescription: z.string().max(160, 'Description should be 160 characters or less'),
  metaKeywords: z.string().optional(),
  canonicalUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  ogTitle: z.string().max(60, 'OG Title should be 60 characters or less').optional(),
  ogDescription: z.string().max(160, 'OG Description should be 160 characters or less').optional(),
  ogImage: z.any().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
});

type SEOFormValues = z.infer<typeof seoSchema>;

interface SEOManagerProps {
  initialData?: Partial<SEOFormValues>;
  onSubmit: (data: SEOFormValues) => Promise<void>;
}

export function SEOManager({ initialData = {}, onSubmit }: SEOManagerProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SEOFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      noIndex: false,
      noFollow: false,
      ...initialData,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setValue('ogImage', data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const ogImage = watch('ogImage');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            {...register('metaTitle')}
            placeholder="Enter a title that will be displayed in search results"
            className={errors.metaTitle ? 'border-destructive' : ''}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{watch('metaTitle')?.length || 0} / 60 characters</span>
            {errors.metaTitle && (
              <span className="text-destructive">{errors.metaTitle.message}</span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            {...register('metaDescription')}
            placeholder="Enter a description that will be displayed in search results"
            className={errors.metaDescription ? 'border-destructive' : ''}
            rows={3}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{watch('metaDescription')?.length || 0} / 160 characters</span>
            {errors.metaDescription && (
              <span className="text-destructive">{errors.metaDescription.message}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="metaKeywords">Keywords (comma-separated)</Label>
            <Input
              id="metaKeywords"
              {...register('metaKeywords')}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
          
          <div>
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input
              id="canonicalUrl"
              type="url"
              {...register('canonicalUrl')}
              placeholder="https://example.com/page"
              className={errors.canonicalUrl ? 'border-destructive' : ''}
            />
            {errors.canonicalUrl && (
              <p className="text-sm text-destructive mt-1">{errors.canonicalUrl.message}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Indexing</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="noIndex" className="font-normal">
                  Hide from search engines (noindex)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Prevent search engines from indexing this page
                </p>
              </div>
              <Switch
                id="noIndex"
                checked={watch('noIndex')}
                onCheckedChange={(checked) => setValue('noIndex', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="noFollow" className="font-normal">
                  Don&apos;t follow links (nofollow)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Prevent search engines from following links on this page
                </p>
              </div>
              <Switch
                id="noFollow"
                checked={watch('noFollow')}
                onCheckedChange={(checked) => setValue('noFollow', checked)}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Open Graph (Social Sharing)</h3>
          <div className="space-y-4">
            <div>
              <Label>OG Image</Label>
              {ogImage ? (
                <div className="mt-2">
                  <img 
                    src={ogImage} 
                    alt="OG Image" 
                    className="h-32 w-auto rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setValue('ogImage', '')}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-muted-foreground">
                      <label
                        htmlFor="og-image-upload"
                        className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none"
                      >
                        <span>Upload an image</span>
                        <input
                          id="og-image-upload"
                          name="og-image-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 1200×630 pixels
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input
                id="ogTitle"
                {...register('ogTitle')}
                placeholder="Title for social media shares"
                className={errors.ogTitle ? 'border-destructive' : ''}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{watch('ogTitle')?.length || 0} / 60 characters</span>
                {errors.ogTitle && (
                  <span className="text-destructive">{errors.ogTitle.message}</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                {...register('ogDescription')}
                placeholder="Description for social media shares"
                className={errors.ogDescription ? 'border-destructive' : ''}
                rows={2}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{watch('ogDescription')?.length || 0} / 160 characters</span>
                {errors.ogDescription && (
                  <span className="text-destructive">{errors.ogDescription.message}</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="twitterCard">Twitter Card Type</Label>
              <select
                id="twitterCard"
                {...register('twitterCard')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Default (Summary)</option>
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary with Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save SEO Settings'
          )}
        </Button>
      </div>
    </form>
  );
}
