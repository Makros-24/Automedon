/**
 * CORS Helper Utility for secure cross-origin resource sharing
 *
 * Provides functions to generate secure CORS headers based on allowed origins
 */

/**
 * Get allowed origins based on environment
 */
export function getAllowedOrigins(): string[] {
  if (process.env.NODE_ENV === 'production') {
    return [
      process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ].filter(Boolean); // Remove any undefined values
  }

  // Development environment
  return ['http://localhost:3000', 'http://localhost:3001'];
}

/**
 * Generate secure CORS headers for a given origin
 * @param origin - The origin from the request headers
 * @returns Object with CORS headers
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = getAllowedOrigins();

  // Determine if the origin is allowed
  const allowedOrigin = (origin && allowedOrigins.includes(origin))
    ? origin
    : allowedOrigins[0]; // Default to first allowed origin

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
