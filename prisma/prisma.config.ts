import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: './schema.prisma',
  migrate: {
    // Use DATABASE_URL for migrations
    url: process.env.DATABASE_URL!,
  },
})
