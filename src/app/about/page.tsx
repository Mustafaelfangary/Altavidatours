"use client";
export const dynamic = "force-dynamic";

import { Container, Typography, Box, Card, CardContent, Avatar } from '@mui/material';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useContent } from '@/hooks/useContent';

// Dynamic team data from content management system
const getTeamMembers = (getContent: any) => [
  {
    name: getContent('about_team_member_1_name', 'Ashraf El Masry'),
    title: getContent('about_team_member_1_title', 'CEO & Founder'),
    image: getContent('about_team_member_1_image', '/images/team/ashraf.jpg'),
    bio: getContent('about_team_member_1_bio', 'With over 20 years of experience in Egyptian tourism...'),
    social: { facebook: "#", twitter: "#", instagram: "#" }
  },
  {
    name: getContent('about_team_member_2_name', 'Ahmed Abdellah'),
    title: getContent('about_team_member_2_title', 'Operations Manager'),
    image: getContent('about_team_member_2_image', '/images/team/ahmed.jpg'),
    bio: getContent('about_team_member_2_bio', 'Ahmed ensures every cruise runs smoothly...'),
    social: { facebook: "#", twitter: "#", instagram: "#" }
  },
  {
    name: getContent('about_team_member_3_name', 'Captain Gomaa'),
    title: getContent('about_team_member_3_title', 'Master Captain'),
    image: getContent('about_team_member_3_image', '/images/team/gomaa.jpg'),
    bio: getContent('about_team_member_3_bio', 'With decades of experience navigating the Nile...'),
    social: { facebook: "#", twitter: "#", instagram: "#" }
  },
  {
    name: getContent('about_team_member_4_name', 'Abdelrehim'),
    title: getContent('about_team_member_4_title', 'Captain Assistant'),
    image: getContent('about_team_member_4_image', '/images/team/abdo.jpg'),
    bio: getContent('about_team_member_4_bio', 'Abdelrehim supports our captain with technical expertise...'),
    social: { facebook: "#", twitter: "#", instagram: "#" }
  },
  {
    name: getContent('about_team_member_5_name', 'Chef Mohamed'),
    title: getContent('about_team_member_5_title', 'Executive Chef'),
    image: getContent('about_team_member_5_image', '/images/team/chef.jpg'),
    bio: getContent('about_team_member_5_bio', 'Mohamed creates exquisite Egyptian and international cuisine...'),
    social: { facebook: "#", twitter: "#", instagram: "#" }
  },
  {
    name: getContent('about_team_member_6_name', 'Adham'),
    title: getContent('about_team_member_6_title', 'Guest Services'),
    image: getContent('about_team_member_6_image', '/images/team/adham.jpg'),
    bio: getContent('about_team_member_6_bio', 'Adham ensures exceptional hospitality...'),
    social: { facebook: "#", twitter: "#", instagram: "#" }
  },
  {
    name: getContent('about_team_member_7_name', 'Youssef'),
    title: getContent('about_team_member_7_title', 'Senior Sailor'),
    image: getContent('about_team_member_7_image', '/images/team/youssef.jpg'),
    bio: getContent('about_team_member_7_bio', 'Youssef brings years of sailing expertise...'),
    social: { facebook: "#", twitter: "#", instagram: "#" }
  }
];

export default function AboutPage() {
  const { getContent, getContentBlock, loading, error } = useContent({ page: 'about' });

  // Get dynamic team members
  const teamMembers = getTeamMembers(getContent);

  if (loading) {
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

  return (
    <main className="min-h-screen bg-linear-to-b from-ancient-stone/10 to-papyrus/5">
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          height: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          color: 'white',
          background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-pharaoh-gold rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white/30 rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pharaoh-gold/20 rounded-full animate-pulse"></div>
        </div>
        
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <AnimatedSection animation="slide-up">
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {getContent('about_hero_title', 'About Us')}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                maxWidth: '600px',
                lineHeight: 1.6
              }}
            >
              {getContent('about_hero_subtitle', 'Discover the magic of ancient Egypt through authentic Dahabiya experiences')}
            </Typography>
          </AnimatedSection>
        </Container>
      </Box>

      {/* What is Dahabiya Section */}
      <Container sx={{ py: 8 }}>
        <AnimatedSection animation="slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 800,
                  mb: 3,
                  color: 'hsl(210, 85%, 25%)'
                }}
              >
                {getContent('about_dahabiya_title', 'What is Dahabiya')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  color: 'text.secondary'
                }}
              >
                {getContent('about_dahabiya_content', 'Sailing down the Nile in Egypt has always been on my \'to do\' list. When I finally got the chance to tick it off that list, it easily lived up to my expectations. Egypt is struggling for tourists right now and I was happy to work with Djed Egypt Travel and get on board one of their beautiful Dahabiya Boats to sail up the Nile from Esna to Aswan.')}
              </Typography>
            </div>
            <div>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                <Image
                  src={getContent('about_dahabiya_image', '/images/princess-cleopatra-6.jpg')}
                  alt="Princess Cleopatra Dahabiya"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
            </div>
          </div>
        </AnimatedSection>
      </Container>

      {/* Why Dahabiya Section */}
      <Box sx={{ bgcolor: 'hsl(210, 85%, 25%)', color: 'white', py: 8 }}>
        <Container>
          <AnimatedSection animation="slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <Image
                    src={getContent('about_why_image', '/images/royal-cleopatra-6.jpg')}
                    alt="Royal Cleopatra Dahabiya"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </div>
              <div>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 800,
                    mb: 3,
                    color: 'hsl(43, 85%, 58%)'
                  }}
                >
                  {getContent('about_why_title', 'Why Dahabiya')}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    opacity: 0.9
                  }}
                >
                  {getContent('about_why_content', 'We are a premier travel and tours agency in Egypt, dedicated to providing exceptional travel experiences. From the iconic Pyramids of Giza to the Grand Egyptian Museum, from the ancient temples of Luxor to the Mediterranean beauty of Alexandria, we offer expertly guided tours that showcase the best of Egypt. Our professional Egyptologist guides, comfortable transportation, and carefully curated itineraries ensure you discover the wonders of ancient and modern Egypt in comfort and style.')}
                </Typography>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Box>

      {/* Founder Section */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <AnimatedSection animation="slide-up">
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 3,
                border: '4px solid hsl(43, 85%, 58%)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <Image
                src={getContent('about_founder_image', '/images/team/ashraf.jpg')}
                alt="Ashraf Elmasry"
                width={120}
                height={120}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                mb: 1,
                color: 'hsl(210, 85%, 25%)'
              }}
            >
              {getContent('about_founder_name', 'Ashraf Elmasry')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'hsl(43, 85%, 58%)',
                fontWeight: 600
              }}
            >
              {getContent('about_founder_title', 'Founder')}
            </Typography>
          </Box>
        </AnimatedSection>
      </Container>

      {/* Enhanced Leadership Team Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, hsl(43, 85%, 98%) 0%, hsl(210, 85%, 98%) 100%)',
        py: 10,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border-4 border-pharaoh-gold rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-deep-nile-blue rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pharaoh-gold/20 rounded-full animate-pulse"></div>
        </div>

        <Container>
          <AnimatedSection animation="slide-up">
            {/* Section Header */}
            <div className="text-center mb-12">
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  animation: 'fadeInUp 1s ease-out'
                }}
              >
                {getContent('about_team_title', 'Meet Our Expert Team')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'hsl(210, 85%, 35%)',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  animation: 'fadeInUp 1s ease-out 0.2s both'
                }}
              >
                {getContent('about_team_subtitle', 'Our passionate team of professionals is dedicated to providing you with an unforgettable Egypt travel experience.')}
              </Typography>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedSection key={index} animation="fade-in" delay={index * 0.1}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      borderRadius: 6,
                      background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(210, 185, 125, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-15px) scale(1.02)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                        '& .team-image': {
                          transform: 'scale(1.1)',
                          filter: 'brightness(1.1)'
                        },
                        '& .team-overlay': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
                        borderRadius: '6px 6px 0 0'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, pb: 3 }}>
                      {/* Enhanced Circular Image */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 3,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '4px solid transparent',
                          background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
                          padding: '4px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                          '&:hover': {
                            boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="team-image"
                            style={{
                              objectFit: 'cover',
                              transition: 'all 0.4s ease'
                            }}
                          />
                          {/* Hover overlay */}
                          <Box
                            className="team-overlay"
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(135deg, rgba(33, 82, 135, 0.8) 0%, rgba(210, 185, 125, 0.8) 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transform: 'translateY(100%)',
                              transition: 'all 0.4s ease',
                              borderRadius: '50%'
                            }}
                          >
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                sx={{
                                  color: 'white',
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <Facebook fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: 'white',
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <Instagram fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      {/* Member Info */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'var(--font-playfair)',
                          fontWeight: 700,
                          mb: 1,
                          background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: '1.3rem'
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'hsl(43, 85%, 58%)',
                          fontWeight: 600,
                          mb: 2,
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {member.title}
                      </Typography>

                      {/* Bio Text */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'hsl(210, 85%, 45%)',
                          lineHeight: 1.6,
                          fontSize: '0.9rem',
                          opacity: 0.8
                        }}
                      >
                        {member.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </Box>
    </main>
  );
}


