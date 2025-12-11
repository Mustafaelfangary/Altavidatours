"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Box,
  Chip,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  size: number;
  mimeType: string;
  alt?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaLibrarySelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  acceptedTypes?: ('IMAGE' | 'VIDEO' | 'DOCUMENT')[];
  title?: string;
  multiple?: boolean;
}

export default function MediaLibrarySelector({
  open,
  onClose,
  onSelect,
  acceptedTypes = ['IMAGE', 'VIDEO'],
  title = 'Select Media',
  multiple = false,
}: MediaLibrarySelectorProps) {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('ALL');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load media assets
  const loadMediaAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/media-assets');
      if (!response.ok) {
        throw new Error('Failed to load media assets');
      }
      const assets = await response.json();
      setMediaAssets(assets);
      setFilteredAssets(assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  // Filter assets based on search and type
  useEffect(() => {
    let filtered = mediaAssets;

    // Filter by accepted types
    if (acceptedTypes.length > 0) {
      filtered = filtered.filter(asset => acceptedTypes.includes(asset.type));
    }

    // Filter by selected type tab
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.originalName.toLowerCase().includes(term) ||
        asset.alt?.toLowerCase().includes(term) ||
        asset.caption?.toLowerCase().includes(term)
      );
    }

    setFilteredAssets(filtered);
  }, [mediaAssets, searchTerm, selectedType, acceptedTypes]);

  // Load assets when dialog opens
  useEffect(() => {
    if (open) {
      loadMediaAssets();
      setSelectedAssets([]);
      setSearchTerm('');
      setSelectedType('ALL');
    }
  }, [open]);

  // Handle asset selection
  const handleAssetClick = (asset: MediaAsset) => {
    if (multiple) {
      setSelectedAssets(prev => 
        prev.includes(asset.id) 
          ? prev.filter(id => id !== asset.id)
          : [...prev, asset.id]
      );
    } else {
      onSelect(asset);
      onClose();
    }
  };

  // Handle multiple selection confirm
  const handleConfirmSelection = () => {
    if (multiple && selectedAssets.length > 0) {
      const selected = mediaAssets.filter(asset => selectedAssets.includes(asset.id));
      selected.forEach(asset => onSelect(asset));
    }
    onClose();
  };

  // Handle file upload
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
      
      // Reload assets after upload
      await loadMediaAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return <ImageIcon />;
      case 'VIDEO': return <VideoIcon />;
      case 'DOCUMENT': return <FileIcon />;
      default: return <FileIcon />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
        color: 'white',
        fontWeight: 'bold'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Search and Upload Section */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ flex: 1 }}
          />
          
          <Button
            variant="contained"
            component="label"
            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
            disabled={uploading}
            sx={{
              background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(210, 85%, 20%) 0%, hsl(43, 85%, 53%) 100%)',
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              hidden
              multiple
              accept={acceptedTypes.includes('IMAGE') ? 'image/*' : acceptedTypes.includes('VIDEO') ? 'video/*' : '*/*'}
              onChange={handleFileUpload}
            />
          </Button>
        </Box>

        {/* Type Filter Tabs */}
        <Tabs
          value={selectedType}
          onChange={(_, value) => setSelectedType(value)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" value="ALL" />
          {acceptedTypes.includes('IMAGE') && <Tab label="Images" value="IMAGE" />}
          {acceptedTypes.includes('VIDEO') && <Tab label="Videos" value="VIDEO" />}
          {acceptedTypes.includes('DOCUMENT') && <Tab label="Documents" value="DOCUMENT" />}
        </Tabs>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Media Grid */}
        {!loading && (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 2,
              maxHeight: '400px',
              overflow: 'auto'
            }}
          >
            {filteredAssets.map((asset) => (
              <Card
                key={asset.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedAssets.includes(asset.id) ? '3px solid hsl(43, 85%, 58%)' : '1px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => handleAssetClick(asset)}
              >
                <Box sx={{ position: 'relative', height: 150 }}>
                  {asset.type === 'IMAGE' ? (
                    <Image
                      src={asset.url}
                      alt={asset.alt || asset.originalName}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : asset.type === 'VIDEO' ? (
                    <video
                      src={asset.url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      bgcolor: 'grey.100'
                    }}>
                      {getTypeIcon(asset.type)}
                    </Box>
                  )}
                  
                  {/* Selection indicator */}
                  {selectedAssets.includes(asset.id) && (
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: 'hsl(43, 85%, 58%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      ✓
                    </Box>
                  )}
                </Box>
                
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" noWrap title={asset.originalName}>
                    {asset.originalName}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={asset.type} 
                      size="small" 
                      color={asset.type === 'IMAGE' ? 'primary' : asset.type === 'VIDEO' ? 'secondary' : 'default'}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(asset.size)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredAssets.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No media files found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        {multiple && selectedAssets.length > 0 && (
          <Button 
            onClick={handleConfirmSelection} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
            }}
          >
            Select {selectedAssets.length} item{selectedAssets.length > 1 ? 's' : ''}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}


