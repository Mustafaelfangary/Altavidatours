'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PharaonicDecoration } from '@/components/ui/PharaonicDecoration';
import imageLoader from '@/utils/imageLoader';

export default function JordanDestinationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-rose-50">
      <Navbar />
      <main className="pt-20">
        <section className="relative max-w-6xl mx-auto px-4 pb-16">
          <div className="relative h-[360px] rounded-3xl overflow-hidden shadow-2xl mb-10">
            <Image
              src="/Destinations/Jordon.jpg"
              alt="Jordan luxury adventures"
              fill
              className="object-cover"
              loader={imageLoader}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
            <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-12 text-white space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold drop-shadow-2xl">
                Jordan, Carved in Sandstone
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-white/90 leading-relaxed">
                Enter Petra by candlelight, float on the Dead Sea and cross Wadi Rum in comfort – Jordan tailored
                for discerning explorers.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <Link href="/packages">
                  <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-black font-semibold px-8 py-6 text-lg rounded-full">
                    Explore Jordan Ideas
                  </Button>
                </Link>
                <Link href="/tailor-made">
                  <Button variant="outline" className="border-white/70 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                    Plan a Bespoke Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nile-blue flex items-center gap-3">
                <span>Beyond Petra</span>
              </h2>
              <PharaonicDecoration variant="section" size="sm" />
              <p className="text-lg text-ancient-stone leading-relaxed">
                We combine iconic sites like Petra and Wadi Rum with quiet village dinners, stargazing in the
                desert and hand‑picked boutique stays that feel intimate and authentic.
              </p>
              <p className="text-lg text-ancient-stone leading-relaxed">
                Every Jordan itinerary is crafted door‑to‑door, with private drivers, expert local guides and
                flexible pacing so you can slow down and savour the landscape.
              </p>
            </div>
            <div className="space-y-4 bg-white/80 rounded-2xl shadow-xl border border-pharaoh-gold/20 p-6">
              <h3 className="text-xl font-semibold text-nile-blue mb-2">Signature Jordan Moments</h3>
              <ul className="space-y-2 text-ancient-stone text-sm">
                <li>• Candlelit entrance to Petra and extended touring</li>
                <li>• Luxury camps in Wadi Rum with sky‑full star views</li>
                <li>• Floating and spa rituals at the Dead Sea</li>
                <li>• Amman food walks and local storytelling</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
