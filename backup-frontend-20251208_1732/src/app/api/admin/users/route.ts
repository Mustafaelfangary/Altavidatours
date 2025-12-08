import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email/welcome-email';

// GET /api/admin/users - Get all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        phone: true,
        loyaltyPoints: true,
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Transform users to match frontend expectations
    const transformedUsers = users.map(user => ({
      ...user,
      isEmailVerified: !!user.emailVerified,
      loyaltyPoints: user.loyaltyPoints || 0
    }));

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, password, role } = data;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Name, email, password, and role are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format',
        message: 'Please provide a valid email address' 
      }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password too short',
        message: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Validate role
    const validRoles = ['ADMIN', 'MANAGER', 'GUIDE', 'USER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role',
        message: 'Role must be one of: ADMIN, MANAGER, GUIDE, USER' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User already exists',
        message: 'A user with this email address already exists' 
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: new Date() // Auto-verify admin-created users
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true
      }
    });

    // Send welcome email only for admin roles (ADMIN, MANAGER, GUIDE)
    const adminRoles = ['ADMIN', 'MANAGER', 'GUIDE'];
    if (adminRoles.includes(role)) {
      try {
        await sendWelcomeEmail({
          email,
          name,
          password, // Send the plain password (before hashing)
          role
        });
        console.log(`Welcome email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the user creation if email fails
        // Just log the error
      }
    }

    return NextResponse.json({ 
      user,
      message: adminRoles.includes(role) 
        ? 'User created successfully! Welcome email sent with login credentials.' 
        : 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ 
      error: 'Failed to create user',
      message: 'An error occurred while creating the user' 
    }, { status: 500 });
  }
}