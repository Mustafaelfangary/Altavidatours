'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PageContent {
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: 'TEXT' | 'HTML' | 'MARKDOWN' | 'JSON';
  page: string;
  section: string;
  order: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export default function ContentManager() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState<Partial<PageContent>>({
    key: '',
    title: '',
    content: '',
    contentType: 'TEXT',
    page: 'home',
    section: 'hero',
    order: 0,
    isActive: true,
  });

  // Fetch all content
  const { data: contents = [], isLoading, refetch } = useQuery<PageContent[]>({
    queryKey: ['page-contents'],
    queryFn: async () => {
      const res = await fetch('/api/admin/page-content');
      if (!res.ok) throw new Error('Failed to fetch content');
      return res.json();
    },
  });

  // Filter content by active tab and search term
  const filteredContents = contents.filter(content => {
    const matchesTab = content.page === activeTab || activeTab === 'all';
    const matchesSearch = 
      content.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && (searchTerm === '' || matchesSearch);
  });

  // Group content by section
  const contentBySection = filteredContents.reduce<Record<string, PageContent[]>>((acc, content) => {
    if (!acc[content.section]) {
      acc[content.section] = [];
    }
    acc[content.section].push(content);
    return acc;
  }, {});

  // Create or update content
  const saveContent = useMutation({
    mutationFn: async (content: Partial<PageContent>) => {
      const method = content.id ? 'PUT' : 'POST';
      const url = content.id ? `/api/admin/page-content/${content.id}` : '/api/admin/page-content';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save content');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-contents'] });
      toast.success('Content saved successfully');
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Delete content
  const deleteContent = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/page-content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete content');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-contents'] });
      toast.success('Content deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleEdit = (content: PageContent) => {
    setCurrentContent(content);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveContent.mutate(currentContent);
  };

  const resetForm = () => {
    setCurrentContent({
      key: '',
      title: '',
      content: '',
      contentType: 'TEXT',
      page: activeTab,
      section: 'hero',
      order: 0,
      isActive: true,
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentContent(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">
            Manage your website's content dynamically
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Content
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="dahabiyas">Dahabiyas</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {isEditing && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{currentContent.id ? 'Edit' : 'Add New'} Content</CardTitle>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Key *</Label>
                    <Input
                      id="key"
                      name="key"
                      value={currentContent.key}
                      onChange={handleInputChange}
                      placeholder="unique-identifier"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={currentContent.title}
                      onChange={handleInputChange}
                      placeholder="Content title"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page">Page *</Label>
                    <Select
                      value={currentContent.page}
                      onValueChange={(value) => handleSelectChange('page', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="about">About</SelectItem>
                        <SelectItem value="dahabiyas">Dahabiyas</SelectItem>
                        <SelectItem value="itineraries">Itineraries</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section">Section *</Label>
                    <Input
                      id="section"
                      name="section"
                      value={currentContent.section}
                      onChange={handleInputChange}
                      placeholder="Section name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select
                      value={currentContent.contentType}
                      onValueChange={(value) => handleSelectChange('contentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Plain Text</SelectItem>
                        <SelectItem value="HTML">HTML</SelectItem>
                        <SelectItem value="MARKDOWN">Markdown</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={currentContent.content}
                    onChange={handleInputChange}
                    placeholder="Enter your content here..."
                    rows={8}
                    className="font-mono text-sm"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={currentContent.isActive ?? true}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={saveContent.isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saveContent.isPending}>
                      {saveContent.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {Object.entries(contentBySection).map(([section, sectionContents]) => (
          <TabsContent key={section} value={activeTab} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium capitalize">{section}</h3>
              <Badge variant="outline">{sectionContents.length} items</Badge>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectionContents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">
                        <div className="font-mono text-xs">{content.key}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {content.content.substring(0, 60)}{content.content.length > 60 ? '...' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{content.contentType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={content.isActive ? 'default' : 'secondary'}>
                          {content.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(content)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this content?')) {
                                deleteContent.mutate(content.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}

        {filteredContents.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No content found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {searchTerm
                ? 'No content matches your search. Try a different term.'
                : 'No content has been added yet. Click "Add Content" to get started.'}
            </p>
          </div>
        )}
      </Tabs>
    </div>
  );
}
