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
  Upload, 
  ArrowLeft, 
  RefreshCw,
  Crown,
  Eye,
  Edit,
  Trash2,
  Download,
  Search,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Archive,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  tags: string[];
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MediaManagement() {
  const { data: session, status } = useSession();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [uploadForm, setUploadForm] = useState({
    category: 'general',
    tags: '',
    description: '',
    isPublic: true
  });

  useEffect(() => {
    if (session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role)) {
      fetchMediaFiles();
    }
  }, [session]);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });

      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.files || []);
      } else {
        toast.error('Failed to load media files');
      }
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast.error('Error loading media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploadLoading(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });
      formData.append('category', uploadForm.category);
      formData.append('tags', uploadForm.tags);
      formData.append('description', uploadForm.description);
      formData.append('isPublic', uploadForm.isPublic.toString());

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success(`${selectedFiles.length} file(s) uploaded successfully!`);
        setShowUploadModal(false);
        setSelectedFiles([]);
        setUploadForm({
          category: 'general',
          tags: '',
          description: '',
          isPublic: true
        });
        fetchMediaFiles();
      } else {
        toast.error('Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Error uploading files');
    } finally {
      setUploadLoading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('File deleted successfully');
        fetchMediaFiles();
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    return Archive;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || file.mimeType.startsWith(typeFilter);
    
    return matchesSearch && matchesType;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading Media Library...</p>
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
          <p className="text-amber-600">Only administrators and managers may access media management.</p>
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
            <Upload className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">Media Library</h1>
              <p className="text-amber-200">Manage all media files and assets</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-300 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Files</p>
                  <p className="text-3xl font-bold text-blue-900">{mediaFiles.length}</p>
                </div>
                <Archive className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-300 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Images</p>
                  <p className="text-3xl font-bold text-green-900">
                    {mediaFiles.filter(f => f.mimeType.startsWith('image/')).length}
                  </p>
                </div>
                <ImageIcon className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Videos</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {mediaFiles.filter(f => f.mimeType.startsWith('video/')).length}
                  </p>
                </div>
                <Video className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-300 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Size</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {formatFileSize(mediaFiles.reduce((sum, f) => sum + f.size, 0))}
                  </p>
                </div>
                <Archive className="h-8 w-8 text-orange-600" />
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
                Media Controls
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
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
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="application">Documents</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Media Files
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                      <Label htmlFor="files">Select Files *</Label>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        required
                      />
                      {selectedFiles.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedFiles.length} file(s) selected
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={uploadForm.category} 
                        onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="images">Images</SelectItem>
                          <SelectItem value="videos">Videos</SelectItem>
                          <SelectItem value="documents">Documents</SelectItem>
                          <SelectItem value="logos">Logos</SelectItem>
                          <SelectItem value="banners">Banners</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={uploadForm.tags}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="e.g., logo, banner, hero"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUploadModal(false)}
                        disabled={uploadLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={uploadLoading}
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
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Button onClick={fetchMediaFiles} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Files Grid/List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Media Files ({filteredFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFiles.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    return (
                      <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                          {file.mimeType.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={file.originalName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileIcon className="w-16 h-16 text-gray-400" />
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Badge variant={file.isPublic ? 'default' : 'secondary'}>
                              {file.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm">
                            {file.originalName}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {file.mimeType} • {formatFileSize(file.size)}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>{file.category}</span>
                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          </div>
                          {file.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap mb-3">
                              {file.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => copyUrl(file.url)}
                              className="flex-1 text-blue-600 hover:bg-blue-50"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => window.open(file.url, '_blank')}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteFile(file.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    return (
                      <Card key={file.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {file.mimeType.startsWith('image/') ? (
                                <img
                                  src={file.url}
                                  alt={file.originalName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FileIcon className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900 truncate">{file.originalName}</h3>
                                  <p className="text-sm text-gray-600">
                                    {file.mimeType} • {formatFileSize(file.size)}
                                  </p>
                                </div>
                                <Badge variant={file.isPublic ? 'default' : 'secondary'}>
                                  {file.isPublic ? 'Public' : 'Private'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <span>Category: {file.category}</span>
                                <span>Created: {new Date(file.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1 flex-wrap">
                                  {file.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {file.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{file.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => copyUrl(file.url)}
                                    className="text-blue-600 hover:bg-blue-50"
                                  >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy URL
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => window.open(file.url, '_blank')}
                                    className="text-green-600 hover:bg-green-50"
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Open
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => deleteFile(file.id)}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Media Files Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || typeFilter !== 'all' 
                    ? 'No files match your current filters.' 
                    : 'No media files have been uploaded yet.'}
                </p>
                {(searchTerm || typeFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
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