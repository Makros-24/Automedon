/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side environment variables (no need to expose to client)
  // PORTFOLIO_CONFIG_PATH is now used server-side only in API routes

  // Enable React strict mode
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Turbopack configuration (now stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // API configuration
  async headers() {
    return [
      {
        // Apply cache headers to API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development'
              ? 'no-cache, no-store, must-revalidate'
              : 'public, max-age=300, s-maxage=600'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
