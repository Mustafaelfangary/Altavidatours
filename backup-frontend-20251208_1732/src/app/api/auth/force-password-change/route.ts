import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword, token } = await request.json();

    // Validate inputs
    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Email and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow admin roles to use this endpoint
    const adminRoles = ['ADMIN', 'MANAGER', 'GUIDE'];
    if (!adminRoles.includes(user.role)) {
      return NextResponse.json(
        { message: 'This feature is only available for admin users' },
        { status: 403 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        emailVerified: new Date() // Verify email if not already verified
      }
    });

    return NextResponse.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { message: 'An error occurred while changing the password' },
      { status: 500 }
    );
  }
}
