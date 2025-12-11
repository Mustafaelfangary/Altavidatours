"use client";

import { Check, X } from 'lucide-react';

interface IncludesExcludesProps {
  includes?: string[];
  excludes?: string[];
}

export default function IncludesExcludes({ includes = [], excludes = [] }: IncludesExcludesProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Includes */}
          {includes.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold font-serif text-gray-900 mb-8 flex items-center gap-3">
                <Check className="w-8 h-8 text-green-500" />
                What's Included
              </h3>
              <ul className="space-y-4">
                {includes.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-gray-800 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Excludes */}
          {excludes.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold font-serif text-gray-900 mb-8 flex items-center gap-3">
                <X className="w-8 h-8 text-red-500" />
                What's Not Included
              </h3>
              <ul className="space-y-4">
                {excludes.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-gray-800 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


