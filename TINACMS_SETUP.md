# TinaCMS Setup Documentation

## Overview
TinaCMS has been successfully integrated into the MQ Studio website to provide a visual content management system for managing website content. This replaces the previous custom CMS approach with a production-ready solution.

## What is TinaCMS?
TinaCMS is a Git-backed headless CMS that provides:
- **Visual Editing**: Edit content directly on your website with live preview
- **Git-based**: All content changes are stored as commits in your Git repository
- **MDX Support**: Native support for MDX files with rich text editing
- **Local Development**: Works completely offline during development
- **Type-Safe**: Auto-generates TypeScript types for your content

## Access Points

### Local Development
- **Main Application**: http://localhost:3100
- **TinaCMS Admin**: http://localhost:3100/admin/index.html
- **GraphQL Playground**: http://localhost:3100/admin/index.html#/graphql
- **GraphQL API**: http://localhost:4001/graphql

### Production (Future Setup)
- Admin interface will be available at: `https://your-domain.com/admin`
- Requires TinaCMS Cloud account for authentication

## Content Structure

TinaCMS is configured to manage four content types:

### 1. Musings
- **Path**: `content/musings/`
- **Fields**: title, description, date, category (thinking/feeling/doing), status, tags, body
- **Format**: MDX files

### 2. Artworks
- **Path**: `content/artworks/`
- **Fields**: title, description, medium, dimensions, year, image, category, body
- **Format**: MDX files

### 3. Publications
- **Path**: `content/publications/`
- **Fields**: title, authors, journal, year, DOI, abstract, URL, body
- **Format**: MDX files

### 4. Projects
- **Path**: `content/projects/`
- **Fields**: title, description, client, start/end dates, status, featured image, body
- **Format**: MDX files

## How to Use TinaCMS

### Starting the Development Server
```bash
npm run dev
```
This command automatically starts both Next.js and TinaCMS together.

### Accessing the Admin Interface
1. Navigate to http://localhost:3100/admin/index.html
2. For local development, no authentication is required
3. You'll see a sidebar with all your content collections

### Editing Content
1. Click on any collection (Musings, Artworks, Publications, Projects)
2. Select an existing item to edit or click "Create New"
3. Edit fields in the form on the left
4. See live preview on the right
5. Click "Save" to commit changes to your files

### Creating New Content
1. Navigate to a collection
2. Click the "+" or "Create New" button
3. Fill in the required fields
4. Add content using the rich text editor
5. Save to create the MDX file

### Rich Text Editor Features
- **Formatting**: Bold, italic, underline, strikethrough
- **Headers**: H1-H6 support
- **Lists**: Bullet and numbered lists
- **Links**: Internal and external linking
- **Images**: Upload and embed images
- **Code blocks**: Syntax-highlighted code
- **Tables**: Create and edit tables
- **MDX Components**: Insert custom React components

## File Structure

```
website-mq-studio/
├── tina/
│   ├── config.ts          # TinaCMS configuration
│   └── __generated__/     # Auto-generated types and client
├── content/
│   ├── musings/          # Blog posts and thoughts
│   ├── artworks/         # Artwork entries
│   ├── publications/     # Academic publications
│   └── projects/         # Project descriptions
└── public/
    └── uploads/          # Uploaded media files
```

## Development Workflow

### Local Development
1. Run `npm run dev` to start the development server
2. Make content changes through the TinaCMS admin interface
3. Changes are immediately saved to your local MDX files
4. Commit changes to Git when ready

### Git Integration
- All content changes are saved directly to MDX files
- Use standard Git workflow (add, commit, push)
- Changes can be reviewed in pull requests
- Content versioning through Git history

## Production Deployment

### Prerequisites for Production
1. Create a TinaCMS Cloud account at https://app.tina.io
2. Create a new project and get your credentials
3. Configure environment variables

### Required Environment Variables
```env
# Production TinaCMS Configuration
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id-from-tina-cloud
TINA_TOKEN=your-read-only-token-from-tina-cloud
```

### Authentication in Production
- TinaCMS Cloud handles authentication
- Authorized users can edit through the `/admin` route
- Public users see the read-only website

## Advanced Features

### Media Management
- Upload images directly through TinaCMS
- Files are stored in `public/uploads/`
- Automatic optimization and resizing
- Support for various image formats

### Content Relationships
- Link between different content types
- Reference artworks in musings
- Connect projects to publications

### Search and Filtering
- Built-in search within the admin interface
- Filter content by status, category, or date
- Bulk operations support

## Troubleshooting

### Common Issues

1. **Port 3100 already in use**
   ```bash
   lsof -i :3100
   kill -9 [PID]
   ```

2. **TinaCMS not loading**
   - Ensure `npm install` completed successfully
   - Check that `tina/config.ts` exists
   - Verify no syntax errors in configuration

3. **Content not appearing**
   - Check file paths in `tina/config.ts`
   - Ensure MDX files are in correct directories
   - Verify frontmatter matches schema

4. **GraphQL errors**
   - Restart the development server
   - Check for schema mismatches
   - Review generated types in `tina/__generated__/`

### Debug Mode
View detailed logs:
```bash
DEBUG=tina* npm run dev
```

## Benefits Over Previous CMS

### Immediate Advantages
✅ **Working Solution**: Fully functional out of the box
✅ **Visual Editing**: See changes in real-time
✅ **No Database Required**: Git-based storage
✅ **Type Safety**: Auto-generated TypeScript types
✅ **MDX Support**: Native MDX handling

### Long-term Benefits
✅ **Community Support**: Active development and community
✅ **Extensibility**: Plugin system for custom features
✅ **Cloud Option**: Scalable hosted solution available
✅ **Version Control**: Full Git history of all changes
✅ **Collaboration**: Multi-user editing with cloud version

## Next Steps

### Immediate Actions
1. ✅ Test the admin interface at http://localhost:3100/admin/index.html
2. ✅ Try editing existing content
3. ✅ Create a new test post
4. ✅ Verify changes are saved to MDX files

### Future Enhancements
1. Set up TinaCMS Cloud for production
2. Configure custom fields for specific needs
3. Add content validation rules
4. Implement custom preview templates
5. Set up automated deployments

## Resources

- **TinaCMS Documentation**: https://tina.io/docs/
- **TinaCMS GitHub**: https://github.com/tinacms/tinacms
- **Community Discord**: https://discord.gg/zumN63Ybpf
- **Video Tutorials**: https://tina.io/docs/introduction/video-tutorials/

## Summary

TinaCMS is now fully integrated and provides Moura with a powerful, visual content management system. The setup includes:

- ✅ Complete TinaCMS installation
- ✅ Configuration for all content types (musings, artworks, publications, projects)
- ✅ Local development environment ready
- ✅ Visual editor accessible at `/admin`
- ✅ Git-based workflow maintained
- ✅ MDX content fully supported

The system is ready for immediate use in development, with a clear path to production deployment when needed.