import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  discoverLocales,
  getDefaultLocale,
  isValidLocale,
} from '@/utils/localeDiscovery';

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

    // Validate and set language (default to discovered default if invalid)
    const locale = requestedLang && isValidLocale(requestedLang)
      ? requestedLang
      : getDefaultLocale();

    // Validate filename (prevent path traversal attacks)
    // Only allow alphanumeric, hyphens, and .md extension
    if (!filename || !/^[\w-]+\.md$/.test(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename format' },
        { status: 400 }
      );
    }

    // Construct file path with locale support
    // Use PORTFOLIO_CONFIG_PATH env variable for Docker compatibility
    const configPath = process.env.PORTFOLIO_CONFIG_PATH || './portfolio-data';
    let markdownPath: string;

    if (path.isAbsolute(configPath)) {
      // Absolute path (Docker container)
      markdownPath = path.join(configPath, locale, 'projects-md', filename);
    } else {
      // Relative path (local development)
      const projectRoot = path.resolve(process.cwd(), '../../..');
      markdownPath = path.resolve(projectRoot, configPath, locale, 'projects-md', filename);
    }

    // Check if file exists
    try {
      await fs.access(markdownPath);
    } catch {
      return NextResponse.json(
        { error: 'Markdown file not found', filename },
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
    console.error('Markdown API Error:', error);

    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        return NextResponse.json(
          { error: 'Markdown file not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('EACCES')) {
        return NextResponse.json(
          { error: 'Permission denied accessing markdown file' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error while loading markdown' },
      { status: 500 }
    );
  }
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
