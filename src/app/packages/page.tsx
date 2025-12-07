'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Typography, Box, Button, Card, CardMedia, CardContent, Grid, Chip, TextField, InputAdornment } from '@mui/material';
import { Search, LocationOn, Star, AccessTime, CheckCircle, Security, Support } from '@mui/icons-material';
import LogoLoader from '@/components/ui/LogoLoader';
import { useContent } from '@/hooks/useContent';

interface Package {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  duration?: number;
  durationDays?: number;
  destination?: string;
  mainImage?: string;
  mainImageUrl?: string;
  images?: string[];
  slug?: string;
}

export default function PackagesPage() {
  const { getContent } = useContent({ page: 'packages' });
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (response.ok) {
          const data = await response.json();
          const packageData = data.packages || data || [];
          setPackages(packageData);
          setFilteredPackages(packageData);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Static fallback packages
        const fallbackPackages = [
          {
            id: '1',
            name: 'Classic Nile Discovery',
            duration: 7,
            price: 2850,
            destination: 'Luxor to Aswan',
            description: 'Comprehensive luxury journey featuring premium dahabiya accommodation, expert Egyptologist guides, and exclusive temple access with gourmet dining throughout.',
            mainImage: '/images/cultural-historical/saqqara-pyramid.jpg'
          },
          {
            id: '2',
            name: 'Royal Egyptian Explorer',
            duration: 10,
            price: 4250,
            destination: 'Cairo to Aswan',
            description: 'Ultimate Egyptian experience combining luxury Nile cruise, Pyramids of Giza, Valley of Kings, premium hotels, and private cultural immersion experiences.',
            mainImage: '/desert&safary/DSC_9908.JPG'
          },
          {
            id: '3',
            name: 'Romantic Nile Escape',
            duration: 5,
            price: 2150,
            destination: 'Aswan Highlights',
            description: 'Perfect couples retreat featuring boutique dahabiya, private dining experiences, spa treatments, sunset felucca rides, and personalized temple tours.',
            mainImage: '/Alexandria/IMG_6334.JPG'
          },
          {
            id: '4',
            name: 'Pharaohs Legacy Tour',
            duration: 12,
            price: 5200,
            destination: 'Full Egypt Circuit',
            description: 'Complete Egyptian odyssey from Alexandria to Abu Simbel, including all UNESCO sites, luxury accommodations, and private guided experiences.',
            mainImage: '/images/cultural-historical/DSC_8401.JPG'
          },
          {
            id: '5',
            name: 'Nile Adventure Plus',
            duration: 8,
            price: 3400,
            destination: 'Luxor & Surrounds',
            description: 'Active exploration combining traditional Nile cruising with adventure activities, hot air ballooning, and archaeological site visits.',
            mainImage: '/desert&safary/DSC_9912.JPG'
          },
          {
            id: '6',
            name: 'Luxury Family Journey',
            duration: 9,
            price: 3950,
            destination: 'Cairo to Luxor',
            description: 'Family-friendly luxury experience with educational activities, spacious accommodations, and specially designed programs for younger travelers.',
            mainImage: '/Alexandria/IMG_6504.JPG'
          }
        ];
        setPackages(fallbackPackages);
        setFilteredPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const filtered = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.destination && pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPackages(filtered);
  }, [searchTerm, packages]);

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <>
      {/* Hero Section */}
        <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', sm: '65vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1BAE70 0%, #0B70E1 50%, #0A2FA6 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/cultural-historical/saqqara-pyramid.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: { xs: 'center', sm: 'center' },
            opacity: 0.3,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
          <Typography
            variant="h1"
            component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem', lg: '4.5rem' },
            fontWeight: 'bold',
            mb: 3,
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            lineHeight: { xs: '1.2', sm: '1.1' }
          }}
          >
            {getContent('packages_hero_title', 'Luxury Travel Packages')}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem', lg: '1.8rem' },
            mb: 4,
            opacity: 0.95,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: { xs: '1.3', sm: '1.4' },
            px: { xs: 2, sm: 0 }
          }}
          >
            {getContent('packages_hero_subtitle', 'Curated Egyptian Adventures & Premium Nile Experiences')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              opacity: 0.85,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            {getContent('packages_hero_description', 'From intimate cruises to comprehensive cultural journeys, discover your perfect Egyptian adventure')}
          </Typography>
        </Container>
      </Box>

      {/* Search & Filter Section */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TextField
            variant="outlined"
            placeholder={getContent('packages_search_placeholder', 'Search packages by name, destination, or description...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
            maxWidth: 600, 
            width: '100%',
            mx: { xs: 2, sm: 0 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#1BAE70' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}>
          {filteredPackages.length} {filteredPackages.length === 1 ? getContent('packages_singular', 'package') : getContent('packages_plural', 'packages')} {getContent('packages_available', 'available')}
        </Typography>
      </Container>

      {/* Packages Grid */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {filteredPackages.map((pkg) => (
            <Box key={pkg.id} sx={{ width: { xs: '100%', md: '50%', lg: '33.3333%' }, pr: { md: 2 }, pb: 2 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="280"
                    image={pkg.mainImage || pkg.mainImageUrl || '/cultural-historical/DSCF1165.JPG'}
                    alt={pkg.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                    <Chip
                      label={`${pkg.duration || pkg.durationDays || '7'} Days`}
                      sx={{
                        bgcolor: '#1BAE70',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    />
                  </Box>
                  <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        px: 2,
                        py: 1,
                        borderRadius: 2
                      }}
                    >
                      <Star sx={{ color: '#FFA500', fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        4.8
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    {pkg.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ fontSize: '1.1rem', color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {pkg.destination || 'Egypt'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AccessTime sx={{ fontSize: '1.1rem', color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {pkg.duration || pkg.durationDays || '7'} days journey
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, height: { xs: 'auto', md: '4.5em' }, overflow: 'hidden' }}>
                    {pkg.shortDescription || pkg.description?.substring(0, 140) || 'Luxury travel experience combining comfort, culture, and adventure in Egypt.'}...
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Starting from
                      </Typography>
                      <Typography variant="h5" color="#1BAE70" fontWeight="bold">
                        ${pkg.price?.toLocaleString() || '2,450'}
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      href={`/packages/${pkg.slug || pkg.id}`}
                      variant="contained"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2.5,
                        px: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        bgcolor: '#0B70E1',
                        '&:hover': {
                          bgcolor: '#0A5FBF'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Our Packages Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 'bold',
                mb: 3,
                color: '#0A2FA6'
              }}
            >
              {getContent('packages_why_title', 'Why Choose Our Travel Packages')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
              {getContent('packages_why_subtitle', 'Every package is carefully crafted to deliver exceptional value and unforgettable experiences')}
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {[
              {
                icon: <CheckCircle sx={{ fontSize: '4rem', color: '#1BAE70' }} />,
                title: getContent('packages_feature_1_title', 'All-Inclusive Excellence'),
                description: getContent('packages_feature_1_description', 'Everything included from luxury accommodations to expert guides, meals, and entrance fees - no hidden costs.')
              },
              {
                icon: <Security sx={{ fontSize: '4rem', color: '#0B70E1' }} />,
                title: getContent('packages_feature_2_title', 'Travel Protection'),
                description: getContent('packages_feature_2_description', 'Comprehensive travel insurance, 24/7 support, and flexible booking policies for complete peace of mind.')
              },
              {
                icon: <Support sx={{ fontSize: '4rem', color: '#FFA500' }} />,
                title: getContent('packages_feature_3_title', 'Expert Local Guides'),
                description: getContent('packages_feature_3_description', 'Certified Egyptologists and local specialists bringing ancient history to life with insider knowledge and stories.')
              }
            ].map((feature, index) => (
              <Box key={index} sx={{ width: { xs: '100%', md: '33.3333%' }, p: { xs: 2, md: 4 } }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom sx={{ color: '#0A2FA6' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 4, md: 8 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}
        >
          <Typography variant="h2" component="h2" fontWeight="bold" gutterBottom sx={{ color: '#0A2FA6', fontSize: { xs: '2rem', md: '2.5rem' } }}>
            {getContent('packages_cta_title', 'Ready to Book Your Adventure?')}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
            {getContent('packages_cta_subtitle', "Join thousands of satisfied travelers who've discovered Egypt with our expertly crafted travel packages")}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/booking"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 2,
                textTransform: 'none',
                borderRadius: 3,
                minWidth: 220,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#1BAE70',
                '&:hover': {
                  bgcolor: '#159A63',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(27,174,112,0.3)'
                }
              }}
            >
              {getContent('packages_cta_book_btn', 'Book Now')}
            </Button>
            <Button
              component={Link}
              href="/contact"
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 2,
                textTransform: 'none',
                borderRadius: 3,
                borderWidth: 2,
                minWidth: 220,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#0B70E1',
                borderColor: '#0B70E1',
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(11, 112, 225, 0.05)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {getContent('packages_cta_contact_btn', 'Contact Us')}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
