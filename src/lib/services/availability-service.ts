import prisma from '@/lib/prisma';

export interface AvailabilityCheck {
  dailyTourId?: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  // Legacy support
  dahabiyaId?: string;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  availableCabins: {
    id: string;
    name: string;
    price: number;
    capacity: number;
  }[];
  totalPrice: number;
}

export class AvailabilityService {
  static async checkAvailability({
    dailyTourId,
    dahabiyaId,
    startDate,
    endDate,
    guests,
  }: AvailabilityCheck): Promise<AvailabilityResult> {
    // Support both dailyTourId and legacy dahabiyaId
    const tourId = dailyTourId || dahabiyaId;

    if (!tourId) {
      return { isAvailable: false, availableCabins: [], totalPrice: 0 };
    }

    // Get all cabins for the daily tour
    const cabins = await prisma.cabin.findMany({
      where: { dailyTourId: tourId },
      include: {
        bookings: {
          where: {
            OR: [
              {
                AND: [
                  { startDate: { lte: startDate } },
                  { endDate: { gte: startDate } },
                ],
              },
              {
                AND: [
                  { startDate: { lte: endDate } },
                  { endDate: { gte: endDate } },
                ],
              },
            ],
            status: 'CONFIRMED',
          },
        },
      },
    });

    // Filter available cabins
    const availableCabins = cabins
      .filter(cabin => {
        const isBooked = cabin.bookings.length > 0;
        return !isBooked && cabin.capacity >= guests;
      })
      .map(cabin => ({
        id: cabin.id,
        name: cabin.name,
        price: Number(cabin.price),
        capacity: cabin.capacity,
      }));

    // Calculate total price
    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = availableCabins.reduce(
      (sum, cabin) => sum + cabin.price * nights,
      0
    );

    return {
      isAvailable: availableCabins.length > 0,
      availableCabins,
      totalPrice,
    };
  }

  static async getAvailabilityCalendar(
    dailyTourId: string,
    month: number,
    year: number
  ) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        dailyTourId,
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
        ],
        status: 'CONFIRMED',
      },
      select: {
        startDate: true,
        endDate: true,
        cabinId: true,
      },
    });

    const calendar: { [key: string]: boolean } = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const isBooked = bookings.some(
        booking =>
          currentDate >= booking.startDate && currentDate <= booking.endDate
      );
      calendar[dateKey] = !isBooked;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }
}

