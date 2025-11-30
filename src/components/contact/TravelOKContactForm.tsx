"use client";

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function TravelOKContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-travelok-blue-dark mb-2">
          🛥️ Contact AltaVida Tours
        </h2>
        <p className="text-travelok-gray">
          Ready to embark on your Egyptian adventure? Send us a message and we'll help you plan the perfect dahabiya cruise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Your message has been sent successfully! We'll get back to you within 24 hours.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-travelok-dark mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-travelok-blue focus:border-travelok-blue outline-none transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-travelok-dark mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-travelok-blue focus:border-travelok-blue outline-none transition-all duration-300"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-travelok-dark mb-2">
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={(e) => handleChange(e as any)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-travelok-blue focus:border-travelok-blue outline-none transition-all duration-300"
          >
            <option value="">Select a topic</option>
            <option value="Dahabiya Booking">🛥️ Dahabiya Booking</option>
            <option value="Itinerary Information">🗺️ Itinerary Information</option>
            <option value="Custom Tour">✨ Custom Tour Request</option>
            <option value="Group Booking">👥 Group Booking</option>
            <option value="General Inquiry">📞 General Inquiry</option>
            <option value="Other">❓ Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-travelok-dark mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-travelok-blue focus:border-travelok-blue outline-none transition-all duration-300 resize-vertical"
            placeholder="Tell us about your travel plans, preferred dates, group size, or any specific requirements..."
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-travelok-gray">
            * Required fields
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                📧 Send Message
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center p-4 bg-travelok-blue/5 rounded-lg">
            <div className="text-2xl mb-2">📞</div>
            <div className="text-sm font-semibold text-travelok-blue-dark">Phone</div>
            <div className="text-sm text-travelok-gray">+20 95 237 0574</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-travelok-orange/5 rounded-lg">
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-semibold text-travelok-blue-dark">Email</div>
            <div className="text-sm text-travelok-gray">info@altavidatours.com</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-travelok-blue/5 rounded-lg">
            <div className="text-2xl mb-2">📍</div>
            <div className="text-sm font-semibold text-travelok-blue-dark">Location</div>
            <div className="text-sm text-travelok-gray">Luxor, Egypt</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelOKContactForm;
