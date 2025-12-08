'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Container, Typography, Grid, Box, TextField, Paper } from '@mui/material';
import { ContactForm } from '@/components/contact/contact-form';
import { useTranslation } from '@/lib/i18n';
import { useContent } from '@/hooks/useContent';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const t = useTranslation();
  const { getContent, getContentBlock, loading: contentLoading, error } = useContent({ page: 'contact' });

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pharaoh-gold mx-auto mb-4"></div>
          <p className="text-deep-nile-blue font-semibold">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          bgcolor: 'primary.main',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
            {getContent('contact_hero_title', 'Contact Us')}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            {getContent('contact_hero_subtitle', 'We\'d love to hear from you')}
          </Typography>
        </Container>
      </Box>

      {/* Contact Information and Form */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Information */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 4 }}>
                {getContent('contact_info_title', 'Get in Touch')}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {getContent('contact_address_title', 'Address')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {getContent('contact_address_content', '123 Nile Street\nLuxor, Egypt')}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {getContent('contact_phone_title', 'Phone')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {getContent('contact_phone_content', '+20 123 456 7890\n+20 123 456 7891')}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {getContent('contact_email_title', 'Email')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {getContent('contact_email_content', 'info@altavidatours.com\nbookings@altavidatours.com')}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {getContent('contact_hours_title', 'Business Hours')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {getContent('contact_hours_content', 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed')}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Contact Form */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 4 }}>
                {getContent('contact_form_title', 'Send us a Message')}
              </Typography>
              <ContactForm />
            </Paper>
          </Box>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box sx={{ height: '400px', bgcolor: 'grey.200' }}>
        {/* Add map component here */}
      </Box>
    </main>
  );
}