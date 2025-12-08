'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, Chip } from '@mui/material';
import { 
  Star, 
  LocationOn, 
  People, 
  CheckCircle,
  Security,
  Support,
  Flight,
  Restaurant,
  Spa,
  TrendingUp,
  Award,
  Globe,
  DirectionsBoat,
  FitnessCenter
} from '@mui/icons-material';
import Link from 'next/link';
import LogoLoader from '@/components/ui/LogoLoader';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, packagesRes, destinationsRes] = await Promise.all([
          fetch('/api/travel-services?featured=true&limit=3'),
          fetch('/api/packages?featured=true&limit=3'),
          fetch('/api/destinations?featured=true&limit=6'),
        ]);

        if (servicesRes.ok && packagesRes.ok && destinationsRes.ok) {
          const servicesData = await servicesRes.json();
          const packagesData = await packagesRes.json();
          const destinationsData = await destinationsRes.json();
          setServices(servicesData.services?.slice(0, 3) || []);
          setPackages(packagesData.packages?.slice(0, 3) || []);
          setDestinations(destinationsData.destinations?.slice(0, 6) || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Continue with static fallbacks
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(59,130,246,0.1) 50%, rgba(16,185,129,0.1) 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/hero/global-travel.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4.5rem', lg: '6rem' },
              fontWeight: 'bold',
              mb: 3,
              background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 50%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(13,148,136,0.3)'
            }}
          >
            Discover the World with AltaVida
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.5rem', lg: '2rem' },
              mb: 4,
              opacity: 0.95,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.4
            }}
          >
Explore extraordinary destinations with curated luxury journeys, authentic cultural immersion, and seamless planning worldwide
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
From adventure to luxury escapes, we design personalized trips with premium stays, private guides, and unforgettable moments
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/packages"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#0A2FA6',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 4,
                minWidth: 220,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
Browse Packages
            </Button>
            <Button
              component={Link}
href="/destinations"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 4,
                borderWidth: 2,
                minWidth: 220,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderWidth: 2,
                  transform: 'translateY(-2px)'
                }
              }}
            >
Explore Destinations
            </Button>
          </Box>
        </Container>
      </Box>

{/* Featured Destinations Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
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
Featured Destinations
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
Discover our most loved places across the globe—iconic cities, hidden gems, and unforgettable landscapes
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {dahabiyas.length > 0 ? (
            dahabiyas.map((dahabiya: any) => (
              <Grid item xs={12} md={4} key={dahabiya.id}>
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
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        px: 2,
                        py: 1,
                        borderRadius: 2
                      }}
                    >
                      <Star sx={{ color: '#FFA500', fontSize: '1.1rem', mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        4.9
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                      {dahabiya.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <People sx={{ fontSize: '1.1rem', color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Up to {dahabiya.capacity || '8'} guests
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, height: '4.2em', overflow: 'hidden' }}>
                      {dahabiya.description?.substring(0, 120) || 'Experience luxury sailing on the Nile with premium amenities and personalized service.'}...
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          From
                        </Typography>
                        <Typography variant="h5" color="#1BAE70" fontWeight="bold">
                          ${dahabiya.pricePerNight || '450'}/night
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
                          fontWeight: 'bold'
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Static fallback dahabiyas
            [
              {
                id: 1,
                name: "Nefertiti Premium",
                capacity: 10,
                pricePerNight: 520,
                description: "Luxury dahabiya featuring panoramic suites, gourmet dining, and personalized concierge service for the ultimate Nile experience.",
                image: "/images/dahabiya-1.jpg"
              },
              {
                id: 2,
                name: "Cleopatra Royal",
                capacity: 8,
                pricePerNight: 475,
                description: "Intimate sailing yacht with traditional design, modern amenities, and dedicated crew ensuring exceptional comfort throughout your journey.",
                image: "/images/dahabiya-2.jpg"
              },
              {
                id: 3,
                name: "Pharaoh's Dream",
                capacity: 12,
                pricePerNight: 585,
                description: "Premium vessel offering spacious accommodations, fine dining, spa services, and curated cultural experiences along ancient Egypt.",
                image: "/images/dahabiya-3.jpg"
              }
            ].map((dahabiya) => (
              <Grid item xs={12} md={4} key={dahabiya.id}>
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
                      image={dahabiya.image}
                      alt={dahabiya.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        px: 2,
                        py: 1,
                        borderRadius: 2
                      }}
                    >
                      <Star sx={{ color: '#FFA500', fontSize: '1.1rem', mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        4.9
                      </Typography>
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

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, height: '4.2em', overflow: 'hidden' }}>
                      {dahabiya.description}...
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
                        href={`/dahabiyas`}
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2.5,
                          px: 3,
                          fontWeight: 'bold'
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            component={Link}
href="/destinations"
            variant="outlined"
            size="large"
            sx={{
              px: 6,
              py: 2,
              textTransform: 'none',
              borderRadius: 3,
              borderWidth: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': { borderWidth: 2 }
            }}
          >
Explore All Destinations
          </Button>
        </Box>
      </Container>

      {/* Featured Packages Section */}
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
              Signature Travel Experiences
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
Curated journeys combining premium stays, private guides, and authentic cultural immersion worldwide
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {packages.length > 0 ? (
              packages.map((pkg: any) => (
                <Grid item xs={12} md={4} key={pkg.id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={pkg.mainImage || pkg.images?.[0] || '/images/package-placeholder.jpg'}
                      alt={pkg.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                      <Chip
                        label={`${pkg.duration || '7'} Days`}
                        sx={{
                          bgcolor: '#1BAE70',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                        {pkg.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn sx={{ fontSize: '1.1rem', color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {pkg.destination || 'Luxor to Aswan'}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, height: '4.5em', overflow: 'hidden' }}>
                        {pkg.description?.substring(0, 140) || 'Comprehensive luxury journey featuring premium accommodations, expert guides, and cultural experiences.'}...
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Starting from
                          </Typography>
                          <Typography variant="h5" color="#1BAE70" fontWeight="bold">
                            ${pkg.price || '2,450'}
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
                            fontWeight: 'bold',
                            bgcolor: '#0B70E1'
                          }}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              // Static fallback packages
              [
                {
                  id: 1,
                  name: "Classic Nile Explorer",
                  duration: 8,
                  price: 2850,
                  destination: "Luxor to Aswan",
                  description: "Comprehensive luxury journey featuring premium dahabiya accommodation, expert Egyptologist guides, and exclusive temple access with gourmet dining throughout.",
                  image: "/images/package-1.jpg"
                },
                {
                  id: 2,
                  name: "Royal Egyptian Adventure",
                  duration: 12,
                  price: 4250,
                  destination: "Cairo to Luxor",
                  description: "Ultimate Egyptian experience combining luxury Nile cruise, Pyramids of Giza, Valley of Kings, premium hotels, and private cultural immersion experiences.",
                  image: "/images/package-2.jpg"
                },
                {
                  id: 3,
                  name: "Intimate Nile Romance",
                  duration: 6,
                  price: 2150,
                  destination: "Aswan Highlights",
                  description: "Perfect couples retreat featuring boutique dahabiya, private dining experiences, spa treatments, sunset felucca rides, and personalized temple tours.",
                  image: "/images/package-3.jpg"
                }
              ].map((pkg) => (
                <Grid item xs={12} md={4} key={pkg.id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={pkg.image}
                      alt={pkg.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                      <Chip
                        label={`${pkg.duration} Days`}
                        sx={{
                          bgcolor: '#1BAE70',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                        {pkg.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn sx={{ fontSize: '1.1rem', color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {pkg.destination}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, height: '4.5em', overflow: 'hidden' }}>
                        {pkg.description}...
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Starting from
                          </Typography>
                          <Typography variant="h5" color="#1BAE70" fontWeight="bold">
                            ${pkg.price}
                          </Typography>
                        </Box>
                        <Button
                          component={Link}
                          href={`/packages`}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2.5,
                            px: 3,
                            fontWeight: 'bold',
                            bgcolor: '#0B70E1'
                          }}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              component={Link}
              href="/packages"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 2,
                textTransform: 'none',
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: '#0B70E1'
              }}
            >
              View All Experiences
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
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
Why Travel With AltaVida
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
            Experience the difference with our commitment to luxury, safety, and creating unforgettable memories
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {[
            {
              icon: <CheckCircle sx={{ fontSize: '4rem', color: '#1BAE70' }} />,
              title: "Award-Winning Excellence",
              description: "Internationally recognized for luxury travel services and exceptional guest satisfaction ratings across all destinations."
            },
            {
              icon: <Security sx={{ fontSize: '4rem', color: '#0B70E1' }} />,
              title: "Safety & Security First",
              description: "Comprehensive safety protocols, experienced crew, and 24/7 monitoring ensuring your complete peace of mind throughout your journey."
            },
            {
              icon: <Support sx={{ fontSize: '4rem', color: '#FFA500' }} />,
              title: "Personalized Concierge",
              description: "Dedicated travel specialists providing customized itineraries and round-the-clock support for seamless luxury experiences."
            },
            {
              icon: <DirectionsBoat sx={{ fontSize: '4rem', color: '#0A2FA6' }} />,
title: "Tailored Planning",
description: "Expert planners tailoring every detail—from flights and stays to private guides and experiences—just for you."
            },
            {
              icon: <Restaurant sx={{ fontSize: '4rem', color: '#1BAE70' }} />,
              title: "Gourmet Dining",
              description: "World-class culinary experiences featuring local specialties and international cuisine prepared by expert chefs using finest ingredients."
            },
            {
              icon: <FitnessCenter sx={{ fontSize: '4rem', color: '#FFA500' }} />,
              title: "Wellness & Comfort",
              description: "Premium spa services, comfortable accommodations, and thoughtful amenities designed for your ultimate relaxation and rejuvenation."
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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

      {/* Testimonials Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1BAE70 0%, #0B70E1 100%)',
          color: 'white',
          py: { xs: 6, md: 10 }
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" component="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 3, fontWeight: 'bold' }}>
              Guest Experiences
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
Hear from travelers who explored the world with us—luxury stays, seamless logistics, and unforgettable experiences
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: "Sarah & Michael Chen",
                location: "San Francisco, USA",
                rating: 5,
                review: "Absolutely extraordinary experience! The dahabiya exceeded our expectations with impeccable service, gourmet cuisine, and breathtaking views. Our guide's expertise brought ancient Egypt to life. Planning our return trip already!"
              },
              {
                name: "Emma & James Thompson",
                location: "London, UK",
                rating: 5,
                review: "This luxury Nile cruise was the highlight of our honeymoon. From personalized service to stunning accommodations, every detail was perfect. The sunset dinners and private temple tours were unforgettable magical moments."
              },
              {
                name: "Dr. Hans & Ingrid Mueller",
                location: "Munich, Germany",
                rating: 5,
                review: "As frequent luxury travelers, we can confidently say this surpassed all expectations. The perfect blend of authentic culture, modern comfort, and exceptional hospitality. The intimate vessel made it feel like our private yacht."
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', mb: 3 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#FFA500', fontSize: '1.4rem' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', lineHeight: 1.7, color: 'white', fontSize: '1.1rem' }}>
                      "{testimonial.review}"
                    </Typography>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.85, color: 'white' }}>
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
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
            Ready for Your Dream Journey?
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
Join thousands of satisfied travelers who explore the world with personalized luxury journeys and seamless planning
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/packages"
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
              Explore Packages
            </Button>
            <Button
              component={Link}
href="/services"
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
Explore Services
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
