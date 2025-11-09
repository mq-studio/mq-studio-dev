/**
 * CMS Type Definitions
 * Shared types across the CMS application
 */

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expires: Date;
}

// Content Types
export type ContentType = 'musing' | 'artwork' | 'publication' | 'project';

export interface ContentMetadata {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  description?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContentFile {
  path: string;
  frontmatter: Record<string, any>;
  content: string;
  metadata: ContentMetadata;
}

// Musing Type
export interface Musing extends ContentMetadata {
  type: 'musing';
  content: string;
  audioUrl?: string;
  audioTranscript?: string;
  mood?: string;
  series?: string;
}

// Artwork Type
export interface Artwork extends ContentMetadata {
  type: 'artwork';
  content: string;
  images: ArtworkImage[];
  medium?: string;
  dimensions?: string;
  year?: number;
  price?: string;
  inStock?: boolean;
}

// Artwork Image
export interface ArtworkImage {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

// Publication Type
export interface Publication extends ContentMetadata {
  type: 'publication';
  content: string;
  publisher?: string;
  publicationDate?: Date;
  link?: string;
  abstract?: string;
}

// Project Type
export interface Project extends ContentMetadata {
  type: 'project';
  content: string;
  images: ArtworkImage[];
  link?: string;
  projectStatus?: 'completed' | 'in-progress' | 'archived';
}

// Media Type
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'audio' | 'video' | 'document';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
}

// Editor State
export interface EditorState {
  contentId?: string;
  type: ContentType;
  title: string;
  description: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  metadata: Record<string, any>;
  isDirty: boolean;
  isLoading: boolean;
  error?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
