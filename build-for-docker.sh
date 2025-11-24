#!/bin/bash
# =============================================================================
# Build Script for Docker Deployment (Workaround for Tailwind CSS v4)
# =============================================================================
# This script builds the Next.js application locally and prepares it for
# Docker deployment. This bypasses the Tailwind CSS v4 + Docker compatibility
# issue by building in your local environment where native binaries work.
#
# Usage:
#   chmod +x build-for-docker.sh
#   ./build-for-docker.sh
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_APP_DIR="$PROJECT_ROOT/src/app/web"
BUILD_MARKER="$PROJECT_ROOT/.docker-build-ready"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Automedon Portfolio - Docker Build Script                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check if we're in the right directory
echo -e "${YELLOW}📁 Checking project structure...${NC}"
if [ ! -d "$WEB_APP_DIR" ]; then
    echo -e "${RED}❌ Error: Web application directory not found at $WEB_APP_DIR${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Project structure verified${NC}"
echo ""

# Step 2: Navigate to web app directory
echo -e "${YELLOW}📂 Navigating to web application directory...${NC}"
cd "$WEB_APP_DIR"
echo -e "${GREEN}✓ Current directory: $(pwd)${NC}"
echo ""

# Step 3: Check Node.js version
echo -e "${YELLOW}🔍 Checking Node.js version...${NC}"
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"
if [[ ! "$NODE_VERSION" =~ ^v(18|20|21|22) ]]; then
    echo -e "${RED}⚠️  Warning: Node.js 18+ recommended. Current version: $NODE_VERSION${NC}"
fi
echo ""

# Step 4: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 5: Clean previous build
echo -e "${YELLOW}🧹 Cleaning previous build artifacts...${NC}"
if [ -d ".next" ]; then
    rm -rf .next
    echo -e "${GREEN}✓ Removed .next directory${NC}"
else
    echo -e "${GREEN}✓ No previous build to clean${NC}"
fi
echo ""

# Step 6: Build the Next.js application
echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
echo -e "${BLUE}This may take a few minutes...${NC}"
echo ""

# Set production environment
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Run the build
if npm run build; then
    echo ""
    echo -e "${GREEN}✓ Build completed successfully!${NC}"
else
    echo ""
    echo -e "${RED}❌ Build failed. Please check the errors above.${NC}"
    exit 1
fi
echo ""

# Step 7: Verify build output
echo -e "${YELLOW}🔍 Verifying build output...${NC}"
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Error: .next directory not found after build${NC}"
    exit 1
fi

if [ ! -f ".next/BUILD_ID" ]; then
    echo -e "${RED}❌ Error: BUILD_ID file not found${NC}"
    exit 1
fi

BUILD_ID=$(cat .next/BUILD_ID)
echo -e "${GREEN}✓ Build ID: $BUILD_ID${NC}"
echo -e "${GREEN}✓ Build artifacts verified${NC}"
echo ""

# Step 8: Setup .dockerignore for pre-built approach
echo -e "${YELLOW}🔧 Configuring .dockerignore for pre-built approach...${NC}"
cd "$PROJECT_ROOT"

if [ -f ".dockerignore" ] && [ ! -f ".dockerignore.backup" ]; then
    cp .dockerignore .dockerignore.backup
    echo -e "${GREEN}✓ Backed up original .dockerignore${NC}"
fi

if [ -f ".dockerignore.prebuilt" ]; then
    cp .dockerignore.prebuilt .dockerignore
    echo -e "${GREEN}✓ Switched to .dockerignore.prebuilt${NC}"
    echo -e "${BLUE}  (Original backed up as .dockerignore.backup)${NC}"
else
    echo -e "${YELLOW}⚠️  .dockerignore.prebuilt not found, using existing .dockerignore${NC}"
fi
echo ""

# Step 9: Create build marker for Docker
echo -e "${YELLOW}📝 Creating build marker...${NC}"
cat > "$BUILD_MARKER" << EOF
Build completed at: $(date)
Build ID: $BUILD_ID
Node.js version: $NODE_VERSION
Working directory: $WEB_APP_DIR
.dockerignore: Configured for pre-built approach
EOF
echo -e "${GREEN}✓ Build marker created${NC}"
echo ""

# Step 10: Display next steps
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Build Complete - Ready for Docker!                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Build the Docker image:"
echo -e "     ${YELLOW}docker compose -f docker-compose.prebuilt.yml build${NC}"
echo ""
echo -e "  2. Run the container:"
echo -e "     ${YELLOW}docker compose -f docker-compose.prebuilt.yml up${NC}"
echo ""
echo -e "  3. Access your portfolio at:"
echo -e "     ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📋 Build Information:${NC}"
echo -e "  • Build ID: ${GREEN}$BUILD_ID${NC}"
echo -e "  • Build artifacts: ${GREEN}.next/${NC}"
echo -e "  • Ready for Docker: ${GREEN}Yes${NC}"
echo ""
