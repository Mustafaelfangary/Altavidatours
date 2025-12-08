'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContentModel, getContentModel } from '@/lib/content-models';
import { ContentItem } from '@/lib/content-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ContentList({ modelId }: { modelId: string }) {
  const router = useRouter();
  const [model, setModel] = useState<ContentModel | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load content model and items
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const contentModel = getContentModel(modelId);
        if (!contentModel) {
          throw new Error(`Content model '${modelId}' not found`);
        }
        setModel(contentModel);

        const response = await fetch(`/api/admin/content/${modelId}`);
        if (!response.ok) {
          throw new Error('Failed to load content items');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error loading content items:', error);
        toast.error('Failed to load content items');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [modelId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/admin/content/${modelId}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Remove the deleted item from the list
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.data.title?.toLowerCase().includes(searchLower)) ||
      (item.data.name?.toLowerCase().includes(searchLower)) ||
      (item.data.description?.toLowerCase().includes(searchLower)) ||
      (item.id.toLowerCase().includes(searchLower))
    );
  });

  if (!model) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{model.name}</h2>
          <p className="text-muted-foreground">
            Manage {model.name.toLowerCase()} content items
          </p>
        </div>
        <Button onClick={() => router.push(`/admin/content/${modelId}/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add {model.name}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${model.name.toLowerCase()}...`}
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No {model.name.toLowerCase()} found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : `You haven't created any ${model.name.toLowerCase()} yet.`}
              </p>
              {!searchQuery && (
                <Button onClick={() => router.push(`/admin/content/${modelId}/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create {model.name}
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {model.listFields?.length ? (
                      model.listFields.map((fieldId) => (
                        <TableHead key={fieldId}>
                          {model.fields.find((f) => f.id === fieldId)?.label || fieldId}
                        </TableHead>
                      ))
                    ) : (
                      <TableHead>Title</TableHead>
                    )}
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const displayFields = model.listFields?.length
                      ? model.listFields
                      : ['title', 'name', 'id'].filter((f) => item.data[f] !== undefined);

                    return (
                      <TableRow key={item.id}>
                        {displayFields.length > 0 ? (
                          displayFields.map((fieldId) => (
                            <TableCell key={fieldId} className="font-medium">
                              {renderFieldValue(item.data[fieldId])}
                            </TableCell>
                          ))
                        ) : (
                          <TableCell className="font-medium">
                            {item.data.title || item.data.name || `Item ${item.id.slice(0, 6)}`}
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge variant={item.data.published ? 'default' : 'outline'}>
                            {item.data.published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(item.updatedAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/content/${modelId}/${item.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-destructive" />
                              )}
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function renderFieldValue(value: any) {
  if (value === undefined || value === null) return '-';
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}
