import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  discoverLocales,
  getDefaultLocale,
  isValidLocale,
} from '@/utils/localeDiscovery';
import {
  sanitizeFilename,
  sanitizeLocaleCode,
  securePath,
  secureErrorResponse,
} from '@/utils/security';

// Initialize locale discovery on module load
let localesInitialized = false;
async function ensureLocalesInitialized() {
  if (!localesInitialized) {
    await discoverLocales();
    localesInitialized = true;
  }
}

/**
 * API route for serving markdown files
 *
 * Endpoint: /api/markdown/[filename]?lang=<locale>
 * Method: GET
 *
 * Features:
 * - Server-side markdown file loading with locale support
 * - Hot reload support (no in-memory caching)
 * - Security validation (prevent path traversal)
 * - Docker volume compatibility
 * - Environment-based cache headers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Ensure locales are discovered
    await ensureLocalesInitialized();

    const { filename } = await params;

    // Extract language from query parameter
    const { searchParams } = new URL(request.url);
    const requestedLang = searchParams.get('lang');

    // Sanitize and validate locale code
    const sanitizedLang = requestedLang ? sanitizeLocaleCode(requestedLang) : null;

    if (requestedLang && !sanitizedLang) {
      return NextResponse.json(
        secureErrorResponse(400, 'Invalid language parameter'),
        { status: 400 }
      );
    }

    const locale = sanitizedLang && isValidLocale(sanitizedLang)
      ? sanitizedLang
      : getDefaultLocale();

    // Sanitize and validate filename (prevent path traversal attacks)
    const validFilename = sanitizeFilename(filename, 'md');

    if (!validFilename) {
      return NextResponse.json(
        secureErrorResponse(400, 'Invalid filename'),
        { status: 400 }
      );
    }

    // Construct file path with locale support using secure path construction
    const configPath = process.env.PORTFOLIO_CONFIG_PATH || './portfolio-data';
    let basePath: string;

    if (path.isAbsolute(configPath)) {
      // Absolute path (Docker container)
      basePath = configPath;
    } else {
      // Relative path (local development)
      const projectRoot = path.resolve(process.cwd(), '../../..');
      basePath = path.resolve(projectRoot, configPath);
    }

    // Use secure path construction to prevent path traversal
    const markdownPath = securePath(basePath, locale, 'projects-md', validFilename);

    if (!markdownPath) {
      return NextResponse.json(
        secureErrorResponse(400, 'Invalid file path'),
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      await fs.access(markdownPath);
    } catch {
      console.error('[Security] Markdown file access failed:', {
        file: validFilename,
        locale: locale,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        secureErrorResponse(404, 'Resource not found'),
        { status: 404 }
      );
    }

    // Read file content (always fresh read for hot reload support)
    // No in-memory caching - file is read from disk on every request
    const content = await fs.readFile(markdownPath, 'utf8');

    // Determine cache strategy based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Return markdown content with appropriate headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',

        // Hot reload support: No caching in development, short cache in production
        'Cache-Control': isDevelopment
          ? 'no-cache, no-store, must-revalidate' // Development: instant hot reload
          : 'public, max-age=60, s-maxage=300',   // Production: 1min client, 5min CDN

        'Pragma': isDevelopment ? 'no-cache' : 'public',
        ...(isDevelopment && { 'Expires': '0' }),

        // CORS headers (if needed)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });

  } catch (error) {
    // Log error server-side only (without exposing paths)
    console.error('[Security] Markdown API Error:', {
      error: error instanceof Error ? error.message.replace(/[C-Z]:\\.*?[\\/]/g, '[PATH]/') : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    // Return generic error response (don't expose internal details)
    return NextResponse.json(
      secureErrorResponse(500, 'Internal server error'),
      { status: 500 }
    );
  }
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS(request: NextRequest) {
  const { getCorsHeaders } = await import('@/utils/corsHelper');
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}
