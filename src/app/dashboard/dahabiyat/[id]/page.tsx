import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface DahabiyaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DahabiyaPage({ params }: DahabiyaPageProps) {
  const { id } = await params;
  const cruise = await prisma.dahabiya.findUnique({
    where: { id },
    include: {
      images: true,
      bookings: {
        where: {
          status: "CONFIRMED",
        },
        include: {
          user: true,
        },
        orderBy: {
          startDate: "desc",
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!cruise) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{cruise.name}</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/dahabiyat">
            <Button variant="secondary">Back to Dahabiyat</Button>
          </Link>
          <Link href={`/dashboard/dahabiyat/${cruise.id}/edit`}>
            <Button>Edit Dahabiya</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p className="text-gray-600">{cruise.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500">Price per day</p>
                <p className="font-semibold">${cruise.pricePerDay.toString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Capacity</p>
                <p className="font-semibold">{cruise.capacity} guests</p>
              </div>
              <div>
                <p className="text-gray-500">Rating</p>
                <p className="font-semibold flex items-center">
                  {cruise.rating.toFixed(1)}
                  <span className="text-yellow-400 ml-1">★</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500">Active Bookings</p>
                <p className="font-semibold">{cruise.bookings.length}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <div className="flex flex-wrap gap-2">
                {cruise.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {cruise.images.map((image) => (
                  <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt || cruise.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Bookings */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {cruise.bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${booking.totalPrice.toString()}</p>
                      <p className="text-sm text-gray-500">{booking.guests} guests</p>
                    </div>
                  </div>
                ))}
                {cruise.bookings.length === 0 && (
                  <p className="text-gray-500">No bookings yet</p>
                )}
              </div>
            </div>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {cruise.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center mb-2">
                      {review.user.image ? (
                        <Image
                          src={review.user.image}
                          alt={review.user.name || ""}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500">
                            {(review.user.name || "U")[0]}
                          </span>
                        </div>
                      )}
                      <div className="ml-2">
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
                {cruise.reviews.length === 0 && (
                  <p className="text-gray-500">No reviews yet</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
