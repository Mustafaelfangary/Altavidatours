import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Rating } from '@mui/material';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'United States',
    rating: 5,
    date: '2024-02-15',
    image: '/images/testimonials/sarah.jpg',
    text: 'An unforgettable experience! The dahabiya was beautiful, the crew was exceptional, and the historical sites were breathtaking. The small group size made it feel like a private tour.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Australia',
    rating: 5,
    date: '2024-01-20',
    image: '/images/testimonials/michael.jpg',
    text: 'The perfect blend of luxury and authenticity. The food was amazing, the cabins were comfortable, and the guides were incredibly knowledgeable. Highly recommend!',
  },
  {
    id: 3,
    name: 'Emma Thompson',
    location: 'United Kingdom',
    rating: 5,
    date: '2024-01-05',
    image: '/images/testimonials/emma.jpg',
    text: 'A magical journey down the Nile. The sunset views were spectacular, and the small boat experience allowed us to visit places the larger ships can\'t reach.',
  },
  {
    id: 4,
    name: 'David Rodriguez',
    location: 'Spain',
    rating: 5,
    date: '2023-12-10',
    image: '/images/testimonials/david.jpg',
    text: 'The attention to detail was impressive. From the welcome drinks to the farewell dinner, every moment was carefully planned and executed perfectly.',
  },
  {
    id: 5,
    name: 'Sophie Martin',
    location: 'France',
    rating: 5,
    date: '2023-11-25',
    image: '/images/testimonials/sophie.jpg',
    text: 'The crew went above and beyond to make our trip special. The traditional music nights and cooking demonstrations were highlights of our journey.',
  },
  {
    id: 6,
    name: 'James Wilson',
    location: 'Canada',
    rating: 5,
    date: '2023-11-10',
    image: '/images/testimonials/james.jpg',
    text: 'A once-in-a-lifetime experience. The combination of luxury, history, and natural beauty made this trip truly unforgettable.',
  },
];

export default function TestimonialsPage() {
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
            Guest Reviews
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            What our guests say about their experience
          </Typography>
        </Container>
      </Box>

      {/* Testimonials Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container component="div" spacing={4}>
          {testimonials.map((testimonial) => (
            <Box key={testimonial.id} sx={{ width: '100%', maxWidth: 600, flex: '1 1 300px' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">{testimonial.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" paragraph>
                    {testimonial.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Container>
    </main>
  );
} 

