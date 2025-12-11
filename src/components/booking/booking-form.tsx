import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface BookingFormProps {
  cruiseId: string;
}

export function BookingForm({ cruiseId }: BookingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const [formData, setFormData] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    guests: 1,
    specialRequests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setShowLoginDialog(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cruiseId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(date) => setFormData({ ...formData, startDate: date })}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={formData.endDate}
            onChange={(date) => setFormData({ ...formData, endDate: date })}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />
        </div>
      </LocalizationProvider>

      <TextField
        label="Number of Guests"
        type="number"
        fullWidth
        required
        value={formData.guests}
        onChange={(e) =>
          setFormData({ ...formData, guests: parseInt(e.target.value) })
        }
        inputProps={{ min: 1 }}
      />

      <TextField
        label="Special Requests"
        multiline
        rows={4}
        fullWidth
        value={formData.specialRequests}
        onChange={(e) =>
          setFormData({ ...formData, specialRequests: e.target.value })
        }
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Book Now'}
      </Button>

      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle>Sign In Required</DialogTitle>
        <DialogContent>
          <p>Please sign in to make a booking.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 

