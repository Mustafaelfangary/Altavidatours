import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9]+$/, "Phone number can only contain digits and an optional '+' prefix")
    .transform(val => val.startsWith('+') ? val : `+${val}`), // Ensure phone number always starts with +
  image: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    console.log('Received signup request');
    const body = await req.json();
    console.log('Request body:', { ...body, password: '[REDACTED]' });

    const { name, email, password, phone, image } = signUpSchema.parse(body);
    console.log('Parsed data:', { name, email, phone, image });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    console.log('Password hashed successfully');

    // Create the user
    console.log('Creating user in database...');
    const userData = {
      name,
      email,
      password: hashedPassword,
      image,
      role: "USER", // Default role for new users
    } as const;

    // Add phone only if it exists
    if (phone) {
      (userData as any).phone = phone;
    }

    const user = await prisma.user.create({
      data: userData,
    });
    console.log('User created successfully:', { id: user.id, email: user.email });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 

