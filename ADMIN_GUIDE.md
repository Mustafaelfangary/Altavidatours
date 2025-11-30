# Altavida Tours.com - Admin Panel Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Admin Features](#admin-features)
8. [Setup Instructions](#setup-instructions)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

## Project Overview

This document outlines the architecture, features, and implementation details of the Altavida Tours.com admin panel. The admin panel allows administrators to manage tours, bookings, users, and other aspects of the travel booking system.

## Tech Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Maps**: Google Maps API
- **Deployment**: Vercel (recommended)

## System Architecture

```
altavidatours/
├── .env                    # Environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static files
└── src/
    ├── app/                # App router pages
    │   ├── admin/          # Admin routes
    │   └── api/            # API routes
    ├── components/         # Reusable components
    ├── lib/                # Utility functions
    └── types/              # TypeScript types
```

## Database Schema

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  hashedPassword String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  tours         TravelService[]
}

// ... rest of the schema ...
```

## API Endpoints

### Tours
- `GET /api/tours` - Get all tours with pagination
- `POST /api/tours` - Create a new tour
- `GET /api/tours/[id]` - Get a single tour
- `PATCH /api/tours/[id]` - Update a tour
- `DELETE /api/tours/[id]` - Delete a tour

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/[id]` - Get a single booking
- `PATCH /api/bookings/[id]` - Update booking status
- `DELETE /api/bookings/[id]` - Cancel a booking

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create a new user (admin only)
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user details
- `DELETE /api/users/[id]` - Delete a user (admin only)

## Authentication & Authorization

### User Roles
- `ADMIN`: Full access to all features
- `GUIDE`: Can manage assigned tours
- `USER`: Can book tours and view their bookings

### Protected Routes
- All `/admin/*` routes require admin privileges
- User-specific routes are protected based on ownership
- API routes include role-based access control

## Admin Features

### Dashboard
- Overview of key metrics
- Recent bookings
- System status

### Tour Management
- Create, read, update, and delete tours
- Upload and manage tour images
- Set pricing and availability
- Manage tour categories and tags

### Booking Management
- View and filter bookings
- Update booking status
- Process refunds
- Export booking data

### User Management
- View and manage user accounts
- Assign roles and permissions
- Reset passwords
- View user activity

### Content Management
- Manage static pages
- Update site content
- Manage media library

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
- AWS S3 bucket (for file uploads)
- Google Maps API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Altavidatours.git
   cd Altavidatours
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the admin panel at `http://localhost:3000/admin`

## Deployment Guide

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab repository
2. Import the repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Set up build command: `npm run build`
5. Deploy!

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/treasure_egypt_tours"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-region"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Run `npx prisma generate` if schema changes

2. **Authentication Problems**
   - Check `NEXTAUTH_SECRET` is set
   - Verify callback URLs in auth provider settings
   - Clear browser cookies if session issues persist

3. **File Upload Failures**
   - Verify AWS S3 credentials and permissions
   - Check CORS configuration on S3 bucket
   - Ensure file size limits are not exceeded

### Getting Help

For additional support, please open an issue in the GitHub repository or contact the development team.

---

*Last updated: October 31, 2025*
