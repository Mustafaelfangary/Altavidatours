"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface BookingFormProps {
  dahabiyaId: string;
  price: number | string;
  minDays?: number;
  duration?: number;
}

export default function BookingForm({ dahabiyaId, price, minDays = 1, duration }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Start from tomorrow

  const calculateTotalPrice = (start: Date, end: Date, guestCount: number): number => {
    if (!start || !end || !guestCount) return 0;
    
    if (duration) {
      // For packages, use fixed duration and price
      return Number(price) * guestCount;
    }
    // For cruises, calculate based on days
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Number(price) * days * guestCount;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!startDate || !endDate || !guests) {
      toast.error("Please fill in all required fields");
      return;
    }

    const start = new Date(startDate);
    const end = duration 
      ? new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000))
      : new Date(endDate);
    
    const totalPrice = calculateTotalPrice(start, end, guests);
    
    if (totalPrice <= 0) {
      toast.error("Invalid booking details");
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        dahabiyaId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        guests,
        specialRequests,
        totalPrice: Number(totalPrice)
      };
      
      console.log('Submitting booking data:', bookingData);
      
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to create booking');
      }

      toast.success("Booking created successfully!");
      router.push("/dashboard/bookings");
      router.refresh();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };
  
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium mb-1">
          Start Date
        </label>
        <Input
          id="startDate"
          type="date"
          required
          min={today}
          max={maxDateStr}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            if (e.target.value && endDate && new Date(e.target.value) >= new Date(endDate)) {
              const nextDay = new Date(e.target.value);
              nextDay.setDate(nextDay.getDate() + minDays);
              setEndDate(nextDay.toISOString().split("T")[0]);
            }
          }}
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium mb-1">
          End Date
        </label>
        <Input
          id="endDate"
          type="date"
          required
          min={startDate || today}
          max={maxDateStr}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="guests" className="block text-sm font-medium mb-1">
          Number of Guests
        </label>
        <Input
          id="guests"
          type="number"
          required
          min={1}
          max={10}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium mb-1">
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          className="w-full rounded-md border p-2 min-h-[100px]"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any dietary requirements or special requests..."
          maxLength={1000}
        />
      </div>

      {startDate && endDate && guests > 0 && (
        <div className="text-lg font-semibold text-center">
          Total Price: ${calculateTotalPrice(new Date(startDate), new Date(endDate), guests).toFixed(2)}
        </div>
      )}

      {!session ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push("/auth/signin")}
        >
          Sign In to Book
        </Button>
      ) : (
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : "Book Now"}
        </Button>
      )}
    </form>
  );
}
