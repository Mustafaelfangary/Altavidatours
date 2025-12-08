// Type definitions for module resolution

// For @/lib/auth
declare module '@/lib/auth' {
  import { NextAuthOptions } from 'next-auth';
  export const authOptions: NextAuthOptions;
}

// For @/lib/prisma
declare module '@/lib/prisma' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export default prisma;
}
