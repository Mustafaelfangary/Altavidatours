import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure nodemailer (replace with your email service details)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password',
  },
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Calculate total price (you might want to get this from the daily tour)
    const totalPrice = data.totalPrice || 0;

    // Support both legacy dahabiyaId and new dailyTourId
    const dailyTourId = data.dailyTourId || data.dahabiyaId;

    const booking = await prisma.booking.create({
      data: {
        userId: data.userId, // This should be the authenticated user's ID
        dailyTourId: dailyTourId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        guests: data.guests,
        totalPrice: totalPrice,
        specialRequests: data.specialRequests,
      },
    });

    // Send HTML email to user (you'll need to get user email from the user record)
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true, name: true }
    });

    if (user?.email) {
      await transporter.sendMail({
        from: 'your-email@example.com',
        to: user.email,
        subject: 'Booking Confirmation',
        html: `
          <h1>Booking Confirmation</h1>
          <p>Hello ${user.name || 'Guest'},</p>
          <p>Your booking for ${data.guests} guests has been confirmed.</p>
          <p>Start Date: ${data.startDate}</p>
          <p>End Date: ${data.endDate}</p>
          <p>Total Price: $${totalPrice}</p>
        `,
      });
    }

    // Send HTML email to admin
    await transporter.sendMail({
      from: 'your-email@example.com',
      to: 'admin@example.com',
      subject: 'New Booking',
      html: `
        <h1>New Booking</h1>
        <p>User: ${user?.name || 'Unknown'}</p>
        <p>Email: ${user?.email || 'Unknown'}</p>
        <p>Guests: ${data.guests}</p>
        <p>Start Date: ${data.startDate}</p>
        <p>End Date: ${data.endDate}</p>
        <p>Total Price: $${totalPrice}</p>
      `,
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to save booking.' }, { status: 500 });
  }
} 

