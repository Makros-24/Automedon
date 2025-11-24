# =============================================================================
# Multi-stage Dockerfile for Automedon Portfolio
# =============================================================================
# This Dockerfile creates an optimized production build of the portfolio
# with support for multilingual content and volume-mounted portfolio data.
#
# Build: docker build -t automedon-portfolio .
# Run:   docker run -p 3000:3000 automedon-portfolio
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
# Install all dependencies (both production and dev) for building
# Using Debian-based image for better lightningcss compatibility
FROM node:20-slim AS deps

# Install minimal dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/web

# Copy package files for dependency installation
COPY src/app/web/package*.json ./

# Install dependencies with clean install for reproducibility
RUN npm ci

# Explicitly install lightningcss with platform-specific binaries
RUN npm install lightningcss-linux-x64-gnu || npm rebuild lightningcss || true

# -----------------------------------------------------------------------------
# Stage 2: Builder
# -----------------------------------------------------------------------------
# Build the Next.js application
FROM node:20-slim AS builder

WORKDIR /app/web

# Copy dependencies from deps stage
COPY --from=deps /app/web/node_modules ./node_modules

# Copy all web application source files
COPY src/app/web/ ./

# Copy portfolio data to the expected location
COPY portfolio-data/ /app/portfolio-data/

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORTFOLIO_DATA_DIR=/app/portfolio-data

# Build the Next.js application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Runner
# -----------------------------------------------------------------------------
# Create the production runtime image
FROM node:20-slim AS runner

WORKDIR /app/web

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORTFOLIO_DATA_DIR=/app/portfolio-data

# Configure application URLs and settings
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_DEFAULT_LANGUAGE=en
ENV NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION=true
ENV NEXT_PUBLIC_DEBUG_MODE=false
ENV NEXT_PUBLIC_SHOW_GRID=false

# Create a non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy portfolio data from builder (baked into image)
COPY --from=builder --chown=nextjs:nodejs /app/portfolio-data /app/portfolio-data

# Copy only production dependencies
COPY --from=deps --chown=nextjs:nodejs /app/web/node_modules ./node_modules

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/web/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/web/public ./public

# Copy necessary config files
COPY --from=builder --chown=nextjs:nodejs /app/web/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/web/next.config.ts ./next.config.ts

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Configure the port Next.js will listen on
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check to ensure container is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/portfolio?lang=en', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the Next.js production server
CMD ["npm", "start"]
