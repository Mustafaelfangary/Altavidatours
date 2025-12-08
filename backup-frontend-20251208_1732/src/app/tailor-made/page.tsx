'use client';

import React, { useEffect, useState } from 'react';
import { Container, Button, TextField, MenuItem } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import { Play, ChevronRight, Eye, Star, Send, CheckCircle, Phone, Mail, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  startDate: string;
  endDate: string;
  totalPrice: number;
  guestCount: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  package?: {
    id: string;
    name: string;
    mainImageUrl?: string;
    duration?: number;
  };
  dahabiya?: {
    id: string;
    name: string;
    mainImageUrl?: string;
  };
}

export default function TailorMadePage() {
  const { getContent, loading: contentLoading, error } = useContent({ page: 'tailor-made' });

  // Booking list/table state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // Tailor-made booking request form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    duration: '',
    budget: '',
    interests: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const scrollToBookings = () => {
    const bookingsSection = document.getElementById('bookings-section');
    if (bookingsSection) bookingsSection.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToForm = () => {
    const formSection = document.getElementById('tailor-made-form');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setUnauthorized(false);
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          if (response.status === 401) {
            setUnauthorized(true);
            setBookings([]);
            return;
          }
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }
        const data = await response.json();
        setBookings(data.bookings || data || []);
      } catch (err) {
        console.error('Bookings fetch error:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setSubmitMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/tailor-made', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Your request has been submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          duration: '',
          budget: '',
          interests: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Failed to submit your request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading Tailor-Made Experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 text-xl font-bold">Content Loading Error</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-ocean-blue-lightest">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-ocean-blue to-deep-blue overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getContent('tailor_made_hero_image', '/images/tailor-made-hero.jpg')}
            alt="Tailor-made journey"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-hieroglyph-brown/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <Container maxWidth="lg">
            <div className="text-white text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {getContent('tailor_made_hero_title', 'Tailor-Made Journeys')}
              </h1>

              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                {getContent(
                  'tailor_made_hero_subtitle',
                  'Create your perfect Egyptian adventure. Every detail crafted to your desires, every moment designed for your dreams.'
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 px-8 py-4 text-lg hover:bg-gray-100 rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  Watch How It Works
                </Button>
                <Button onClick={scrollToBookings} className="bg-blue-600 text-white px-8 py-4 text-lg hover:bg-blue-700 rounded-full">
                  View Bookings
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button onClick={scrollToForm} className="bg-emerald-600 text-white px-8 py-4 text-lg hover:bg-emerald-700 rounded-full">
                  Start Planning
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Bookings Table Section */}
      <section id="bookings-section" className="py-16 bg-gradient-to-b from-blue-50 to-ocean-blue-lightest">
        <Container maxWidth="lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Your Bookings</h2>
            <p className="text-gray-600 mt-2">Review your Dahabiya journeys and manage details.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
            </div>
          ) : unauthorized ? (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-4 text-lg font-semibold">Please sign in to view your bookings.</p>
              <Link href="/auth/signin">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Sign In</Button>
              </Link>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-4 text-lg font-semibold">No bookings found</p>
              <Link href="/packages">
                <Button className="bg-gradient-to-r from-ocean-blue-400 to-navy-blue-400 hover:from-ocean-blue-500 hover:to-navy-blue-500 text-white">
                  Browse Packages
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">Item</TableHead>
                      <TableHead className="min-w-[220px]">Dates</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-semibold text-gray-900">
                            {booking.package?.name || booking.dahabiya?.name || 'Custom Booking'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Booked {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-800">
                            {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                          </div>
                          {booking.package?.duration && (
                            <div className="text-xs text-gray-500">{booking.package.duration} days</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-900">{booking.guestCount}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(booking.status)} border`}>{booking.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-emerald-600">${booking.totalPrice.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/bookings/${booking.id}`} className="inline-flex items-center px-2 py-1 text-sm rounded border border-egyptian-gold/40 text-hieroglyph-brown hover:bg-egyptian-gold/10">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Link>
                            {booking.status === 'COMPLETED' && (
                              <Link href={`/bookings/${booking.id}/review`} className="inline-flex items-center px-2 py-1 text-sm rounded bg-ocean-blue text-white hover:bg-blue-700">
                                <Star className="w-4 h-4 mr-1" /> Review
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Tailor-Made Booking Request Form */}
      <section id="tailor-made-form" className="py-20 bg-gradient-to-b from-blue-50 to-ocean-blue-lightest">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {getContent('tailor_made_form_title', 'Start Planning Your Journey')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {getContent('tailor_made_form_subtitle', "Tell us about your dream Egyptian adventure and we'll create the perfect itinerary just for you.")}
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Call Us</div>
                    <div className="text-gray-600">+20 123 456 789</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Email Us</div>
                    <div className="text-gray-600">info@cleopatradadhabiyat.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Response Time</div>
                    <div className="text-gray-600">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </div>

                <TextField
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="duration"
                    label="Preferred Duration"
                    select
                    value={formData.duration}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <MenuItem value="3-5 days">3-5 days</MenuItem>
                    <MenuItem value="6-8 days">6-8 days</MenuItem>
                    <MenuItem value="9-12 days">9-12 days</MenuItem>
                    <MenuItem value="13+ days">13+ days</MenuItem>
                  </TextField>

                  <TextField
                    name="budget"
                    label="Budget Range"
                    select
                    value={formData.budget}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <MenuItem value="$2000-5000">$2,000 - $5,000</MenuItem>
                    <MenuItem value="$5000-10000">$5,000 - $10,000</MenuItem>
                    <MenuItem value="$10000-20000">$10,000 - $20,000</MenuItem>
                    <MenuItem value="$20000+">$20,000+</MenuItem>
                  </TextField>
                </div>

                <TextField
                  name="interests"
                  label="Special Interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Ancient temples, Photography, Luxury dining..."
                  fullWidth
                />

                <TextField
                  name="message"
                  label="Tell us about your dream journey"
                  value={formData.message}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                />

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-green-800 font-medium">{submitMessage}</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-red-600 mr-2">⚠️</div>
                      <p className="text-red-800 font-medium">{submitMessage}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-lg rounded-lg ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send My Request
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
