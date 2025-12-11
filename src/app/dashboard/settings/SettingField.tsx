"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import Image from 'next/image';
import MediaLibrarySelector from '@/components/media/MediaLibrarySelector';

interface Setting {
  key: string;
  value: string;
  group: string;
  type: string;
  description: string | null;
}

interface SettingFieldProps {
  setting: Setting;
  onSave: (key: string, value: string) => Promise<void>;
  isSaving: boolean;
}

export default function SettingField({ setting, onSave, isSaving }: SettingFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(setting.value);
  const [error, setError] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // Sync value with prop changes (important for correct editing after save/tab switch)
  useEffect(() => {
    setValue(setting.value);
  }, [setting.value]);

  const handleEdit = () => {
    // For media fields, open media library instead of text editing
    if (setting.type === 'media' || setting.type === 'image' || setting.type === 'video') {
      setShowMediaLibrary(true);
    } else {
      setIsEditing(true);
      setError('');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(setting.value);
    setError('');
  };

  const handleSave = async () => {
    const trimmedValue = value.trim();
    if (trimmedValue === setting.value) {
      setIsEditing(false);
      setError('');
      return;
    }
    try {
      await onSave(setting.key, trimmedValue);
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to save setting');
    }
  };

  // Media delete handler
  const handleDeleteMedia = async () => {
    // Delete from server if URL exists
    if (setting.value) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(setting.value)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to delete media file:', error);
      }
    }

    setValue('');
    await onSave(setting.key, '');
    setIsEditing(false);
  };

  const handleMediaLibrarySelect = async (asset: any) => {
    setValue(asset.url);
    await onSave(setting.key, asset.url);
    setShowMediaLibrary(false);
    setIsEditing(false);
  };

  const renderValue = () => {
    if ((setting.type === 'media' || setting.type === 'image' || setting.type === 'video') && setting.value) {
      return (
        <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
          {setting.type === 'video' ? (
            <video src={setting.value} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Image
              src={setting.value}
              alt={setting.description || setting.key}
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<PhotoLibraryIcon />}
              onClick={() => setShowMediaLibrary(true)}
              disabled={isSaving}
              sx={{
                background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, hsl(210, 85%, 20%) 0%, hsl(43, 85%, 53%) 100%)',
                }
              }}
            >
              Change
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={handleDeleteMedia} disabled={isSaving}>
              Delete
            </Button>
          </Box>
        </Box>
      );
    }

    if (setting.type === 'longtext') {
      return (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          {setting.value}
        </Typography>
      );
    }

    if (setting.type === 'color') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <input
            type="color"
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{ width: 40, height: 40, border: 'none', background: 'none', padding: 0 }}
          />
          <TextField
            label={setting.description || setting.key}
            value={value}
            onChange={e => setValue(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ width: 120 }}
          />
        </Box>
      );
    }

    if ((setting.type === 'media' || setting.type === 'image' || setting.type === 'video') && !setting.value) {
      return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<PhotoLibraryIcon />}
            onClick={() => setShowMediaLibrary(true)}
            disabled={isSaving}
            sx={{
              background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(210, 85%, 20%) 0%, hsl(43, 85%, 53%) 100%)',
              }
            }}
          >
            Choose from Media Library
          </Button>
        </Box>
      );
    }

    return (
      <Typography variant="body1">
        {setting.value}
      </Typography>
    );
  };

  const renderEditField = () => {
    // Media fields should not have text editing - they use media library only
    if (setting.type === 'media' || setting.type === 'image' || setting.type === 'video') {
      return null;
    }

    if (setting.type === 'longtext') {
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={setting.description || setting.key}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!!error}
          helperText={error}
        />
      );
    }

    return (
      <TextField
        fullWidth
        label={setting.description || setting.key}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={!!error}
        helperText={error}
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              {setting.description || setting.key}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {setting.key}
            </Typography>
          </Box>
          {!isEditing && !(setting.type === 'media' || setting.type === 'image' || setting.type === 'video') && (
            <Tooltip title="Edit">
              <IconButton onClick={handleEdit} size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {isEditing && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Save">
                <IconButton
                  onClick={handleSave}
                  disabled={isSaving}
                  color="primary"
                  size="small"
                >
                  {isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton onClick={handleCancel} size="small">
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {isEditing ? (
          renderEditField()
        ) : (
          renderValue()
        )}
      </CardContent>

      {/* Media Library Selector */}
      <MediaLibrarySelector
        open={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleMediaLibrarySelect}
        acceptedTypes={setting.type === 'video' ? ['VIDEO'] : setting.type === 'image' ? ['IMAGE'] : ['IMAGE', 'VIDEO']}
        title={`Select ${setting.type === 'video' ? 'Video' : setting.type === 'image' ? 'Image' : 'Media'} for ${setting.description || setting.key}`}
      />
    </Card>
  );
}

