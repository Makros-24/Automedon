# Docker Pre-built Deployment Guide

This guide explains how to deploy the Automedon portfolio using the **pre-built approach**, which bypasses the Tailwind CSS v4 + Docker compatibility issue by building the Next.js application locally before creating the Docker image.

## 🎯 Overview

**The Problem**: Tailwind CSS v4 (beta) has compatibility issues with Docker builds due to `lightningcss` native binary requirements.

**The Solution**: Build the Next.js application locally (where native binaries work correctly), then create a lightweight Docker image that only runs the pre-built application.

## ✅ Prerequisites

- **Node.js 18+** installed locally
- **npm** installed locally
- **Docker** and **Docker Compose** installed
- **Git** (for version control)

## 🚀 Quick Start (3 Steps)

### Step 1: Build the Application Locally

Run the build script for your operating system:

**Linux/Mac:**
```bash
chmod +x build-for-docker.sh
./build-for-docker.sh
```

**Windows:**
```cmd
build-for-docker.bat
```

This script will:
- ✅ Install dependencies
- ✅ Build the Next.js application
- ✅ Configure `.dockerignore` for pre-built approach
- ✅ Create a build marker file

### Step 2: Build the Docker Image

```bash
docker compose -f docker-compose.prebuilt.yml build
```

This creates a Docker image with your pre-built application.

### Step 3: Run the Container

```bash
docker compose -f docker-compose.prebuilt.yml up
```

Your portfolio will be available at **http://localhost:3000**

To run in detached mode (background):
```bash
docker compose -f docker-compose.prebuilt.yml up -d
```

## 📁 Files in the Pre-built Approach

| File | Purpose |
|------|---------|
| `build-for-docker.sh` | Build script for Linux/Mac |
| `build-for-docker.bat` | Build script for Windows |
| `Dockerfile.prebuilt` | Dockerfile for pre-built artifacts |
| `docker-compose.prebuilt.yml` | Docker Compose configuration |
| `.dockerignore.prebuilt` | Optimized .dockerignore that includes .next folder |
| `.docker-build-ready` | Marker file indicating build is complete |

## 🔄 Complete Workflow

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd Automedon

# 2. Build locally
./build-for-docker.sh  # or build-for-docker.bat on Windows

# 3. Build Docker image
docker compose -f docker-compose.prebuilt.yml build

# 4. Run container
docker compose -f docker-compose.prebuilt.yml up
```

### Making Changes and Rebuilding

When you make changes to your portfolio:

```bash
# 1. Make your code changes
# (edit files in src/app/web/)

# 2. Rebuild locally
./build-for-docker.sh

# 3. Rebuild Docker image
docker compose -f docker-compose.prebuilt.yml build

# 4. Restart container
docker compose -f docker-compose.prebuilt.yml up -d
```

### Updating Portfolio Data Only

If you only change portfolio data (JSON files):

```bash
# Option 1: Enable volume mount (recommended for frequent updates)
# Edit docker-compose.prebuilt.yml and uncomment the volume line:
volumes:
  - ./portfolio-data:/app/portfolio-data:ro

# Then restart the container
docker compose -f docker-compose.prebuilt.yml restart

# Option 2: Rebuild the image
docker compose -f docker-compose.prebuilt.yml build
docker compose -f docker-compose.prebuilt.yml up -d
```

## 🔧 What the Build Script Does

### Automated Steps

1. **Verification**
   - Checks project structure
   - Verifies Node.js installation
   - Confirms dependencies

2. **Dependency Installation**
   - Runs `npm ci` for clean installation
   - Ensures all packages are up to date

3. **Build Process**
   - Sets production environment variables
   - Runs `npm run build`
   - Creates optimized `.next` folder

4. **Build Verification**
   - Checks for `.next` folder
   - Validates `BUILD_ID` file
   - Verifies build artifacts

5. **Docker Configuration**
   - Backs up original `.dockerignore`
   - Switches to `.dockerignore.prebuilt`
   - Creates build marker file

6. **Success Report**
   - Displays build information
   - Shows next steps
   - Provides Docker commands

## 📝 Environment Variables

The Docker container uses these environment variables (configured in `docker-compose.prebuilt.yml`):

```env
# Application
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Portfolio
PORTFOLIO_DATA_DIR=/app/portfolio-data

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Languages
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION=true

# Features
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SHOW_GRID=false

# Telemetry
NEXT_TELEMETRY_DISABLED=1
```

## 🐛 Troubleshooting

### Build Script Fails

**Issue**: Build script exits with errors

**Solutions**:
```bash
# Check Node.js version (18+ required)
node --version

# Clear previous build and try again
cd src/app/web
rm -rf .next node_modules
npm install
npm run build

# Then run build script again
cd ../../../
./build-for-docker.sh
```

### Docker Build Fails

**Issue**: `docker compose build` fails

**Solutions**:
```bash
# Ensure build script completed successfully
ls src/app/web/.next  # Should show build files

# Check for .dockerignore.prebuilt
ls -la .dockerignore.prebuilt

# Verify .dockerignore was updated
cat .dockerignore | grep -v "^#" | grep ".next"  # Should NOT exclude .next

# Try rebuilding with --no-cache
docker compose -f docker-compose.prebuilt.yml build --no-cache
```

### Container Starts But Shows Errors

**Issue**: Container runs but portfolio doesn't load

**Solutions**:
```bash
# Check container logs
docker compose -f docker-compose.prebuilt.yml logs

# Check if port 3000 is available
netstat -an | grep 3000  # Linux/Mac
netstat -an | findstr 3000  # Windows

# Try different port
# Edit docker-compose.prebuilt.yml:
ports:
  - "3001:3000"  # Use port 3001 instead
```

### .next Folder Not Found in Docker

**Issue**: Docker build can't find `.next` folder

**Solution**:
```bash
# Verify .dockerignore is correct
cat .dockerignore

# It should NOT have this line (or it should be commented):
# **/.next

# If it does, the build script didn't run correctly
# Manually copy .dockerignore.prebuilt:
cp .dockerignore.prebuilt .dockerignore

# Then rebuild Docker image
docker compose -f docker-compose.prebuilt.yml build
```

## 🔒 Security Considerations

### Non-root User

The Docker container runs as a non-root user (`nextjs`) for security:
- User ID: 1001
- Group ID: 1001

### File Permissions

All files are owned by the `nextjs` user:
```dockerfile
COPY --chown=nextjs:nodejs src/app/web/.next ./.next
```

### Health Checks

The container includes health checks to ensure it's running correctly:
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/portfolio?lang=en', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 📊 Performance

### Image Size

The pre-built approach creates a smaller image because:
- ❌ No build tools in final image
- ❌ No dev dependencies
- ✅ Only production dependencies
- ✅ Only necessary runtime files

Expected image size: **~300-400MB** (vs ~1GB+ for full build)

### Build Time

- **Local build**: 1-3 minutes (runs locally with full resources)
- **Docker image creation**: 30-60 seconds (just copying files)
- **Total**: ~2-4 minutes

Compare to in-container build: Would fail due to Tailwind CSS v4 issue

## 🚀 Production Deployment

### Using Docker Compose

```bash
# Production deployment
docker compose -f docker-compose.prebuilt.yml up -d

# Check status
docker compose -f docker-compose.prebuilt.yml ps

# View logs
docker compose -f docker-compose.prebuilt.yml logs -f

# Stop
docker compose -f docker-compose.prebuilt.yml down
```

### Using Docker Run

```bash
# Build image
docker build -f Dockerfile.prebuilt -t automedon-portfolio:latest .

# Run container
docker run -d \
  --name automedon-portfolio \
  -p 3000:3000 \
  --restart unless-stopped \
  -v $(pwd)/portfolio-data:/app/portfolio-data:ro \
  automedon-portfolio:latest
```

### Using Docker Swarm

```bash
# Initialize swarm (if not already done)
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prebuilt.yml automedon

# Check services
docker service ls

# View logs
docker service logs automedon_automedon-portfolio
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Build application
        run: |
          chmod +x build-for-docker.sh
          ./build-for-docker.sh

      - name: Build Docker image
        run: docker compose -f docker-compose.prebuilt.yml build

      - name: Push to registry
        run: |
          docker tag automedon-portfolio:prebuilt registry.example.com/automedon:latest
          docker push registry.example.com/automedon:latest
```

## 🆚 Comparison: Pre-built vs Standard Approach

| Aspect | Pre-built Approach | Standard Approach |
|--------|-------------------|-------------------|
| **Compatibility** | ✅ Works with Tailwind CSS v4 | ❌ Fails with Tailwind CSS v4 |
| **Build Location** | Local machine | Docker container |
| **Build Time** | Faster (local resources) | Slower (container resources) |
| **Image Size** | Smaller (~300MB) | Larger (~1GB+) |
| **Complexity** | Two-step process | Single-step build |
| **Debugging** | Easier (local build) | Harder (in container) |
| **CI/CD** | Requires Node.js in CI | Pure Docker workflow |

## 📚 Additional Resources

- [DOCKER.md](./DOCKER.md) - Full Docker documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## ❓ FAQ

### Q: Why not just fix the Tailwind CSS issue?

**A**: Tailwind CSS v4 is in beta, and the issue will be resolved in the stable release. This workaround allows you to use Docker now while maintaining the latest features.

### Q: Can I automate the build script in CI/CD?

**A**: Yes! The build script is designed for automation. Just ensure your CI environment has Node.js 18+ installed.

### Q: What happens if I forget to run the build script?

**A**: The Docker build will fail with a "`.next` not found" error. Simply run the build script and try again.

### Q: Can I use this approach in production?

**A**: Absolutely! This is a perfectly valid production deployment method. Many teams pre-compile their applications before containerization.

### Q: How do I update just the portfolio data?

**A**: Enable the volume mount in `docker-compose.prebuilt.yml` and restart the container. Changes to JSON files will be reflected immediately.

## ✨ Benefits of Pre-built Approach

1. **✅ Works Today** - No waiting for Tailwind CSS v4 stable
2. **✅ Faster Builds** - Use local machine resources
3. **✅ Smaller Images** - No build tools in final image
4. **✅ Easier Debugging** - Build errors are local, not in Docker
5. **✅ Better Security** - Minimal attack surface in production image
6. **✅ Consistent Builds** - Same build artifacts every time

---

**Ready to deploy?** Start with Step 1 and run the build script! 🚀
