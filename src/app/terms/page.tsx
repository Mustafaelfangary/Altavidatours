import { Container, Typography, Box, Paper } from '@mui/material';

export default function TermsPage() {
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
            Terms and Conditions
          </Typography>
        </Container>
      </Box>

      {/* Terms Content */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            1. Booking and Payment
          </Typography>
          <Typography paragraph>
            1.1. All bookings are subject to availability and confirmation by Cleopatra Dahabiya.
          </Typography>
          <Typography paragraph>
            1.2. A deposit of 30% of the total booking value is required to secure your reservation.
          </Typography>
          <Typography paragraph>
            1.3. Full payment must be received at least 30 days before the cruise departure date.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            2. Cancellation Policy
          </Typography>
          <Typography paragraph>
            2.1. Cancellations made more than 30 days before departure: Full refund minus administrative fees.
          </Typography>
          <Typography paragraph>
            2.2. Cancellations made 15-29 days before departure: 50% refund.
          </Typography>
          <Typography paragraph>
            2.3. Cancellations made less than 14 days before departure: No refund.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            3. Travel Insurance
          </Typography>
          <Typography paragraph>
            3.1. We strongly recommend that all passengers obtain comprehensive travel insurance.
          </Typography>
          <Typography paragraph>
            3.2. Insurance should cover medical expenses, trip cancellation, and personal belongings.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            4. Health and Safety
          </Typography>
          <Typography paragraph>
            4.1. Passengers must declare any medical conditions or special requirements at the time of booking.
          </Typography>
          <Typography paragraph>
            4.2. We reserve the right to refuse boarding to any passenger who may pose a risk to themselves or others.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            5. Itinerary Changes
          </Typography>
          <Typography paragraph>
            5.1. We reserve the right to modify itineraries due to weather conditions, water levels, or other circumstances beyond our control.
          </Typography>
          <Typography paragraph>
            5.2. Alternative arrangements will be made where possible, but no compensation will be offered for changes beyond our control.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            6. Liability
          </Typography>
          <Typography paragraph>
            6.1. Cleopatra Dahabiya is not liable for any loss, damage, or injury that occurs during the cruise.
          </Typography>
          <Typography paragraph>
            6.2. Passengers are responsible for their personal belongings and safety during shore excursions.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            7. Force Majeure
          </Typography>
          <Typography paragraph>
            7.1. We are not liable for any failure to perform our obligations due to circumstances beyond our reasonable control.
          </Typography>
          <Typography paragraph>
            7.2. Such circumstances include but are not limited to war, civil unrest, natural disasters, and government actions.
          </Typography>
        </Paper>
      </Container>
    </main>
  );
} 

