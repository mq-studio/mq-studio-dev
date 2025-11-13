/**
 * Rate Limiting for MQ Studio
 *
 * Implements simple, memory-based rate limiting to prevent DoS attacks.
 * Uses next-rate-limit for efficient, in-memory rate limiting without external dependencies.
 *
 * Configuration:
 * - Search API: 60 requests per 60 seconds per IP (allows autocomplete)
 * - Content API: 60 requests per 60 seconds per IP
 * - General API: 100 requests per 60 seconds per IP
 */

import rateLimit from 'next-rate-limit';

/**
 * Rate limiter for search endpoint
 * Allows for autocomplete typing (60 requests per minute = ~1 per second)
 */
export const searchRateLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 unique IPs tracked at once
});

/**
 * Rate limiter for content API endpoint
 * Moderate limit for general content retrieval (60 requests per minute)
 */
export const contentRateLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

/**
 * Rate limiter for general API endpoints
 * More relaxed limit for other operations (100 requests per minute)
 */
export const generalRateLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

/**
 * Extract client IP from request
 * Checks various headers set by reverse proxies/CDNs
 *
 * @param request - Next.js request object
 * @returns Client IP address or 'anonymous' if not found
 */
export function getClientIP(request: Request): string {
  // Try to get IP from common headers (set by reverse proxies/CDNs)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (won't work behind proxies, but good for local dev)
  return 'anonymous';
}

/**
 * Apply rate limiting to an API route
 *
 * @param request - Next.js request object
 * @param limiter - Rate limiter instance to use
 * @param limit - Maximum requests allowed in the interval
 * @returns true if request should proceed, false if rate limit exceeded
 */
export async function checkRateLimit(
  request: Request,
  limiter: ReturnType<typeof rateLimit>,
  limit: number = 10
): Promise<{ success: true } | { success: false; remaining: number; resetAt: Date }> {
  try {
    // next-rate-limit uses checkNext which throws on rate limit exceeded
    limiter.checkNext(request as any, limit);
    return { success: true };
  } catch (error: any) {
    // Rate limit exceeded
    const resetAt = new Date(Date.now() + 60 * 1000); // 60 seconds from now
    return {
      success: false,
      remaining: 0,
      resetAt,
    };
  }
}
