# Partners Section Setup Guide

## Problem
The "Our Partners" section doesn't appear on the website or in the admin panel because there are no partners in the database.

---

## ✅ Solution: Add Partners to Database

### **Method 1: Using Admin Panel (Recommended)**

1. **Login to Admin Panel:**
   - Go to: `https://www.dahabiyatnilecruise.com/admin`
   - Login with your admin credentials

2. **Navigate to Partners:**
   - Click on "Partners" in the admin sidebar

3. **Add New Partner:**
   - Click "Add New Partner" button
   - Fill in the form:
     - **Name:** Partner company name
     - **Logo URL:** Upload or enter logo image URL
     - **Website URL:** Partner's website
     - **Description:** Brief description (optional)
     - **Order:** Display order (0, 1, 2, etc.)
     - **Active:** Check to make visible
   - Click "Save"

4. **Repeat** for all partners you want to add

---

### **Method 2: Using Seed API (Quick Setup)**

Run this command on your server to seed default partners:

```bash
# SSH into your server
ssh root@srv918080

# Navigate to project directory
cd /var/Dahabiyat-Nile-Cruise

# Run seed script using curl (you need to be logged in as admin)
curl -X POST https://www.dahabiyatnilecruise.com/api/admin/seed-partners \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

**Note:** You need to get your session cookie from the browser after logging in as admin.

---

### **Method 3: Direct Database Insert (Advanced)**

If you have direct database access:

```sql
-- Insert sample partners
INSERT INTO "Partner" (id, name, "logoUrl", "websiteUrl", description, "order", "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Alta Vida Tours', '/images/partners/altavida-logo.png', 'https://www.altavidatours.com', 'Premium Egypt Tours & Travel Experiences', 0, true, NOW(), NOW()),
   (gen_random_uuid(), 'Altavida Tours', '/images/partners/altavida-logo.png', 'https://www.altavidatours.com', 'Discover Egypt with Altavida', 1, true, NOW(), NOW());
```

---

## 📁 Where Partners Appear

### **Frontend:**
1. **Packages Page:** `https://www.dahabiyatnilecruise.com/packages`
   - Bottom of the page
   - Full "Our Partners" section with cards

2. **Footer:** All pages
   - Compact partner logos
   - Links to partner websites

### **Admin Panel:**
- **URL:** `/admin/partners`
- **Features:**
  - View all partners
  - Add new partners
  - Edit existing partners
  - Delete partners
  - Reorder partners
  - Toggle active/inactive

---

## 🎨 Partner Logo Requirements

### **Image Specifications:**
- **Format:** PNG with transparent background (recommended)
- **Size:** 240px × 120px (or similar aspect ratio)
- **File Size:** < 100KB
- **Background:** Transparent or white

### **Upload Location:**
- Upload logos to: `/public/images/partners/`
- Or use external URLs

---

## 🔧 Component Details

### **Partners Component:**
**File:** `src/components/Partners.tsx`

**Variants:**
1. **Footer Variant:** Compact logos in footer
2. **Page Variant:** Full section with cards and descriptions

**Features:**
- Fetches from `/api/partners`
- Only shows active partners
- Ordered by `order` field
- Hover effects and animations
- Links to partner websites

---

## 📊 Database Schema

```prisma
model Partner {
  id          String   @id @default(cuid())
  name        String
  logoUrl     String
  websiteUrl  String
  description String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🚀 Quick Start (Easiest Method)

1. **Go to Admin Panel:**
   ```
   https://www.dahabiyatnilecruise.com/admin/partners
   ```

2. **Click "Add New Partner"**

3. **Fill in the form:**
   - Name: `Alta Vida Tours`
   - Logo URL: `/images/partners/altavida-logo.png`
   - Website: `https://www.altavidatours.com`
   - Description: `Premium Egypt Tours & Travel Experiences`
   - Order: `0`
   - Active: ✓ Checked

4. **Click Save**

5. **Add more partners** as needed

6. **Check the website:**
   - Go to: `https://www.dahabiyatnilecruise.com/packages`
   - Scroll to bottom
   - You should see "Our Partners" section

---

## 🐛 Troubleshooting

### **Partners still not showing?**

1. **Check Database:**
   - Verify partners exist in database
   - Check `isActive` is `true`

2. **Check API:**
   - Visit: `https://www.dahabiyatnilecruise.com/api/partners`
   - Should return JSON array of partners

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for API calls

4. **Clear Cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or clear browser cache

5. **Check Component:**
   - Partners component returns `null` if no partners found
   - Make sure at least one partner exists with `isActive: true`

---

## 📝 Example Partners Data

### **Partner 1:**
```json
{
  "name": "Alta Vida Tours",
  "logoUrl": "/images/partners/altavida-logo.png",
  "websiteUrl": "https://www.altavidatours.com",
  "description": "Premium Egypt Tours & Travel Experiences",
  "order": 0,
  "isActive": true
}
```

### **Partner 2:**
```json
{
   "name": "Altavida Tours",
   "logoUrl": "/images/partners/altavida-logo.png",
   "websiteUrl": "https://www.altavidatours.com",
  "description": "Discover the Treasures of Ancient Egypt",
  "order": 1,
  "isActive": true
}
```

---

## ✅ Verification Steps

After adding partners:

1. **Check Admin Panel:**
   - Go to `/admin/partners`
   - Should see list of partners

2. **Check API Response:**
   - Visit `/api/partners`
   - Should return JSON array

3. **Check Frontend:**
   - Go to `/packages`
   - Scroll to bottom
   - Should see "Our Partners" section

4. **Check Footer:**
   - Any page on the site
   - Should see partner logos in footer

---

## 🎉 Summary

**The Partners section exists but is hidden because there are no partners in the database.**

**To fix:**
1. Login to admin panel
2. Go to Partners section
3. Add at least one partner
4. Make sure it's set to "Active"
5. Check the packages page

**That's it!** The section will automatically appear once you have active partners in the database. 🚀
