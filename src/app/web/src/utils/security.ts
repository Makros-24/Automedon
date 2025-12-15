import path from 'path';

/**
 * Security Utility Module
 *
 * Provides sanitization and validation functions to prevent common vulnerabilities:
 * - Path traversal attacks
 * - Injection attacks
 * - Information disclosure
 */

/**
 * Sanitizes locale codes to prevent path traversal
 *
 * @param locale - The locale code to sanitize
 * @returns Sanitized locale code or null if invalid
 */
export function sanitizeLocaleCode(locale: string): string | null {
  if (!locale || typeof locale !== 'string') return null;
  if (locale.length > 10) return null;

  // Only allow lowercase letters, 2-5 chars (e.g., 'en', 'fr', 'de', 'ar')
  if (!/^[a-z]{2,5}$/.test(locale)) return null;

  // Explicit traversal checks
  if (locale.includes('..') || locale.includes('/') || locale.includes('\\')) {
    return null;
  }

  return locale;
}

/**
 * Sanitizes filenames to prevent path traversal
 *
 * @param filename - The filename to sanitize
 * @param expectedExt - Expected file extension (e.g., 'md', 'svg')
 * @returns Sanitized filename or null if invalid
 */
export function sanitizeFilename(
  filename: string,
  expectedExt: string
): string | null {
  if (!filename || typeof filename !== 'string') return null;
  if (filename.length > 100) return null;

  // Only allow alphanumeric, hyphens, underscores, single dot before extension
  const regex = new RegExp(`^[a-zA-Z0-9_-]+\\.${expectedExt}$`);
  if (!regex.test(filename)) return null;

  // Explicit traversal checks
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return null;
  }

  // Check URL-decoded version
  try {
    const decoded = decodeURIComponent(filename);
    if (decoded.includes('..') || decoded.includes('/') || decoded.includes('\\')) {
      return null;
    }
  } catch {
    // If decodeURIComponent fails, treat as invalid
    return null;
  }

  return filename;
}

/**
 * Safely constructs file paths within a base directory
 *
 * Ensures the resolved path is within the base directory to prevent path traversal
 *
 * @param basePath - The base directory path
 * @param segments - Path segments to join
 * @returns Resolved path or null if unsafe
 */
export function securePath(
  basePath: string,
  ...segments: string[]
): string | null {
  // Validate all segments
  for (const segment of segments) {
    if (!segment ||
        segment.includes('..') ||
        segment.includes('/') ||
        segment.includes('\\')) {
      return null;
    }
  }

  const fullPath = path.join(basePath, ...segments);
  const resolvedPath = path.resolve(fullPath);
  const resolvedBase = path.resolve(basePath);

  // Ensure path is within base directory
  if (!resolvedPath.startsWith(resolvedBase)) {
    return null;
  }

  return resolvedPath;
}

/**
 * Generic error response without internal details
 *
 * Prevents information disclosure through error messages
 *
 * @param _status - HTTP status code (for API consistency, not used in response body)
 * @param message - Generic error message
 * @returns Error response object
 */
export function secureErrorResponse(
  _status: number = 400,
  message: string = 'Invalid request'
) {
  return {
    error: message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Sanitizes error messages for client response
 *
 * Removes sensitive information like file paths and stack traces
 *
 * @param error - Error object
 * @returns Sanitized error object for logging
 */
export function sanitizeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      message: error.message.replace(/[C-Z]:\\\\.*?[\\/]/g, '[PATH]/'), // Remove Windows paths
      type: error.name
      // DO NOT include: stack, cause with paths
    };
  }

  return {
    message: 'Unknown error',
    type: 'UnknownError'
  };
}
