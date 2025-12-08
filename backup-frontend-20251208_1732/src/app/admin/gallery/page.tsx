'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Image as ImageIcon, 
  ArrowLeft, 
  Plus, 
  Upload,
  RefreshCw,
  Crown,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Grid,
  List,
  Star,
  Calendar,
  Camera,
  FileText,
  MapPin,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  photographer?: string;
  location?: string;
  tags: string[];
  featured: boolean;
  isActive: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryCategory {
  id: string;
  name: string;
  description?: string;
  imageCount: number;
}

export default function GalleryManagement() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    photographer: '',
    location: '',
    tags: '',
    imageUrl: '',
    featured: false,
    isActive: true
  });
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    description: ''
  });
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role)) {
      fetchGalleryData();
    }
  }, [session]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const [imagesRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/gallery/images', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        }),
        fetch('/api/admin/gallery/categories', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        })
      ]);

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setImages(imagesData.images || []);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const catList = categoriesData.categories || [];
        setCategories(catList);
        // Preselect first category if available and none chosen yet
        if (!uploadForm.category && catList.length > 0) {
          setUploadForm((prev) => ({ ...prev, category: catList[0].name }));
        }
      }
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      toast.error('Failed to load gallery data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.imageUrl && !selectedFile) {
      toast.error('Please provide an image URL or select a file');
      return;
    }

    setUploadLoading(true);

    try {
      let imageUrl = uploadForm.imageUrl;

      // Validate required metadata (backend has defaults, but help user early)
      if (!uploadForm.title.trim()) {
        toast.error('Title is required');
        setUploadLoading(false);
        return;
      }

      // If no category selected, require user to create or select one
      if (!uploadForm.category?.trim()) {
        toast.error('Please select a category or create a new one');
        setUploadLoading(false);
        return;
      }
      const finalCategory = uploadForm.category.trim();

      // If file is selected, upload it first
      if (selectedFile) {
        const formData = new FormData();
        // API expects 'files' (array). Also optionally set a category for storage path.
        formData.append('files', selectedFile);
        formData.append('category', 'images');

        const uploadRes = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData?.files?.length) {
            imageUrl = uploadData.files[0].url;
          } else {
            toast.error('Upload succeeded but no file URL returned');
            setUploadLoading(false);
            return;
          }
        } else {
          const errText = await uploadRes.text();
          toast.error(`Failed to upload file: ${errText}`);
          setUploadLoading(false);
          return;
        }
      }

      const response = await fetch('/api/admin/gallery/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...uploadForm,
          category: finalCategory,
          imageUrl,
          tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      });

      if (response.ok) {
        toast.success('✅ Image uploaded successfully!');
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: '',
          photographer: '',
          location: '',
          tags: '',
          imageUrl: '',
          featured: false,
          isActive: true
        });
        setSelectedFile(null);
        setPreviewUrl('');
        fetchGalleryData();
      } else {
        let msg = 'Failed to upload image';
        try {
          const err = await response.json();
          msg = err?.message || err?.error || msg;
        } catch {}
        toast.error(msg);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploadLoading(false);
    }
  };

  const toggleFeatured = async (imageId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !featured }),
      });

      if (response.ok) {
        toast.success(`Image ${!featured ? 'featured' : 'unfeatured'} successfully`);
        fetchGalleryData();
      } else {
        toast.error('Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Error updating image');
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setUploadForm({
      title: image.title,
      description: image.description || '',
      category: image.category,
      photographer: image.photographer || '',
      location: image.location || '',
      tags: image.tags.join(', '),
      imageUrl: image.imageUrl,
      featured: image.featured,
      isActive: image.isActive
    });
    setPreviewUrl(image.imageUrl);
    setShowEditModal(true);
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    try {
      setUploadLoading(true);
      const response = await fetch(`/api/admin/gallery/images/${editingImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category,
          photographer: uploadForm.photographer,
          location: uploadForm.location,
          tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          imageUrl: uploadForm.imageUrl,
          featured: uploadForm.featured,
          isActive: uploadForm.isActive
        }),
      });

      if (response.ok) {
        toast.success('Image updated successfully');
        setShowEditModal(false);
        setEditingImage(null);
        setUploadForm({
          title: '',
          description: '',
          category: '',
          photographer: '',
          location: '',
          tags: '',
          imageUrl: '',
          featured: false,
          isActive: true
        });
        setPreviewUrl('');
        fetchGalleryData();
      } else {
        toast.error('Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Error updating image');
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Image deleted successfully');
        fetchGalleryData();
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    }
  };

  const createNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const response = await fetch('/api/admin/gallery/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryForm.name.trim(),
          description: newCategoryForm.description.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('✅ Category created successfully!');
        setShowNewCategoryModal(false);
        setNewCategoryForm({ name: '', description: '' });
        // Set the new category as selected in the upload form
        setUploadForm(prev => ({ ...prev, category: data.category.name }));
        // Refresh categories list
        fetchGalleryData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error creating category');
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading Gallery...</p>
        </div>
      </div>
    );
  }

  if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h1>
          <p className="text-amber-600">Only administrators and managers may access gallery management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 via-navy-blue-50 to-deep-blue-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-ocean-blue-600 via-navy-blue-600 to-deep-blue-700 rounded-lg shadow-lg">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <ImageIcon className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">Gallery Management</h1>
              <p className="text-amber-200">Manage gallery images and categories</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-300 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Images</p>
                  <p className="text-3xl font-bold text-blue-900">{images.length}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-300 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Categories</p>
                  <p className="text-3xl font-bold text-green-900">{categories.length}</p>
                </div>
                <Grid className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-300 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Featured</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {images.filter(img => img.featured).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Active</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {images.filter(img => img.isActive).length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Gallery Controls
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white text-gray-900 border border-gray-300 focus:ring-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                  <SelectItem value="all" className="text-gray-900 hover:bg-blue-50">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name} className="text-gray-900 hover:bg-blue-50">
                      {category.name} ({category.imageCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Camera className="w-6 h-6 text-amber-600" />
                      Upload New Image
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-2">Add a new image to your gallery collection</p>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="space-y-6 mt-4">
                    {/* Image Source Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Image Source
                      </h3>
                      
                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="imageFile" className="text-sm font-medium">Upload from Computer</Label>
                        <Input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {previewUrl && (
                          <div className="mt-3 relative">
                            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-amber-200" />
                            <Badge className="absolute top-2 right-2 bg-green-500">Preview</Badge>
                          </div>
                        )}
                      </div>

                      {/* OR Divider */}
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-gray-50 px-3 text-gray-500 font-semibold">Or use URL</span>
                        </div>
                      </div>

                      {/* Image URL */}
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL</Label>
                        <Input
                          id="imageUrl"
                          value={uploadForm.imageUrl}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    {/* Basic Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Basic Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                          <Input
                            id="title"
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter image title"
                            required
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                          <Input
                            id="description"
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the image"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="category" className="text-sm font-medium flex items-center justify-between">
                            Category *
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowNewCategoryModal(true)}
                              className="ml-2 text-xs h-6 px-2"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              New
                            </Button>
                          </Label>
                          <Select 
                            value={uploadForm.category} 
                            onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="mt-1 bg-white text-gray-900 border border-gray-300 focus:ring-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Select category or create new" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.name} className="text-gray-900 hover:bg-blue-50">
                                  {category.name} ({category.imageCount} images)
                                </SelectItem>
                              ))}
                              {categories.length === 0 && (
                                <SelectItem value="" disabled className="text-gray-500">
                                  No categories available - create one first
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                          <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="location"
                              value={uploadForm.location}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="e.g., Luxor, Egypt"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Additional Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="photographer" className="text-sm font-medium">Photographer</Label>
                          <Input
                            id="photographer"
                            value={uploadForm.photographer}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, photographer: e.target.value }))}
                            placeholder="e.g., John Smith"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                          <Input
                            id="tags"
                            value={uploadForm.tags}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="nile, cruise, sunset"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            id="featured"
                            type="checkbox"
                            checked={uploadForm.featured}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, featured: e.target.checked }))}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="featured" className="text-sm font-medium">Feature on homepage</Label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowUploadModal(false);
                          setPreviewUrl('');
                          setSelectedFile(null);
                        }}
                        disabled={uploadLoading}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={uploadLoading || (!selectedFile && !uploadForm.imageUrl)}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {uploadLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Edit Image Modal */}
              <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Edit className="w-6 h-6 text-green-600" />
                      Edit Image
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-2">Update image details and settings</p>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    {/* Image Preview */}
                    {previewUrl && (
                      <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                        <Label className="text-sm font-medium mb-2 block">Current Image</Label>
                        <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-green-200" />
                      </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Basic Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="edit-title" className="text-sm font-medium">Title *</Label>
                          <Input
                            id="edit-title"
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter image title"
                            required
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
                          <Input
                            id="edit-description"
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the image"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="edit-category" className="text-sm font-medium">Category *</Label>
                          <Select 
                            value={uploadForm.category} 
                            onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="mt-1 bg-white text-gray-900 border border-gray-300">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.name} className="text-gray-900 hover:bg-blue-50">
                                  {category.name} ({category.imageCount} images)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="edit-location" className="text-sm font-medium">Location</Label>
                          <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="edit-location"
                              value={uploadForm.location}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="e.g., Luxor, Egypt"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Additional Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-photographer" className="text-sm font-medium">Photographer</Label>
                          <Input
                            id="edit-photographer"
                            value={uploadForm.photographer}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, photographer: e.target.value }))}
                            placeholder="e.g., John Smith"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="edit-tags" className="text-sm font-medium">Tags</Label>
                          <Input
                            id="edit-tags"
                            value={uploadForm.tags}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="nile, cruise, sunset"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              id="edit-featured"
                              type="checkbox"
                              checked={uploadForm.featured}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, featured: e.target.checked }))}
                              className="h-4 w-4"
                            />
                            <Label htmlFor="edit-featured" className="text-sm font-medium">Feature on homepage</Label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              id="edit-active"
                              type="checkbox"
                              checked={uploadForm.isActive}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, isActive: e.target.checked }))}
                              className="h-4 w-4"
                            />
                            <Label htmlFor="edit-active" className="text-sm font-medium">Active</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingImage(null);
                          setPreviewUrl('');
                        }}
                        disabled={uploadLoading}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleUpdateImage}
                        disabled={uploadLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {uploadLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Update Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* New Category Modal */}
              <Dialog open={showNewCategoryModal} onOpenChange={setShowNewCategoryModal}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Plus className="w-6 h-6 text-amber-600" />
                      Create New Category
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-2">Add a new image category to organize your gallery</p>
                  </DialogHeader>
                  <form onSubmit={createNewCategory} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="categoryName" className="text-sm font-medium">Category Name *</Label>
                      <Input
                        id="categoryName"
                        value={newCategoryForm.name}
                        onChange={(e) => setNewCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Dahabiyat, Destinations, Experiences"
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoryDescription" className="text-sm font-medium">Description</Label>
                      <Input
                        id="categoryDescription"
                        value={newCategoryForm.description}
                        onChange={(e) => setNewCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of this category"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowNewCategoryModal(false);
                          setNewCategoryForm({ name: '', description: '' });
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Category
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Button onClick={fetchGalleryData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Images Grid/List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Gallery Images ({filteredImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredImages.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-gray-200">
                        <img
                          src={image.imageUrl || '/images/placeholder.svg'}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {image.featured && (
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge variant={image.isActive ? 'default' : 'secondary'}>
                            {image.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{image.title}</h3>
                        {image.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                        )}
                        {image.photographer && (
                          <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {image.photographer}
                          </p>
                        )}
                        {image.location && (
                          <p className="text-xs text-gray-500 mb-2">
                            📍 {image.location}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{image.category}</span>
                          <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1 flex-wrap mb-3">
                          {image.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="flex-1 text-blue-600 hover:bg-blue-50">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => toggleFeatured(image.id, image.featured)}
                            className="text-yellow-600 hover:bg-yellow-50"
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditImage(image)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteImage(image.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredImages.map((image) => (
                    <Card key={image.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={image.imageUrl || '/images/placeholder.svg'}
                              alt={image.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                              <div className="flex gap-1 ml-2">
                                {image.featured && (
                                  <Badge className="bg-yellow-500 text-white">Featured</Badge>
                                )}
                                <Badge variant={image.isActive ? 'default' : 'secondary'}>
                                  {image.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                            {image.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              <span>Category: {image.category}</span>
                              <span>Created: {new Date(image.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1 flex-wrap">
                                {image.tags.slice(0, 5).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {image.tags.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{image.tags.length - 5}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => toggleFeatured(image.id, image.featured)}
                                  className="text-yellow-600 hover:bg-yellow-50"
                                >
                                  <Star className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditImage(image)}
                                  className="text-green-600 hover:bg-green-50"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => deleteImage(image.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Images Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'No images match your current filters.' 
                    : 'No images have been uploaded yet.'}
                </p>
                {(searchTerm || categoryFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}