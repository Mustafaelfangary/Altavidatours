# Content Management System - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Content](#managing-content)
4. [Working with Media](#working-with-media)
5. [Content Workflow](#content-workflow)
6. [SEO Management](#seo-management)
7. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### Logging In
1. Navigate to `/admin` or `/auth/signin`
2. Enter your email and password
3. Click "Sign In"

### User Roles
- **Admin**: Full access to all features
- **Manager**: Can create and edit content, but cannot delete or publish

---

## Dashboard Overview

The admin dashboard provides quick access to:
- **Content Models**: Different types of content you can manage
- **Recent Activity**: Latest changes and updates
- **Statistics**: Content count, published items, drafts

---

## Managing Content

### Creating New Content

1. **Navigate to Content**
   - Click "Content" in the sidebar
   - Select the content type you want to create

2. **Fill Out the Form**
   - Enter required fields (marked with *)
   - Add optional information
   - Upload images or files if needed

3. **Set Status**
   - **Draft**: Save without publishing
   - **Pending Review**: Submit for approval
   - **Published**: Make it live on the website

4. **Save**
   - Click "Save" to create the content
   - You'll be redirected to the content list

### Editing Existing Content

1. **Find the Content**
   - Use the search bar to find specific items
   - Filter by status, date, or other criteria

2. **Click Edit**
   - Click the "Edit" button on the content item
   - Make your changes in the form

3. **Save Changes**
   - Click "Save" to update
   - A new version is automatically created

### Deleting Content

1. **Select Content**
   - Click the checkbox next to items you want to delete
   - Or click the delete icon on a single item

2. **Confirm Deletion**
   - A confirmation dialog will appear
   - Click "Delete" to confirm

⚠️ **Warning**: Deleted content cannot be recovered!

### Bulk Actions

Select multiple items and perform actions on all at once:

1. **Select Items**
   - Check the boxes next to items
   - Or use "Select All" for all items on the page

2. **Choose Action**
   - Click "Bulk Actions" dropdown
   - Select: Publish, Unpublish, or Delete

3. **Confirm**
   - Review the selection
   - Click "Apply" to execute

---

## Working with Media

### Uploading Images

1. **Click Upload Area**
   - In the image field, click the upload area
   - Or drag and drop files

2. **Select File**
   - Choose an image from your computer
   - Supported formats: JPG, PNG, GIF, WebP

3. **Preview**
   - The image will appear after upload
   - Click "Remove" to delete and upload another

### Image Guidelines

- **Size**: Maximum 10MB per file
- **Dimensions**: Recommended 1920x1080 for hero images
- **Format**: Use JPG for photos, PNG for graphics with transparency
- **Optimization**: Compress images before upload for faster loading

### Managing Uploaded Files

- Files are automatically stored in `/public/uploads/`
- Old files are deleted when you update or remove content
- Keep track of file names for easy management

---

## Content Workflow

### Draft → Review → Publish

**1. Create Draft**
- Start with "Draft" status
- Save your work without publishing
- Come back to edit anytime

**2. Submit for Review**
- When ready, change status to "Pending Review"
- A manager or admin will review
- You'll receive feedback if changes are needed

**3. Approve or Reject**
- Reviewers can approve or reject content
- Rejected items return to draft status
- Approved items can be published

**4. Publish**
- Change status to "Published"
- Content appears on the live website
- Can be unpublished at any time

### Scheduling Content

1. **Set Publish Date**
   - Click the calendar icon
   - Select a future date and time
   - Content will auto-publish at that time

2. **View Scheduled Items**
   - Filter by "Scheduled" status
   - See upcoming publications

### Version History

Every change creates a new version:

1. **View History**
   - Click "Version History" on any content item
   - See all previous versions

2. **Restore Version**
   - Click "Restore" on any previous version
   - Confirm to revert to that version
   - A new version is created from the restored content

---

## SEO Management

### Meta Information

**Meta Title**
- 50-60 characters recommended
- Include primary keyword
- Make it compelling for search results

**Meta Description**
- 150-160 characters recommended
- Summarize the page content
- Include a call-to-action

**Keywords**
- Add 3-5 relevant keywords
- Separate with commas
- Don't keyword stuff

### Open Graph (Social Media)

**OG Title & Description**
- Customize how content appears when shared
- Can differ from meta title/description
- Test with Facebook Debugger

**OG Image**
- Recommended size: 1200x630 pixels
- Shows when shared on social media
- Use high-quality, relevant images

### Advanced Settings

**Canonical URL**
- Set preferred URL for duplicate content
- Helps avoid SEO penalties

**No Index**
- Prevent search engines from indexing
- Use for private or temporary pages

**No Follow**
- Prevent search engines from following links
- Use sparingly

---

## Tips & Best Practices

### Content Writing

✅ **Do:**
- Write clear, concise content
- Use headings and paragraphs
- Include relevant keywords naturally
- Proofread before publishing

❌ **Don't:**
- Copy content from other websites
- Use excessive keywords
- Publish without review
- Ignore formatting

### Images

✅ **Do:**
- Optimize before upload
- Use descriptive file names
- Add alt text for accessibility
- Maintain consistent style

❌ **Don't:**
- Upload huge files
- Use copyrighted images without permission
- Forget to crop/resize
- Use low-quality images

### Workflow

✅ **Do:**
- Save drafts frequently
- Use version history
- Schedule content in advance
- Review before publishing

❌ **Don't:**
- Delete content without backup
- Skip the review process
- Publish untested changes
- Ignore scheduled content

### Performance

✅ **Do:**
- Compress images
- Use caching
- Test on mobile devices
- Monitor page load speed

❌ **Don't:**
- Upload videos directly (use YouTube/Vimeo)
- Embed too many widgets
- Ignore mobile optimization
- Neglect accessibility

---

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save content
- `Ctrl/Cmd + K`: Open search
- `Esc`: Close dialogs
- `Alt + N`: New content
- `Alt + E`: Edit mode

---

## Getting Help

### Support Resources
- 📧 Email: support@altavidatours.com
- 📚 Documentation: [link to docs]
- 🎥 Video Tutorials: [link to videos]
- 💬 Live Chat: Available in admin panel

### Common Issues

**Can't save content**
- Check required fields are filled
- Ensure file sizes are under limit
- Verify internet connection

**Images not uploading**
- Check file format (JPG, PNG, GIF)
- Reduce file size if over 10MB
- Try a different browser

**Changes not appearing**
- Clear browser cache
- Check if content is published
- Verify you saved changes

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Content management for all page types
- Image upload and management
- Workflow and versioning
- SEO tools
- Bulk actions

---

**Need more help?** Contact the support team or refer to the developer documentation for technical details.
