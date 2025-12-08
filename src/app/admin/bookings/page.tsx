'use client';
import prisma from '@/lib/prisma';
import { useState } from 'react';

interface Booking {
  id: string;
  name: string;
  email: string;
  guests: number;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  async function loadBookings() {
    const res = await fetch('/api/bookings');
    const data = await res.json();
    setBookings(data);
  }

  async function deleteBooking(id: string) {
    if (confirm('Are you sure you want to delete this booking?')) {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Booking deleted successfully!');
        loadBookings();
      } else {
        setMessage('Failed to delete booking.');
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Bookings</h1>
      {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{message}</div>}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guests}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 