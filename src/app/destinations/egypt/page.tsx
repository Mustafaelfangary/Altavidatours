'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PharaonicDecoration, PharaonicText } from '@/components/ui/PharaonicDecoration';
import imageLoader from '@/utils/imageLoader';

export default function EgyptDestinationPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-papyrus via-white to-nile-blue/5">
      <Navbar />
      <main className="pt-20">
        <section className="relative max-w-6xl mx-auto px-4 pb-16">
          <div className="relative h-[360px] rounded-3xl overflow-hidden shadow-2xl mb-10">
            <Image
              src="/Destinations/Egypt.webp"
              alt="Luxury Egypt journeys"
              fill
              className="object-cover"
              loader={imageLoader}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/60" />
            <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-12 text-white space-y-4">
              <PharaonicText className="text-white/80" showTranslation={false} />
              <h1 className="text-4xl md:text-5xl font-serif font-bold drop-shadow-2xl">
                Egypt, Curated in Luxury
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-white/90 leading-relaxed">
                Sunset dahabiya sails on the Nile, candlelit temple visits and private Egyptologists – a timeless
                Egypt crafted around your pace and passions.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <Link href="/packages">
                  <Button className="bg-pharaoh-gold hover:bg-pharaoh-gold/90 text-black font-semibold px-8 py-6 text-lg rounded-full">
                    View Egypt Journeys
                  </Button>
                </Link>
                <Link href="/tailor-made">
                  <Button variant="outline" className="border-white/70 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                    Design a Bespoke Escape
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nile-blue flex items-center gap-3">
                <span>Why Egypt with AltaVida</span>
              </h2>
              <PharaonicDecoration variant="section" size="sm" />
              <p className="text-lg text-ancient-stone leading-relaxed">
                We blend iconic must‑see highlights with private moments that most visitors never experience: quiet
                sunrise views over the Pyramids, curated museum hours and intimate encounters with local artisans
                and storytellers.
              </p>
              <p className="text-lg text-ancient-stone leading-relaxed">
                From Cairo to Aswan and Luxor, every transfer, guide and hotel is hand‑picked, so you move through
                Egypt effortlessly while still feeling the thrill of discovery.
              </p>
            </div>
            <div className="space-y-4 bg-white/80 rounded-2xl shadow-xl border border-pharaoh-gold/20 p-6">
              <h3 className="text-xl font-semibold text-nile-blue mb-2">Signature Egypt Highlights</h3>
              <ul className="space-y-2 text-ancient-stone text-sm">
                <li>• Private touring of the Pyramids, Sphinx & Grand Egyptian Museum</li>
                <li>• Boutique dahabiya cruises with only a few cabins on board</li>
                <li>• Old Cairo, Khan el‑Khalili and hidden foodie corners</li>
                <li>• Sunrise or sunset experiences away from the crowds</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


