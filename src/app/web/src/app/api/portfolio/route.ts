import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validatePortfolioData } from '@/utils/dataLoader';
import {
  discoverLocales,
  getCachedLocales,
  getDefaultLocale,
  isValidLocale,
} from '@/utils/localeDiscovery';
import {
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
 * API route for portfolio data with multi-language support
 * Handles server-side loading of portfolio data from JSON files
 *
 * Query Parameters:
 * - lang: Language code (en, fr, de, ar). Defaults to 'en'
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure locales are discovered
    await ensureLocalesInitialized();

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

    const language = sanitizedLang && isValidLocale(sanitizedLang)
      ? sanitizedLang
      : getDefaultLocale();

    // Get the portfolio config path from environment variables
    // This now points to the portfolio-data directory
    const configPath = process.env.PORTFOLIO_CONFIG_PATH || './portfolio-data';

    // Resolve base path
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
    const fullPath = securePath(basePath, language, 'portfolio.json');

    if (!fullPath) {
      return NextResponse.json(
        secureErrorResponse(400, 'Invalid file path'),
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      console.error('[Security] Portfolio file access failed:', {
        file: 'portfolio.json',
        locale: language,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        secureErrorResponse(404, 'Resource not found'),
        { status: 404 }
      );
    }

    // Read and parse the JSON file
    let portfolioData;
    try {
      const fileContent = await fs.readFile(fullPath, 'utf8');
      portfolioData = JSON.parse(fileContent);
    } catch (_parseError) {
      return NextResponse.json(
        { error: 'Failed to parse portfolio data: Invalid JSON format' },
        { status: 400 }
      );
    }

    // Validate the data structure
    if (!validatePortfolioData(portfolioData)) {
      return NextResponse.json(
        { error: 'Invalid portfolio data structure' },
        { status: 400 }
      );
    }

    // Get available locales for response header
    const availableLocales = getCachedLocales().map(l => l.code).join(', ');

    // Return the portfolio data with appropriate headers
    return NextResponse.json(portfolioData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Language': language,
        'X-Portfolio-Language': language,
        'X-Available-Locales': availableLocales,
        // Prevent caching in development, allow caching in production
        'Cache-Control': process.env.NODE_ENV === 'development'
          ? 'no-cache, no-store, must-revalidate'
          : 'public, max-age=300, s-maxage=600', // 5min client, 10min CDN
        'Pragma': 'no-cache',
        'Expires': '0',
        // Vary header to cache different language versions separately
        'Vary': 'Accept-Language'
      }
    });

  } catch (error) {
    // Log error server-side only (without exposing paths)
    console.error('[Security] Portfolio API Error:', {
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

  return NextResponse.json({}, {
    headers: getCorsHeaders(origin),
  });
}

/**
 * Health check endpoint - returns basic info about the API
 */
export async function HEAD(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Portfolio-API': 'v1.0.0',
    },
  });
}