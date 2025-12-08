import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: any;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const templates = {
  'booking-confirmation': (data: any) => ({
    subject: 'Booking Confirmation',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${data.user.name},</p>
      <p>Your booking has been confirmed. Here are your booking details:</p>
      <ul>
        <li>Booking ID: ${data.booking.id}</li>
        <li>Check-in: ${new Date(data.booking.startDate).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(data.booking.endDate).toLocaleDateString()}</li>
        <li>Guests: ${data.booking.guests}</li>
        <li>Total Price: $${data.booking.totalPrice}</li>
      </ul>
      <p>Thank you for choosing Egipto Trips!</p>
    `,
  }),
  'booking-modification': (data: any) => ({
    subject: 'Booking Modification Confirmation',
    html: `
      <h1>Booking Modification Confirmation</h1>
      <p>Dear ${data.user.name},</p>
      <p>Your booking has been modified. Here are your updated booking details:</p>
      <ul>
        <li>Booking ID: ${data.booking.id}</li>
        <li>Check-in: ${new Date(data.booking.startDate).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(data.booking.endDate).toLocaleDateString()}</li>
        <li>Guests: ${data.booking.guests}</li>
        <li>Total Price: $${data.booking.totalPrice}</li>
      </ul>
      <p>Thank you for choosing Egipto Trips!</p>
    `,
  }),
  'booking-cancellation': (data: any) => ({
    subject: 'Booking Cancellation Confirmation',
    html: `
      <h1>Booking Cancellation Confirmation</h1>
      <p>Dear ${data.user.name},</p>
      <p>Your booking has been cancelled. Here are the details of the cancelled booking:</p>
      <ul>
        <li>Booking ID: ${data.booking.id}</li>
        <li>Check-in: ${new Date(data.booking.startDate).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(data.booking.endDate).toLocaleDateString()}</li>
        <li>Guests: ${data.booking.guests}</li>
        <li>Total Price: $${data.booking.totalPrice}</li>
      </ul>
      <p>We hope to welcome you back soon!</p>
    `,
  }),
};

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  const templateFn = templates[template as keyof typeof templates];
  if (!templateFn) {
    throw new Error(`Email template '${template}' not found`);
  }

  const { subject: templateSubject, html } = templateFn(data);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: subject || templateSubject,
    html,
  });
} 