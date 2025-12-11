import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ship, Clock, Users, MapPin, ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import imageLoader from '@/utils/imageLoader';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCruise(id: string) {
  const cruise = await prisma.cruise.findUnique({
    where: { id },
    include: { images: true },
  });
  return cruise;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const cruise = await getCruise(id);
  if (!cruise) return { title: "Cruise Not Found" };
  return {
    title: `${cruise.name} | AltaVida Tours`,
    description: cruise.description,
  };
}

export default async function CruiseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cruise = await getCruise(id);

  if (!cruise) {
    notFound();
  }

  const itineraryDays = cruise.itinerary?.split("\n").filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-linear-to-b from-deep-nile-blue/5 to-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        {cruise.images?.[0]?.url ? (
          <Image src={cruise.images[0].url} alt={cruise.name} fill className="object-cover" priority loader={imageLoader} />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-deep-nile-blue to-pharaoh-gold flex items-center justify-center">
            <Ship className="w-32 h-32 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link href="/cruises" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cruises
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{cruise.name}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" /> {cruise.duration} Days
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Users className="w-4 h-4" /> Up to {cruise.capacity} Guests
              </span>
              <span className="flex items-center gap-2 bg-pharaoh-gold px-3 py-1 rounded-full font-semibold">
                From ${cruise.price}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader><CardTitle>About This Cruise</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{cruise.description}</p>
                </CardContent>
              </Card>

              {itineraryDays.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Itinerary</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {itineraryDays.map((day, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="shrink-0 w-12 h-12 bg-pharaoh-gold/20 rounded-full flex items-center justify-center">
                            <span className="font-bold text-pharaoh-gold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground">{day}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {cruise.images && cruise.images.length > 1 && (
                <Card>
                  <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {cruise.images.slice(1).map((image, index) => (
                        <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                          <Image src={image.url} alt={`${cruise.name} - Image ${index + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-300" loader={imageLoader} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader><CardTitle>Book This Cruise</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 bg-pharaoh-gold/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-3xl font-bold text-pharaoh-gold">${cruise.price}</p>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Duration:</span><span className="font-medium">{cruise.duration} Days</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Capacity:</span><span className="font-medium">{cruise.capacity} Guests</span></div>
                  </div>
                  <Link href={`/booking?cruise=${cruise.id}`} className="block">
                    <Button className="w-full" size="lg"><Calendar className="w-4 h-4 mr-2" />Book Now</Button>
                  </Link>
                  <Link href="/contact" className="block">
                    <Button variant="outline" className="w-full">Ask a Question</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

