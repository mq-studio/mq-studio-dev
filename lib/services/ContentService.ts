/**
 * Content Service
 * Handles CRUD operations for content (musings, artworks, publications, projects)
 * Includes security measures for validation and sanitization
 */

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  ContentFile,
  ContentMetadata,
  ContentType,
} from '@/lib/types/cms';
import { validateSlug, validateContentType, validateContentStatus } from '@/lib/utils/validation';
import { sanitizeContent, sanitizeMetadata, sanitizeErrorForLogging } from '@/lib/utils/sanitization';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export class ContentService {
  /**
   * Get all content of a specific type
   */
  async getAllContent(type: ContentType): Promise<ContentFile[]> {
    const typeDir = path.join(CONTENT_DIR, type);

    try {
      const files = await fs.readdir(typeDir);
      const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

      const contents = await Promise.all(
        mdxFiles.map((file) => this.readContentFile(type, file))
      );

      return contents.filter(Boolean) as ContentFile[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Get content by slug
   * Validates slug to prevent path traversal attacks
   */
  async getContentBySlug(type: ContentType, slug: string): Promise<ContentFile | null> {
    // Validate slug format
    if (!validateSlug(slug)) {
      throw new Error('Invalid slug format');
    }

    // Validate content type
    if (!validateContentType(type)) {
      throw new Error('Invalid content type');
    }

    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      return {
        path: filePath,
        frontmatter: sanitizeMetadata(data),
        content: sanitizeContent(body),
        metadata: this.createMetadata(slug, type, data),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      const sanitizedError = sanitizeErrorForLogging(error);
      console.error('Error reading content file:', sanitizedError);
      throw new Error('Failed to read content file');
    }
  }

  /**
   * Create new content
   * Validates slug and sanitizes content before writing
   */
  async createContent(
    type: ContentType,
    slug: string,
    metadata: Partial<ContentMetadata>,
    content: string
  ): Promise<ContentFile> {
    // Validate slug format
    if (!validateSlug(slug)) {
      throw new Error('Invalid slug format');
    }

    // Validate content type
    if (!validateContentType(type)) {
      throw new Error('Invalid content type');
    }

    // Validate status if provided
    if (metadata.status && !validateContentStatus(metadata.status)) {
      throw new Error('Invalid content status');
    }

    const fileDir = path.join(CONTENT_DIR, type);
    const filePath = path.join(fileDir, `${slug}.mdx`);

    // Ensure directory exists
    try {
      await fs.mkdir(fileDir, { recursive: true });
    } catch (error) {
      const sanitizedError = sanitizeErrorForLogging(error);
      console.error('Failed to create directory:', sanitizedError);
      throw new Error('Failed to create content directory');
    }

    // Check if file already exists
    try {
      await fs.access(filePath);
      throw new Error(`Content with slug "${slug}" already exists`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    // Sanitize content and metadata
    const sanitizedContent = sanitizeContent(content);
    const sanitizedMetadata = sanitizeMetadata(metadata);

    const frontmatter = {
      title: sanitizedMetadata.title || 'Untitled',
      description: sanitizedMetadata.description || '',
      status: sanitizedMetadata.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...sanitizedMetadata,
    };

    try {
      const fileContent = matter.stringify(sanitizedContent, frontmatter);
      await fs.writeFile(filePath, fileContent);
    } catch (error) {
      const sanitizedError = sanitizeErrorForLogging(error);
      console.error('Failed to write content file:', sanitizedError);
      throw new Error('Failed to create content');
    }

    return {
      path: filePath,
      frontmatter,
      content: sanitizedContent,
      metadata: this.createMetadata(slug, type, frontmatter),
    };
  }

  /**
   * Update existing content
   * Validates slug and sanitizes content before writing
   */
  async updateContent(
    type: ContentType,
    slug: string,
    updates: Partial<ContentMetadata>,
    content?: string
  ): Promise<ContentFile> {
    // Validate slug format
    if (!validateSlug(slug)) {
      throw new Error('Invalid slug format');
    }

    // Validate content type
    if (!validateContentType(type)) {
      throw new Error('Invalid content type');
    }

    // Validate status if provided
    if (updates.status && !validateContentStatus(updates.status)) {
      throw new Error('Invalid content status');
    }

    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);

    const existing = await this.getContentBySlug(type, slug);
    if (!existing) {
      throw new Error(`Content with slug "${slug}" not found`);
    }

    // Sanitize content and metadata
    const sanitizedContent = content ? sanitizeContent(content) : existing.content;
    const sanitizedUpdates = sanitizeMetadata(updates);

    const frontmatter = {
      ...existing.frontmatter,
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
    };

    try {
      const fileContent = matter.stringify(sanitizedContent, frontmatter);
      await fs.writeFile(filePath, fileContent);
    } catch (error) {
      const sanitizedError = sanitizeErrorForLogging(error);
      console.error('Failed to update content file:', sanitizedError);
      throw new Error('Failed to update content');
    }

    return {
      path: filePath,
      frontmatter,
      content: sanitizedContent,
      metadata: this.createMetadata(slug, type, frontmatter),
    };
  }

  /**
   * Delete content
   * Validates slug to prevent path traversal attacks
   */
  async deleteContent(type: ContentType, slug: string): Promise<void> {
    // Validate slug format
    if (!validateSlug(slug)) {
      throw new Error('Invalid slug format');
    }

    // Validate content type
    if (!validateContentType(type)) {
      throw new Error('Invalid content type');
    }

    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Content with slug "${slug}" not found`);
      }
      const sanitizedError = sanitizeErrorForLogging(error);
      console.error('Failed to delete content file:', sanitizedError);
      throw new Error('Failed to delete content');
    }
  }

  /**
   * Publish content (updates status and publishedAt)
   */
  async publishContent(type: ContentType, slug: string): Promise<ContentFile> {
    return this.updateContent(type, slug, {
      status: 'published',
      publishedAt: new Date(),
    });
  }

  /**
   * Archive content
   */
  async archiveContent(type: ContentType, slug: string): Promise<ContentFile> {
    return this.updateContent(type, slug, {
      status: 'archived',
    });
  }

  /**
   * Search content by title and description
   */
  async searchContent(type: ContentType, query: string): Promise<ContentFile[]> {
    const allContent = await this.getAllContent(type);
    const lowerQuery = query.toLowerCase();

    return allContent.filter(
      (item) =>
        item.metadata.title.toLowerCase().includes(lowerQuery) ||
        item.metadata.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get content by tag
   */
  async getContentByTag(type: ContentType, tag: string): Promise<ContentFile[]> {
    const allContent = await this.getAllContent(type);
    return allContent.filter((item) =>
      item.metadata.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Read a single content file
   * Private method - sanitizes errors to not expose paths in production
   */
  private async readContentFile(type: ContentType, filename: string): Promise<ContentFile | null> {
    const filePath = path.join(CONTENT_DIR, type, filename);
    const slug = filename.replace('.mdx', '');

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      return {
        path: filePath,
        frontmatter: sanitizeMetadata(data),
        content: sanitizeContent(body),
        metadata: this.createMetadata(slug, type, data),
      };
    } catch (error) {
      const sanitizedError = sanitizeErrorForLogging(error);
      console.error('Error reading content file:', sanitizedError);
      return null;
    }
  }

  /**
   * Create metadata object from frontmatter
   */
  private createMetadata(
    slug: string,
    type: ContentType,
    frontmatter: Record<string, unknown>
  ): ContentMetadata {
    const title = typeof frontmatter.title === 'string' ? frontmatter.title : 'Untitled';
    const description = typeof frontmatter.description === 'string' ? frontmatter.description : undefined;
    const author = typeof frontmatter.author === 'string' ? frontmatter.author : 'Admin';
    const createdAt = frontmatter.createdAt ? new Date(frontmatter.createdAt as string | number) : new Date();
    const updatedAt = frontmatter.updatedAt ? new Date(frontmatter.updatedAt as string | number) : new Date();
    const publishedAt = frontmatter.publishedAt ? new Date(frontmatter.publishedAt as string | number) : undefined;
    const status = validateContentStatus(String(frontmatter.status)) ? (frontmatter.status as 'draft' | 'published' | 'archived') : 'draft';
    const featured = typeof frontmatter.featured === 'boolean' ? frontmatter.featured : false;
    const tags = Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [];
    const seoTitle = typeof frontmatter.seoTitle === 'string' ? frontmatter.seoTitle : undefined;
    const seoDescription = typeof frontmatter.seoDescription === 'string' ? frontmatter.seoDescription : undefined;

    return {
      id: slug,
      slug,
      type,
      title,
      description,
      author,
      createdAt,
      updatedAt,
      publishedAt,
      status,
      featured,
      tags,
      seoTitle,
      seoDescription,
    };
  }
}

export const contentService = new ContentService();
