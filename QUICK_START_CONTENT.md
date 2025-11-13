# Quick Start Guide - Adding Content to Your Website

**For Moura Quayle** - The simplest way to add content to your site

---

## 🎯 The Basics

Your website content is stored in simple text files. Think of them like Word documents, but simpler.

**Location:** Everything lives in the `content` folder

---

## 📝 How to Add a New Publication

### 3 Easy Steps:

1. **Copy the template**
   ```
   Go to: templates/publication-template.md
   Copy it to: content/publications/
   Rename it: your-paper-name.md
   ```

2. **Fill in your information**
   - Open the file in any text editor (Notepad, TextEdit, etc.)
   - Replace the placeholder text with your information
   - Keep the `---` lines at the top and bottom
   - Don't worry about the fields you don't have - you can delete them!

3. **Save the file**
   - That's it! Your publication will appear on the website

### What You Need:
- ✅ **Title** - Name of your paper
- ✅ **Date** - When it was published (format: 2024-11-15)
- ✅ **Description** - One sentence about what it's about
- Optional: Authors, journal, PDF file, etc.

---

## 🎨 How to Add Artwork

### 3 Easy Steps:

1. **Upload your image first**
   ```
   Put your image in: public/images/artworks/
   Name it something simple: watercolor-garden-2024.jpg
   ```

2. **Copy the template**
   ```
   Go to: templates/artwork-template.md
   Copy it to: content/artworks/
   Rename it: match your image name
   ```

3. **Fill in the details**
   - Title, date, description (required)
   - Medium (watercolor, calligraphy, etc.)
   - Availability (available, sold, private)
   - Price (only if it's for sale)

---

## 💭 How to Add a Musing

### 2 Easy Steps:

1. **Copy the template**
   ```
   Go to: templates/musing-template.md
   Copy it to: content/musings/
   Rename it: your-reflection-name.md
   ```

2. **Write your thoughts**
   - Add title and date
   - Write your reflection below the `---` lines
   - If you recorded audio, upload it first to: public/audio/musings/

**Tip:** Musings are the easiest! Just write your thoughts freely.

---

## 📋 Important Rules

1. **Dates must be:** YYYY-MM-DD format
   - ✅ Good: 2024-11-15
   - ❌ Bad: Nov 15, 2024 or 11/15/24

2. **File names:**
   - Use lowercase letters only
   - Use hyphens instead of spaces
   - ✅ Good: governance-design-thinking.md
   - ❌ Bad: Governance Design Thinking.md

3. **Keep the `---` lines**
   - These mark the beginning and end of your information
   - Don't delete them!

4. **Quotes around titles**
   - ✅ Good: title: "My Research Paper"
   - ❌ Bad: title: My Research Paper

---

## 🖼️ Working with Files

### Images (for artworks):
1. Save as JPG or PNG
2. Make it web-friendly (1200-2000 pixels wide)
3. Put in: `public/images/artworks/`
4. In your content file, write: `imageUrl: /images/artworks/your-image.jpg`

### PDFs (for publications):
1. Put in: `public/pdfs/publications/`
2. In your content file, write: `pdfUrl: /pdfs/publications/your-paper.pdf`

### Audio (for musings):
1. Save as MP3
2. Put in: `public/audio/musings/`
3. In your content file, write: `audioUrl: /audio/musings/your-recording.mp3`

---

## ✅ Checklist Before Saving

- [ ] Did you fill in the title?
- [ ] Did you add a date in YYYY-MM-DD format?
- [ ] Did you write a description?
- [ ] Are the `---` lines still there?
- [ ] Did you upload any images/PDFs/audio first?
- [ ] Is your filename lowercase with hyphens?

---

## 🆘 Common Problems

### "My content isn't showing up"
- Check: Is the date format YYYY-MM-DD?
- Check: Did you save the file in the right folder?
- Check: Are the `---` lines still there?

### "My image isn't appearing"
- Check: Did you upload the image first?
- Check: Is the path correct? Should start with `/images/artworks/`
- Check: Did you spell the filename exactly right?

### "I made a mistake"
- Don't worry! Just open the file and fix it
- You can't break anything - worst case, delete the file and start over

---

## 📚 Need More Help?

1. **Full Guide:** See `CONTENT_MANAGEMENT_GUIDE.md` for detailed instructions
2. **Examples:** Look at existing files in `content/` folders
3. **Templates:** Use the ready-made templates in `templates/` folder

---

## 🎉 You've Got This!

Remember:
- You're just editing text files
- You can always undo or start over
- Look at existing content for examples
- The templates have everything you need

**Most important:** Don't overthink it! If you can write an email, you can manage your website content.

---

**Quick Reference:**

```
Templates are in: templates/
Your content goes in: content/
Images go in: public/images/artworks/
PDFs go in: public/pdfs/publications/
Audio goes in: public/audio/musings/
```

---

**Questions?** Refer to the full guide at `CONTENT_MANAGEMENT_GUIDE.md`
