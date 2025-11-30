# Quick Guide: Add Partner Logos

## You have 2 partner logo images. Here's how to add them:

### Step 1: Save the Images

Save the two images you have as:
1. `altavida-logo.png` (Altavida Tours - primary brand/logo)
2. `altavida-partner-logo.png` (Altavida partner logo variant)

### Step 2: Add to Project

Put both images in this folder:
```
public/images/partners/
```

So you'll have:
```
public/images/partners/altavida-logo.png
public/images/partners/altavida-partner-logo.png
```

### Step 3: Commit via GitHub Desktop

1. Open GitHub Desktop
2. You'll see the new images in the changes
3. Write commit message: "Add partner logos"
4. Click "Commit to main"
5. Click "Push origin"

### Step 4: Deploy to Server

```bash
cd /var/Dahabiyat-Nile-Cruise
git pull origin main
npm run build
pm2 restart all
```

## That's it! 

The partner logos will now appear in:
- ✅ Footer (all pages)
- ✅ Packages page (dedicated section)

## Preview:

**Footer**: Small logos in horizontal row at bottom
**Packages Page**: Large cards with logos, descriptions, and "Visit Website" buttons

Both link to:
- https://www.altavidatours.com
