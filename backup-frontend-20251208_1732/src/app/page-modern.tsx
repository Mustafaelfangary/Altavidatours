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
  Globe
} from '@mui/icons-material';
import Link from 'next/link';
import LogoLoader from '@/components/ui/LogoLoader';

export default function HomePageModern() {
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
              fontSize: { xs: '1.3rem', md: '1.8rem', lg: '2.2rem' },
              mb: 4,
              color: '#1f2937',
              maxWidth: '900px',
              mx: 'auto',
              lineHeight: 1.4,
              fontWeight: 600
            }}
          >
            Experience extraordinary destinations with curated luxury journeys, authentic cultural immersion, and seamless planning worldwide
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              color: '#4b5563',
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.6
            }}
          >
            From adventure expeditions to luxury escapes, we design personalized trips with premium accommodations, expert guides, and unforgettable moments
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/packages"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                color: 'white',
                px: 6,
                py: 2.5,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 4,
                minWidth: 240,
                boxShadow: '0 8px 32px rgba(13,148,136,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(13,148,136,0.4)'
                }
              }}
            >
              ✈️ Explore Packages
            </Button>
            <Button
              component={Link}
              href="/destinations"
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#0d9488',
                color: '#0d9488',
                px: 6,
                py: 2.5,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 4,
                borderWidth: 3,
                minWidth: 240,
                '&:hover': {
                  borderColor: '#0d9488',
                  background: 'rgba(13,148,136,0.1)',
                  borderWidth: 3,
                  transform: 'translateY(-3px)'
                }
              }}
            >
              🌍 Browse Destinations
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Destinations Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: 4,
              background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            🌍 Featured Destinations
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
            Discover our most beloved destinations across the globe—iconic cities, hidden gems, and breathtaking landscapes waiting to be explored
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {destinations.length > 0 ? (
            destinations.map((destination: any) => (
              <Grid item xs={12} sm={6} md={4} key={destination.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 60px rgba(13,148,136,0.15)',
                      border: '2px solid rgba(13,148,136,0.3)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={destination.mainImage || destination.images?.[0] || '/images/destination-placeholder.jpg'}
                      alt={destination.name}
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
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Star sx={{ color: '#f59e0b', fontSize: '1.2rem', mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        4.8
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        bgcolor: 'rgba(13,148,136,0.9)',
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        🏖️ Beach Paradise
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                      {destination.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: '1.2rem', color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {destination.country || 'Beautiful Location'}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, height: '4.5em', overflow: 'hidden' }}>
                      {destination.description?.substring(0, 140) || 'Experience breathtaking landscapes, rich culture, and unforgettable adventures in this stunning destination.'}...
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Tours from
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#0d9488', fontWeight: 'bold' }}>
                          ${destination.priceFrom || '899'}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        href={`/destinations/${destination.slug || destination.id}`}
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          borderRadius: 3,
                          px: 4,
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        Explore
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Static fallback destinations
            [
              {
                id: 1,
                name: "Santorini, Greece",
                country: "Greece",
                priceFrom: 1299,
                description: "Experience the magical sunsets, white-washed buildings, and crystal-clear waters of this iconic Greek island paradise.",
                image: "/images/destinations/santorini.jpg"
              },
              {
                id: 2,
                name: "Bali, Indonesia",
                country: "Indonesia", 
                priceFrom: 899,
                description: "Discover tropical beaches, ancient temples, lush rice terraces, and vibrant culture in this enchanting island destination.",
                image: "/images/destinations/bali.jpg"
              },
              {
                id: 3,
                name: "Swiss Alps",
                country: "Switzerland",
                priceFrom: 1599,
                description: "Adventure through pristine mountain landscapes, charming villages, and world-class ski resorts in the heart of Europe.",
                image: "/images/destinations/swiss-alps.jpg"
              },
              {
                id: 4,
                name: "Tokyo, Japan",
                country: "Japan",
                priceFrom: 1199,
                description: "Immerse yourself in the perfect blend of ancient traditions and cutting-edge technology in this fascinating metropolis.",
                image: "/images/destinations/tokyo.jpg"
              },
              {
                id: 5,
                name: "Machu Picchu, Peru",
                country: "Peru",
                priceFrom: 1099,
                description: "Journey to the ancient Incan citadel nestled high in the Andes Mountains for an unforgettable archaeological adventure.",
                image: "/images/destinations/machu-picchu.jpg"
              },
              {
                id: 6,
                name: "Maldives",
                country: "Maldives",
                priceFrom: 1899,
                description: "Relax in overwater villas surrounded by pristine coral reefs and turquoise lagoons in this tropical paradise.",
                image: "/images/destinations/maldives.jpg"
              }
            ].map((destination) => (
              <Grid item xs={12} sm={6} md={4} key={destination.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 60px rgba(13,148,136,0.15)',
                      border: '2px solid rgba(13,148,136,0.3)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={destination.image}
                      alt={destination.name}
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
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Star sx={{ color: '#f59e0b', fontSize: '1.2rem', mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        4.8
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                      {destination.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: '1.2rem', color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {destination.country}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, height: '4.5em', overflow: 'hidden' }}>
                      {destination.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Tours from
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#0d9488', fontWeight: 'bold' }}>
                          ${destination.priceFrom}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        href={`/destinations`}
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          borderRadius: 3,
                          px: 4,
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        Explore
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Button
            component={Link}
            href="/destinations"
            variant="outlined"
            size="large"
            sx={{
              px: 8,
              py: 2.5,
              textTransform: 'none',
              borderRadius: 4,
              borderWidth: 3,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderColor: '#0d9488',
              color: '#0d9488',
              '&:hover': { 
                borderWidth: 3,
                background: 'rgba(13,148,136,0.1)',
                transform: 'scale(1.05)'
              }
            }}
          >
            🌍 Discover All Destinations
          </Button>
        </Box>
      </Container>

      {/* Featured Services Section */}
      <Box sx={{ bgcolor: 'rgba(13,148,136,0.02)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 'bold',
                mb: 4,
                background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ⚡ Our Premium Services
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
              From adventure expeditions to luxury wellness retreats, we offer specialized travel services tailored to your unique preferences and interests
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {services.length > 0 ? (
              services.map((service: any) => (
                <Grid item xs={12} md={4} key={service.id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.4s ease',
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 30px 70px rgba(59,130,246,0.15)',
                        border: '2px solid rgba(59,130,246,0.3)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="280"
                      image={service.mainImage || service.images?.[0] || '/images/service-placeholder.jpg'}
                      alt={service.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                      <Chip
                        label={`✨ ${service.category || 'Premium'}`}
                        sx={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                        {service.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <People sx={{ fontSize: '1.2rem', color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {service.type || 'Specialized Service'}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, height: '4.8em', overflow: 'hidden' }}>
                        {service.description?.substring(0, 160) || 'Experience our premium travel service designed with expert planning, personalized attention, and unforgettable moments.'}...
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Starting from
                          </Typography>
                          <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                            ${service.pricePerDay || '299'}/day
                          </Typography>
                        </Box>
                        <Button
                          component={Link}
                          href={`/services/${service.slug || service.id}`}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            borderRadius: 3,
                            px: 4,
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          Learn More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              // Static fallback services
              [
                {
                  id: 1,
                  name: "Adventure Expeditions",
                  category: "ADVENTURE",
                  type: "Outdoor Adventures",
                  pricePerDay: 399,
                  description: "Embark on thrilling adventures with expert guides, premium equipment, and carefully curated routes for unforgettable outdoor experiences.",
                  image: "/images/services/adventure.jpg"
                },
                {
                  id: 2,
                  name: "Luxury Wellness Retreats",
                  category: "LUXURY", 
                  type: "Wellness & Spa",
                  pricePerDay: 599,
                  description: "Rejuvenate your mind and body with premium spa treatments, yoga sessions, and holistic wellness programs in stunning locations.",
                  image: "/images/services/wellness.jpg"
                },
                {
                  id: 3,
                  name: "Cultural Immersion Tours",
                  category: "CULTURAL",
                  type: "Cultural Experiences", 
                  pricePerDay: 299,
                  description: "Discover authentic local cultures through exclusive access, expert local guides, and immersive experiences with local communities.",
                  image: "/images/services/cultural.jpg"
                }
              ].map((service) => (
                <Grid item xs={12} md={4} key={service.id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.4s ease',
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 30px 70px rgba(59,130,246,0.15)',
                        border: '2px solid rgba(59,130,246,0.3)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="280"
                      image={service.image}
                      alt={service.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                      <Chip
                        label={`✨ ${service.category}`}
                        sx={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                        {service.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <People sx={{ fontSize: '1.2rem', color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {service.type}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, height: '4.8em', overflow: 'hidden' }}>
                        {service.description}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Starting from
                          </Typography>
                          <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                            ${service.pricePerDay}/day
                          </Typography>
                        </Box>
                        <Button
                          component={Link}
                          href={`/services`}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            borderRadius: 3,
                            px: 4,
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          Learn More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Button
              component={Link}
              href="/services"
              variant="contained"
              size="large"
              sx={{
                px: 8,
                py: 2.5,
                textTransform: 'none',
                borderRadius: 4,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              ⚡ View All Services
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: 4,
              background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Why Choose AltaVida Tours
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
            Experience the difference with our commitment to excellence, personalized service, and creating memories that last a lifetime
          </Typography>
        </Box>

        <Grid container spacing={8}>
          {[
            {
              icon: <Award sx={{ fontSize: '4rem', color: '#f59e0b' }} />,
              title: "Award-Winning Excellence",
              description: "Internationally recognized for luxury travel services and exceptional guest satisfaction ratings across all destinations worldwide."
            },
            {
              icon: <Security sx={{ fontSize: '4rem', color: '#3b82f6' }} />,
              title: "Safety & Security First",
              description: "Comprehensive safety protocols, experienced guides, and 24/7 monitoring ensuring your complete peace of mind throughout your journey."
            },
            {
              icon: <Support sx={{ fontSize: '4rem', color: '#10b981' }} />,
              title: "Personalized Concierge",
              description: "Dedicated travel specialists providing customized itineraries and round-the-clock support for seamless luxury experiences."
            },
            {
              icon: <Globe sx={{ fontSize: '4rem', color: '#0d9488' }} />,
              title: "Global Network",
              description: "Extensive worldwide partnerships with premium hotels, local experts, and exclusive venues for unparalleled access and experiences."
            },
            {
              icon: <Restaurant sx={{ fontSize: '4rem', color: '#10b981' }} />,
              title: "Culinary Excellence",
              description: "World-class dining experiences featuring local specialties and international cuisine prepared by expert chefs using finest ingredients."
            },
            {
              icon: <Spa sx={{ fontSize: '4rem', color: '#f59e0b' }} />,
              title: "Luxury Comfort",
              description: "Premium accommodations, spa services, and thoughtful amenities designed for your ultimate relaxation and rejuvenation."
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 5,
                  height: '100%',
                  transition: 'all 0.4s ease',
                  borderRadius: 4,
                  border: '2px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 50px rgba(13,148,136,0.1)',
                    border: '2px solid rgba(13,148,136,0.2)',
                    background: 'rgba(13,148,136,0.02)'
                  }
                }}
              >
                <Box sx={{ mb: 4 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom sx={{ color: '#1f2937', mb: 3 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
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
          background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)',
          color: 'white',
          py: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h2" component="h2" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 4, fontWeight: 'bold' }}>
              💬 What Our Travelers Say
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
              Hear from adventurers who explored the world with us—luxury accommodations, seamless logistics, and life-changing experiences
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {[
              {
                name: "Emma & James Wilson",
                location: "London, United Kingdom",
                rating: 5,
                review: "Absolutely extraordinary experience! AltaVida exceeded our expectations with flawless planning, luxurious accommodations, and breathtaking destinations. Our travel specialist made everything seamless. Already planning our next adventure!"
              },
              {
                name: "Sarah & Michael Chen",
                location: "San Francisco, USA",
                rating: 5,
                review: "This was the trip of a lifetime! From the Swiss Alps to Santorini, every detail was perfectly orchestrated. The local guides were phenomenal and the accommodations were beyond luxurious. Highly recommend AltaVida!"
              },
              {
                name: "Dr. Hans & Ingrid Mueller",
                location: "Munich, Germany",
                rating: 5,
                review: "As frequent luxury travelers, we can confidently say AltaVida is exceptional. The perfect blend of authentic culture, modern comfort, and unparalleled service. Their attention to detail is remarkable."
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 5, fontStyle: 'italic', lineHeight: 1.8, color: 'white', fontSize: '1.1rem' }}>
                      "{testimonial.review}"
                    </Typography>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                        📍 {testimonial.location}
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
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 6, md: 10 },
            borderRadius: 5,
            background: 'linear-gradient(135deg, rgba(13,148,136,0.05) 0%, rgba(59,130,246,0.05) 100%)',
            border: '3px solid rgba(13,148,136,0.1)'
          }}
        >
          <Typography variant="h2" component="h2" fontWeight="bold" gutterBottom sx={{ 
            background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.2rem', md: '3rem' } 
          }}>
            ✈️ Ready for Your Dream Adventure?
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 8, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
            Join thousands of satisfied travelers who discover the world with personalized luxury journeys, expert planning, and unforgettable experiences
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/packages"
              variant="contained"
              size="large"
              sx={{
                px: 8,
                py: 3,
                textTransform: 'none',
                borderRadius: 4,
                minWidth: 240,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                boxShadow: '0 8px 32px rgba(13,148,136,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)',
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 12px 40px rgba(13,148,136,0.4)'
                }
              }}
            >
              🌟 Explore Packages
            </Button>
            <Button
              component={Link}
              href="/contact"
              variant="outlined"
              size="large"
              sx={{
                px: 8,
                py: 3,
                textTransform: 'none',
                borderRadius: 4,
                borderWidth: 3,
                minWidth: 240,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#3b82f6',
                borderColor: '#3b82f6',
                '&:hover': {
                  borderWidth: 3,
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateY(-3px) scale(1.05)'
                }
              }}
            >
              📞 Plan Your Trip
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
