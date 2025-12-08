import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type RevenueChartProps = {
  monthlyRevenue: number[];
  months: string[];
};

export const RevenueChart = ({ monthlyRevenue, months }: RevenueChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
        font: {
          size: 20,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `Revenue: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(this: any, value: number | string) {
            if (typeof value === 'number') {
              return `$${value.toLocaleString()}`;
            }
            return value;
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenue,
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(53, 162, 235, 0.9)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow h-[400px]">
      <Bar options={options} data={data} />
    </div>
  );
};