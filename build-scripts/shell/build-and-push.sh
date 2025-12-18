#!/bin/bash
# =============================================================================
# Build and Push Script for Docker Hub (Linux/Mac)
# =============================================================================
# This script automates the complete workflow for building and pushing the
# Automedon portfolio Docker image to Docker Hub.
#
# Usage:
#   chmod +x build-and-push.sh
#   ./build-and-push.sh
#
# Prerequisites:
#   - Docker installed and running
#   - Docker Hub account (makros24)
#   - Next.js project built locally (or use --force to rebuild)
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_REPO="makros24/automedon"
DOCKERFILE="Dockerfile.prebuilt"
BUILD_MARKER=".docker-build-ready"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Automedon Portfolio - Build and Push to Docker Hub          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# =============================================================================
# Step 1: Check Prerequisites
# =============================================================================
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install Docker from https://www.docker.com/get-started${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Error: Docker daemon is not running${NC}"
    echo -e "${YELLOW}Please start Docker and try again${NC}"
    exit 1
fi

# Check if Dockerfile.prebuilt exists
if [ ! -f "$DOCKERFILE" ]; then
    echo -e "${RED}❌ Error: $DOCKERFILE not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed and running${NC}"
echo -e "${GREEN}✓ $DOCKERFILE found${NC}"
echo ""

# =============================================================================
# Step 2: Build Next.js Application Locally
# =============================================================================
echo -e "${YELLOW}📦 Checking Next.js build...${NC}"

# Check if build marker exists and is recent (less than 1 hour old)
REBUILD_NEEDED=false
if [ -f "$BUILD_MARKER" ]; then
    # Check if build marker is older than 1 hour (3600 seconds)
    if [ $(($(date +%s) - $(stat -c %Y "$BUILD_MARKER" 2>/dev/null || stat -f %m "$BUILD_MARKER"))) -gt 3600 ]; then
        echo -e "${YELLOW}⚠️  Build marker is older than 1 hour${NC}"
        REBUILD_NEEDED=true
    else
        echo -e "${GREEN}✓ Recent build found (less than 1 hour old)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No build marker found${NC}"
    REBUILD_NEEDED=true
fi

# Ask user if they want to rebuild if marker is old or missing
if [ "$REBUILD_NEEDED" = true ]; then
    echo ""
    read -p "Do you want to rebuild the Next.js application? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Building Next.js application...${NC}"

        # Determine which build script to use
        if [ -f "build-for-docker.sh" ]; then
            chmod +x build-for-docker.sh
            ./build-for-docker.sh
        else
            echo -e "${RED}❌ Error: build-for-docker.sh not found${NC}"
            exit 1
        fi

        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Next.js build failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Skipping rebuild - using existing .next folder${NC}"
        echo -e "${YELLOW}⚠️  Make sure your .next folder is up to date!${NC}"
    fi
fi

echo ""

# =============================================================================
# Step 3: Get Version Number
# =============================================================================
echo -e "${YELLOW}📋 Version Information${NC}"
echo -e "${BLUE}Please enter a version number for this release${NC}"
echo -e "${BLUE}Format: MAJOR.MINOR.PATCH (e.g., 1.0.0, 2.1.3)${NC}"
echo ""

while true; do
    read -p "Version number: " VERSION

    # Validate version format (semver: MAJOR.MINOR.PATCH)
    if [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo -e "${GREEN}✓ Valid version format: $VERSION${NC}"
        break
    else
        echo -e "${RED}❌ Invalid version format${NC}"
        echo -e "${YELLOW}Please use semantic versioning: MAJOR.MINOR.PATCH (e.g., 1.0.0)${NC}"
    fi
done

# Construct image tags
VERSION_TAG="${DOCKER_REPO}:v${VERSION}"
LATEST_TAG="${DOCKER_REPO}:latest"

echo ""
echo -e "${BLUE}Docker image will be tagged as:${NC}"
echo -e "  • ${GREEN}${VERSION_TAG}${NC}"
echo -e "  • ${GREEN}${LATEST_TAG}${NC}"
echo ""

# =============================================================================
# Step 4: Docker Hub Login
# =============================================================================
echo -e "${YELLOW}🔐 Docker Hub Authentication${NC}"

# Check if already logged in
if docker info 2>&1 | grep -q "Username"; then
    CURRENT_USER=$(docker info 2>&1 | grep "Username" | awk '{print $2}')
    echo -e "${GREEN}✓ Already logged in as: ${CURRENT_USER}${NC}"

    # Ask if user wants to re-login
    read -p "Do you want to log in with a different account? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Please log in to Docker Hub:${NC}"
        docker login
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Docker login failed${NC}"
            exit 1
        fi
    fi
else
    echo -e "${BLUE}Please log in to Docker Hub:${NC}"
    docker login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Docker login failed${NC}"
        exit 1
    fi
fi

echo ""

# =============================================================================
# Step 5: Build Docker Image
# =============================================================================
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
echo -e "${BLUE}This may take a few minutes...${NC}"
echo ""

# Build the Docker image
docker build -f "$DOCKERFILE" -t "$VERSION_TAG" -t "$LATEST_TAG" .

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

# =============================================================================
# Step 6: Push to Docker Hub
# =============================================================================
echo -e "${YELLOW}📤 Pushing images to Docker Hub...${NC}"

# Push version tag
echo -e "${BLUE}Pushing ${VERSION_TAG}...${NC}"
docker push "$VERSION_TAG"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push ${VERSION_TAG}${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Pushed ${VERSION_TAG}${NC}"

# Push latest tag
echo -e "${BLUE}Pushing ${LATEST_TAG}...${NC}"
docker push "$LATEST_TAG"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push ${LATEST_TAG}${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Pushed ${LATEST_TAG}${NC}"

echo ""

# =============================================================================
# Step 7: Success Summary
# =============================================================================
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Build and Push Complete!                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📦 Images available on Docker Hub:${NC}"
echo -e "  • ${GREEN}${VERSION_TAG}${NC}"
echo -e "  • ${GREEN}${LATEST_TAG}${NC}"
echo ""
echo -e "${BLUE}🚀 Deployment Commands:${NC}"
echo ""
echo -e "${YELLOW}To pull and run on any server:${NC}"
echo -e "  docker pull ${DOCKER_REPO}:latest"
echo -e "  docker run -p 3000:3000 ${DOCKER_REPO}:latest"
echo ""
echo -e "${YELLOW}Or use docker-compose:${NC}"
echo -e "  docker compose -f docker-compose.production.yml pull"
echo -e "  docker compose -f docker-compose.production.yml up -d"
echo ""
echo -e "${BLUE}🔗 Docker Hub Repository:${NC}"
echo -e "  https://hub.docker.com/r/${DOCKER_REPO}"
echo ""
echo -e "${BLUE}📋 Version Information:${NC}"
echo -e "  Version: ${GREEN}v${VERSION}${NC}"
echo -e "  Build date: ${GREEN}$(date)${NC}"
echo ""
