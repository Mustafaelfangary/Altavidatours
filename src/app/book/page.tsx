'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function BookPage() {
  const params = useSearchParams();
  const dahabiyaId = params?.get('dahabiyaId') ?? null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      dahabiyaId: formData.get('dahabiyaId'),
      name: formData.get('name'),
      email: formData.get('email'),
      guests: parseInt(formData.get('guests') as string),
      date: formData.get('date'),
      phone: formData.get('phone'),
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage('Booking saved successfully!');
      } else {
        setMessage(result.error || 'Failed to save booking.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Book Your Nile Dahabiya</h1>
      {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="dahabiyaId" value={dahabiyaId || ''} />
        <div>
          <label className="block mb-2 font-medium">Full Name</label>
          <input type="text" name="name" className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input type="email" name="email" className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block mb-2 font-medium">Number of Guests</label>
          <input type="number" name="guests" min="1" className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block mb-2 font-medium">Date</label>
          <input type="date" name="date" className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block mb-2 font-medium">Phone Number</label>
          <input type="tel" name="phone" className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded transition disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
} 

