const connectionString = process.env.DATABASE_URL;

const config = {
  datasources: {
    db: {
      url: connectionString,
    },
  },
  // For direct database access (optional)
  directUrl: connectionString,
  // For Prisma Accelerate (optional)
  // accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
} as const;

export default config;