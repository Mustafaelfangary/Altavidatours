import { NextRequest, NextResponse } from 'next/server';

// Simplified middleware for Edge Runtime compatibility
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle image requests - simplified for Edge Runtime
  if (pathname.startsWith('/images/')) {
    // Let Next.js handle image optimization
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/images/:path*',
  ],
};