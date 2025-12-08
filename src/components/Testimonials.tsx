'use client';

import { useState } from 'react';
import Image from 'next/image';
import imageLoader from '../utils/imageLoader';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Adventure Traveler',
    content: 'The Dahabiya cruise exceeded all our expectations. The intimate setting, personalized service, and stunning views of the Nile made this trip unforgettable.',
    image: '/images/cleopatra.png'
  },
  {
    name: 'Michael Chen',
    role: 'History Enthusiast',
    content: 'The knowledge of our Egyptologist guide was incredible. We learned so much about ancient Egyptian history while enjoying modern luxury.',
    image: '/images/cleopatra.png'
  },
  {
    name: 'Emma Thompson',
    role: 'Luxury Travel Blogger',
    content: 'From the gourmet dining to the expertly planned excursions, every detail was perfect. The staff went above and beyond to make our journey special.',
    image: '/images/cleopatra.png'
  }
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Guests Say</h2>
          <p className="mt-4 text-lg text-gray-600">Read about experiences from our valued customers</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="relative bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden">
                <Image
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  fill
                  className="object-cover"
                  loader={imageLoader}
                />
              </div>
              <blockquote className="mt-4">
                <p className="text-xl text-gray-600 italic">&quot;{testimonials[activeIndex].content}&quot;</p>
              </blockquote>
              <div className="mt-4">
                <cite className="font-semibold text-gray-900 not-italic">{testimonials[activeIndex].name}</cite>
                <p className="text-gray-500">{testimonials[activeIndex].role}</p>
              </div>
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={previousTestimonial}
                className="-ml-4 flex justify-center items-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg focus:outline-none"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={nextTestimonial}
                className="-mr-4 flex justify-center items-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg focus:outline-none"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}