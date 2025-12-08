"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';
import { 
  Loader2, 
  Upload, 
  Trash2, 
  Eye, 
  Search, 
  Folder, 
  FolderOpen,
  Grid3X3,
  List,
  Download,
  Copy,
  Filter,
  MoreHorizontal
} from 'lucide-react';


interface MediaItem {
  url: string;
  type: 'image' | 'video';
  filename: string;
  size: number;
  uploadedAt: string;
  folder?: string;
}

export default function MediaManagerPage() {
  const acceptedTypes = "image/*, video/*";
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<string>('all');
  const [folders, setFolders] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [mediaItems, searchTerm, currentFolder]);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch media');
      
      const data = await response.json();
      setMediaItems(data);
      
      // Extract unique folders
      const folderSet = new Set<string>(data.map((item: MediaItem) => item.folder || 'Uncategorized'));
      const uniqueFolders = Array.from(folderSet);
      setFolders(uniqueFolders);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to fetch media items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = mediaItems;

    // Filter by folder
    if (currentFolder !== 'all') {
      filtered = filtered.filter(item => (item.folder || 'Uncategorized') === currentFolder);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      toast.success('Media uploaded successfully');
      fetchMediaItems();
      setShowUpload(false);
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleSelectMedia = (item: MediaItem) => {
    // In standalone mode, just show the media details
    setSelectedMedia(item);
  };

  const handleDeleteMedia = async (urls: string[]) => {
    try {
      const deletePromises = urls.map(url => 
        fetch(`/api/media?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      toast.success(`${urls.length} item(s) deleted successfully`);
      setSelectedItems([]);
      fetchMediaItems();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      handleDeleteMedia(selectedItems);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.url));
    }
  };

  const handleItemSelect = (url: string) => {
    setSelectedItems(prev => 
      prev.includes(url) 
        ? prev.filter(item => item !== url)
        : [...prev, url]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Media Manager
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Folder Filter */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Button
              variant={currentFolder === 'all' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setCurrentFolder('all')}
            >
              All Files
            </Button>
            {folders.map(folder => (
              <Button
                key={folder}
                variant={currentFolder === folder ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCurrentFolder(folder)}
              >
                <Folder className="w-4 h-4 mr-1" />
                {folder}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredItems.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">
                  {selectedItems.length} item(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedItems[0])}
                  disabled={selectedItems.length !== 1}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy URL
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
                <p className="text-gray-600 mb-4">
                  Select images or videos to upload to your media library
                </p>
                <input
                  type="file"
                  multiple
                  accept={acceptedTypes}
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                  id="file-upload-input"
                />
                <Button
                  variant="primary"
                  disabled={uploading}
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  type="button"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Choose Files
                    </>
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowUpload(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.url} 
              className={`group hover:shadow-lg transition-shadow cursor-pointer ${
                selectedItems.includes(item.url) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSelectMedia(item)}
            >
              <CardContent className="p-2">
                <div className="relative aspect-square mb-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.url)}
                    onChange={() => handleItemSelect(item.url)}
                    className="absolute top-2 left-2 z-10 h-4 w-4"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  />
                  
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover rounded-lg"
                      muted
                    />
                  )}
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setSelectedMedia(item);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        copyToClipboard(item.url);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteMedia([item.url]);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  <p className="font-medium truncate">{item.filename}</p>
                  <p>{formatFileSize(item.size)}</p>
                  <p>{new Date(item.uploadedAt).toLocaleDateString()}</p>
                  {item.folder && (
                    <p className="text-blue-600 flex items-center gap-1">
                      <Folder className="w-3 h-3" />
                      {item.folder}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Card 
              key={item.url} 
              className={`group hover:shadow-lg transition-shadow cursor-pointer ${
                selectedItems.includes(item.url) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSelectMedia(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.url)}
                    onChange={() => handleItemSelect(item.url)}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="h-4 w-4"
                  />
                  
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {item.type === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.filename}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover rounded-lg"
                        muted
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.filename}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(item.size)} • {item.type} • {new Date(item.uploadedAt).toLocaleDateString()}
                    </p>
                    {item.folder && (
                      <p className="text-sm text-blue-600 flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {item.folder}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        copyToClipboard(item.url);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteMedia([item.url]);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Media Preview</h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedMedia(null)}
              >
                Close
              </Button>
            </div>
            
            <div className="space-y-4">
              {selectedMedia.type === 'image' ? (
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.filename}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full rounded-lg"
                />
              )}
              
              <div className="space-y-2">
                <p><strong>Filename:</strong> {selectedMedia.filename}</p>
                <p><strong>Type:</strong> {selectedMedia.type}</p>
                <p><strong>Size:</strong> {formatFileSize(selectedMedia.size)}</p>
                <p><strong>Uploaded:</strong> {new Date(selectedMedia.uploadedAt).toLocaleString()}</p>
                <p><strong>URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">{selectedMedia.url}</code></p>
                {selectedMedia.folder && (
                  <p><strong>Folder:</strong> {selectedMedia.folder}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(selectedMedia.url)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No media found' : 'No media uploaded yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Upload your first image or video to get started.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
