import { NextRequest, NextResponse } from 'next/server';
import {
  discoverLocales,
  getCachedLocales,
  getDefaultLocale,
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
 * API route for locale metadata
 * Provides client-side access to discovered locales
 *
 * GET /api/locales
 * Response:
 * {
 *   "locales": [
 *     {
 *       "code": "en",
 *       "name": "English",
 *       "nativeName": "English",
 *       "flag": "🇬🇧",
 *       "isRTL": false
 *     },
 *     ...
 *   ],
 *   "defaultLocale": "en"
 * }
 */
export async function GET(_request: NextRequest) {
  try {
    // Ensure locales are discovered
    await ensureLocalesInitialized();

    // Get cached locales and default locale
    const locales = getCachedLocales();
    const defaultLocale = getDefaultLocale();

    // Return locale metadata
    return NextResponse.json(
      {
        locales,
        defaultLocale,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Cache for 1 hour in production, no cache in development
          'Cache-Control':
            process.env.NODE_ENV === 'development'
              ? 'no-cache, no-store, must-revalidate'
              : 'public, max-age=3600', // 1 hour
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('API Error - Locale metadata loading failed:', error);

    return NextResponse.json(
      { error: 'Internal server error while loading locale metadata' },
      { status: 500 }
    );
  }
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS(_request: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

/**
 * Health check endpoint
 */
export async function HEAD(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Locales-API': 'v1.0.0',
    },
  });
}
