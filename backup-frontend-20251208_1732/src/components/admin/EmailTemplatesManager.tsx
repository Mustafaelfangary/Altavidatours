'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Plus, Search, Edit, Trash2, Check, X, Clock } from 'lucide-react';
import { EmailTemplateEditor } from './EmailTemplateEditor';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variables: string[];
  version: number;
  category?: string;
  lastUsed?: string;
  tags?: string[];
  description?: string;
}

// Default templates for initial state
const defaultTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Our Service!',
    content: '<p>Hello {{user.name}},</p><p>Welcome to our platform! We\'re excited to have you on board.</p>',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variables: ['user.name', 'user.email'],
    version: 1,
    category: 'Onboarding',
    tags: ['welcome', 'onboarding']
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    content: '<p>Hello,</p><p>Click <a href="{{resetLink}}">here</a> to reset your password.</p>',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variables: ['resetLink'],
    version: 1,
    category: 'Authentication',
    tags: ['password', 'security']
  },
  {
    id: '3',
    name: 'Order Confirmation',
    subject: 'Your Order #{{orderId}} has been confirmed',
    content: '<p>Dear {{user.name}},</p><p>Thank you for your order #{{orderId}}.</p>',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variables: ['user.name', 'orderId', 'orderTotal'],
    version: 1,
    category: 'Orders',
    tags: ['confirmation', 'purchase']
  }
];

export default function EmailTemplatesManager() {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState('{"name":"John Doe","email":"test@example.com"}');
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handler for creating a new template
  const handleNewTemplate = () => {
    setSelectedTemplate({
      id: '',
      name: 'New Email Template',
      subject: 'New Email',
      content: '<p>Start writing your email here...</p>',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variables: ['user.name', 'user.email'],
      version: 1,
    });
  };

  // Handler for saving a template
  const handleSaveTemplate = async (template: EmailTemplate) => {
    setIsSaving(true);
    try {
      // Add your save logic here
      console.log('Saving template:', template);
      // Example API call:
      // const response = await fetch('/api/email-templates', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(template),
      // });
      // const savedTemplate = await response.json();
      // setSelectedTemplate(savedTemplate);
      // Update your templates list if needed
      
      // For now, just update the local state
      const updatedTemplates = templates.filter(t => t.id !== template.id);
      setTemplates([...updatedTemplates, template]);
      setSelectedTemplate(template);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for deleting a template
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      // Add your delete logic here
      console.log('Deleting template:', templateId);
      // Example API call:
      // await fetch(`/api/email-templates/${templateId}`, {
      //   method: 'DELETE',
      // });
      
      // Update local state
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      setTemplates(updatedTemplates);
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  // Filter templates based on search query and category
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [templates]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {selectedTemplate ? (
        <EmailTemplateEditor
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => setSelectedTemplate(null)}
          isSaving={isSaving}
          previewData={previewData}
          onPreviewDataChange={setPreviewData}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-2xl font-bold">Email Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your email templates and create new ones
              </p>
            </div>
            <Button onClick={handleNewTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredTemplates.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell 
                          className="font-medium"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          {template.name}
                        </TableCell>
                        <TableCell 
                          className="text-muted-foreground"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          {template.subject}
                        </TableCell>
                        <TableCell>
                          {template.category && (
                            <Badge variant="outline">{template.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {template.isActive ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Check className="h-3 w-3 mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" /> Draft
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedTemplate(template)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">No templates found</h4>
                <p className="text-muted-foreground mb-4 text-center">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No templates match your search. Try adjusting your filters.'
                    : 'Get started by creating a new template.'}
                </p>
                <Button onClick={handleNewTemplate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}