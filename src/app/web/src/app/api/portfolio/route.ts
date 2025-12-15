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

    // Validate and set language (default to discovered default if invalid)
    const language = requestedLang && isValidLocale(requestedLang)
      ? requestedLang
      : getDefaultLocale();

    // Get the portfolio config path from environment variables
    // This now points to the portfolio-data directory
    const configPath = process.env.PORTFOLIO_CONFIG_PATH || './portfolio-data';

    // Resolve the file path relative to the project root
    let fullPath: string;
    if (path.isAbsolute(configPath)) {
      fullPath = path.join(configPath, language, 'portfolio.json');
    } else {
      // If relative path, resolve from project root
      // process.cwd() points to the web app directory, so go up 3 levels to project root
      const projectRoot = path.resolve(process.cwd(), '../../..');
      fullPath = path.resolve(projectRoot, configPath, language, 'portfolio.json');
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch (_error) {
      return NextResponse.json(
        { error: `Portfolio data file not found: ${fullPath}` },
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
    console.error('API Error - Portfolio data loading failed:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        return NextResponse.json(
          { error: 'Portfolio data file not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('EACCES')) {
        return NextResponse.json(
          { error: 'Permission denied accessing portfolio data file' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error while loading portfolio data' },
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