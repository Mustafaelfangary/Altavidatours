import { defineConfig } from "@prisma/config";

const connectionString = process.env.DATABASE_URL;

export default defineConfig({
  datasource: {
    url: connectionString,
    // For direct database access (optional)
    shadowDatabaseUrl: connectionString,
    // For Prisma Accelerate (optional)
    // accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
  },
});