// API route for content retrieval
import { NextRequest, NextResponse } from 'next/server';
import { contentService } from '@/lib/content/content-service';
import { searchQuerySchema, slugSchema, contentApiRequestSchema, formatValidationError } from '@/lib/validation/schemas';
import { contentRateLimiter, checkRateLimit } from '@/lib/rate-limit';

// Force dynamic rendering for API endpoints (handles dynamic queries, rate limiting, user-specific data)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Apply rate limiting (60 requests per minute allows for autocomplete search)
  const rateLimitResult = await checkRateLimit(request, contentRateLimiter, 60);
  if (!rateLimitResult.success) {
    const resetAtISO = ('resetAt' in rateLimitResult) ? rateLimitResult.resetAt.toISOString() : new Date(Date.now() + 60000).toISOString();
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        resetAt: resetAtISO,
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetAtISO,
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limitStr = searchParams.get('limit');
    const search = searchParams.get('search');
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    // Validate search query if present
    if (search) {
      const searchValidation = searchQuerySchema.safeParse({ q: search, category: category || undefined });
      if (!searchValidation.success) {
        return NextResponse.json(
          { error: 'Invalid search parameters', details: formatValidationError(searchValidation.error) },
          { status: 400 }
        );
      }
    }

    // Validate slug if present
    if (slug) {
      const slugValidation = slugSchema.safeParse(slug);
      if (!slugValidation.success) {
        return NextResponse.json(
          { error: 'Invalid slug format', details: formatValidationError(slugValidation.error) },
          { status: 400 }
        );
      }
    }

    // Validate limit if present
    let limit: number | undefined;
    if (limitStr) {
      const limitNum = parseInt(limitStr, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return NextResponse.json(
          { error: 'Invalid limit: must be a number between 1 and 100' },
          { status: 400 }
        );
      }
      limit = limitNum;
    }

    // Single content by ID
    if (id) {
      const content = await contentService.getContentById(id);
      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(content);
    }

    // Single content by slug
    if (slug) {
      const content = await contentService.getContentBySlug(slug);
      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(content);
    }

    // Search
    if (search) {
      const results = await contentService.searchContent(search);
      return NextResponse.json(results);
    }

    // Get content by filters
    let content;

    if (type) {
      content = await contentService.getContentByType(type as any);
    } else if (category) {
      content = await contentService.getContentByCategory(category as any);
    } else if (featured === 'true') {
      content = await contentService.getFeaturedContent();
    } else {
      content = await contentService.getAllContent();
    }

    // Apply limit if specified
    if (limit) {
      content = content.slice(0, limit);
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error in content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API route to get recent content and other POST actions
export async function POST(request: NextRequest) {
  // Apply rate limiting (60 requests per minute)
  const rateLimitResult = await checkRateLimit(request, contentRateLimiter, 60);
  if (!rateLimitResult.success) {
    const resetAtISO = ('resetAt' in rateLimitResult) ? rateLimitResult.resetAt.toISOString() : new Date(Date.now() + 60000).toISOString();
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        resetAt: resetAtISO,
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetAtISO,
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { action, contentId, id, slug, limit = 6 } = body;

    // Validate limit
    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit: must be a number between 1 and 100' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'recent':
        const recentContent = await contentService.getRecentContent(limit);
        return NextResponse.json(recentContent);

      case 'related':
      case 'getRelated':
        const targetId = contentId || id;
        if (!targetId) {
          return NextResponse.json(
            { error: 'contentId or id required for related content' },
            { status: 400 }
          );
        }
        const relatedContent = await contentService.getRelatedContent(targetId, limit);
        return NextResponse.json(relatedContent);

      case 'getBySlug':
        if (!slug) {
          return NextResponse.json(
            { error: 'slug required for getBySlug action' },
            { status: 400 }
          );
        }
        // Validate slug format
        const slugValidation = slugSchema.safeParse(slug);
        if (!slugValidation.success) {
          return NextResponse.json(
            { error: 'Invalid slug format', details: formatValidationError(slugValidation.error) },
            { status: 400 }
          );
        }
        const content = await contentService.getContentBySlug(slug);
        if (!content) {
          return NextResponse.json(
            { error: 'Content not found' },
            { status: 404 }
          );
        }
        return NextResponse.json(content);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}