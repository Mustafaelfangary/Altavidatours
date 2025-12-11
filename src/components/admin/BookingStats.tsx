'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Check, Clock, X } from 'lucide-react';
import { getBookingStats } from '@/app/actions/bookings';

type BookingStats = {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
};

type StatCardProps = {
  title: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  className?: string;
};

const StatCard = ({ title, value, total, icon, className = '' }: StatCardProps) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-500">{percentage}% of total</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      </div>
    </Card>
  );
};

export default function BookingStats() {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  async function fetchStats() {
    const result = await getBookingStats();
    if (result.success && result.data) {
      setStats(result.data as BookingStats);
      setError('');
    } else {
      setError(result.error || 'Failed to fetch booking stats');
      setStats(null);
    }
  }

  useEffect(() => {
    fetchStats();

    // Set up an interval to refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div>Loading booking statistics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Confirmed Bookings"
        value={stats.confirmedBookings}
        total={stats.totalBookings}
        icon={<Check className="h-6 w-6 text-green-600" />}
        className="border-l-4 border-green-500"
      />
      <StatCard
        title="Pending Bookings"
        value={stats.pendingBookings}
        total={stats.totalBookings}
        icon={<Clock className="h-6 w-6 text-yellow-600" />}
        className="border-l-4 border-yellow-500"
      />
      <StatCard
        title="Cancelled Bookings"
        value={stats.cancelledBookings}
        total={stats.totalBookings}
        icon={<X className="h-6 w-6 text-red-600" />}
        className="border-l-4 border-red-500"
      />
    </div>
  );
}

