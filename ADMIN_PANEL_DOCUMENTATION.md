# Admin Panel & Database Schema Documentation

## Overview
This document describes the complete admin panel structure, database schema, and API endpoints for the Altavida Tours.com website.

## Database Schema

### Core Models

#### User
- Extended with `phone` field for user contacts
- Supports roles: `USER`, `ADMIN`, `EDITOR`, `GUIDE`, `MANAGER`
- Relationships: accounts, sessions, bookings, reviews, memories, preferences, loyaltyPoints, wishlist, toursGuided, blogs

#### Tour
- Core tour management with pricing, duration, difficulty
- Supports multiple categories and tags
- Includes GeoJSON locations for mapping
- Relationships: categories, tags, guides, reviews, bookings

#### Category & Tag
- Flexible content organization system
- Categories: broader classification (e.g., "Cultural", "Adventure")
- Tags: specific attributes (e.g., "Family-Friendly", "Luxury")

#### Booking
- Tracks tour reservations and payments
- Status: pending, confirmed, cancelled, completed
- Payment Status: pending, paid, refunded, failed

### Content Management Models

#### WebsiteContent
- **Purpose**: Dynamic page content management
- **Fields**:
  - `key`: Unique identifier (e.g., "about_hero_title")
  - `title`: Human-readable title
  - `content`: Text content (supports rich text)
  - `mediaUrl`: URL for images/videos
  - `contentType`: TEXT, IMAGE, VIDEO, RICH_TEXT, GALLERY, etc.
  - `page`: Page identifier (e.g., "homepage", "about")
  - `section`: Section within page (e.g., "hero", "features")
  - `order`: Display order
  - `isActive`: Visibility toggle
  - `metadata`: Additional JSON data

**Usage Example**:
```typescript
// Fetch homepage hero content
const content = await prisma.websiteContent.findMany({
  where: {
    page: 'homepage',
    section: 'hero',
    isActive: true
  },
  orderBy: { order: 'asc' }
});
```

#### Setting
- **Purpose**: Global site settings and configurations
- **Fields**:
  - `key`: Unique identifier (e.g., "whatsapp_phone")
  - `value`: Setting value (stored as text)
  - `category`: Grouping (general, email, whatsapp, payment, etc.)
  - `description`: Admin notes
  - `isPublic`: Whether accessible via public API

**Categories**:
- `general`: Site-wide settings
- `email`: Email configuration
- `whatsapp`: WhatsApp widget settings
- `sms`: SMS notification settings
- `payment`: Payment gateway configuration
- `analytics`: Tracking and analytics

#### PageContent
- **Purpose**: Legacy page content storage
- **Note**: Being migrated to WebsiteContent

#### GalleryImage
- Image management with categories and featured status
- Fields: url, title, description, isFeatured, order, category

### Tourism Models

#### Package
- **Purpose**: Tour packages and itineraries
- **Fields**:
  - Basic: name, slug, description, shortDescription
  - Pricing: price, discountPrice
  - Details: duration, destination, maxGroupSize, difficulty
  - Media: mainImage, images[]
  - Content: includes[], excludes[], itinerary (JSON)
  - Classification: category, isFeatured, isActive
  - Metadata: order, metadata (JSON)

#### Dahabiya
- **Purpose**: Traditional Nile boat details
- **Fields**:
  - Basic: name, slug, description, summary
  - Specifications: capacity, cabins, crew, length
  - Media: imageCover, images[], amenities[]
  - Features: JSON object with detailed specs
  - Status: isActive, isFeatured, order

#### Itinerary
- **Purpose**: Day-by-day tour schedules
- **Fields**:
  - title, slug, description
  - duration: Number of days
  - days: JSON array with daily activities
  - tourType: cruise, land, mixed
  - destination, isActive, order

#### TravelService
- **Purpose**: Individual travel services (guides, transport, etc.)
- **Fields**:
  - title, slug, description, summary
  - serviceType: accommodation, transport, guide, activity
  - price, duration (in minutes)
  - Media: imageCover, images[], features[]
  - Status: isActive, order
  - metadata: JSON for additional details

#### Destination
- **Purpose**: Location information
- **Fields**:
  - name, slug, description
  - country (default: Egypt), region
  - coordinates: JSON {lat, lng}
  - Media: imageCover, images[], highlights[]
  - Status: isActive, order

### Review & Feedback Models

#### Review
- Tour-specific reviews with ratings
- Unique constraint: one review per user per tour
- Fields: review, rating (1-5), tourId, userId

#### Testimonial
- General customer testimonials
- Fields: name, email, country, rating, content, tourName, travelDate
- Status: isApproved, isFeatured
- Order management for homepage display

#### Inquiry
- Customer contact form submissions
- Fields: name, email, phone, country, subject, message
- inquiryType: general, booking, custom, complaint
- status: new, in-progress, resolved, closed
- Assignment: assignedTo, notes

### Blog System

#### Blog
- Full blog post management
- Fields: title, slug, content, excerpt, coverImage
- authorId: Links to User
- category, tags[] for organization
- Publishing: isPublished, publishedAt, views
- SEO-friendly with slug-based URLs

### Loyalty & Engagement

#### LoyaltyPoint
- User point balances
- Fields: userId, points, description, expiresAt

#### LoyaltyAction
- Point earning history
- Fields: userId, action, points, description

#### WishlistItem
- User saved tours
- Unique constraint: one entry per user per tour

### Utility Models

#### Availability
- **Purpose**: Track booking availability for resources
- **Fields**:
  - resourceId, resourceType (tour, package, dahabiya)
  - date, slotsTotal, slotsBooked
  - isAvailable, price (override default)
  - notes
- **Unique Constraint**: resourceId + resourceType + date

#### UserMemory
- User travel memories/stories
- Fields: title, description, imageUrl, date, location, isPublic

#### UserPreference
- User settings
- Fields: preferredLanguage, currency, notifications, marketingEmails

#### ChatConversation
- AI assistant chat history
- Fields: sessionId, userMessage, assistantResponse, metadata

#### Partner
- Partner/sponsor logos and links
- Fields: name, logoUrl, websiteUrl, description, order, isActive

## API Endpoints

### Public APIs

#### Website Content
```
GET  /api/website-content?page=homepage&section=hero
POST /api/website-content (admin only)
PUT  /api/website-content (admin only)
DELETE /api/website-content?id={id} (admin only)
```

#### Settings
```
GET  /api/settings?category=whatsapp&public=true
POST /api/settings (admin only)
PUT  /api/settings (admin only)
DELETE /api/settings?key={key} (admin only)
```

#### Tours
```
GET  /api/tours?page=1&limit=10&search=cairo
POST /api/tours (admin only)
```

#### Packages
```
GET  /api/packages?page=1&featured=true&category=luxury
POST /api/packages (admin only)
PUT  /api/packages (admin only)
DELETE /api/packages?id={id} (admin only)
```

#### Bookings
```
GET  /api/bookings (authenticated)
POST /api/bookings (authenticated)
GET  /api/bookings/{id} (authenticated)
PUT  /api/bookings/{id}/status (admin only)
```

#### Blogs
```
GET  /api/blogs?page=1&published=true
GET  /api/blogs/{slug}
POST /api/blogs (admin only)
PUT  /api/blogs/{id} (admin only)
DELETE /api/blogs/{id} (admin only)
```

### Admin APIs

#### Users
```
GET  /api/admin/users
POST /api/admin/users
GET  /api/admin/users/{id}
PUT  /api/admin/users/{id}
DELETE /api/admin/users/{id}
PUT  /api/admin/users/{id}/role
```

#### Gallery
```
GET  /api/admin/gallery/images
POST /api/admin/gallery/images
PUT  /api/admin/gallery/images/{id}
DELETE /api/admin/gallery/images/{id}
GET  /api/admin/gallery/categories
```

#### Itineraries
```
GET  /api/admin/itineraries
POST /api/admin/itineraries
GET  /api/admin/itineraries/{id}
PUT  /api/admin/itineraries/{id}
DELETE /api/admin/itineraries/{id}
```

#### Reviews
```
GET  /api/admin/reviews
PUT  /api/admin/reviews/{id}
DELETE /api/admin/reviews/{id}
```

#### Logo Management
```
GET  /api/admin/logo
POST /api/admin/logo
```

#### Media
```
GET  /api/admin/media
POST /api/admin/media/upload
PUT  /api/admin/media/{id}
DELETE /api/admin/media/{id}
```

#### Email Settings
```
GET  /api/admin/email-settings
POST /api/admin/email-settings
POST /api/admin/test-email
```

#### Notification Settings
```
GET  /api/admin/notification-settings
POST /api/admin/notification-settings
GET  /api/admin/notification-rules
POST /api/admin/notification-rules
```

#### Stats & Analytics
```
GET  /api/admin/overview
GET  /api/admin/quick-stats
GET  /api/admin/stats
```

## Admin Panel Features

### Dashboard (`/admin`)
- Quick stats (tours, bookings, users counts)
- Recent bookings table
- System status indicators

### Content Management

#### Tours (`/admin/tours`)
- List all tours with search and filters
- Create/edit tours with:
  - Basic info (title, slug, description)
  - Pricing and duration
  - Categories and tags
  - Images and cover photo
  - Locations (GeoJSON)
  - Start dates
  - Guide assignments

#### Packages (`/admin/packages`)
- Package CRUD operations
- Itinerary builder (day-by-day)
- Includes/excludes lists
- Featured package toggle

#### Website Content (`/admin/website`)
- Page-by-page content editor
- Key-value content management
- Media upload and linking
- Preview changes
- Bulk operations

#### Itineraries (`/admin/itineraries`)
- Create detailed day-by-day schedules
- Link to tours/packages
- Reorder days
- Add activities and notes

#### Gallery (`/admin/gallery`)
- Upload images
- Organize by categories
- Set featured images
- Reorder for display
- Bulk upload support

#### Blogs (`/admin/blogs`)
- Rich text editor
- SEO fields (slug, excerpt)
- Category and tags
- Publish/draft status
- Schedule publishing

### User Management (`/admin/users`)
- View all users
- Filter by role
- Create admin/manager accounts
- Send welcome emails
- Force password change
- Manage roles

### Booking Management (`/admin/bookings`)
- View all bookings
- Filter by status/date
- Update booking status
- Send confirmation emails
- Export to CSV
- Booking details view

### Settings

#### Email Settings (`/admin/email-settings`)
- SMTP configuration
- Email templates
- Test email sending
- Default sender info

#### WhatsApp Settings (`/admin/whatsapp-settings`)
- Enable/disable widget
- Phone number
- Welcome message
- Position and timing
- Business hours message

#### Logo Manager (`/admin/logo-manager`)
- Upload site logo
- Navbar logo
- Footer logo
- Favicon
- Preview logos

#### Developer Settings (`/admin/developer-settings`)
- API keys
- Environment variables
- Debug mode
- Cache management

### Media Management (`/admin/media`)
- Central media library
- Upload files
- Organize by type
- Search and filter
- Usage tracking

### Reviews & Testimonials (`/admin/reviews`)
- Moderate reviews
- Approve/reject
- Feature testimonials
- Respond to reviews

### Availability (`/admin/availability`)
- Calendar view
- Set available slots
- Block dates
- Override pricing

## Authentication & Authorization

### Roles
1. **USER**: Regular customer
   - Can book tours
   - Write reviews
   - Manage profile

2. **GUIDE**: Tour guide
   - View assigned tours
   - Access guide dashboard
   - Update tour status

3. **EDITOR**: Content editor
   - Manage content
   - Edit blogs
   - Moderate reviews

4. **MANAGER**: Operations manager
   - All editor permissions
   - Manage bookings
   - View analytics
   - Manage users (except admins)

5. **ADMIN**: System administrator
   - Full system access
   - Manage all users
   - System settings
   - Developer tools

### Protected Routes
- `/admin/*` - Requires ADMIN or MANAGER role
- `/api/admin/*` - Requires ADMIN or MANAGER role
- `/guide/*` - Requires GUIDE, MANAGER, or ADMIN role

## Content Management System

### useContent Hook
```typescript
const { content, loading, error, getContent, refetch } = useContent({
  page: 'homepage',
  section: 'hero'
});

// Get specific content
const heroTitle = getContent('hero_title', 'Default Title');
const heroImage = getContent('hero_image', '/default.jpg');
```

### Content Keys Convention
Format: `{page}_{section}_{element}_{type}`

Examples:
- `homepage_hero_title` - Homepage hero section title
- `about_team_description` - About page team section description
- `contact_form_email` - Contact form email field
- `footer_social_facebook` - Footer Facebook link

### Dynamic Content Updates
- Content updates via admin panel
- Real-time preview
- Automatic cache invalidation
- Broadcast channel notifications
- No deployment needed for content changes

## Next Steps

1. **Content Population**
   - Add initial website content via admin panel
   - Upload images to gallery
   - Create tour packages
   - Set up email templates

2. **Configuration**
   - Configure SMTP settings
   - Set up WhatsApp widget
   - Configure payment gateway
   - Set up analytics

3. **User Setup**
   - Create admin account
   - Add managers/editors
   - Invite tour guides
   - Set role permissions

4. **Testing**
   - Test booking flow
   - Verify email notifications
   - Check content updates
   - Test payment processing

## Development Notes

### Environment Variables Required
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://..."
NEXTAUTH_SECRET="..."
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="..."
EMAIL_SERVER_PASSWORD="..."
EMAIL_FROM="..."
```

### Cache Management
- Next.js uses aggressive caching
- Admin updates trigger revalidation
- Use `revalidatePath()` after content updates
- BroadcastChannel for cross-tab updates

### Database Migrations
```bash
# Push schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Build & Deploy
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL in `.env`
   - Check PostgreSQL is running
   - Ensure database exists

2. **Prisma Errors**
   - Run `npx prisma generate`
   - Clear node_modules and reinstall
   - Check schema syntax

3. **Content Not Updating**
   - Check cache settings
   - Force page revalidation
   - Clear browser cache
   - Verify BroadcastChannel support

4. **Auth Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches domain
   - Clear cookies and retry

5. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall/port access
   - Test with `/api/admin/test-email`
   - Enable "Less secure apps" for Gmail

## API Authentication

All admin APIs require authentication:
```typescript
const session = await getServerSession(authOptions);
if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Security Considerations

1. **Input Validation**
   - All inputs validated on server-side
   - Zod schema validation for complex data
   - SQL injection prevention (Prisma ORM)

2. **Authentication**
   - NextAuth.js for secure auth
   - JWT session strategy
   - CSRF protection enabled

3. **Authorization**
   - Role-based access control
   - Route-level protection
   - API endpoint authorization

4. **Data Protection**
   - Passwords hashed with bcrypt
   - Sensitive data encrypted
   - HTTPS enforced in production

## Support

For issues or questions:
1. Check this documentation
2. Review API endpoint responses
3. Check browser console for errors
4. Verify database schema is up to date
5. Contact development team
