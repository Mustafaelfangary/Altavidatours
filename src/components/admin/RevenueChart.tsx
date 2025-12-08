'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getRevenueData } from '@/app/actions/revenue';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type RevenueData = {
  months: string[];
  monthlyRevenue: number[];
  totalRevenue: number;
};

export default function RevenueChart() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [error, setError] = useState<string>('');

  async function fetchRevenueData() {
    const result = await getRevenueData();
    if (result.success && result.data) {
      setData(result.data as RevenueData);
      setError('');
    } else {
      setError(result.error || 'Failed to fetch revenue data');
      setData(null);
    }
  }

  useEffect(() => {
    fetchRevenueData();

    // Refresh data every minute
    const interval = setInterval(fetchRevenueData, 60000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data) {
    return <div>Loading revenue data...</div>;
  }

  const chartData = data.months.map((month, index) => ({
    month,
    revenue: data.monthlyRevenue[index]
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <p className="text-sm text-gray-500">
          Total Revenue: {formatCurrency(data.totalRevenue)}
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              tickLine={false}
              width={80}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}