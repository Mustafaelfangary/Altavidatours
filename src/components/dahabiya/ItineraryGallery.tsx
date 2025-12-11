"use client";
import { useState } from "react";
import Image from "next/image";

interface ItineraryGalleryProps {
  images: { url: string; alt?: string }[];
  dayTitle?: string;
}

export default function ItineraryGallery({ images, dayTitle }: ItineraryGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div className="overflow-x-auto flex gap-4 py-2">
        {images.map((img, idx) => (
          <div
            key={img.url}
            className="relative w-56 h-40 shrink-0 rounded-xl overflow-hidden group shadow-lg border-2 border-emerald-200 hover:border-red-400 transition-all cursor-pointer"
            onClick={() => setLightboxIdx(idx)}
          >
            <Image
              src={img.url}
              alt={img.alt || dayTitle || "Itinerary image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative w-full max-w-3xl aspect-video flex items-center justify-center">
            <Image
              src={images[lightboxIdx].url}
              alt={images[lightboxIdx].alt || dayTitle || "Itinerary image"}
              fill
              className="object-contain rounded-xl shadow-2xl"
            />
            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-red-400 text-white rounded-full p-2"
                  onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + images.length) % images.length); }}
                >
                  &#8592;
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-red-400 text-white rounded-full p-2"
                  onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % images.length); }}
                >
                  &#8594;
                </button>
              </>
            )}
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              onClick={e => { e.stopPropagation(); setLightboxIdx(null); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 rounded px-3 py-1">
              {lightboxIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

