'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { Edit, Delete, Add, OpenInNew } from '@mui/icons-material';
import Image from 'next/image';
import MediaPicker from './MediaPicker';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PartnerManager = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    description: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/partners');
      if (!response.ok) throw new Error('Failed to fetch partners');
      const data = await response.json();
      setPartners(data);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        logoUrl: partner.logoUrl,
        websiteUrl: partner.websiteUrl,
        description: partner.description || '',
        order: partner.order,
        isActive: partner.isActive,
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        logoUrl: '',
        websiteUrl: '',
        description: '',
        order: partners.length,
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPartner(null);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const url = editingPartner ? `/api/partners/${editingPartner.id}` : '/api/partners';
      const method = editingPartner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save partner');
      }

      await fetchPartners();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save partner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      const response = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete partner');
      await fetchPartners();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete partner');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h4" component="h1">
          Partner Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          style={{ backgroundColor: '#0080ff', color: 'white' }}
        >
          Add New Partner
        </Button>
      </div>

      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0ebe0' }}>
            <TableRow>
              <TableCell><strong>Logo</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Website</strong></TableCell>
              <TableCell><strong>Order</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id} hover>
                <TableCell>
                  <Box sx={{ width: 60, height: 60, position: 'relative' }}>
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                    {partner.name}
                  </Typography>
                  {partner.description && (
                    <Typography variant="caption" color="textSecondary">
                      {partner.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0080ff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Visit <OpenInNew style={{ width: 16, height: 16 }} />
                  </a>
                </TableCell>
                <TableCell>{partner.order}</TableCell>
                <TableCell>
                  <Switch checked={partner.isActive} disabled size="small" />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(partner)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(partner.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#0080ff', color: 'white' }}>
          {editingPartner ? 'Edit Partner' : 'Add New Partner'}
        </DialogTitle>
        <DialogContent style={{ marginTop: '16px' }}>
          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Partner Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
            style={{ marginBottom: '16px' }}
          />

          {/* Logo URL with Media Picker */}
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="subtitle2" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              Partner Logo *
            </Typography>
            <MediaPicker
              value={formData.logoUrl}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              label="Select Logo"
              accept="image/*"
            />
            {formData.logoUrl && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
                <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginBottom: '8px' }}>
                  Preview:
                </Typography>
                <Box sx={{ width: 200, height: 100, position: 'relative', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: 1 }}>
                  <Image
                    src={formData.logoUrl}
                    alt="Logo preview"
                    fill
                    style={{ objectFit: 'contain', padding: '8px' }}
                  />
                </Box>
              </Box>
            )}
          </div>

          <TextField
            label="Website URL"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            fullWidth
            required
            style={{ marginBottom: '16px' }}
            placeholder="https://example.com"
          />

          <TextField
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            style={{ marginBottom: '16px' }}
          />

          <TextField
            label="Display Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            fullWidth
            style={{ marginBottom: '16px' }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseDialog} style={{ color: '#666666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            style={{ backgroundColor: '#0080ff', color: 'white' }}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PartnerManager;
