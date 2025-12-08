"use client";
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalFileUpload } from '../upload/local-file-upload';
import { useFileUpload } from '@/hooks/use-file-upload';

interface MediaItem {
  id: string;
  url: string;
  alt?: string;
  type: 'image' | 'video';
}

export function MediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const { uploadFile, uploading, error } = useFileUpload();

  const handleUpload = async (file: File): Promise<string> => {
    try {
      const url = await uploadFile(file);
      const newItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        type: file.type.startsWith('image/') ? 'image' : 'video',
      };
      setMediaItems([...mediaItems, newItem]);
      return url;
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  };

  const handleDelete = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };



  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Media Manager
      </Typography>

      <Box sx={{ mb: 4 }}>
        <LocalFileUpload
          onUpload={handleUpload}
          accept="image/*, video/*"
          label="Upload media files"
        />
      </Box>

      <Grid container component="div" spacing={3}>
        {mediaItems.map((item) => (
          <Box key={item.id} sx={{ width: '100%', maxWidth: 400, flex: '1 1 300px' }}>
            <Card>
              {item.type === 'image' ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.url}
                  alt={item.alt || ''}
                />
              ) : (
                <CardMedia
                  component="video"
                  height="200"
                  src={item.url}
                  controls
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.alt || 'No description'}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Grid>


    </Box>
  );
} 
