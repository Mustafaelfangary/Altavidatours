"use client";

import { useState } from "react";
import { Status } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BookingStatusFormProps {
  booking: {
    id: string;
    status: Status;
  };
}

export default function BookingStatusForm({ booking }: BookingStatusFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (newStatus: Status) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      toast.success("Booking status updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update booking status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Update Booking Status</h2>
      <div className="flex flex-wrap gap-2">
        {Object.values(Status).map((status) => (
          <Button
            key={status}
            onClick={() => updateStatus(status)}
            disabled={isLoading || booking.status === status}
            variant={booking.status === status ? "primary" : "secondary"}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
}
