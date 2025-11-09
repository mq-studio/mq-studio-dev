# MQ Studio CMS - Setup & Development Guide

## Overview

This document provides a comprehensive guide to the CMS infrastructure that has been created for MQ Studio. The CMS is built on Next.js 14 with NextAuth authentication and file-based content storage.

## Architecture

### Directory Structure

```
app/
├── studio/                          # CMS Pages
│   ├── page.tsx                    # Entry point (redirects to dashboard)
│   ├── login/page.tsx              # Login page
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── content/page.tsx            # Content management
│   ├── media/page.tsx              # Media library
│   └── settings/page.tsx           # Settings
├── api/
│   ├── auth/[...nextauth]/         # NextAuth routes
│   │   └── route.ts
│   └── studio/
│       ├── content/                # Content CRUD operations
│       │   ├── route.ts            # List & create
│       │   └── [slug]/route.ts     # Get, update, delete
│       ├── media/route.ts          # Media upload & management
│       ├── tags/route.ts           # Tag management
│       └── settings/route.ts       # Settings management

lib/
├── auth/
│   └── config.ts                   # NextAuth configuration
├── services/
│   └── ContentService.ts           # Content CRUD service
├── types/
│   └── cms.ts                      # Type definitions
└── utils/                          # Utility functions

components/cms/
├── forms/
│   └── LoginForm.tsx               # Login form component
├── layout/
│   ├── DashboardLayout.tsx         # Dashboard layout
│   ├── ContentManager.tsx          # Content management layout
│   ├── MediaLibrary.tsx            # Media library layout
│   └── Settings.tsx                # Settings layout
├── editors/                        # Editor components (TBD)
├── media/                          # Media components (TBD)
└── dashboard/                      # Dashboard widgets (TBD)
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

The following packages have been added for CMS functionality:
- `next-auth` - Authentication framework
- `@tiptap/react` & `@tiptap/starter-kit` - WYSIWYG editor
- `react-hook-form` - Form management
- `zod` - Schema validation

### 2. Configure Environment Variables

Copy the example file and update with your values:

```bash
cp .env.local.example .env.local
```

**Required environment variables:**

```env
# NextAuth Configuration
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3100

# Admin Credentials
ADMIN_EMAIL=admin@mq-studio.com
ADMIN_PASSWORD=change-me-in-production
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

Access the CMS at: http://localhost:3100/studio

### 4. Login Credentials (Development)

- **Email:** admin@mq-studio.com
- **Password:** (from ADMIN_PASSWORD in .env.local)

## Authentication

NextAuth is configured with Credentials Provider for simple authentication. The configuration is in `/lib/auth/config.ts`.

### For Production

**Important:** In production, you should:

1. Use a secure authentication provider (GitHub, Google, etc.)
2. Hash passwords with bcrypt
3. Use a proper database for user management
4. Generate a strong NEXTAUTH_SECRET
5. Set NEXTAUTH_URL to your production domain

Example for GitHub OAuth (to be implemented):

```typescript
import GithubProvider from "next-auth/providers/github";

providers: [
  GithubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
]
```

## API Routes

All API routes require authentication. The pattern is:

### Content API

**List & Create Content**
```
GET/POST /api/studio/content?type=musing
```

**Get, Update, Delete Content**
```
GET/PUT/DELETE /api/studio/content/[slug]?type=musing
```

**Query Parameters:**
- `type` (required): `musing`, `artwork`, `publication`, or `project`
- `search` (optional): Search content by title/description
- `tag` (optional): Filter by tag

### Media API

**List & Upload Media**
```
GET/POST /api/studio/media
```

### Tags API

**List & Create Tags**
```
GET/POST /api/studio/tags?type=musing
```

### Settings API

**Get & Update Settings**
```
GET/PUT /api/studio/settings
```

## Content Service

The `ContentService` class handles all content operations:

```typescript
import { contentService } from '@/lib/services/ContentService';

// List all content of a type
const content = await contentService.getAllContent('musing');

// Get by slug
const musing = await contentService.getContentBySlug('musing', 'my-musing');

// Create new content
const newContent = await contentService.createContent(
  'musing',
  'new-musing',
  { title: 'My Musing', description: '...' },
  '# Content here'
);

// Update
await contentService.updateContent('musing', 'my-musing', {
  title: 'Updated Title'
}, 'Updated content...');

// Delete
await contentService.deleteContent('musing', 'my-musing');

// Publish
await contentService.publishContent('musing', 'my-musing');

// Search
const results = await contentService.searchContent('musing', 'query');

// Get by tag
const tagged = await contentService.getContentByTag('musing', 'inspiration');
```

## Type Definitions

All CMS types are defined in `/lib/types/cms.ts`. Key types include:

- `User` - User information
- `Session` - Authentication session
- `ContentMetadata` - Content metadata (shared across types)
- `Musing`, `Artwork`, `Publication`, `Project` - Specific content types
- `MediaFile` - Media asset information
- `EditorState` - Editor state management
- `ApiResponse<T>` - Standard API response format

## Content Structure

Content files are stored as MDX in `/content/{type}/{slug}.mdx` with frontmatter:

```mdx
---
title: My Musing
description: A brief description
status: published
createdAt: 2025-11-09T00:00:00Z
updatedAt: 2025-11-09T00:00:00Z
author: admin@mq-studio.com
tags: [tag1, tag2]
featured: false
---

# Markdown content here
```

## Development Workflow

### Creating New Components

Components should follow this structure:

```typescript
'use client'; // if interactive

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyComponent() {
  // Component logic
  return (
    // JSX
  );
}
```

### Adding API Endpoints

1. Create route handler in `/app/api/studio/{resource}/`
2. Add authentication check at the top
3. Implement GET/POST/PUT/DELETE methods
4. Use consistent response format:

```typescript
return NextResponse.json({
  success: true,
  data: result,
  message: 'Success message'
});
```

### Form Handling

Use React Hook Form + Zod for validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function Form() {
  const { register, handleSubmit, errors } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Next Steps for Implementation

### Phase 1: Editor Components (Priority)
- [ ] Implement TipTap rich text editor
- [ ] Create content editor interface
- [ ] Add preview mode
- [ ] Implement autosave functionality

### Phase 2: Content Management UI
- [ ] Content list view with pagination
- [ ] Search and filtering
- [ ] Bulk operations
- [ ] Status badges (draft/published/archived)

### Phase 3: Media Management
- [ ] File upload component
- [ ] Image optimization
- [ ] Media picker/browser
- [ ] Organize by tags

### Phase 4: Advanced Features
- [ ] User management interface
- [ ] Roles and permissions
- [ ] Activity logs
- [ ] Scheduled publishing
- [ ] Content versioning

### Phase 5: Optimization
- [ ] Real-time collaboration (optional)
- [ ] Git integration for auto-commit on publish
- [ ] Automated backups
- [ ] Performance optimization

## Testing

### Running Tests

```bash
# Unit tests
npm run test:unit

# All tests
npm run test:all

# Specific test
npm test -- LoginForm
```

### Testing the CMS

1. **Login Flow**
   ```bash
   npm run dev
   # Visit http://localhost:3100/studio
   # Login with admin@mq-studio.com
   ```

2. **API Testing**
   ```bash
   # Using curl
   curl -X GET http://localhost:3100/api/studio/content?type=musing

   # Using fetch (in browser console)
   fetch('/api/studio/content?type=musing')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Content Service**
   ```typescript
   // In browser console (if exposed)
   import { contentService } from '@/lib/services/ContentService';
   const musings = await contentService.getAllContent('musing');
   console.log(musings);
   ```

## Deployment

### Vercel Deployment

The GitHub Actions workflow (`.github/workflows/cms-ci.yml`) automatically:

1. Lints code on push
2. Type checks TypeScript
3. Builds the project
4. Runs tests
5. Verifies CMS infrastructure
6. Deploys to Vercel (main branch only)

**Required Secrets (in GitHub):**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Environment Variables (Production)

Set these in Vercel:
```
NEXTAUTH_SECRET=<secure-value>
NEXTAUTH_URL=https://mq-studio.vercel.app
ADMIN_EMAIL=<secure-value>
ADMIN_PASSWORD=<secure-value> (or use better auth)
```

## Troubleshooting

### "NextAuth is not defined"

Make sure you've imported:
```typescript
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
```

### 401 Unauthorized on API calls

- Check that session is valid
- Verify NEXTAUTH_SECRET is set
- Clear browser cookies and login again

### Content not loading

- Check file permissions on `/content` directory
- Verify frontmatter format is valid YAML
- Check ContentService logs

### Build fails with TypeScript errors

```bash
npx tsc --noEmit
```

This will show all TypeScript errors.

## Security Considerations

1. **Environment Variables:** Never commit `.env.local`
2. **Authentication:** Implement stronger auth in production
3. **File Uploads:** Add file type validation and virus scanning
4. **CORS:** Configure appropriate CORS headers
5. **Rate Limiting:** Implement rate limiting on API routes
6. **Input Validation:** Always validate and sanitize input

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TipTap Editor](https://tiptap.dev)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the architecture documentation
3. Check GitHub issues
4. Contact the development team

---

**Last Updated:** November 9, 2025
**CMS Version:** 0.1.0 (Infrastructure Setup)
