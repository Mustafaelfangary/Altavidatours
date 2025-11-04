import prisma from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

// Unified booking validation schema
export const bookingSchema = z.object({
  type: z.enum(['DAHABIYA', 'PACKAGE']),
  dahabiyaId: z.string().optional(),
  packageId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  guests: z.number().min(1, "At least 1 guest is required"),
  specialRequests: z.string().optional(),
  totalPrice: z.number().min(0, "Total price must be positive"),
  guestDetails: z.array(z.object({
    name: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    age: z.number().optional(),
    nationality: z.string().optional(),
    dateOfBirth: z.string().optional(),
    passport: z.string().optional(),
    dietaryRequirements: z.array(z.string()).optional(),
  })).optional().default([]),
  isGuestBooking: z.boolean().optional(),
  guestInfo: z.object({
    name: z.string().min(1, "Guest name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
  }).optional(),
});

export type BookingData = z.infer<typeof bookingSchema>;

export interface BookingResult {
  success: boolean;
  booking?: any;
  error?: string;
}

export interface BookingItem {
  id: string;
  name: string;
  pricePerDay?: number;
  price?: number;
  capacity?: number;
  maxGuests?: number;
  isActive?: boolean;
  mainImage?: string | null;
  mainImageUrl?: string | null;
  durationDays?: number;
}

export class UnifiedBookingService {
  /**
   * Create a new booking (dahabiya or package)
   * @param userId - User ID for authenticated bookings, null for guest bookings
   * @param data - Booking data
   */
  static async createBooking(userId: string | null, data: BookingData): Promise<BookingResult> {
    // Temporarily disabled until Booking schema is realigned.
    // Prevents runtime errors due to mismatched relations/fields.
    return { success: false, error: 'Online booking is temporarily unavailable while we upgrade the booking schema. Please contact support to book.' };
  }

  /**
   * Get all bookings for admin
   */
  static async getAllBookings() {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tour: {
            select: {
              id: true,
              title: true,
              imageCover: true,
              price: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' }
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  /**
   * Get booking by ID with authorization check
   */
  static async getBookingById(bookingId: string, userId?: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          tour: {
            select: {
              id: true,
              title: true,
              imageCover: true,
              price: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!booking) {
        return null;
      }

      // Check authorization if userId provided
      if (userId && booking.userId !== userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
          return null;
        }
      }

      return booking;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      return null;
    }
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userId: string) {
    try {
      return await prisma.booking.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tour: {
            select: {
              id: true,
              title: true,
              imageCover: true,
              price: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(bookingId: string, status: Status) {
    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tour: {
            select: {
              id: true,
              title: true,
              imageCover: true,
            },
          },
        }
      });

      // Send status update email
      try {
        await this.sendStatusUpdateEmail(booking);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }

      return { success: true, booking };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error: 'Failed to update booking status' };
    }
  }

  /**
   * Cancel booking with authorization check
   */
  static async cancelBooking(bookingId: string, userId?: string): Promise<BookingResult> {
    try {
      // Verify booking exists and get details
      const existingBooking = await this.getBookingById(bookingId, userId);
      if (!existingBooking) {
        return { success: false, error: 'Booking not found or unauthorized' };
      }

      // Check authorization
      if (userId && existingBooking.userId !== userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
          return { success: false, error: 'Unauthorized to cancel this booking' };
        }
      }

      // Update booking status to cancelled
      const result = await this.updateBookingStatus(bookingId, 'CANCELLED');

      if (result.success && result.booking) {
        // Send cancellation email
        try {
          await this.sendCancellationEmail(result.booking);
        } catch (emailError) {
          console.error('Failed to send cancellation email:', emailError);
        }
      }

      return result;
    } catch (error) {
      console.error('Booking cancellation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel booking'
      };
    }
  }

  /**
   * Send booking confirmation emails
   */
  private static async sendBookingEmails(booking: any, itemDetails: BookingItem, guestInfo?: { name: string; email: string; phone?: string }) {
    try {
      console.log('📧 Sending booking confirmation emails...');

      // Use guest info if provided, otherwise use booking user
      const recipientEmail = guestInfo?.email || booking.user?.email;
      const recipientName = guestInfo?.name || booking.user?.name || 'Guest';

      if (!recipientEmail) {
        console.warn('⚠️ No email address available for booking confirmation');
        return;
      }

      const emailData = {
        user: guestInfo ? { name: guestInfo.name, email: guestInfo.email } : booking.user,
        booking: {
          ...booking,
          bookingReference: booking.bookingReference,
          startDate: booking.startDate,
          endDate: booking.endDate,
          guests: booking.guests,
          totalPrice: booking.totalPrice,
          status: booking.status,
          specialRequests: booking.specialRequests
        },
        ...(booking.type === 'DAHABIYA' ? { dahabiya: itemDetails } : { package: itemDetails })
      };

      // Send customer confirmation email
      if (booking.type === 'PACKAGE') {
        await sendEmail({
          to: recipientEmail,
          subject: '🏺 Your Sacred Journey Awaits - Package Booking Confirmed',
          template: 'package-booking-confirmation',
          data: emailData
        });
      } else {
        await sendEmail({
          to: recipientEmail,
          subject: '🏺 Your Sacred Journey Awaits - Booking Confirmed',
          template: 'booking-confirmation',
          data: emailData
        });
      }

      // Send admin notification emails to multiple recipients
      const adminEmails = process.env.ADMIN_BOOKING_EMAILS || process.env.ADMIN_EMAIL || 'admin@cleopatra-dahabiyat.com';
      const adminEmailList = adminEmails.split(',').map(email => email.trim()).filter(email => email);
      
      console.log('📧 Sending admin notifications to:', adminEmailList);

      // Send to each admin email
      for (const adminEmail of adminEmailList) {
        try {
          if (booking.type === 'PACKAGE') {
            await sendEmail({
              to: adminEmail,
              subject: `🚨 New Package Booking Received - ${booking.bookingReference}`,
              template: 'admin-package-booking-notification',
              data: emailData
            });
          } else {
            await sendEmail({
              to: adminEmail,
              subject: `🚨 New Dahabiya Booking Received - ${booking.bookingReference}`,
              template: 'admin-booking-notification',
              data: emailData
            });
          }
          console.log(`✅ Admin notification sent to: ${adminEmail}`);
        } catch (emailError) {
          console.error(`❌ Failed to send admin notification to ${adminEmail}:`, emailError);
        }
      }

      console.log('✅ All booking emails sent successfully');
    } catch (error) {
      console.error('❌ Email sending error:', error);
      throw error;
    }
  }

  /**
   * Send status update email
   */
  private static async sendStatusUpdateEmail(booking: any) {
    try {
      const itemName = booking.tour?.title;

      await sendEmail({
        to: booking.user.email,
        subject: `Booking Update - ${booking.bookingReference}`,
        template: 'booking-status-update',
        data: {
          user: booking.user,
          booking: {
            ...booking,
            itemName
          }
        }
      });
    } catch (error) {
      console.error('Status update email error:', error);
    }
  }

  /**
   * Send cancellation email
   */
  private static async sendCancellationEmail(booking: any) {
    try {
      const itemName = booking.tour?.title;

      await sendEmail({
        to: booking.user.email,
        subject: `Booking Cancelled - ${booking.bookingReference}`,
        template: 'booking-cancellation',
        data: {
          user: booking.user,
          booking: {
            ...booking,
            itemName
          }
        }
      });
    } catch (error) {
      console.error('Cancellation email error:', error);
    }
  }

  /**
   * Create admin notification in database
   */
  private static async createAdminNotification(booking: any, itemDetails: BookingItem) {
    try {
      console.log('🔔 Creating admin notification for booking:', booking.bookingReference);

      const itemName = itemDetails.name;

      // Get all admin users
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true }
      });

      if (adminUsers.length === 0) {
        console.log('⚠️ No admin users found, skipping notification creation');
        return;
      }

      // Create notification for each admin user
      const notificationPromises = adminUsers.map(admin =>
        prisma.notification.create({
          data: {
            type: 'BOOKING_CREATED',
            title: `New ${booking.type} Booking`,
            message: `${booking.user?.name || 'Guest'} booked ${itemName} for ${booking.guests} guests`,
            data: {
              bookingId: booking.id,
              bookingReference: booking.bookingReference,
              customerName: booking.user.name || 'Guest',
              customerEmail: booking.user.email,
              bookingType: booking.type,
              itemName: itemName,
              startDate: booking.startDate,
              endDate: booking.endDate,
              guests: booking.guests,
              totalPrice: booking.totalPrice,
              status: booking.status
            },
            userId: admin.id,
            read: false,
          }
        })
      );

      await Promise.all(notificationPromises);
      console.log(`✅ Admin notifications created for ${adminUsers.length} admin users`);
    } catch (error) {
      console.error('❌ Failed to create admin notification:', error);
      throw error;
    }
  }
}

// Backward-compatible alias so existing imports keep working
export const CleanBookingService = UnifiedBookingService;
