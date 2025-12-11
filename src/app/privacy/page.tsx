import { Container, Typography, Box, Paper } from '@mui/material';

export default function PrivacyPage() {
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
            Privacy Policy
          </Typography>
        </Container>
      </Box>

      {/* Privacy Content */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            1. Information We Collect
          </Typography>
          <Typography paragraph>
            1.1. Personal Information: We collect information that you provide directly to us, including your name, email address, phone number, and payment information.
          </Typography>
          <Typography paragraph>
            1.2. Booking Information: Details about your cruise preferences, special requirements, and travel plans.
          </Typography>
          <Typography paragraph>
            1.3. Website Usage: Information about how you interact with our website, including IP address, browser type, and pages visited.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            2. How We Use Your Information
          </Typography>
          <Typography paragraph>
            2.1. To process your bookings and payments.
          </Typography>
          <Typography paragraph>
            2.2. To communicate with you about your bookings and provide customer support.
          </Typography>
          <Typography paragraph>
            2.3. To send you marketing communications (with your consent).
          </Typography>
          <Typography paragraph>
            2.4. To improve our website and services.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            3. Information Sharing
          </Typography>
          <Typography paragraph>
            3.1. We do not sell your personal information to third parties.
          </Typography>
          <Typography paragraph>
            3.2. We may share your information with:
          </Typography>
          <Typography paragraph>
            - Service providers who assist in operating our website and conducting our business
          </Typography>
          <Typography paragraph>
            - Legal authorities when required by law
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            4. Data Security
          </Typography>
          <Typography paragraph>
            4.1. We implement appropriate security measures to protect your personal information.
          </Typography>
          <Typography paragraph>
            4.2. We use secure servers and encryption for sensitive data.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            5. Your Rights
          </Typography>
          <Typography paragraph>
            5.1. You have the right to access, correct, or delete your personal information.
          </Typography>
          <Typography paragraph>
            5.2. You can opt-out of marketing communications at any time.
          </Typography>
          <Typography paragraph>
            5.3. You can request a copy of your personal data.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            6. Cookies
          </Typography>
          <Typography paragraph>
            6.1. We use cookies to improve your browsing experience and analyze website traffic.
          </Typography>
          <Typography paragraph>
            6.2. You can control cookie settings through your browser preferences.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            7. Changes to This Policy
          </Typography>
          <Typography paragraph>
            7.1. We may update this privacy policy from time to time.
          </Typography>
          <Typography paragraph>
            7.2. We will notify you of any significant changes via email or website notice.
          </Typography>

          <Typography variant="h4" sx={{ mb: 4, mt: 6 }}>
            8. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this privacy policy, please contact us at:
          </Typography>
          <Typography paragraph>
            Email: privacy@altavidatours.com
          </Typography>
          <Typography paragraph>
            Phone: +20 123 456 7890
          </Typography>
        </Paper>
      </Container>
    </main>
  );
} 

