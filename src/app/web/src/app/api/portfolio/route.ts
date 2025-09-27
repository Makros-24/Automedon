import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validatePortfolioData } from '@/utils/dataLoader';

/**
 * API route for portfolio data
 * Handles server-side loading of portfolio data from JSON files
 */
export async function GET(request: NextRequest) {
  try {
    // Get the portfolio config path from environment variables
    const configPath = process.env.PORTFOLIO_CONFIG_PATH;
    
    if (!configPath) {
      return NextResponse.json(
        { error: 'PORTFOLIO_CONFIG_PATH environment variable is not set' },
        { status: 500 }
      );
    }

    // Resolve the file path relative to the project root
    let fullPath: string;
    if (path.isAbsolute(configPath)) {
      fullPath = configPath;
    } else {
      // If relative path, resolve from project root
      // process.cwd() points to the web app directory, so go up 3 levels to project root
      const projectRoot = path.resolve(process.cwd(), '../../..');
      fullPath = path.resolve(projectRoot, configPath);
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
        // Prevent caching in development, allow caching in production
        'Cache-Control': process.env.NODE_ENV === 'development' 
          ? 'no-cache, no-store, must-revalidate' 
          : 'public, max-age=300, s-maxage=600', // 5min client, 10min CDN
        'Pragma': 'no-cache',
        'Expires': '0'
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