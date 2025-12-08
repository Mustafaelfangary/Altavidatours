"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);

      // First check if user exists and if email is verified (bypass for admin users)
      const checkResponse = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      if (checkResponse.ok) {
        const userData = await checkResponse.json();
        if (userData.exists && !userData.isEmailVerified && userData.role !== 'ADMIN') {
          toast.error("Please verify your email address before signing in.");
          router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        }
      }

      // Get callback URL from search params or default to admin dashboard
      const urlParams = new URLSearchParams(window.location.search);
      let callbackUrl = urlParams.get('callbackUrl') || '/admin';
      
      // Ensure the callback URL is a relative path
      if (callbackUrl.startsWith('http')) {
        try {
          const url = new URL(callbackUrl);
          callbackUrl = url.pathname + url.search;
        } catch (e) {
          console.error('Invalid callback URL:', callbackUrl);
          callbackUrl = '/';
        }
      }

      console.log('Signing in with callback URL:', callbackUrl);

      // Sign in with credentials and let NextAuth handle redirect atomically to avoid race conditions
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: callbackUrl
      });

      // If redirect is true, NextAuth will navigate. This log is mainly for debugging in non-redirect scenarios.
      console.log('Sign in result:', result);
      
      // No manual navigation here to prevent loops; errors will be handled by NextAuth or shown above.
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-text-primary text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-text-primary text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link 
              href="/auth/forgot-password"
              className="text-primary hover:text-primary-dark"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link 
            href="/auth/signup"
            className="text-primary hover:text-primary-dark"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
} 