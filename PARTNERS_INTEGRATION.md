# Partners Integration - Complete Guide

## Overview

Added "Our Partners" section to showcase partner companies with their logos and links.

## Features

✅ **Footer Integration** - Partners displayed in footer on all pages
✅ **Packages Page** - Dedicated partners section with detailed cards
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Hover Effects** - Smooth animations and transitions
✅ **External Links** - Opens partner websites in new tab
✅ **Beautiful UI** - Matches website design language

## Partner Companies

### 1. Alta Vida Tours
- **Website**: https://www.altavidatours.com
- **Logo**: Red square with white bird design
- **Description**: Premium Egypt Tours & Travel Experiences

### 2. Altavida Tours
- **Website**: https://www.altavidatours.com
- **Logo**: Blue/gold pyramid design
- **Description**: Discover the Treasures of Ancient Egypt

## Where Partners Appear

### 1. Footer (All Pages)
- **Location**: Bottom of every page, above copyright
- **Style**: Compact horizontal layout
- **Design**: White cards with hover effects
- **Size**: Small logos (120x60px display)

### 2. Packages Page
- **Location**: After packages list and CTA section
- **Style**: Large detailed cards in grid layout
- **Design**: Full-width section with gradient background
- **Size**: Large logos (200x100px display)

## Files Created

### Components
- `src/components/Partners.tsx` - Main partners component with two variants

### Modified Files
- `src/components/Footer.tsx` - Added Partners section
- `src/app/packages/page.tsx` - Added Partners section

### Assets Directory
- `public/images/partners/` - Directory for partner logos
- `public/images/partners/README.md` - Instructions for adding logos

## Adding Partner Logos

### Step 1: Prepare Images

Save the partner logos you have:
1. **Alta Vida Tours logo** → `altavida-logo.png`
2. **Altavida Tours logo** → `altavida-logo.png`

### Step 2: Add to Project

```bash
# Copy logos to the partners directory
cp /path/to/altavida-logo.png public/images/partners/
cp /path/to/altavida-logo.png public/images/partners/
```

### Step 3: Commit and Push

```bash
git add public/images/partners/
git commit -m "Add partner logos"
git push origin main
```

### Step 4: Deploy

```bash
cd /var/Dahabiyat-Nile-Cruise
git pull origin main
npm run build
pm2 restart all
```

## Component Usage

### Footer Variant (Compact)

```tsx
<Partners variant="footer" />
```

Features:
- Horizontal layout
- Small logos
- Minimal spacing
- White background cards

### Page Variant (Detailed)

```tsx
<Partners variant="page" />
```

Features:
- Grid layout (2 columns on desktop)
- Large logos
- Partner descriptions
- "Visit Website" buttons
- Gradient background section

## Customization

### Adding More Partners

Edit `src/components/Partners.tsx`:

```tsx
const partners: Partner[] = [
  {
    name: 'Alta Vida Tours',
    url: 'https://www.altavidatours.com',
    logo: '/images/partners/altavida-logo.png',
    description: 'Premium Egypt Tours & Travel Experiences'
  },
  {
    name: 'Altavida Tours',
    url: 'https://www.altavidatours.com',
    logo: '/images/partners/altavida-logo.png',
    description: 'Discover the Treasures of Ancient Egypt'
  },
  // Add more partners here
  {
    name: 'New Partner',
    url: 'https://www.newpartner.com',
    logo: '/images/partners/newpartner-logo.png',
    description: 'Partner description'
  }
];
```

### Changing Colors

Edit the component's Tailwind classes:
- Background: `bg-white` → `bg-blue-50`
- Hover: `hover:bg-white/20` → `hover:bg-blue-100`
- Border: `border-ocean-blue` → `border-egyptian-gold`

### Changing Layout

Footer variant:
- Change `flex-wrap gap-4` for spacing
- Adjust logo size in `h-12 w-auto`

Page variant:
- Change `grid-cols-1 md:grid-cols-2` for columns
- Adjust `gap-8` for spacing

## Design Details

### Colors Used
- Ocean Blue: `#003d7a`
- Egyptian Gold: `#d4af37`
- Pale Blue: `#e6f3ff`
- White with transparency: `rgba(255,255,255,0.1)`

### Animations
- Fade in on scroll (Framer Motion)
- Scale on hover (1.05x)
- Smooth transitions (300ms)

### Responsive Breakpoints
- Mobile: < 768px (1 column)
- Desktop: ≥ 768px (2 columns)

## Testing

### Test Footer Display
1. Visit any page on the website
2. Scroll to footer
3. Check "Our Partners" section appears
4. Verify logos display correctly
5. Test hover effects
6. Click links (should open in new tab)

### Test Packages Page
1. Visit `/packages`
2. Scroll to bottom
3. Check "Our Trusted Partners" section
4. Verify large partner cards display
5. Test hover animations
6. Click "Visit Website" buttons

## SEO Benefits

- External links with `rel="noopener noreferrer"`
- Descriptive alt text for logos
- Semantic HTML structure
- Proper heading hierarchy

## Accessibility

- Keyboard navigation support
- Focus visible states
- Alt text for images
- ARIA labels for links
- High contrast ratios

## Performance

- Images use Next.js Image component
- Lazy loading enabled
- Optimized animations
- Minimal bundle size impact

## Troubleshooting

### Logos Not Showing

1. **Check file paths**:
   ```
   public/images/partners/altavida-logo.png
  public/images/partners/altavida-logo.png
   ```

2. **Verify file names** match exactly (case-sensitive)

3. **Check image formats** (PNG recommended)

4. **Clear browser cache** (Ctrl+Shift+R)

### Layout Issues

1. **Check responsive design** on different screen sizes
2. **Verify Tailwind classes** are correct
3. **Test in different browsers**

### Links Not Working

1. **Verify URLs** are correct with `https://`
2. **Check `target="_blank"`** is set
3. **Test in incognito mode**

## Future Enhancements

Potential improvements:
- Admin panel for managing partners
- Partner logos in database
- Dynamic partner ordering
- Partner testimonials
- Partnership badges
- Analytics tracking for partner clicks

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are committed
3. Ensure images are uploaded
4. Test after deployment

The partners section is now fully integrated and ready to display once you add the logo images!
