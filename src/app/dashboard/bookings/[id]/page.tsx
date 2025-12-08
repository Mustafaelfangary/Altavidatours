import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookingStatusForm from "@/components/admin/BookingStatusForm";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

interface BookingDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      dahabiya: {
        include: {
          images: true,
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const durationInDays = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        <Link href="/dashboard/bookings">
          <Button variant="secondary">Back to Bookings</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cruise Information</h2>
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-32 w-48 relative rounded-lg overflow-hidden">
                  {booking.dahabiya?.images[0] && (
                    <Image
                      src={booking.dahabiya.images[0].url}
                      alt={booking.dahabiya.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{booking.dahabiya?.name}</h3>
                  <p className="text-gray-600 mt-2">{booking.dahabiya?.description}</p>
                  <Link
                    href={`/dashboard/dahabiyat/${booking.dahabiya?.id}`}
                    className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    View Dahabiya Details →
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-gray-500">Check-in Date</dt>
                    <dd className="font-medium">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Check-out Date</dt>
                    <dd className="font-medium">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Duration</dt>
                    <dd className="font-medium">{durationInDays} days</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Number of Guests</dt>
                    <dd className="font-medium">{booking.guests}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-gray-500">Total Amount</dt>
                    <dd className="text-2xl font-bold text-blue-600">
                      {formatCurrency(Number(booking.totalPrice))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Price per Day</dt>
                    <dd className="font-medium">
                      N/A
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Booking Date</dt>
                    <dd className="font-medium">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <BookingStatusForm booking={booking} />
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="flex items-center gap-4 mb-4">
                {booking.user.image ? (
                  <Image
                    src={booking.user.image}
                    alt={booking.user.name || ""}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-lg">
                      {(booking.user.name || booking.user.email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {booking.user.name || "No name provided"}
                  </p>
                  <p className="text-gray-600">{booking.user.email}</p>
                </div>
              </div>
              <Link
                href={`/dashboard/users/${booking.user.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Customer Profile →
              </Link>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 bg-green-500 rounded"></div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div
                    className={`w-2 rounded ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium">Current Status: {booking.status}</p>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(booking.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
