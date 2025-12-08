"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Dahabiya = {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  images: { url: string }[];
  averageRating: number;
};

function DahabiyaCard({ dahabiya }: { dahabiya: Dahabiya }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = dahabiya.images || [];
  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Autoplay logic
  useEffect(() => {
    if (!isHovered && images.length > 1) {
      autoplayRef.current = setInterval(() => {
        setImgIdx(i => (i + 1) % images.length);
      }, 3500);
    } else {
      clearInterval(autoplayRef.current);
    }
    return () => clearInterval(autoplayRef.current);
  }, [isHovered, images.length]);

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) setImgIdx(i => (i - 1 + images.length) % images.length);
    if (delta < -40) setImgIdx(i => (i + 1) % images.length);
    touchStartX.current = null;
  };

  return (
    <Link href={`/dahabiyat/${dahabiya.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        {images.length > 0 && (
          <div
            className="relative h-48 w-full flex items-center justify-center group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((img, i) => (
              <Image
                key={`${img.url}-${i}`}
                src={img.url}
                alt={dahabiya.name}
                fill
                className={`object-cover rounded-t-lg absolute transition-all duration-700 ease-in-out ${i === imgIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                style={{ pointerEvents: i === imgIdx ? 'auto' : 'none' }}
              />
            ))}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 text-blue-700 shadow rounded-full p-1 transition-all duration-200 opacity-80 group-hover:opacity-100"
                  onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); }}
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 text-blue-700 shadow rounded-full p-1 transition-all duration-200 opacity-80 group-hover:opacity-100"
                  onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); }}
                  aria-label="Next image"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <span key={i} className={`inline-block w-2 h-2 rounded-full border border-white ${i === imgIdx ? 'bg-blue-600 scale-125' : 'bg-gray-300'} transition-all`}></span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{dahabiya.name}</h2>
          <p className="text-gray-600 mb-4 line-clamp-2">{dahabiya.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">${dahabiya.pricePerDay.toString()}</span>
            <span className="text-sm text-yellow-500">★ {dahabiya.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function DahabiyaList({ dahabiyat }: { dahabiyat: Dahabiya[] }) {
  if (dahabiyat.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">
          No dahabiyat found
        </h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {dahabiyat.map((d) => (
        <DahabiyaCard key={d.id} dahabiya={d} />
      ))}
    </div>
  );
} 