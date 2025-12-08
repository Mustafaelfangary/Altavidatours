import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        image: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const { name, email, role, password } = data;

    // Validate role if provided
    if (role) {
      const validRoles = ['ADMIN', 'MANAGER', 'GUIDE', 'USER'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ 
          error: 'Invalid role',
          message: 'Role must be one of: ADMIN, MANAGER, GUIDE, USER' 
        }, { status: 400 });
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id }
        }
      });

      if (emailTaken) {
        return NextResponse.json({ 
          error: 'Email already taken',
          message: 'Another user already has this email address' 
        }, { status: 409 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;

    // Hash new password if provided
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ 
          error: 'Password too short',
          message: 'Password must be at least 6 characters long' 
        }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true
      }
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: 'User updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      error: 'Failed to update user',
      message: 'An error occurred while updating the user' 
    }, { status: 500 });
  }
}

// PATCH /api/admin/users/[id] - Partial update user (alias for PUT)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if (session.user.id === id) {
      return NextResponse.json({ 
        error: 'Cannot delete yourself',
        message: 'You cannot delete your own account' 
      }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      error: 'Failed to delete user',
      message: 'An error occurred while deleting the user' 
    }, { status: 500 });
  }
}