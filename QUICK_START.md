# Quick Start Guide - Altavida Tours.com Admin Panel

## ✅ Completed Setup

### 1. Database Schema ✓
- All required models added to Prisma schema
- Database synchronized with `prisma db push`
- Prisma client generated

### 2. API Routes Fixed ✓
- `/api/tours` - Fixed role check (was using `.roles`, now uses `.role`)
- `/api/website-content` - Working with WebsiteContent model
- `/api/website-content/whatsapp-settings` - Fixed to use `category` field
- `/api/logo` - Working with WebsiteContent model
- `/api/admin/*` - All admin APIs properly secured

### 3. Authentication ✓
- Admin layout redirects work correctly
- Role-based access control implemented
- Session checks for ADMIN/MANAGER roles

## 🚀 Getting Started

### Access the Admin Panel

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   Server runs on: http://localhost:3001

2. **Access admin panel**:
   ```
   http://localhost:3001/admin
   ```

3. **Sign in**:
   - If you don't have an admin account, create one via database or signup endpoint

### First Time Setup

#### Create Admin User (via Prisma Studio)
```bash
npx prisma studio
```
Then:
1. Open User table
2. Create new user with:
   - email: your-email@example.com
   - password: (hash using bcrypt - see below)
   - role: ADMIN
   - emailVerified: (current date)

#### Hash Password (Node.js)
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 12);
console.log(hash); // Use this in database
```

## 📋 Main Admin Features

### Dashboard (`/admin`)
- View quick stats
- Recent bookings
- System overview

### Content Management

#### Website Content (`/admin/website`)
Edit dynamic content for all pages:
- Homepage
- About
- Contact
- Services
- Any other page

**Content Keys Format**: `{page}_{section}_{element}`
Example: `homepage_hero_title`

#### Tours (`/admin/tours`)
- Create/edit/delete tours
- Manage pricing and schedules
- Assign guides
- Add images and locations

#### Packages (`/admin/packages`)
- Manage tour packages
- Create itineraries
- Set pricing
- Feature packages

#### Blogs (`/admin/blogs`)
- Write blog posts
- Manage categories
- Publish/unpublish
- SEO optimization

### Media Management

#### Gallery (`/admin/gallery`)
- Upload images
- Organize by category
- Set featured images
- Bulk operations

#### Logo Manager (`/admin/logo-manager`)
- Update site logo
- Navbar logo
- Footer logo
- Favicon

### User Management (`/admin/users`)
- View all users
- Create admin/manager accounts
- Assign roles
- Send welcome emails

### Bookings (`/admin/bookings`)
- View all bookings
- Update statuses
- Export data
- Send confirmations

### Settings

#### Email Settings (`/admin/email-settings`)
Configure SMTP:
```
Host: smtp.gmail.com
Port: 587
User: your-email@gmail.com
Password: your-app-password
From: info@altavidatours.com
```

#### WhatsApp Settings (`/admin/whatsapp-settings`)
- Enable/disable widget
- Set phone number
- Customize messages
- Configure timing

## 🔧 Common Tasks

### Add New Website Content

1. Go to `/admin/website`
2. Select page (e.g., "homepage")
3. Click "Add Content"
4. Fill in:
   - Key: `homepage_hero_title`
   - Title: "Homepage Hero Title"
   - Content: "Your hero title here"
   - Content Type: TEXT or IMAGE
   - Section: hero
5. Save

### Create a Tour

1. Go to `/admin/tours`
2. Click "Create New Tour"
3. Fill in required fields:
   - Title, slug, description
   - Price, duration
   - Categories and tags
   - Images
   - Start location (GeoJSON)
4. Save

### Add a Package

1. Go to `/admin/packages`
2. Click "Create Package"
3. Fill in:
   - Name, description
   - Price, duration
   - Destination
   - Includes/excludes
   - Day-by-day itinerary
4. Mark as featured (optional)
5. Save

### Upload Images

1. Go to `/admin/gallery`
2. Click "Upload Images"
3. Select files
4. Add titles/descriptions
5. Assign categories
6. Set featured status
7. Save

### Manage Users

1. Go to `/admin/users`
2. View all users
3. To create admin:
   - Click "Create User"
   - Fill in details
   - Select role: ADMIN or MANAGER
   - System sends welcome email
4. To change role:
   - Click user
   - Select new role
   - Save

## 🔍 Testing the System

### Test Content Updates

1. Update content in `/admin/website`
2. Open website in another tab
3. Refresh page
4. Changes should appear immediately

### Test Booking Flow

1. Create a tour in `/admin/tours`
2. Set availability in `/admin/availability`
3. Go to public site
4. Try booking the tour
5. Check booking appears in `/admin/bookings`

### Test Email System

1. Configure SMTP in `/admin/email-settings`
2. Click "Send Test Email"
3. Check your inbox
4. If failed, check console for errors

## 📊 Database Models

### Key Tables
- `User` - Users and authentication
- `Tour` - Tour packages
- `Package` - Travel packages
- `Booking` - Reservations
- `WebsiteContent` - Dynamic content
- `Setting` - Site settings
- `Blog` - Blog posts
- `GalleryImage` - Image library
- `Testimonial` - Customer reviews
- `Inquiry` - Contact form submissions

### Relationships
- Tours have multiple Categories and Tags
- Tours have multiple Guides (Users)
- Users have multiple Bookings
- Blogs have Authors (Users)
- Reviews link Users to Tours

## 🛠️ Troubleshooting

### Can't Access Admin Panel
**Problem**: Redirected to sign in
**Solution**: 
1. Check you're signed in
2. Verify your role is ADMIN or MANAGER
3. Check session in browser DevTools

### Content Not Updating
**Problem**: Changes don't appear on website
**Solution**:
1. Clear browser cache
2. Check content is marked `isActive: true`
3. Verify correct page/section values
4. Force refresh (Ctrl+F5)

### API Returns 500 Error
**Problem**: `/api/tours` or other API fails
**Solution**:
1. Check database is running
2. Verify Prisma client is generated: `npx prisma generate`
3. Check database connection in `.env`
4. Look at server console for detailed error

### Images Not Loading
**Problem**: Uploaded images don't display
**Solution**:
1. Check image URL is valid
2. Verify images are in `public` folder or external URL
3. Check WebsiteContent.mediaUrl or GalleryImage.url
4. Ensure proper permissions on image files

### Email Not Sending
**Problem**: SMTP errors
**Solution**:
1. Verify SMTP credentials in `/admin/email-settings`
2. For Gmail: Enable "App Passwords"
3. Check firewall allows port 587
4. Test with `/api/admin/test-email`

## 📖 API Quick Reference

### Authentication
All admin APIs require authentication header or session cookie.

### Get Website Content
```typescript
GET /api/website-content?page=homepage&section=hero
```

### Update Content
```typescript
POST /api/website-content
{
  "key": "homepage_hero_title",
  "title": "Hero Title",
  "content": "Welcome to Egypt",
  "page": "homepage",
  "section": "hero"
}
```

### Get Tours
```typescript
GET /api/tours?page=1&limit=10&search=cairo
```

### Create Tour (Admin Only)
```typescript
POST /api/tours
{
  "title": "Cairo Tour",
  "slug": "cairo-tour",
  "description": "...",
  "price": 1200,
  "duration": 5,
  // ... other fields
}
```

### Get Packages
```typescript
GET /api/packages?featured=true
```

### Get Settings
```typescript
GET /api/settings?category=whatsapp
```

### Get Users (Admin Only)
```typescript
GET /api/admin/users
```

## 🔐 Security Notes

1. **Never commit `.env` file**
2. **Use strong passwords** for admin accounts
3. **Keep NEXTAUTH_SECRET secure**
4. **Use HTTPS in production**
5. **Regularly update dependencies**
6. **Monitor admin activity logs**

## 📞 Support

For help:
1. Check `ADMIN_PANEL_DOCUMENTATION.md` for detailed info
2. Review API responses in browser DevTools
3. Check server logs for errors
4. Verify database schema: `npx prisma studio`

## ✨ Quick Tips

1. **Use Prisma Studio** to inspect/edit database directly
2. **Test in incognito** to verify caching behavior
3. **Use browser DevTools** Network tab to debug API calls
4. **Check console logs** for detailed error messages
5. **Keep backups** of database before major changes

## 🎯 Next Steps

1. ✅ Admin panel is ready
2. ✅ Database schema is complete
3. ✅ All APIs are functional
4. 📝 Start adding content via admin panel
5. 🖼️ Upload images to gallery
6. 👥 Create additional admin users
7. 📧 Configure email settings
8. 🎨 Customize website content
9. 📱 Set up WhatsApp widget
10. 🚀 Deploy to production

## Happy Managing! 🎉
