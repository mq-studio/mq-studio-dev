/**
 * Content Service
 * Handles CRUD operations for content (musings, artworks, publications, projects)
 */

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  ContentFile,
  ContentMetadata,
  ContentType,
  Musing,
  Artwork,
  Publication,
  Project,
} from '@/lib/types/cms';

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
   */
  async getContentBySlug(type: ContentType, slug: string): Promise<ContentFile | null> {
    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      return {
        path: filePath,
        frontmatter: data,
        content: body,
        metadata: this.createMetadata(slug, type, data),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create new content
   */
  async createContent(
    type: ContentType,
    slug: string,
    metadata: Partial<ContentMetadata>,
    content: string
  ): Promise<ContentFile> {
    const fileDir = path.join(CONTENT_DIR, type);
    const filePath = path.join(fileDir, `${slug}.mdx`);

    // Ensure directory exists
    await fs.mkdir(fileDir, { recursive: true });

    // Check if file already exists
    try {
      await fs.access(filePath);
      throw new Error(`Content with slug "${slug}" already exists`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    const frontmatter = {
      title: metadata.title || 'Untitled',
      description: metadata.description || '',
      status: metadata.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...metadata,
    };

    const fileContent = matter.stringify(content, frontmatter);
    await fs.writeFile(filePath, fileContent);

    return {
      path: filePath,
      frontmatter,
      content,
      metadata: this.createMetadata(slug, type, frontmatter),
    };
  }

  /**
   * Update existing content
   */
  async updateContent(
    type: ContentType,
    slug: string,
    updates: Partial<ContentMetadata>,
    content?: string
  ): Promise<ContentFile> {
    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);

    const existing = await this.getContentBySlug(type, slug);
    if (!existing) {
      throw new Error(`Content with slug "${slug}" not found`);
    }

    const frontmatter = {
      ...existing.frontmatter,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const fileContent = matter.stringify(content || existing.content, frontmatter);
    await fs.writeFile(filePath, fileContent);

    return {
      path: filePath,
      frontmatter,
      content: content || existing.content,
      metadata: this.createMetadata(slug, type, frontmatter),
    };
  }

  /**
   * Delete content
   */
  async deleteContent(type: ContentType, slug: string): Promise<void> {
    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Content with slug "${slug}" not found`);
      }
      throw error;
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
   */
  private async readContentFile(type: ContentType, filename: string): Promise<ContentFile | null> {
    const filePath = path.join(CONTENT_DIR, type, filename);
    const slug = filename.replace('.mdx', '');

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      return {
        path: filePath,
        frontmatter: data,
        content: body,
        metadata: this.createMetadata(slug, type, data),
      };
    } catch (error) {
      console.error(`Error reading content file: ${filePath}`, error);
      return null;
    }
  }

  /**
   * Create metadata object from frontmatter
   */
  private createMetadata(
    slug: string,
    type: ContentType,
    frontmatter: Record<string, any>
  ): ContentMetadata {
    return {
      id: slug,
      slug,
      type,
      title: frontmatter.title || 'Untitled',
      description: frontmatter.description,
      author: frontmatter.author || 'Admin',
      createdAt: new Date(frontmatter.createdAt || Date.now()),
      updatedAt: new Date(frontmatter.updatedAt || Date.now()),
      publishedAt: frontmatter.publishedAt ? new Date(frontmatter.publishedAt) : undefined,
      status: frontmatter.status || 'draft',
      featured: frontmatter.featured || false,
      tags: frontmatter.tags || [],
      seoTitle: frontmatter.seoTitle,
      seoDescription: frontmatter.seoDescription,
    };
  }
}

export const contentService = new ContentService();
