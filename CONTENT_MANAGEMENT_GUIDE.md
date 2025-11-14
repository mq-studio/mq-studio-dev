# Content Management Guide for MQ Studio

**For Moura Quayle - Simple Instructions for Managing Your Website Content**

This guide explains how to add and update content on your website without needing technical knowledge.

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Adding a Publication](#adding-a-publication)
- [Adding an Artwork](#adding-an-artwork)
- [Adding a Musing](#adding-a-musing)
- [Adding a Project](#adding-a-project)
- [Updating Existing Content](#updating-existing-content)
- [Working with Images](#working-with-images)
- [Getting Help](#getting-help)

---

## Quick Start

All your content lives in the `content/` folder. Each type of content (publications, artworks, musings, projects) has its own subfolder.

**Content is stored as simple text files** with a `.md` extension (Markdown format). Don't worry - they're easy to edit!

### Basic Structure:
```
content/
├── publications/     ← Academic papers and articles
├── artworks/         ← Watercolors and visual art
├── musings/          ← Reflections and thoughts
└── projects/         ← Leadership initiatives
```

---

## Adding a Publication

Publications are academic papers, articles, or written works.

### Step 1: Create a New File

1. Go to the `content/publications/` folder
2. Create a new file with a descriptive name (use lowercase and hyphens)
   - Example: `governance-design-thinking.md`

### Step 2: Copy This Template

```markdown
---
title: "Your Publication Title Here"
slug: your-publication-slug
category: thinking
authors:
  - Moura Quayle
  - Co-Author Name (if any)
date: 2024-03-15
journal: Journal Name
externalUrl: https://link-to-journal.com
volume: "42"
issue: "3"
pages: "234-251"
doi: "10.1007/example"
tags:
  - governance
  - design thinking
  - public policy
featured: true
pdfUrl: /pdfs/publications/your-file.pdf
pdfSize: 2457600
description: "One sentence describing what this publication is about."
abstract: "A longer summary of the publication content."
---

## Introduction

Your content starts here...

## Main Content

Continue writing your content using markdown...
```

### Step 3: Fill in Your Information

**Required Fields:**
- `title` - The full title of your publication
- `slug` - Short URL-friendly name (lowercase, hyphens only)
- `category` - Always use "thinking" for publications
- `date` - Publication date (format: YYYY-MM-DD)
- `description` - One sentence summary

**Optional Fields:**
- `authors` - List all authors
- `journal` - Where it was published
- `externalUrl` - Link to the journal website
- `volume`, `issue`, `pages` - Journal details
- `doi` - Digital Object Identifier
- `tags` - Keywords (one per line with a dash)
- `featured` - Set to `true` to highlight it on your homepage
- `pdfUrl` - Path to PDF file (see Working with Images section)
- `abstract` - Longer description

### Step 4: Write Your Content

After the `---` lines, write your content using simple formatting:

```markdown
## Heading

Regular paragraph text.

**Bold text** or *italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item
```

---

## Adding an Artwork

Artworks are your watercolors, calligraphy, and visual creations.

### Step 1: Create a New File

1. Go to the `content/artworks/` folder
2. Create a new file: `artwork-title.md`

### Step 2: Copy This Template

```markdown
---
title: "Artwork Title"
slug: artwork-title
category: feeling
date: 2024-03-15
medium: Watercolor on paper
dimensions: "24 x 18 inches"
year: 2024
imageUrl: /images/artworks/your-image.jpg
tags:
  - watercolor
  - landscape
  - nature
featured: true
availability: available
price: 500
location: "Artist's Studio"
description: "Brief description of the artwork and what inspired it."
---

## Artist Statement

Share your thoughts about this piece, what inspired it, and the story behind it.

## Process

Describe your creative process for this work (optional).
```

### Step 3: Fill in Your Information

**Required Fields:**
- `title` - Name of the artwork
- `slug` - URL-friendly name
- `category` - Always use "feeling" for artworks
- `date` - Creation date
- `imageUrl` - Path to the image file
- `description` - What the artwork depicts

**Optional Fields:**
- `medium` - Materials used (e.g., "Watercolor on paper")
- `dimensions` - Size of the work
- `year` - Year created
- `tags` - Style or theme keywords
- `featured` - Show on homepage (true/false)
- `availability` - Options: "available", "sold", "private", "exhibition"
- `price` - Sale price (only if available)
- `location` - Current location

---

## Adding a Musing

Musings are your reflections, thoughts, and audio recordings.

### Step 1: Create a New File

1. Go to the `content/musings/` folder
2. Create a new file: `musing-title.md`

### Step 2: Copy This Template

```markdown
---
title: "Your Musing Title"
slug: musing-title
category: feeling
date: 2024-03-15
audioUrl: /audio/musings/your-audio.mp3
audioDuration: 420
tags:
  - reflection
  - creativity
featured: true
description: "A brief introduction to what this musing is about."
---

Your written content goes here. This will be displayed on the page.

You can write multiple paragraphs, use formatting, and share your thoughts freely.
```

### Step 3: Fill in Your Information

**Required Fields:**
- `title` - Title of your musing
- `slug` - URL-friendly name
- `category` - Choose: "thinking", "feeling", or "doing"
- `date` - Date written
- `description` - Brief introduction

**Optional Fields:**
- `audioUrl` - Path to audio file if you recorded it
- `audioDuration` - Length in seconds (helps show listening time)
- `tags` - Topic keywords
- `featured` - Show on homepage

---

## Adding a Project

Projects are your leadership initiatives and collaborative ventures.

### Step 1: Create a New File

1. Go to the `content/projects/` folder
2. Create a new file: `project-name.md`

### Step 2: Copy This Template

```markdown
---
title: "Project Name"
slug: project-name
category: doing
date: 2024-03-15
status: ongoing
startDate: 2024-01-01
endDate: 2024-12-31
location: "Vancouver, BC"
role: "Principal Investigator"
client: "Organization Name"
collaborators:
  - "Collaborator Name"
  - "Another Collaborator"
tags:
  - governance
  - community
featured: true
description: "One sentence about what this project aims to achieve."
---

## Project Overview

Describe the project, its goals, and significance.

## Outcomes

What has been accomplished or what you hope to achieve.
```

### Step 3: Fill in Your Information

**Required Fields:**
- `title` - Project name
- `slug` - URL-friendly name
- `category` - Always use "doing" for projects
- `date` - Start date
- `description` - Brief summary

**Optional Fields:**
- `status` - Options: "completed", "ongoing", "planned"
- `startDate` / `endDate` - Timeline
- `location` - Where the project takes place
- `role` - Your role in the project
- `client` - Who you're working with
- `collaborators` - List of partners
- `tags` - Topic keywords

---

## Updating Existing Content

To update any content:

1. **Find the file** in the appropriate content folder
2. **Open it** in any text editor
3. **Make your changes** to the text or information
4. **Save the file**

The website will automatically reflect your changes.

---

## Working with Images

### For Artworks and Images:

1. **Prepare your image:**
   - Save as JPG or PNG format
   - Use a descriptive filename (lowercase, no spaces)
   - Recommended size: 1200-2000 pixels wide

2. **Upload your image:**
   - Place it in `/public/images/artworks/` folder
   - Example: `/public/images/artworks/watercolor-landscape-2024.jpg`

3. **Reference it in your content:**
   ```yaml
   imageUrl: /images/artworks/watercolor-landscape-2024.jpg
   ```

### For PDFs:

1. **Prepare your PDF:**
   - Save with a descriptive name
   - Keep file size reasonable (under 5MB if possible)

2. **Upload your PDF:**
   - Place it in `/public/pdfs/publications/` folder
   - Example: `/public/pdfs/publications/governance-paper.pdf`

3. **Reference it in your content:**
   ```yaml
   pdfUrl: /pdfs/publications/governance-paper.pdf
   ```

### For Audio Files:

1. **Prepare your audio:**
   - Save as MP3 format
   - Use a descriptive filename

2. **Upload your audio:**
   - Place it in `/public/audio/musings/` folder
   - Example: `/public/audio/musings/reflection-on-creativity.mp3`

3. **Reference it in your content:**
   ```yaml
   audioUrl: /audio/musings/reflection-on-creativity.mp3
   ```

---

## Tips for Success

### Writing Good Descriptions
- **Be concise** - One clear sentence is better than a paragraph
- **Use keywords** - Include important terms people might search for
- **Be specific** - "Exploring governance through design thinking" is better than "My thoughts"

### Choosing Tags
- Use 3-5 tags per item
- Use existing tags when possible (check other content)
- Keep tags simple and clear
- Common tags: governance, design, watercolor, landscape, policy, community

### Dates
- Always use format: YYYY-MM-DD
- Example: 2024-03-15 (March 15, 2024)

### Slugs (URL names)
- Use lowercase letters only
- Replace spaces with hyphens
- Keep it short but descriptive
- Example: "governance-design-thinking" not "Governance_Design Thinking"

---

## Common Mistakes to Avoid

1. **Don't break the `---` lines** - These mark the beginning and end of your information section
2. **Keep indentation consistent** - Especially for lists (authors, tags, collaborators)
3. **Use quotes for titles** - Wrap titles in "quotes"
4. **Match file paths exactly** - Image and file paths are case-sensitive
5. **Check your dates** - Use YYYY-MM-DD format

---

## Getting Help

### If something isn't working:

1. **Check the template** - Compare your file to the examples above
2. **Look at existing files** - See how other content is formatted
3. **Check file paths** - Make sure images and PDFs are in the right folders
4. **Verify dates** - Ensure they're in YYYY-MM-DD format

### Content Templates

Pre-made templates are available in the `templates/` folder:
- `publication-template.md`
- `artwork-template.md`
- `musing-template.md`
- `project-template.md`

Copy these to start with a clean template!

---

## Example: Complete Publication

Here's a complete example to help you:

```markdown
---
title: "Designing Better Communities Through Collaborative Governance"
slug: collaborative-governance-communities
category: thinking
authors:
  - Moura Quayle
  - David Fushtey
date: 2024-11-15
journal: Journal of Urban Design
externalUrl: https://www.tandfonline.com/urban-design
volume: "29"
issue: "4"
pages: "456-473"
doi: "10.1080/example.2024.123456"
tags:
  - governance
  - community design
  - collaboration
  - urban planning
featured: true
pdfUrl: /pdfs/publications/collaborative-governance-2024.pdf
pdfSize: 3145728
description: "Examining how collaborative governance frameworks can transform community design processes."
abstract: "This paper explores the intersection of governance and community design, demonstrating how participatory approaches lead to more resilient and equitable urban spaces."
---

## Introduction

Community design has evolved significantly over the past decades, moving from top-down planning to more inclusive, participatory models.

## Methodology

We conducted case studies in five municipalities...

## Findings

Our research revealed three key patterns...

## Conclusion

Collaborative governance represents not just a method, but a fundamental shift in how we approach community design.
```

---

**Remember:** You don't need to be technical! These are just text files with simple formatting. If you can write an email, you can manage your website content. Take it one step at a time, and don't hesitate to refer back to this guide.

**Questions?** Look at existing content files for examples, or refer to the technical team for assistance.
