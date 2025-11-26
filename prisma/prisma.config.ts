import { defineConfig } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default defineConfig({
  // For direct database connection
  datasourceUrl: databaseUrl,
  
  // If you're using Prisma Accelerate, uncomment and set this:
  // accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
  
  // Other Prisma Client configuration options
  // ...
});
