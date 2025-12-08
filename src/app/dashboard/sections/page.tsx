"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Box, Button, TextField, Typography, Paper, Grid, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import imageLoader from '@/utils/imageLoader';
import { UseSettingsReturn, Settings } from '@/types/settings';

interface Setting {
  key: string;
  value: string;
}

export default function SectionsPage() {
  const { settings, loading, error, get, getByCategory, updateSettings, isLoading } = useSettings() as UseSettingsReturn;
  const [localSettings, setLocalSettings] = useState<Settings>({} as Settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      // Ensure all array fields are always arrays
      const arrayFields = [
        'dahabiya_comparison_points',
        'dahabiya_comparison_gallery',
        'story_section_gallery',
        'home_memories_gallery',
      ];
      const safeSettings = { ...settings };
      arrayFields.forEach((field) => {
        if (!Array.isArray(safeSettings[field])) {
          safeSettings[field] = [];
        }
      });
      setLocalSettings(safeSettings);
    }
  }, [settings]);

  const getArrayValue = (key: string): string[] => {
    const value = localSettings[key];
    return Array.isArray(value) ? [...value] : value ? value.split(',') : [];
  };

  const updateLocalSettings = (newSettings: Partial<Settings>) => {
    setLocalSettings(prev => ({ ...prev, ...newSettings } as Settings));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, galleryKey: string) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = getArrayValue(galleryKey);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        newImages.push(data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }

    const arrayFields = [
      'dahabiya_comparison_gallery',
      'story_section_gallery',
      'home_memories_gallery',
      'dahabiya_comparison_points',
    ];
    if (arrayFields.includes(galleryKey)) {
      updateLocalSettings({ [galleryKey]: newImages });
    } else {
      updateLocalSettings({ [galleryKey]: newImages.join(',') });
    }
  };

  const removeImage = (galleryKey: string, index: number) => {
    const newImages = getArrayValue(galleryKey);
    newImages.splice(index, 1);
    const arrayFields = [
      'dahabiya_comparison_gallery',
      'story_section_gallery',
      'home_memories_gallery',
      'dahabiya_comparison_points',
    ];
    if (arrayFields.includes(galleryKey)) {
      updateLocalSettings({ [galleryKey]: newImages });
    } else {
      updateLocalSettings({ [galleryKey]: newImages.join(',') });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', { method: 'POST', body: JSON.stringify(localSettings) });
      toast.success('Sections updated successfully');
    } catch (error) {
      toast.error('Failed to update sections');
      console.error('Error updating sections:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Homepage Sections
      </Typography>

      {/* Dahabiya Comparison Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Dahabiya Comparison Section
        </Typography>
        <Grid container component="div" spacing={3}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Title"
              value={localSettings.dahabiya_comparison_title || ''}
              onChange={(e) => updateLocalSettings({ dahabiya_comparison_title: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Subtitle"
              value={localSettings.dahabiya_comparison_subtitle || ''}
              onChange={(e) => updateLocalSettings({ dahabiya_comparison_subtitle: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={localSettings.dahabiya_comparison_description || ''}
              onChange={(e) => updateLocalSettings({ dahabiya_comparison_description: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Comparison Points
            </Typography>
            {getArrayValue('dahabiya_comparison_points').map((point, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  value={point}
                  onChange={(e) => {
                    const newPoints = getArrayValue('dahabiya_comparison_points');
                    newPoints[index] = e.target.value;
                    updateLocalSettings({ dahabiya_comparison_points: newPoints });
                  }}
                  placeholder="Enter comparison point"
                />
                <IconButton
                  onClick={() => {
                    const newPoints = getArrayValue('dahabiya_comparison_points');
                    newPoints.splice(index, 1);
                    updateLocalSettings({ dahabiya_comparison_points: newPoints });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              onClick={() => {
                const newPoints = [...getArrayValue('dahabiya_comparison_points'), ''];
                updateLocalSettings({ dahabiya_comparison_points: newPoints });
              }}
              startIcon={<AddIcon />}
            >
              Add Point
            </Button>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Gallery Images
            </Typography>
            <Grid container component="div" spacing={2}>
              {getArrayValue('dahabiya_comparison_gallery').map((image, index) => (
                <Box key={index} sx={{ width: '100%', maxWidth: 400, flex: '1 1 300px' }}>
                  <Paper sx={{ p: 1, position: 'relative' }}>
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
                      onClick={() => removeImage('dahabiya_comparison_gallery', index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                </Box>
              ))}
            </Grid>
            <Button
              component="label"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Add Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'dahabiya_comparison_gallery')}
              />
            </Button>
          </Box>
        </Grid>
      </Paper>

      {/* Story Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Story Section
        </Typography>
        <Grid container spacing={3}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Title"
              value={localSettings.story_section_title || ''}
              onChange={(e) => updateLocalSettings({ story_section_title: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Subtitle"
              value={localSettings.story_section_subtitle || ''}
              onChange={(e) => updateLocalSettings({ story_section_subtitle: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={localSettings.story_section_description || ''}
              onChange={(e) => updateLocalSettings({ story_section_description: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%', flex: '1 1 50%' }}>
            <TextField
              fullWidth
              label="CTA Text"
              value={localSettings.story_section_cta_text || ''}
              onChange={(e) => updateLocalSettings({ story_section_cta_text: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%', flex: '1 1 50%' }}>
            <TextField
              fullWidth
              label="CTA Link"
              value={localSettings.story_section_cta_link || ''}
              onChange={(e) => updateLocalSettings({ story_section_cta_link: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Gallery Images
            </Typography>
            <Grid container spacing={2}>
              {getArrayValue('story_section_gallery').map((image, index) => (
                <Box key={index} sx={{ width: '100%', maxWidth: 400, flex: '1 1 300px' }}>
                  <Paper sx={{ p: 1, position: 'relative' }}>
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
                      onClick={() => removeImage('story_section_gallery', index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                </Box>
              ))}
            </Grid>
            <Button
              component="label"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Add Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'story_section_gallery')}
              />
            </Button>
          </Box>
        </Grid>
      </Paper>

      {/* Our Story Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Our Story Section
        </Typography>
        <Grid container spacing={3}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Title"
              value={localSettings.home_our_story_title || ''}
              onChange={(e) => updateLocalSettings({ home_our_story_title: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={localSettings.home_our_story_content || ''}
              onChange={(e) => updateLocalSettings({ home_our_story_content: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'home_our_story_image')}
            />
            {localSettings.home_our_story_image && (
              <Box sx={{ mt: 2 }}>
                <Image src={localSettings.home_our_story_image} alt="Our Story" width={200} height={200} loader={imageLoader} />
              </Box>
            )}
          </Box>
        </Grid>
      </Paper>

      {/* Share Your Memories Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Share Your Memories Section
        </Typography>
        <Grid container spacing={3}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Title"
              value={localSettings.home_memories_title || ''}
              onChange={(e) => updateLocalSettings({ home_memories_title: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={localSettings.home_memories_description || ''}
              onChange={(e) => updateLocalSettings({ home_memories_description: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Gallery Images
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, 'home_memories_gallery')}
            />
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {getArrayValue('home_memories_gallery').map((image, index) => (
                <Box key={index} sx={{ width: '100%', maxWidth: 400, flex: '1 1 300px' }}>
                  <Box sx={{ position: 'relative' }}>
                    <Image src={image} alt={`Memory ${index + 1}`} width={100} height={100} loader={imageLoader} />
                    <Button
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                      onClick={() => removeImage('home_memories_gallery', index)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Paper>

      {/* Featured Cruises Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Featured Cruises Section
        </Typography>
        <Grid container spacing={3}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Section Title"
              value={localSettings.home_featured_title || ''}
              onChange={(e) => updateLocalSettings({ home_featured_title: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Section Subtitle"
              value={localSettings.home_featured_subtitle || ''}
              onChange={(e) => updateLocalSettings({ home_featured_subtitle: e.target.value })}
            />
          </Box>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ width: '100%' }}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Featured Cruise {i}
                </Typography>
                <TextField
                  fullWidth
                  label={`Cruise ${i} Title`}
                  value={localSettings[`home_featured_${i}_title`] || ''}
                  onChange={(e) => updateLocalSettings({ [`home_featured_${i}_title`]: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={`Cruise ${i} Description`}
                  value={localSettings[`home_featured_${i}_desc`] || ''}
                  onChange={(e) => updateLocalSettings({ [`home_featured_${i}_desc`]: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Cruise {i} Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, `home_featured_${i}_image`)}
                />
                {typeof localSettings[`home_featured_${i}_image`] === 'string' && localSettings[`home_featured_${i}_image`] && (
                  <Box sx={{ mt: 2 }}>
                    <Image src={localSettings[`home_featured_${i}_image`] as string} alt={`Featured Cruise ${i}`} width={200} height={200} loader={imageLoader} />
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <LoadingButton
          variant="contained"
          onClick={handleSave}
          loading={isSaving}
          size="large"
        >
          Save Changes
        </LoadingButton>
      </Box>
    </Box>
  );
}