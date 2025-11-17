import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validatePortfolioData } from '@/utils/dataLoader';

// Supported languages
type Language = 'en' | 'fr' | 'de' | 'ar';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'fr', 'de', 'ar'];
const DEFAULT_LANGUAGE: Language = 'en';

/**
 * API route for portfolio data with multi-language support
 * Handles server-side loading of portfolio data from JSON files
 *
 * Query Parameters:
 * - lang: Language code (en, fr, de, ar). Defaults to 'en'
 */
export async function GET(request: NextRequest) {
  try {
    // Extract language from query parameter
    const { searchParams } = new URL(request.url);
    const requestedLang = searchParams.get('lang') as Language | null;

    // Validate and set language (default to English if invalid)
    const language: Language = requestedLang && SUPPORTED_LANGUAGES.includes(requestedLang)
      ? requestedLang
      : DEFAULT_LANGUAGE;

    // Get the portfolio config path from environment variables
    // This now points to the portfolio-data directory
    const configPath = process.env.PORTFOLIO_CONFIG_PATH || './portfolio-data';

    // Resolve the file path relative to the project root
    let fullPath: string;
    if (path.isAbsolute(configPath)) {
      fullPath = path.join(configPath, `${language}.json`);
    } else {
      // If relative path, resolve from project root
      // process.cwd() points to the web app directory, so go up 3 levels to project root
      const projectRoot = path.resolve(process.cwd(), '../../..');
      fullPath = path.resolve(projectRoot, configPath, `${language}.json`);
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch (error) {
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
    } catch (parseError) {
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

    // Return the portfolio data with appropriate headers
    return NextResponse.json(portfolioData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Language': language,
        'X-Portfolio-Language': language,
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
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Health check endpoint - returns basic info about the API
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Portfolio-API': 'v1.0.0',
    },
  });
}