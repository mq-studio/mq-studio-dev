import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main';

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  // Search configuration - only enabled if token is provided
  ...(process.env.TINA_SEARCH_TOKEN ? {
    search: {
      tina: {
        indexerToken: process.env.TINA_SEARCH_TOKEN,
        stopwordLanguages: ['eng']
      },
      indexBatchSize: 100,
      maxSearchIndexFieldLength: 100
    }
  } : {}),

  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'musings',
        label: 'My Musings',
        path: 'content/musings',
        match: {
          include: '**/*.mdx',
          exclude: '**/node_modules/**',
        },
        format: 'mdx',
        ui: {
          filename: {
            readonly: false, // Allow editing for now to fix the Add File error
            slugify: values => {
              return `${values?.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}`
            },
          },
          router: ({ document }) => {
            if (document._sys.path.includes('archive')) {
              const pathParts = document._sys.path.split('/')
              const year = pathParts[pathParts.indexOf('archive') + 1]
              return `/musings/archive/${year}/${document._sys.filename}`
            }
            return `/musings/${document._sys.filename}`
          },
          // Add default path for new files
          beforeSubmit: async ({ values }) => {
            return {
              ...values,
              _collection: 'musings'
            }
          }
        },
        defaultItem: () => {
          return {
            title: '',
            date: new Date().toISOString(),
            status: 'draft', // Always start as draft - no anxiety about accidental publishing
            category: 'thinking', // Safe default
            slug: ''
          }
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'What\'s on your mind?',
            description: 'Give your musing a title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'This musing is about...',
            description: 'Choose the one that feels right',
            options: ['thinking', 'feeling', 'doing'],
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Your Thoughts',
            description: 'Share what you\'re thinking about',
            isBody: true,
          },
          {
            type: 'string',
            name: 'status',
            label: 'Ready to share?',
            description: 'Drafts are only visible to you',
            options: ['draft', 'published'],
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
            description: 'When did you write this?',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Brief Summary (Optional)',
            description: 'A short description for search engines',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags (Optional)',
            description: 'Add keywords to help organize your musings',
            list: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'URL Path (auto-generated)',
            description: 'This will be created from your title',
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
            description: 'Who wrote this?',
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Excerpt (Optional)',
            description: 'A brief preview of the content',
          },
          {
            type: 'boolean',
            name: 'legacy',
            label: 'Legacy Post',
            description: 'Is this an archived post?',
          },
          {
            type: 'string',
            name: 'originalUrl',
            label: 'Original URL (Optional)',
            description: 'Link to the original post if imported',
          },
        ],
      },
      {
        name: 'artworks',
        label: 'My Artworks',
        path: 'content/artworks',
        format: 'md',
        ui: {
          defaultItem: () => ({
            title: '',
            year: new Date().getFullYear(),
            availability: 'available',
            featured: false,
            medium: '',
          })
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Artwork Title',
            description: 'What do you call this piece?',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'imageUrl',
            label: 'Artwork Image',
            description: 'URL or path to your artwork image',
            required: true,
          },
          {
            type: 'string',
            name: 'medium',
            label: 'Medium',
            description: 'What materials did you use? (e.g., watercolour on paper)',
          },
          {
            type: 'number',
            name: 'year',
            label: 'Year Created',
            description: 'When did you create this?',
          },
          {
            type: 'string',
            name: 'description',
            label: 'About This Artwork (Optional)',
            description: 'Tell the story behind this piece',
          },
          {
            type: 'object',
            name: 'dimensions',
            label: 'Dimensions (Optional)',
            description: 'Size of your artwork',
            fields: [
              {
                type: 'number',
                name: 'width',
                label: 'Width',
              },
              {
                type: 'number',
                name: 'height',
                label: 'Height',
              },
              {
                type: 'string',
                name: 'unit',
                label: 'Unit',
                description: 'inches, cm, etc.',
              },
            ],
          },
          {
            type: 'string',
            name: 'availability',
            label: 'Is this available?',
            description: 'Let people know if they can purchase this',
            options: ['available', 'sold', 'not-for-sale'],
          },
          {
            type: 'number',
            name: 'price',
            label: 'Price (Optional)',
            description: 'If available for sale',
          },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Feature on homepage?',
            description: 'Showcase this artwork prominently',
          },
          {
            type: 'string',
            name: 'artistStatement',
            label: 'Artist Statement (Optional)',
            description: 'Your thoughts about this work',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'string',
            name: 'location',
            label: 'Current Location (Optional)',
            description: 'Where is this artwork now?',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags (Optional)',
            description: 'Keywords to help organize your art',
            list: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date Created (Optional)',
          },
          {
            type: 'string',
            name: 'thumbnailUrl',
            label: 'Thumbnail Image (Optional)',
            description: 'Smaller version for gallery view',
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Web Address (Auto-generated)',
            description: 'This creates your page URL',
            ui: {
              parse: (val) => val?.toLowerCase().replace(/ /g, '-'),
            }
          },
          {
            type: 'object',
            name: 'exhibitionHistory',
            label: 'Exhibition History (Optional)',
            description: 'Where has this been shown?',
            list: true,
            fields: [
              {
                type: 'string',
                name: 'venue',
                label: 'Where',
                description: 'Gallery or venue name',
              },
              {
                type: 'string',
                name: 'date',
                label: 'When',
                description: 'Month and year',
              },
              {
                type: 'string',
                name: 'location',
                label: 'City/Country',
              },
            ],
          },
          {
            type: 'string',
            name: 'technicalNotes',
            label: 'Technical Notes (Optional)',
            description: 'Materials, process, or other technical details',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      {
        name: 'publications',
        label: 'My Publications',
        path: 'content/publications',
        format: 'md',
        ui: {
          defaultItem: () => ({
            title: '',
            authors: ['Moura Quayle'],
            year: new Date().getFullYear(),
          })
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Publication Title',
            description: 'The title of your paper or article',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'authors',
            label: 'Authors',
            description: 'List of co-authors (you\'re already included)',
            list: true,
          },
          {
            type: 'string',
            name: 'journal',
            label: 'Published In',
            description: 'Journal or publication name',
          },
          {
            type: 'number',
            name: 'year',
            label: 'Year Published',
            description: 'When was this published?',
          },
          {
            type: 'string',
            name: 'abstract',
            label: 'Summary',
            description: 'Brief description of the publication',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'string',
            name: 'url',
            label: 'Link to Full Paper (Optional)',
            description: 'Where can people read this?',
          },
          {
            type: 'string',
            name: 'doi',
            label: 'DOI (Optional)',
            description: 'Digital Object Identifier - looks like: 10.1234/example',
          },
        ],
      },
      {
        name: 'projects',
        label: 'My Projects',
        path: 'content/projects',
        format: 'md',
        ui: {
          defaultItem: () => ({
            title: '',
            status: 'in-progress',
            startDate: new Date().toISOString(),
          })
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Project Name',
            description: 'What do you call this project?',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'What\'s this project about?',
            description: 'A brief description of the project',
          },
          {
            type: 'image',
            name: 'featuredImage',
            label: 'Project Image',
            description: 'A visual to represent this project',
          },
          {
            type: 'string',
            name: 'status',
            label: 'Current Status',
            description: 'Where is this project now?',
            options: ['planning', 'in-progress', 'completed'],
          },
          {
            type: 'string',
            name: 'client',
            label: 'Client or Partner (Optional)',
            description: 'Who are you working with?',
          },
          {
            type: 'datetime',
            name: 'startDate',
            label: 'Started',
            description: 'When did this begin?',
          },
          {
            type: 'datetime',
            name: 'endDate',
            label: 'Completed (Optional)',
            description: 'When did it finish?',
          },
        ],
      },
    ],
  },
});