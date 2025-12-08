import nodemailer from 'nodemailer';

interface WelcomeEmailParams {
  email: string;
  name: string;
  password: string;
  role: string;
}

export async function sendWelcomeEmail({ email, name, password, role }: WelcomeEmailParams) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Generate password reset token (you'll need to create this in the database)
    const resetToken = generateResetToken();
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/force-password-change?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Email HTML template
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Dahabiya Nile Cruise</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0080ff 0%, #1e3a8a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                𓇳 Welcome to Dahabiya Nile Cruise 𓇳
              </h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                Your Account Has Been Created
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 24px;">
                Hello ${name}! 👋
              </h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your administrator account has been created for the Dahabiya Nile Cruise management system. 
                Below are your login credentials:
              </p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px 0;">
                          <strong style="color: #374151; font-size: 14px;">Email:</strong>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 5px 0 0 0; font-weight: 600;">
                            ${email}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <strong style="color: #374151; font-size: 14px;">Temporary Password:</strong>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 5px 0 0 0; font-weight: 600; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db;">
                            ${password}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <strong style="color: #374151; font-size: 14px;">Role:</strong>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 5px 0 0 0; font-weight: 600;">
                            ${getRoleDisplay(role)}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> For security reasons, you must change this temporary password 
                  immediately upon your first login. This password is for one-time use only.
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #0080ff 0%, #1e3a8a 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      🔐 Change Password Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #0080ff; font-size: 12px; word-break: break-all; margin: 10px 0 0 0;">
                ${resetLink}
              </p>

              <!-- Instructions -->
              <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                <h3 style="color: #1e3a8a; font-size: 18px; margin: 0 0 15px 0;">
                  📋 Next Steps:
                </h3>
                <ol style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Click the "Change Password Now" button above</li>
                  <li>Create a strong, unique password</li>
                  <li>Log in to the admin panel with your new password</li>
                  <li>Explore your dashboard and familiarize yourself with the system</li>
                </ol>
              </div>

              <!-- Support -->
              <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px;">
                <p style="color: #1e40af; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Need Help?</strong><br>
                  If you have any questions or need assistance, please contact our support team at 
                  <a href="mailto:support@dahabiyatnilecruise.com" style="color: #0080ff; text-decoration: none;">
                    support@dahabiyatnilecruise.com
                  </a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
                This is an automated message from Dahabiya Nile Cruise Admin System
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Dahabiya Nile Cruise. All rights reserved.
              </p>
              <div style="margin-top: 15px;">
                <a href="${process.env.NEXTAUTH_URL}" style="color: #0080ff; text-decoration: none; font-size: 12px; margin: 0 10px;">
                  Visit Website
                </a>
                <span style="color: #d1d5db;">|</span>
                <a href="${process.env.NEXTAUTH_URL}/admin" style="color: #0080ff; text-decoration: none; font-size: 12px; margin: 0 10px;">
                  Admin Panel
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Plain text version
    const textContent = `
Welcome to Dahabiya Nile Cruise!

Hello ${name},

Your administrator account has been created for the Dahabiya Nile Cruise management system.

Login Credentials:
------------------
Email: ${email}
Temporary Password: ${password}
Role: ${getRoleDisplay(role)}

SECURITY NOTICE:
For security reasons, you must change this temporary password immediately upon your first login.
This password is for one-time use only.

Change Your Password:
${resetLink}

Next Steps:
1. Click the link above to change your password
2. Create a strong, unique password
3. Log in to the admin panel with your new password
4. Explore your dashboard and familiarize yourself with the system

Need Help?
If you have any questions or need assistance, please contact our support team at support@dahabiyatnilecruise.com

© ${new Date().getFullYear()} Dahabiya Nile Cruise. All rights reserved.
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Dahabiya Nile Cruise" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: '🚢 Welcome to Dahabiya Nile Cruise - Your Account Details',
      text: textContent,
      html: htmlContent,
    });

    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

function getRoleDisplay(role: string): string {
  const roleMap: Record<string, string> = {
    'ADMIN': '👑 Administrator - Full System Access',
    'MANAGER': '📊 Manager - Administrative Access',
    'GUIDE': '🗺️ Guide - Tour Management Access',
    'USER': '👤 User - Customer Access',
  };
  return roleMap[role] || role;
}

function generateResetToken(): string {
  // Generate a random token (in production, save this to database with expiry)
  return Buffer.from(`${Date.now()}-${Math.random().toString(36).substring(2)}`).toString('base64url');
}

// Export helper to save reset token to database
export async function savePasswordResetToken(email: string, token: string) {
  // This should save to your database with an expiry time (e.g., 24 hours)
  // Implementation depends on your database structure
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Example: Save to database
  // await prisma.passwordResetToken.create({
  //   data: {
  //     email,
  //     token,
  //     expiresAt,
  //   },
  // });
  
  return { token, expiresAt };
}
