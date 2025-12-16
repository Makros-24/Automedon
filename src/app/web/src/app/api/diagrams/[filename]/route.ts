import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  sanitizeFilename,
  securePath,
  secureErrorResponse,
} from '@/utils/security';

/**
 * API route for serving diagram files (SVG)
 *
 * Endpoint: /api/diagrams/[filename]
 * Method: GET
 *
 * Features:
 * - Server-side diagram file loading
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
    const { filename } = await params;

    // Sanitize and validate filename (prevent path traversal attacks)
    const validFilename = sanitizeFilename(filename, 'svg');

    if (!validFilename) {
      return NextResponse.json(
        secureErrorResponse(400, 'Invalid filename'),
        { status: 400 }
      );
    }

    // Construct file path using secure path construction
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
    // Diagrams are stored in the 'diagrams' directory at root of portfolio-data
    const diagramPath = securePath(basePath, 'diagrams', validFilename);

    if (!diagramPath) {
      return NextResponse.json(
        secureErrorResponse(400, 'Invalid file path'),
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      await fs.access(diagramPath);
    } catch {
      console.error('[Security] Diagram file access failed:', {
        file: validFilename,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        secureErrorResponse(404, 'Resource not found'),
        { status: 404 }
      );
    }

    // Read file content (always fresh read for hot reload support)
    // No in-memory caching - file is read from disk on every request
    const content = await fs.readFile(diagramPath, 'utf8');

    // Determine cache strategy based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Return SVG content with appropriate headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',

        // Hot reload support: No caching in development, short cache in production
        'Cache-Control': isDevelopment
          ? 'no-cache, no-store, must-revalidate' // Development: instant hot reload
          : 'public, max-age=300, s-maxage=3600',  // Production: 5min client, 1hr CDN

        'Pragma': isDevelopment ? 'no-cache' : 'public',
        ...(isDevelopment && { 'Expires': '0' }),

        // CORS headers (if needed)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });

  } catch (error) {
    // Log error server-side only (without exposing paths)
    console.error('[Security] Diagram API Error:', {
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
