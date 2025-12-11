import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ship, Clock, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import imageLoader from "@/utils/imageLoader";

export const metadata = {
  title: "Nile Cruises | AltaVida Tours",
  description: "Explore our luxury Nile cruise offerings. Experience the magic of Egypt from the comfort of our premium cruise ships.",
};

async function getCruises() {
  // Fetch both Dahabiya and regular Nile cruises
  const dahabiyas = await prisma.dahabiya.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      capacity: true,
      imageItems: {
        select: { url: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
  const cruises = await prisma.package.findMany({
    where: { category: { in: ["nile", "cruise"] } },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      price: true,
      duration: true,
    },
    orderBy: { createdAt: "desc" },
  });
  // Return only the fields needed for rendering
  return [
    ...dahabiyas.map(d => ({
      type: "dahabiya",
      id: d.id,
      name: d.name,
      description: d.description,
      imageUrl: d.imageItems?.[0]?.url ?? "",
      capacity: d.capacity
    })),
    ...cruises.map(c => ({
      type: "cruise",
      id: c.id,
      name: c.name,
      description: c.description,
      imageUrl: c.images?.[0] ?? "",
      price: c.price,
      duration: c.duration
    }))
  ];
}

export default async function CruisesPage() {
  const cruises = await getCruises();

  return (
    <div className="min-h-screen bg-linear-to-b from-deep-nile-blue/5 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-r from-deep-nile-blue to-deep-nile-blue/80">
        <div className="absolute inset-0 bg-[url('/images/nile-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nile Cruises</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover the wonders of ancient Egypt aboard our luxury cruise ships. 
              Sail along the legendary Nile River and explore timeless treasures.
            </p>
          </div>
        </div>
      </section>

      {/* Cruises Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {cruises.length === 0 ? (
            <Card className="max-w-lg mx-auto">
              <CardContent className="text-center py-12">
                <Ship className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Cruises Available</h3>
                <p className="text-muted-foreground mb-4">
                  We&apos;re currently updating our cruise offerings. Please check back soon!
                </p>
                <Link href="/contact">
                  <Button>Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cruises.map((cruise) => (
                <Card key={cruise.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative h-56">
                    {cruise.imageUrl ? (
                      <Image
                        src={cruise.imageUrl}
                        alt={cruise.name}
                        fill
                        loader={imageLoader}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-deep-nile-blue/20 to-pharaoh-gold/20 flex items-center justify-center">
                        <Ship className="w-16 h-16 text-deep-nile-blue/40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-pharaoh-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {cruise.type === "dahabiya" && "capacity" in cruise ? `Capacity: ${cruise.capacity}` : "price" in cruise ? `From $${cruise.price}` : ""}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-pharaoh-gold transition-colors">
                      {cruise.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{cruise.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {cruise.type === "dahabiya" && "capacity" in cruise ? (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {cruise.capacity} guests
                        </span>
                      ) : "duration" in cruise ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {cruise.duration} days
                        </span>
                      ) : null}
                    </div>
                    <Link href={cruise.type === "dahabiya" ? `/dahabiyat/${cruise.id}` : `/cruises/${cruise.id}`}>
                      <Button className="w-full group/btn">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-pharaoh-gold/10 to-deep-nile-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Let us create a custom cruise experience tailored to your preferences.
          </p>
          <Link href="/tailor-made">
            <Button size="lg" variant="outline">
              Create Custom Trip
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}



