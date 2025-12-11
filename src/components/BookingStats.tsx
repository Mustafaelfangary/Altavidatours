import React from 'react';
import { CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';

type BookingStatsProps = {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
};

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  percentage?: number;
};

const StatCard = ({ label, value, icon, bgColor, textColor, percentage }: StatCardProps) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`${textColor} opacity-80 text-sm font-medium`}>{label}</span>
      <span className={textColor}>{icon}</span>
    </div>
    <div className="flex items-end gap-2">
      <span className={`${textColor} text-2xl font-bold`}>{value}</span>
      {percentage !== undefined && (
        <span className={`${textColor} opacity-80 text-sm mb-1`}>
          {percentage > 0 ? `+${percentage}` : percentage}% from last month
        </span>
      )}
    </div>
  </div>
);

export const BookingStats = ({
  totalBookings,
  confirmedBookings,
  pendingBookings,
  cancelledBookings
}: BookingStatsProps) => {
  // Calculate percentages (in a real app, you'd compare with last month's data)
  const confirmedPercentage = Math.round((confirmedBookings / totalBookings) * 100) || 0;
  const pendingPercentage = Math.round((pendingBookings / totalBookings) * 100) || 0;
  const cancelledPercentage = Math.round((cancelledBookings / totalBookings) * 100) || 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Booking Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Bookings"
          value={totalBookings}
          icon={<CalendarDays className="h-5 w-5" />}
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <StatCard
          label="Confirmed"
          value={confirmedBookings}
          icon={<CheckCircle className="h-5 w-5" />}
          bgColor="bg-green-50"
          textColor="text-green-700"
          percentage={confirmedPercentage}
        />
        <StatCard
          label="Pending"
          value={pendingBookings}
          icon={<Clock className="h-5 w-5" />}
          bgColor="bg-yellow-50"
          textColor="text-yellow-700"
          percentage={pendingPercentage}
        />
        <StatCard
          label="Cancelled"
          value={cancelledBookings}
          icon={<XCircle className="h-5 w-5" />}
          bgColor="bg-red-50"
          textColor="text-red-700"
          percentage={cancelledPercentage}
        />
      </div>
    </div>
  );
};

