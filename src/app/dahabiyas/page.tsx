'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Typography, Box, Button, Card, CardMedia, CardContent, Grid, Chip, TextField, InputAdornment } from '@mui/material';
import { Search, LocationOn, Star, People, CheckCircle, Security, Support } from '@mui/icons-material';
import LogoLoader from '@/components/ui/LogoLoader';
import { useContent } from '@/hooks/useContent';

interface Dahabiya {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  capacity: number;
  pricePerNight: number;
  mainImage?: string;
  images?: string[];
  slug?: string;
  category?: string;
  amenities?: string[];
}

export default function DahabiyasPage() {
  const { getContent } = useContent({ page: 'dahabiyas' });
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDahabiyas, setFilteredDahabiyas] = useState<Dahabiya[]>([]);

  useEffect(() => {
    const fetchDahabiyas = async () => {
      try {
        const response = await fetch('/api/dahabiyas');
        if (response.ok) {
          const data = await response.json();
          const dahabiyaData = data.dahabiyas || data || [];
          setDahabiyas(dahabiyaData);
          setFilteredDahabiyas(dahabiyaData);
        }
      } catch (error) {
        console.error('Error fetching dahabiyas:', error);
        // Static fallback dahabiyas
        const fallbackDahabiyas = [
          {
            id: '1',
            name: 'Nefertiti Premium',
            capacity: 10,
            pricePerNight: 520,
            description: 'Luxury dahabiya featuring panoramic suites, gourmet dining, and personalized concierge service for the ultimate Nile experience.',
            mainImage: '/images/Royal Cleopatra/DSC_8568.jpg',
            category: 'Premium',
            amenities: ['Spa', 'Gourmet Dining', 'Private Suites']
          },
          {
            id: '2',
            name: 'Cleopatra Royal',
            capacity: 8,
            pricePerNight: 475,
            description: 'Intimate sailing yacht with traditional design, modern amenities, and dedicated crew ensuring exceptional comfort throughout your journey.',
            mainImage: '/images/Princess Cleopatra Dahabiya (1).jpg',
            category: 'Luxury',
            amenities: ['Traditional Design', 'Modern Amenities', 'Dedicated Crew']
          },
          {
            id: '3',
            name: "Pharaoh's Dream",
            capacity: 12,
            pricePerNight: 585,
            description: 'Premium vessel offering spacious accommodations, fine dining, spa services, and curated cultural experiences along ancient Egypt.',
            mainImage: '/images/Princess Cleopatra Dahabiya (2).jpg',
            category: 'Premium',
            amenities: ['Spa Services', 'Fine Dining', 'Cultural Experiences']
          },
          {
            id: '4',
            name: 'Isis Luxury',
            capacity: 6,
            pricePerNight: 395,
            description: 'Elegant boutique vessel perfect for intimate groups, featuring personalized service and authentic Egyptian hospitality.',
            mainImage: '/images/Princess Cleopatra Dahabiya (3).jpg',
            category: 'Boutique',
            amenities: ['Intimate Setting', 'Personalized Service', 'Authentic Experience']
          },
          {
            id: '5',
            name: 'Hatshepsut Grand',
            capacity: 14,
            pricePerNight: 650,
            description: 'The flagship of our fleet, offering unparalleled luxury with presidential suites, master chef cuisine, and exclusive excursions.',
            mainImage: '/images/Royal Cleopatra Dahabiya (1).jpg',
            category: 'Premium',
            amenities: ['Presidential Suites', 'Master Chef', 'Exclusive Excursions']
          },
          {
            id: '6',
            name: 'Ra Explorer',
            capacity: 10,
            pricePerNight: 445,
            description: 'Adventure-focused dahabiya combining luxury comfort with unique experiences including hot air balloon rides and desert excursions.',
            mainImage: '/images/Royal Cleopatra Dahabiya (2).jpg',
            category: 'Adventure',
            amenities: ['Adventure Activities', 'Hot Air Balloon', 'Desert Excursions']
          }
        ];
        setDahabiyas(fallbackDahabiyas);
        setFilteredDahabiyas(fallbackDahabiyas);
      } finally {
        setLoading(false);
      }
    };

    fetchDahabiyas();
  }, []);

  useEffect(() => {
    const filtered = dahabiyas.filter(dahabiya => 
      dahabiya.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dahabiya.category && dahabiya.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dahabiya.description && dahabiya.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredDahabiyas(filtered);
  }, [searchTerm, dahabiyas]);

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
            backgroundImage: 'url(/images/Royal Cleopatra/DSC_8502.jpg)',
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
            {getContent('dahabiyas_hero_title', 'Luxury Dahabiya Fleet')}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.8rem' },
              mb: 4,
              opacity: 0.95,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.4
            }}
          >
            {getContent('dahabiyas_hero_subtitle', 'Premium Traditional Sailing Vessels on the Nile')}
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
            {getContent('dahabiyas_hero_description', 'Handcrafted dahabiyas combining authentic Egyptian heritage with modern luxury amenities')}
          </Typography>
        </Container>
      </Box>

      {/* Search & Filter Section */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TextField
            variant="outlined"
            placeholder={getContent('dahabiyas_search_placeholder', 'Search dahabiyas by name, category, or amenities...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: 600,
              width: '100%',
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
          {filteredDahabiyas.length} {filteredDahabiyas.length === 1 ? getContent('dahabiyas_vessel_singular', 'vessel') : getContent('dahabiyas_vessel_plural', 'vessels')} {getContent('dahabiyas_in_fleet', 'in our fleet')}
        </Typography>
      </Container>

      {/* Dahabiyas Grid */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {filteredDahabiyas.map((dahabiya) => (
            <Grid item xs={12} md={6} lg={4} key={dahabiya.id}>
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
                    image={dahabiya.mainImage || dahabiya.images?.[0] || '/images/dahabiya-placeholder.jpg'}
                    alt={dahabiya.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                    <Chip
                      label={dahabiya.category || 'Luxury'}
                      sx={{
                        bgcolor: dahabiya.category === 'Premium' ? '#1BAE70' : 
                              dahabiya.category === 'Adventure' ? '#FFA500' :
                              dahabiya.category === 'Boutique' ? '#9C27B0' : '#0B70E1',
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
                        4.9
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    {dahabiya.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ fontSize: '1.1rem', color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Up to {dahabiya.capacity} guests
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    {dahabiya.amenities?.slice(0, 3).map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        size="small"
                        sx={{
                          mr: 1,
                          mb: 1,
                          bgcolor: 'rgba(27, 174, 112, 0.1)',
                          color: '#1BAE70',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, height: '4.2em', overflow: 'hidden' }}>
                    {dahabiya.shortDescription || dahabiya.description?.substring(0, 120) || 'Experience luxury sailing on the Nile with premium amenities and personalized service.'}...
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        From
                      </Typography>
                      <Typography variant="h5" color="#1BAE70" fontWeight="bold">
                        ${dahabiya.pricePerNight}/night
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      href={`/dahabiyas/${dahabiya.slug || dahabiya.id}`}
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
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Fleet Advantages Section */}
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
              {getContent('dahabiyas_advantages_title', 'Why Choose Our Dahabiya Fleet')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
              {getContent('dahabiyas_advantages_subtitle', 'Traditional sailing vessels that offer authentic Nile experiences with modern luxury standards')}
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {[
              {
                icon: <CheckCircle sx={{ fontSize: '4rem', color: '#1BAE70' }} />,
                title: getContent('dahabiyas_advantage_1_title', 'Authentic Traditional Design'),
                description: getContent('dahabiyas_advantage_1_description', 'Handcrafted dahabiyas built using traditional methods while incorporating modern safety and comfort features.')
              },
              {
                icon: <Security sx={{ fontSize: '4rem', color: '#0B70E1' }} />,
                title: getContent('dahabiyas_advantage_2_title', 'Premium Safety Standards'),
                description: getContent('dahabiyas_advantage_2_description', 'All vessels meet international maritime safety standards with modern navigation equipment and emergency protocols.')
              },
              {
                icon: <Support sx={{ fontSize: '4rem', color: '#FFA500' }} />,
                title: getContent('dahabiyas_advantage_3_title', 'Expert Crew & Guides'),
                description: getContent('dahabiyas_advantage_3_description', 'Experienced captains and certified Egyptologist guides providing personalized service and cultural insights.')
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
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
              </Grid>
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
            {getContent('dahabiyas_cta_title', 'Ready to Board Your Dahabiya?')}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
            {getContent('dahabiyas_cta_description', 'Experience the timeless elegance of traditional Nile sailing with modern luxury accommodations')}
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
              {getContent('dahabiyas_cta_book_btn', 'Book Your Cruise')}
            </Button>
            <Button
              component={Link}
              href="/packages"
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
              {getContent('dahabiyas_cta_packages_btn', 'View Packages')}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
