# TinaCMS Quick Reference Guide

## 🚀 How to Use TinaCMS Admin

### Accessing Content
1. **Dashboard**: http://localhost:3100/admin/
2. **Collections Available**:
   - **Musings** (76 items in archive folder) - Blog posts and thoughts
   - **Artworks** (50+ items) - Your artwork portfolio
   - **Publications** (14 items) - Academic and professional publications
   - **Projects** (7 items) - Project documentation
   - **Media Manager** - Upload and manage images

### Creating New Content

#### Quick Create:
1. Click on any collection (e.g., "Artworks")
2. Click the orange **"Add File"** button (top right)
3. Fill in the form fields
4. Click **Save** to create the file

#### Fields Available by Collection:

**Musings:**
- Title, Description, Date
- Category: thinking/feeling/doing
- Status: draft/published
- Tags (multiple)
- Rich text body with MDX support

**Artworks:**
- Title, Medium, Year
- Dimensions (width × height with unit)
- Price, Availability (available/sold/not-for-sale)
- Artist Statement
- Exhibition History
- Technical Notes

**Publications:**
- Title, Authors, Journal
- Year, DOI, URL
- Abstract
- Full text content

**Projects:**
- Title, Description, Client
- Start/End Dates
- Status (planning/in-progress/completed)
- Featured Image

### Editing Existing Content

1. Click on the collection
2. Click on any item title
3. Edit fields in the form
4. See live preview (if configured)
5. Click **Save** to update

### Media Management

1. Click **Media Manager** in sidebar
2. Either:
   - **Drag and drop** images directly
   - Click **Upload** button
3. Images are stored in `public/uploads/`
4. Use uploaded images in any content field

## 🎯 Optimization Tips Based on Your Setup

### 1. **Organization**
- Your musings are in an `archive` folder - consider organizing by year
- Use the **Tags** field to make content discoverable
- Set **Featured** flag on important artworks

### 2. **Workflow Improvements**
- Use **Status** field to track drafts vs published
- Add **Category** to group similar content
- Use **Exhibition History** to track where art has been shown

### 3. **Search (Coming Soon)**
After restart, search will be enabled to quickly find content across all collections.

## 🔧 Common Tasks

### Publishing Workflow
```
Draft → Review → Published
```
1. Create with status: "draft"
2. Edit and refine
3. Change status to "published"
4. Content appears on live site

### Bulk Operations
Currently, TinaCMS handles one item at a time. For bulk operations:
- Use the file system directly
- Or use Git for mass updates

### Image Optimization
- Upload high-quality originals
- TinaCMS stores them in `public/uploads/`
- Consider using Next.js Image component for optimization

## 📝 Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save current document
- **Esc**: Close editor modal
- **Ctrl/Cmd + Z**: Undo last change

## 🌐 Going to Production

When ready for TinaCMS Cloud:
1. Sign up at https://app.tina.io
2. Connect your GitHub repo
3. Add credentials to 1Password:
   ```bash
   npm run dev:1p  # Uses 1Password CLI
   ```
4. Deploy to Vercel/Netlify
5. Access at `https://yourdomain.com/admin`

## 🆘 Troubleshooting

### "You are in local mode"
- This is normal for development
- No authentication required locally
- Add TinaCMS Cloud credentials for production features

### Can't see all content
- Check the file format (.md vs .mdx)
- Verify path in `tina/config.ts`
- Restart server after config changes

### Changes not saving
- Check file permissions
- Ensure Git repo is initialized
- Check console for errors

## 📊 Your Content Summary

Based on the screenshots:
- **Publications**: 14 academic papers ready
- **Artworks**: 50+ pieces catalogued
- **Musings**: Archive folder with historical content
- **Projects**: 7 documented projects

## 🎨 Next Steps

1. **Immediate**: Start editing a piece of content to test the workflow
2. **Soon**: Organize archive musings by year
3. **Later**: Set up TinaCMS Cloud for collaborative editing
4. **Future**: Add custom fields for specific needs

---

**Pro Tip**: The visual editor is most powerful when you have your site open in another tab - edit in TinaCMS, preview changes live!