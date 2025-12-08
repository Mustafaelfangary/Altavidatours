// src/app/(root)/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}