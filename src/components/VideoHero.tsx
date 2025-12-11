"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function VideoHero() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover transform scale-105"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/videos/dahabyia nile Egypt.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70" />
      <div className="relative flex h-full items-center justify-center text-center">
        <div className="max-w-3xl px-4">
          <h1 className="font-heading text-6xl font-bold text-white mb-6 tracking-wide">
            Journey Through Ancient Splendor
          </h1>
          <p className="text-2xl text-white/90 mb-8 font-body leading-relaxed">
            Experience the timeless majesty of Egypt aboard our luxury Nile cruises,
            where ancient wonders meet modern elegance
          </p>
          <Link href="/cruises">
            <Button size="lg" className="text-lg bg-linear-to-r from-primary to-gold hover:from-gold hover:to-primary transition-all duration-300 border-2 border-sand/20 shadow-lg">
              Discover Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


