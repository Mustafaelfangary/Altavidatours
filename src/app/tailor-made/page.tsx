'use client';

import { Container, Typography, Box, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import { AnimatedSection, StaggeredAnimation, FloatingElement } from '@/components/ui/animated-section';
import Navbar from '@/components/Navbar';
import { useContent } from '@/hooks/useContent';



export default function TailorMadePage() {
  const { getContent, getContentBlock, loading: contentLoading, error } = useContent({ page: 'tailor-made' });

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

  // Dynamic features array from content
  const features = [
    {
      title: getContent('tailor-made_feature_1_title', 'Personalized Itinerary'),
      description: getContent('tailor-made_feature_1_description', 'Design your perfect journey with our expert travel consultants. Choose your destinations, activities, and pace.'),
      icon: '🗺️',
    },
    {
      title: getContent('tailor-made_feature_2_title', 'Luxury Accommodations'),
      description: getContent('tailor-made_feature_2_description', 'Select from our finest dahabiya boats and premium hotels to match your comfort preferences.'),
      icon: '🏛️',
    },
    {
      title: getContent('tailor-made_feature_3_title', 'Private Experiences'),
      description: getContent('tailor-made_feature_3_description', 'Enjoy exclusive access to archaeological sites, private dining, and personalized cultural encounters.'),
      icon: '👑',
    },
    {
      title: getContent('tailor-made_feature_4_title', 'Expert Guides'),
      description: getContent('tailor-made_feature_4_description', 'Travel with our most experienced Egyptologists and local guides for deeper cultural insights.'),
      icon: '🎓',
    },
    {
      title: getContent('tailor-made_feature_5_title', 'Flexible Duration'),
      description: getContent('tailor-made_feature_5_description', 'From intimate 3-day escapes to comprehensive 14-day odysseys, we craft the perfect length for you.'),
      icon: '⏰',
    },
    {
      title: getContent('tailor-made_feature_6_title', 'Special Occasions'),
      description: getContent('tailor-made_feature_6_description', 'Celebrate anniversaries, honeymoons, or special milestones with our bespoke celebration packages.'),
      icon: '🎉',
    },
  ];

  // Dynamic steps array from content
  const steps = [
    {
      step: '01',
      title: getContent('tailor-made_step_1_title', 'Consultation'),
      description: getContent('tailor-made_step_1_description', 'Share your dreams and preferences with our travel experts during a personalized consultation.'),
    },
    {
      step: '02',
      title: getContent('tailor-made_step_2_title', 'Design'),
      description: getContent('tailor-made_step_2_description', 'We craft a unique itinerary tailored to your interests, budget, and travel style.'),
    },
    {
      step: '03',
      title: getContent('tailor-made_step_3_title', 'Refinement'),
      description: getContent('tailor-made_step_3_description', 'Review and refine your journey until every detail meets your expectations.'),
    },
    {
      step: '04',
      title: getContent('tailor-made_step_4_title', 'Experience'),
      description: getContent('tailor-made_step_4_description', 'Embark on your perfectly crafted Nile adventure with our dedicated support.'),
    },
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(210, 80%, 35%) 50%, hsl(43, 85%, 58%) 100%)',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/images/papyrus-texture.png") repeat',
            opacity: 0.1,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <AnimatedSection animation="fade-in">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                mb: 3,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {getContent('tailor-made_hero_title', 'Tailor-Made Nile Cruises')}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {getContent('tailor-made_hero_subtitle', 'Create your perfect Egyptian adventure with our bespoke cruise experiences. Every journey is uniquely crafted to match your dreams and desires.')}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, hsl(43, 85%, 58%) 0%, hsl(43, 90%, 48%) 100%)',
                  color: 'hsl(210, 15%, 15%)',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 24px rgba(43, 85%, 58%, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, hsl(43, 90%, 48%) 0%, hsl(25, 85%, 65%) 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(43, 85%, 58%, 0.5)',
                  },
                }}
              >
                {getContent('tailor-made_hero_button', 'Start Planning Your Journey')}
              </Button>
            </Box>
          </AnimatedSection>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <AnimatedSection animation="slide-up">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
              color: 'hsl(210, 85%, 25%)',
              fontWeight: 600,
            }}
          >
            {getContent('tailor-made_features_title', 'Why Choose Tailor-Made?')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'hsl(210, 10%, 45%)',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Experience Egypt your way with our completely customizable cruise packages
          </Typography>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
              <Card
                  sx={{
                    height: '100%',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ fontSize: '3rem', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: 'hsl(210, 85%, 25%)',
                        fontWeight: 600,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'hsl(210, 10%, 45%)',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
            </AnimatedSection>
          ))}
        </div>
      </Container>

      {/* Process Section */}
      <Box sx={{ background: 'hsl(35, 15%, 95%)', py: 8 }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="slide-up">
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 2,
                color: 'hsl(210, 85%, 25%)',
                fontWeight: 600,
              }}
            >
              {getContent('tailor-made_process_title', 'How It Works')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: 'hsl(210, 10%, 45%)',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Our simple 4-step process to create your perfect Nile cruise experience
            </Typography>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <AnimatedSection key={index} animation="slide-up" delay={index * 150}>
                  <Box sx={{ textAlign: 'center' }}>
                    <FloatingElement intensity={0.5}>
                      <Paper
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(210, 80%, 35%) 100%)',
                          color: 'white',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          boxShadow: '0 8px 24px rgba(210, 85%, 25%, 0.3)',
                        }}
                      >
                        {step.step}
                      </Paper>
                    </FloatingElement>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: 'hsl(210, 85%, 25%)',
                        fontWeight: 600,
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'hsl(210, 10%, 45%)',
                        lineHeight: 1.6,
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </AnimatedSection>
            ))}
          </div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <AnimatedSection animation="scale-in">
          <Paper
            sx={{
              background: 'linear-gradient(135deg, hsl(210, 85%, 25%) 0%, hsl(43, 85%, 58%) 100%)',
              borderRadius: '2rem',
              p: 6,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 600,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              {getContent('tailor-made_cta_title', 'Ready to Create Your Dream Journey?')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              {getContent('tailor-made_cta_description', 'Contact our travel experts today and let us craft the perfect Nile cruise experience just for you.')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'white',
                color: 'hsl(210, 85%, 25%)',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '0.75rem',
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.95)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(255, 255, 255, 0.4)',
                },
              }}
            >
              {getContent('tailor-made_cta_button', 'Get Started Today')}
            </Button>
          </Paper>
        </AnimatedSection>
      </Container>
    </>
  );
}
