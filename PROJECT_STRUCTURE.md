# Altavida Tours.com - Complete Project Structure

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL with Prisma ORM 6.18.0
- **Authentication**: NextAuth.js 4.24.13
- **UI Libraries**: 
  - Material-UI (MUI) 7.1.2
  - Radix UI Components
  - Tailwind CSS 4.1.13
  - Shadcn/ui Components
- **State Management**: TanStack React Query 5.90.1
- **Forms**: React Hook Form 7.65.0 + Zod 3.25.76
- **Rich Text**: TipTap Editor
- **Charts**: Chart.js 4.5.0 + Recharts
- **3D Graphics**: Three.js + React Three Fiber
- **Email**: Nodemailer 7.0.9
- **File Upload**: UploadThing
- **Animations**: Framer Motion 12.23.24

## 📁 Project Structure

```
E:\Altavidaweb\
├── 📱 src/
│   ├── 🎯 app/                          # Next.js App Router
│   │   ├── 🏠 (public pages)/
│   │   │   ├── page.tsx                 # Homepage (TravelOK Theme)
│   │   │   ├── about/
│   │   │   ├── packages/
│   │   │   ├── dahabiyas/
│   │   │   ├── itineraries/
│   │   │   ├── gallery/
│   │   │   ├── blogs/
│   │   │   ├── contact/
│   │   │   ├── tailor-made/
│   │   │   ├── schedule-and-rates/
│   │   │   └── ...
│   │   │
│   │   ├── 👑 admin/                    # ADMIN PANEL (Full CMS)
│   │   │   ├── layout.tsx              # Admin layout with auth & navigation
│   │   │   ├── page.tsx                # Dashboard with stats
│   │   │   │
│   │   │   ├── 📝 Content Management/
│   │   │   │   ├── website/            # Dynamic content editor
│   │   │   │   ├── tours/              # Tour management
│   │   │   │   ├── packages/           # Package management
│   │   │   │   ├── blogs/              # Blog CMS
│   │   │   │   ├── itineraries/        # Itinerary builder
│   │   │   │   └── dahabiyas/          # Dahabiya management
│   │   │   │
│   │   │   ├── 🖼️ Media Management/
│   │   │   │   ├── gallery/            # Image library
│   │   │   │   ├── media/              # File manager
│   │   │   │   └── logo-manager/       # Logo uploader
│   │   │   │
│   │   │   ├── 👥 User Management/
│   │   │   │   ├── users/              # User CRUD
│   │   │   │   └── bookings/           # Booking management
│   │   │   │
│   │   │   ├── 📧 Communication/
│   │   │   │   ├── email-settings/     # SMTP config
│   │   │   │   ├── email-templates/    # Email designer
│   │   │   │   ├── whatsapp-settings/  # WhatsApp widget
│   │   │   │   └── notification-settings/
│   │   │   │
│   │   │   ├── ⚙️ Settings/
│   │   │   │   ├── settings/           # General settings
│   │   │   │   ├── developer-settings/ # API keys & env
│   │   │   │   └── availability/       # Calendar management
│   │   │   │
│   │   │   └── 📊 Analytics/
│   │   │       ├── overview/           # Stats dashboard
│   │   │       ├── reviews/            # Review moderation
│   │   │       └── loyalty-system/     # Points management
│   │   │
│   │   ├── 🔌 api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/      # NextAuth handler
│   │   │   │   ├── signup/
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── verify-email/
│   │   │   │   └── force-password-change/
│   │   │   │
│   │   │   ├── 🏛️ Public APIs/
│   │   │   │   ├── tours/              # GET tours (public)
│   │   │   │   ├── packages/           # GET packages
│   │   │   │   ├── blogs/              # GET blogs
│   │   │   │   ├── bookings/           # POST booking
│   │   │   │   ├── contact/            # POST contact form
│   │   │   │   ├── website-content/    # GET dynamic content
│   │   │   │   └── settings/           # GET public settings
│   │   │   │
│   │   │   └── 👑 admin/               # Admin-only APIs
│   │   │       ├── users/              # User CRUD
│   │   │       ├── tours/              # Tour CRUD
│   │   │       ├── bookings/           # Booking management
│   │   │       ├── gallery/            # Image management
│   │   │       ├── itineraries/        # Itinerary CRUD
│   │   │       ├── blogs/              # Blog CRUD
│   │   │       ├── reviews/            # Review moderation
│   │   │       ├── email-settings/     # Email config
│   │   │       ├── notification-settings/
│   │   │       ├── logo/               # Logo management
│   │   │       ├── media/              # Media library
│   │   │       ├── overview/           # Dashboard stats
│   │   │       └── ...
│   │   │
│   │   ├── 🎨 globals.css              # Global styles
│   │   └── layout.tsx                  # Root layout
│   │
│   ├── 🧩 components/                   # React Components
│   │   ├── ui/                         # Shadcn/Radix UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── admin/                      # Admin-specific components
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminProvider.tsx
│   │   │   ├── AdminTextFixer.tsx
│   │   │   ├── CleanWebsiteContentManager.tsx
│   │   │   ├── AdminUsersScreen.tsx
│   │   │   └── ...
│   │   │
│   │   ├── forms/                      # Form components
│   │   │   ├── TourForm.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── ...
│   │   │
│   │   ├── TravelOKHomepage.tsx        # Homepage component
│   │   ├── UnifiedHero.tsx             # Hero section
│   │   ├── LogoLoader.tsx              # Loading spinner
│   │   └── ...
│   │
│   ├── 🔧 lib/                          # Utilities & Libraries
│   │   ├── auth.ts                     # NextAuth configuration
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── content-service.ts          # Content fetching service
│   │   ├── email/
│   │   │   ├── welcome-email.ts
│   │   │   ├── booking-confirmation.ts
│   │   │   └── ...
│   │   ├── utils.ts                    # Utility functions
│   │   └── ...
│   │
│   ├── 🎣 hooks/                        # Custom React Hooks
│   │   ├── useContent.ts               # Dynamic content hook
│   │   ├── useSettings.ts              # Settings hook
│   │   └── ...
│   │
│   ├── 🎨 styles/                       # Additional stylesheets
│   │   ├── admin.css
│   │   ├── admin-contrast-fix.css
│   │   ├── mui-admin-override.css
│   │   └── ...
│   │
│   └── 📝 types/                        # TypeScript definitions
│       ├── next-auth.d.ts              # NextAuth types
│       └── ...
│
├── 🗄️ prisma/
│   ├── schema.prisma                   # Database schema (26+ models)
│   └── migrations/                     # Database migrations
│
├── 🌍 public/                           # Static assets
│   ├── images/                         # Images by category
│   │   ├── cultural&historical/
│   │   ├── desert&safary/
│   │   ├── Alexandria/
│   │   ├── Red Sea/
│   │   ├── Royal Cleopatra/
│   │   └── ...
│   └── logos/
│       └── icons/AppIcons/android/mipmap-xxxhdpi/altavida.png
│
├── ⚙️ Configuration Files
│   ├── package.json                    # Dependencies & scripts
│   ├── tsconfig.json                   # TypeScript config
│   ├── next.config.js                  # Next.js config
│   ├── tailwind.config.ts              # Tailwind config
│   ├── postcss.config.js               # PostCSS config
│   ├── .eslintrc.json                  # ESLint config
│   ├── .env                            # Environment variables
│   └── .gitignore
│
├── 📚 Documentation
│   ├── README.md
│   ├── ADMIN_PANEL_DOCUMENTATION.md    # Complete admin guide
│   ├── QUICK_START.md                  # Quick setup guide
│   └── PROJECT_STRUCTURE.md            # This file
│
└── 🔧 VS Code Workspace
   └── altavidatours.code-workspace
```

## 🗄️ Database Models (Prisma Schema)

### Core Models
1. **User** - Authentication & user management
2. **Account** - OAuth accounts
3. **Session** - User sessions
4. **VerificationToken** - Email verification

### Content Models
5. **Tour** - Tour packages with locations
6. **Category** - Tour categories
7. **Tag** - Tour tags
8. **Package** - Travel packages
9. **Dahabiya** - Traditional boats
10. **Itinerary** - Day-by-day schedules
11. **Blog** - Blog posts
12. **TravelService** - Individual services

### Media & Content
13. **WebsiteContent** - Dynamic page content
14. **PageContent** - Legacy content
15. **GalleryImage** - Image library
16. **Setting** - Site settings

### Location
17. **Destination** - Location information

### Engagement
18. **Review** - Tour reviews
19. **Testimonial** - Customer testimonials
20. **Inquiry** - Contact form submissions
21. **Booking** - Reservations
22. **Availability** - Booking availability

### Loyalty
23. **LoyaltyPoint** - User points
24. **LoyaltyAction** - Point history
25. **WishlistItem** - Saved tours

### Misc
26. **UserMemory** - Travel stories
27. **UserPreference** - User settings
28. **ChatConversation** - AI chat history
29. **Partner** - Partner logos

## 🎯 Key Features

### ✅ Fully Dynamic Website
- All content managed via admin panel
- No code deployment needed for content updates
- Real-time content synchronization
- Dynamic routing for tours, packages, blogs

### ✅ Complete Admin Panel
- **Dashboard**: Stats, recent activity
- **Content Management**: Tours, packages, blogs, itineraries
- **Media Library**: Upload, organize, manage images
- **User Management**: CRUD, roles, permissions
- **Booking System**: View, manage, export bookings
- **Email System**: SMTP config, templates, notifications
- **Settings**: WhatsApp, logos, general config
- **Analytics**: Overview, reviews, loyalty system

### ✅ Authentication & Authorization
- **Roles**: USER, ADMIN, MANAGER, EDITOR, GUIDE
- **NextAuth.js**: Session management
- **Protected Routes**: Role-based access control
- **Password Management**: Reset, force change

### ✅ Content Management System
- **useContent Hook**: Fetch dynamic content
- **Key-Value System**: `{page}_{section}_{element}`
- **Live Updates**: BroadcastChannel for real-time sync
- **Cache Management**: Automatic revalidation

### ✅ Booking System
- **Public Booking**: User-facing booking form
- **Admin Management**: View, update, export
- **Email Notifications**: Automated confirmations
- **Status Tracking**: Pending, confirmed, cancelled, completed

### ✅ Blog System
- **Rich Text Editor**: TipTap
- **SEO Optimization**: Slug-based URLs
- **Category & Tags**: Organization
- **Publish/Draft**: Control visibility
- **Author Attribution**: Links to users

### ✅ Media Management
- **Gallery**: Organized by categories
- **Featured Images**: Homepage display
- **Bulk Upload**: Multiple files at once
- **Usage Tracking**: Where images are used

### ✅ Email System
- **SMTP Configuration**: Admin panel
- **Email Templates**: Customizable designs
- **Welcome Emails**: Auto-send to new users
- **Booking Confirmations**: Automated
- **Test Emails**: Send test messages

### ✅ WhatsApp Integration
- **Widget**: Floating WhatsApp button
- **Configurable**: Phone, message, position
- **Business Hours**: Custom messages
- **Enable/Disable**: Toggle from admin

## 🚀 Development Workflow

### 1. Start Development
```bash
npm run dev                    # Start dev server on :3001
```

### 2. Database Management
```bash
npx prisma studio              # Open database GUI
npx prisma db push             # Push schema changes
npx prisma generate            # Generate client
```

### 3. Build & Deploy
```bash
npm run build                  # Production build
npm start                      # Start production server
```

### 4. Testing
```bash
npm run test                   # Run tests
npm run typecheck              # Type checking
npm run lint                   # Lint code
```

## 🔐 Environment Variables

Required in `.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/altavida"

# NextAuth
NEXTAUTH_URL="http://www.altavidatours.com"
NEXTAUTH_SECRET="your-secret-key"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="info@altavidatours.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="support@altavidatours.com"

# Site
NEXT_PUBLIC_SITE_URL="http://www.altavidatours.com"
```

## 📊 Admin Panel Routes

### Content Management
- `/admin` - Dashboard
- `/admin/website` - Dynamic content editor
- `/admin/tours` - Tour management
- `/admin/tours/new` - Create tour
- `/admin/tours/[id]` - Edit tour
- `/admin/packages` - Package management
- `/admin/blogs` - Blog CMS
- `/admin/blogs/new` - Create blog
- `/admin/itineraries` - Itinerary builder
- `/admin/dahabiyas` - Dahabiya management

### Media
- `/admin/gallery` - Image library
- `/admin/media` - File manager
- `/admin/logo-manager` - Logo uploader

### Users & Bookings
- `/admin/users` - User management
- `/admin/users/[id]` - Edit user
- `/admin/bookings` - Booking list
- `/admin/bookings/[id]` - Booking details

### Settings
- `/admin/settings` - General settings
- `/admin/email-settings` - SMTP config
- `/admin/email-templates` - Email designer
- `/admin/whatsapp-settings` - WhatsApp widget
- `/admin/notification-settings` - Notifications
- `/admin/developer-settings` - API keys

### Analytics
- `/admin/overview` - Dashboard stats
- `/admin/reviews` - Review moderation
- `/admin/loyalty-system` - Points management
- `/admin/availability` - Calendar

## 🎨 UI Component Library

### Shadcn/ui Components
- Button, Card, Dialog, Form
- Input, Select, Textarea
- Checkbox, Radio, Switch
- Tabs, Accordion, Dropdown
- Toast, Alert, Progress
- Table, Pagination, Avatar
- Badge, Separator, Tooltip

### Custom Components
- AdminHeader, AdminSidebar
- TravelOKHomepage
- UnifiedHero
- LogoLoader
- TourForm, BookingForm

## 🔌 API Endpoints Summary

### Public APIs
- `GET /api/tours` - List tours
- `GET /api/packages` - List packages
- `GET /api/blogs` - List blogs
- `GET /api/website-content` - Get content
- `GET /api/settings` - Get public settings
- `POST /api/bookings` - Create booking
- `POST /api/contact` - Submit contact form

### Admin APIs (Auth Required)
- `/api/admin/users` - User CRUD
- `/api/admin/tours` - Tour CRUD
- `/api/admin/bookings` - Booking management
- `/api/admin/gallery` - Image management
- `/api/admin/blogs` - Blog CRUD
- `/api/admin/email-settings` - Email config
- `/api/admin/logo` - Logo management
- `/api/admin/overview` - Dashboard stats

## 📝 Code Conventions

### File Naming
- **Components**: PascalCase (e.g., `AdminHeader.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`)
- **Utils**: camelCase (e.g., `content-service.ts`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useContent.ts`)

### Import Paths
- Use `@/` alias for absolute imports
- Example: `import { Button } from '@/components/ui/button'`

### TypeScript
- Strict mode enabled
- All components typed
- API responses typed
- Zod for runtime validation

### Styling
- Tailwind CSS utility-first
- MUI components for admin
- Shadcn for public site
- CSS modules for custom styles

## 🎯 Next Steps for Development

1. **Content Population**
   - Add tours via `/admin/tours`
   - Upload images to `/admin/gallery`
   - Create packages in `/admin/packages`
   - Write blogs in `/admin/blogs`

2. **Configuration**
   - Set up SMTP in `/admin/email-settings`
   - Configure WhatsApp in `/admin/whatsapp-settings`
   - Upload logo in `/admin/logo-manager`

3. **User Management**
   - Create admin accounts in `/admin/users`
   - Assign roles appropriately
   - Test permissions

4. **Testing**
   - Test booking flow
   - Verify email delivery
   - Check content updates
   - Test admin operations

## 🆘 Support & Troubleshooting

See `ADMIN_PANEL_DOCUMENTATION.md` and `QUICK_START.md` for:
- Detailed setup instructions
- Common issues and solutions
- API documentation
- Development tips

## 📜 License & Credits

**Project**: Altavida Tours.com
**Framework**: Next.js 15
**Database**: PostgreSQL + Prisma
**Authentication**: NextAuth.js
**UI**: Material-UI + Tailwind CSS

---

*Last Updated: November 2025*
