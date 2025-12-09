'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PharaonicDecoration } from '@/components/ui/PharaonicDecoration';
import imageLoader from '@/utils/imageLoader';

export default function TurkeyDestinationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-papyrus via-white to-emerald-50">
      <Navbar />
      <main className="pt-20">
        <section className="relative max-w-6xl mx-auto px-4 pb-16">
          <div className="relative h-[360px] rounded-3xl overflow-hidden shadow-2xl mb-10">
            <Image
              src="/Destinations/Turkey.jpg"
              alt="Turkey luxury journeys"
              fill
              className="object-cover"
              loader={imageLoader}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
            <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-12 text-white space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold drop-shadow-2xl">
                Turkey, Between Continents
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-white/90 leading-relaxed">
                From Bosphorus palaces to Cappadocia cave suites, we choreograph Turkey as a tapestry of culture,
                cuisine and refined comfort.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <Link href="/packages">
                  <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-black font-semibold px-8 py-6 text-lg rounded-full">
                    Explore Turkey Routes
                  </Button>
                </Link>
                <Link href="/tailor-made">
                  <Button variant="outline" className="border-white/70 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                    Craft a Signature Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nile-blue flex items-center gap-3">
                <span>Istanbul, Cappadocia & Beyond</span>
              </h2>
              <PharaonicDecoration variant="section" size="sm" />
              <p className="text-lg text-ancient-stone leading-relaxed">
                Wander Istanbul&apos;s historic quarters with private guides, then drift above Cappadocia in a hot air
                balloon before retreating to serene coastal hideaways.
              </p>
              <p className="text-lg text-ancient-stone leading-relaxed">
                We design Turkey itineraries that pair iconic highlights with quiet corners, so every day balances
                discovery and downtime.
              </p>
            </div>
            <div className="space-y-4 bg-white/80 rounded-2xl shadow-xl border border-pharaoh-gold/20 p-6">
              <h3 className="text-xl font-semibold text-nile-blue mb-2">Signature Turkey Highlights</h3>
              <ul className="space-y-2 text-ancient-stone text-sm">
                <li>• Private Bosphorus cruises and palace visits</li>
                <li>• Boutique cave hotels in Cappadocia</li>
                <li>• Expert‑led market and food tours</li>
                <li>• Coastal extensions in Bodrum or the Turquoise Coast</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
