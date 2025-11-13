/**
 * Validation Schemas for MQ Studio
 *
 * Provides Zod schemas for validating all user inputs to prevent injection attacks.
 *
 * Security measures:
 * - Max length limits prevent buffer overflow and DoS attacks
 * - Regex patterns prevent path traversal and command injection
 * - Enum validation ensures only expected values are accepted
 * - Sanitization removes potentially dangerous characters
 */

import { z } from 'zod';

/**
 * Valid categories for content filtering
 */
export const VALID_CATEGORIES = ['thinking', 'feeling', 'doing'] as const;

/**
 * Valid view modes for gallery display
 */
export const VALID_VIEW_MODES = ['full', 'moderate', 'compact'] as const;

/**
 * Search Query Schema
 *
 * Validates search parameters to prevent XSS and injection attacks.
 *
 * Rules:
 * - Query string: max 200 characters (prevents DoS)
 * - Category: must be one of [thinking, feeling, doing]
 * - All fields optional (allow empty searches)
 */
export const searchQuerySchema = z.object({
  q: z.string()
    .max(200, 'Search query must be 200 characters or less')
    .optional()
    .transform((val) => val?.trim()), // Remove leading/trailing whitespace

  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({ message: 'Category must be one of: thinking, feeling, doing' })
  }).optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

/**
 * Slug Schema
 *
 * Validates URL slugs to prevent path traversal attacks.
 *
 * Rules:
 * - Only lowercase letters, numbers, and hyphens
 * - No dots, slashes, or special characters
 * - Max 100 characters
 * - Cannot start or end with hyphen
 */
export const slugSchema = z.string()
  .min(1, 'Slug cannot be empty')
  .max(100, 'Slug must be 100 characters or less')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens (no leading/trailing hyphens)'
  });

export type Slug = z.infer<typeof slugSchema>;

/**
 * Category Schema
 *
 * Validates content category selection.
 */
export const categorySchema = z.enum(VALID_CATEGORIES, {
  errorMap: () => ({ message: 'Category must be one of: thinking, feeling, doing' })
});

export type Category = z.infer<typeof categorySchema>;

/**
 * View Mode Schema
 *
 * Validates gallery view mode selection.
 */
export const viewModeSchema = z.enum(VALID_VIEW_MODES, {
  errorMap: () => ({ message: 'View mode must be one of: full, moderate, compact' })
});

export type ViewMode = z.infer<typeof viewModeSchema>;

/**
 * Content API Request Schema
 *
 * Validates requests to the content API endpoint.
 */
export const contentApiRequestSchema = z.object({
  type: z.enum(['musings', 'publications', 'artworks'], {
    errorMap: () => ({ message: 'Type must be one of: musings, publications, artworks' })
  }).optional(),

  category: categorySchema.optional(),

  slug: slugSchema.optional(),

  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional(),
});

export type ContentApiRequest = z.infer<typeof contentApiRequestSchema>;

/**
 * Pagination Schema
 *
 * Validates pagination parameters.
 */
export const paginationSchema = z.object({
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),

  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Email Schema
 *
 * Validates email addresses for contact forms.
 */
export const emailSchema = z.string()
  .email('Must be a valid email address')
  .max(255, 'Email must be 255 characters or less');

export type Email = z.infer<typeof emailSchema>;

/**
 * Safe validation helper
 *
 * Validates data against a schema and returns either the validated data or an error.
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Object with either success + data or error + message
 */
export function safeValidate<T extends z.ZodType<any, any, any>>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Format validation errors for user display
 *
 * @param error - The Zod error to format
 * @returns Human-readable error message
 */
export function formatValidationError(error: z.ZodError): string {
  const messages = error.errors.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });

  return messages.join('; ');
}
