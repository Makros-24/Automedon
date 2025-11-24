# Docker Deployment Guide

This guide provides comprehensive instructions for building, running, and deploying the Automedon portfolio application using Docker.

## ⚠️ IMPORTANT: Known Limitation with Tailwind CSS v4

**Current Status**: This project uses **Tailwind CSS v4 (beta)**, which has **known compatibility issues with Docker builds** due to `lightningcss` native binary requirements.

**Error You'll Encounter**:
```
Error: Cannot find module '../lightningcss.linux-x64-gnu.node'
```

**Why This Happens**:
- Tailwind CSS v4 uses `lightningcss` for CSS processing
- `lightningcss` requires platform-specific native binaries (`.node` files)
- These binaries are not properly installed in Docker containers during `npm install`
- This is a known issue with Tailwind CSS v4 beta and will be resolved in the stable release

**Workarounds Available**:

1. **Build Locally, Copy Artifacts** (Temporary Solution)
   - Build the Next.js app on your local machine: `npm run build`
   - Copy the `.next` folder to a simple Node.js Docker image
   - Run with `npm start`

2. **Use Platform-as-a-Service** (Recommended)
   - Deploy to **Vercel** (https://vercel.com) - Full Tailwind CSS v4 support
   - Deploy to **Netlify** (https://netlify.com) - Handles native bindings correctly
   - These platforms have proper build environments for Next.js + Tailwind CSS v4

3. **Wait for Tailwind CSS v4 Stable Release**
   - Docker support will improve when v4 reaches stable
   - The Dockerfile in this repository is ready for when that happens

4. **Downgrade to Tailwind CSS v3** (Requires Code Changes)
   - Tailwind CSS v3 has full Docker compatibility
   - Requires changing `package.json` and Tailwind configuration
   - Not recommended unless Docker deployment is critical

**This documentation is provided for future reference when Tailwind CSS v4 Docker support stabilizes.**

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Building the Image](#building-the-image)
- [Running the Container](#running-the-container)
- [Docker Compose](#docker-compose)
- [Volume Mounts](#volume-mounts)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## Prerequisites

### Required Software

- **Docker**: Version 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0+ (included with Docker Desktop)

### System Requirements

- **CPU**: 1+ cores (2+ recommended)
- **RAM**: 512MB minimum (1GB+ recommended)
- **Disk**: 500MB for image + build cache
- **Network**: Internet connection for initial build

### Verify Installation

```bash
# Check Docker version
docker --version
# Output: Docker version 24.0.0 or higher

# Check Docker Compose version
docker compose version
# Output: Docker Compose version 2.0.0 or higher

# Test Docker installation
docker run hello-world
```

## Quick Start

The fastest way to get the portfolio running with Docker:

```bash
# 1. Navigate to project root
cd /path/to/Automedon

# 2. Build and run with Docker Compose
docker compose up

# 3. Access the application
# Open http://localhost:3000 in your browser
```

**That's it!** The application is now running in a Docker container.

To stop the container:
```bash
docker compose down
```

## Building the Image

### Basic Build

Build the Docker image from the project root:

```bash
# Build the image with default tag
docker build -t automedon-portfolio .

# Build with specific tag/version
docker build -t automedon-portfolio:v1.0.0 .

# Build with build arguments
docker build --build-arg NODE_ENV=production -t automedon-portfolio .
```

### Build Options

```bash
# No cache build (clean build)
docker build --no-cache -t automedon-portfolio .

# Build with specific platform
docker build --platform linux/amd64 -t automedon-portfolio .

# Build with progress output
docker build --progress=plain -t automedon-portfolio .

# Multi-platform build (for ARM64 and AMD64)
docker buildx build --platform linux/amd64,linux/arm64 -t automedon-portfolio .
```

### Verify Build

```bash
# List images
docker images | grep automedon

# Inspect the image
docker inspect automedon-portfolio

# Check image size
docker images automedon-portfolio --format "{{.Size}}"
```

## Running the Container

### Basic Run

```bash
# Run container in foreground
docker run -p 3000:3000 automedon-portfolio

# Run container in background (detached mode)
docker run -d -p 3000:3000 --name automedon automedon-portfolio

# Run with custom name
docker run -d -p 3000:3000 --name my-portfolio automedon-portfolio
```

### Run with Environment Variables

```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=https://yourwebsite.com \
  -e NEXT_PUBLIC_DEFAULT_LANGUAGE=fr \
  -e NEXT_PUBLIC_DEBUG_MODE=true \
  --name automedon \
  automedon-portfolio
```

### Run with Volume Mounts

```bash
# Override portfolio data with local files
docker run -d -p 3000:3000 \
  -v "$(pwd)/portfolio-data:/app/portfolio-data:ro" \
  --name automedon \
  automedon-portfolio

# Mount custom environment file
docker run -d -p 3000:3000 \
  -v "$(pwd)/src/app/web/.env.production:/app/web/.env.production:ro" \
  --name automedon \
  automedon-portfolio
```

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop automedon

# Start stopped container
docker start automedon

# Restart container
docker restart automedon

# Remove container
docker rm automedon

# Remove container forcefully
docker rm -f automedon

# View container logs
docker logs automedon

# Follow logs in real-time
docker logs -f automedon

# View last 100 lines of logs
docker logs --tail 100 automedon
```

## Docker Compose

Docker Compose simplifies running the application with pre-configured settings.

### Basic Commands

```bash
# Start services (build if needed)
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild and start
docker compose up --build

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# View specific service logs
docker compose logs automedon-portfolio
```

### Custom Compose File

```bash
# Use custom compose file
docker compose -f docker-compose.prod.yml up -d

# Use multiple compose files (override settings)
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### Service Management

```bash
# Start specific service
docker compose start automedon-portfolio

# Stop specific service
docker compose stop automedon-portfolio

# Restart specific service
docker compose restart automedon-portfolio

# Scale services (if configured)
docker compose up --scale automedon-portfolio=3
```

## Volume Mounts

### Portfolio Data Override

The hybrid approach allows you to override portfolio data without rebuilding:

**1. Edit docker-compose.yml:**

```yaml
services:
  automedon-portfolio:
    volumes:
      # Uncomment this line
      - ./portfolio-data:/app/portfolio-data:ro
```

**2. Restart the service:**

```bash
docker compose down
docker compose up -d
```

**3. Update portfolio files:**

Now you can edit `portfolio-data/*.json` files locally, and changes will be reflected immediately without rebuilding the image.

### Important Notes

- **Read-only Mount (`:ro`)**: Prevents container from modifying host files
- **File Sync**: Changes to mounted files appear immediately in the container
- **Rebuild**: Only needed when changing application code, not data files

### Testing Data Changes

```bash
# 1. Edit a portfolio file
echo '{"test": "data"}' > portfolio-data/test.json

# 2. Verify inside container
docker exec automedon-portfolio ls -la /app/portfolio-data/

# 3. Test API endpoint
curl http://localhost:3000/api/portfolio?lang=en
```

## Environment Variables

### Available Variables

#### Application Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Application environment mode |
| `PORT` | `3000` | Port the application listens on |
| `HOSTNAME` | `0.0.0.0` | Host binding (use 0.0.0.0 for containers) |

#### Portfolio Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORTFOLIO_DATA_DIR` | `/app/portfolio-data` | Path to portfolio data directory |

#### Public Variables (Client-side)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public URL of the application |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | `en` | Default language (en, fr, de, ar) |
| `NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION` | `true` | Enable browser language detection |
| `NEXT_PUBLIC_DEBUG_MODE` | `false` | Enable debug features |
| `NEXT_PUBLIC_SHOW_GRID` | `false` | Show debug grid overlay |

#### Next.js Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_TELEMETRY_DISABLED` | `1` | Disable Next.js telemetry |

### Setting Environment Variables

**Method 1: Command Line**

```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=https://portfolio.example.com \
  -e NEXT_PUBLIC_DEFAULT_LANGUAGE=fr \
  automedon-portfolio
```

**Method 2: Environment File**

Create `.env.docker`:

```env
NEXT_PUBLIC_APP_URL=https://portfolio.example.com
NEXT_PUBLIC_DEFAULT_LANGUAGE=fr
NEXT_PUBLIC_DEBUG_MODE=false
```

Run with env file:

```bash
docker run -d -p 3000:3000 --env-file .env.docker automedon-portfolio
```

**Method 3: Docker Compose**

Edit `docker-compose.yml`:

```yaml
services:
  automedon-portfolio:
    environment:
      - NEXT_PUBLIC_APP_URL=https://portfolio.example.com
      - NEXT_PUBLIC_DEFAULT_LANGUAGE=fr
```

Or use env file:

```yaml
services:
  automedon-portfolio:
    env_file:
      - .env.docker
```

## Production Deployment

### Build for Production

```bash
# Build optimized production image
docker build \
  --build-arg NODE_ENV=production \
  --tag automedon-portfolio:production \
  --tag automedon-portfolio:v1.0.0 \
  .

# Test production build locally
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=https://yourwebsite.com \
  automedon-portfolio:production
```

### Registry Push

```bash
# Tag for registry
docker tag automedon-portfolio:production username/automedon-portfolio:latest
docker tag automedon-portfolio:production username/automedon-portfolio:v1.0.0

# Login to registry
docker login

# Push to Docker Hub
docker push username/automedon-portfolio:latest
docker push username/automedon-portfolio:v1.0.0

# Push to private registry
docker tag automedon-portfolio:production registry.example.com/automedon-portfolio:latest
docker push registry.example.com/automedon-portfolio:latest
```

### Production Compose File

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  automedon-portfolio:
    image: automedon-portfolio:production
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://yourwebsite.com
      - NEXT_PUBLIC_DEFAULT_LANGUAGE=en
      - NEXT_PUBLIC_DEBUG_MODE=false
    volumes:
      - ./portfolio-data:/app/portfolio-data:ro
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

Deploy:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Reverse Proxy Setup (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name portfolio.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Health Checks

The container includes a built-in health check:

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' automedon

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' automedon
```

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker logs automedon

# Or with Docker Compose
docker compose logs automedon-portfolio
```

**Common issues:**
- Port 3000 already in use: Use `-p 3001:3000` to map to different port
- Permission issues: Ensure portfolio-data directory is readable
- Missing files: Verify all portfolio-data JSON files exist

### Build Failures

**Clear build cache:**
```bash
docker builder prune -a
docker build --no-cache -t automedon-portfolio .
```

**Check build context:**
```bash
# Ensure you're in project root
pwd
# Should show: /path/to/Automedon

# Verify files exist
ls -la portfolio-data/
ls -la src/app/web/
```

### Performance Issues

**Check resource usage:**
```bash
docker stats automedon
```

**Increase resources:**
```yaml
# In docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 1G
```

### Network Issues

**Test connectivity:**
```bash
# From host
curl http://localhost:3000/api/portfolio?lang=en

# From inside container
docker exec automedon curl http://localhost:3000/api/portfolio?lang=en
```

**Check port mapping:**
```bash
docker port automedon
```

### Volume Mount Issues

**Verify mount:**
```bash
docker exec automedon ls -la /app/portfolio-data/

# Check permissions
docker exec automedon cat /app/portfolio-data/en.json
```

**Windows path issues:**
```bash
# Use absolute paths with forward slashes
docker run -v C:/Projects/Automedon/portfolio-data:/app/portfolio-data:ro automedon-portfolio
```

## Advanced Usage

### Multi-stage Build Inspection

```bash
# Build specific stage
docker build --target deps -t automedon-deps .
docker build --target builder -t automedon-builder .

# Inspect stage
docker run -it --rm automedon-builder sh
```

### Debugging Inside Container

```bash
# Open shell in running container
docker exec -it automedon sh

# Run as root for debugging
docker exec -it -u root automedon sh

# Check environment variables
docker exec automedon env

# Check process list
docker exec automedon ps aux

# Check network interfaces
docker exec automedon ip addr
```

### Performance Profiling

```bash
# Monitor real-time stats
docker stats automedon

# Export stats to file
docker stats --no-stream automedon > stats.txt

# Check image layers
docker history automedon-portfolio
```

### Custom Build Optimization

```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t automedon-portfolio .

# Build with secrets (for private npm packages)
docker build --secret id=npmrc,src=$HOME/.npmrc -t automedon-portfolio .
```

### Backup and Restore

**Backup portfolio data:**
```bash
docker exec automedon tar czf /tmp/portfolio-backup.tar.gz -C /app portfolio-data
docker cp automedon:/tmp/portfolio-backup.tar.gz ./portfolio-backup.tar.gz
```

**Restore portfolio data:**
```bash
docker cp ./portfolio-backup.tar.gz automedon:/tmp/
docker exec automedon tar xzf /tmp/portfolio-backup.tar.gz -C /app
docker restart automedon
```

## Best Practices

### Security

- ✅ Run as non-root user (already configured)
- ✅ Use read-only volume mounts when possible
- ✅ Keep base images updated: `docker pull node:20-alpine`
- ✅ Scan for vulnerabilities: `docker scan automedon-portfolio`
- ✅ Use secrets for sensitive data, not environment variables

### Performance

- ✅ Use multi-stage builds (already configured)
- ✅ Minimize layers by combining RUN commands
- ✅ Use .dockerignore to exclude unnecessary files
- ✅ Pin dependency versions in package.json
- ✅ Enable BuildKit for improved caching

### Maintenance

- 🔄 Regular image rebuilds for security patches
- 🔄 Monitor container logs and health
- 🔄 Backup portfolio data regularly
- 🔄 Test updates in staging before production
- 🔄 Document any configuration changes

## Quick Reference

### Essential Commands

```bash
# Build
docker build -t automedon-portfolio .

# Run
docker run -d -p 3000:3000 --name automedon automedon-portfolio

# Compose
docker compose up -d

# Logs
docker logs -f automedon

# Stop
docker stop automedon

# Remove
docker rm automedon

# Shell
docker exec -it automedon sh
```

### File Structure

```
Automedon/
├── Dockerfile                 # Multi-stage build definition
├── .dockerignore             # Build context exclusions
├── docker-compose.yml        # Compose configuration
├── DOCKER.md                 # This documentation
├── portfolio-data/           # Portfolio data (EN, FR, DE, AR)
│   ├── en.json
│   ├── fr.json
│   ├── de.json
│   └── ar.json
└── src/app/web/             # Next.js application
    ├── package.json
    ├── next.config.ts
    └── ...
```

## Support

For issues or questions:

1. Check this documentation
2. Review container logs: `docker logs automedon`
3. Check [Docker documentation](https://docs.docker.com/)
4. Review [Next.js Docker documentation](https://nextjs.org/docs/deployment#docker-image)
5. Open an issue in the project repository

---

**Last Updated**: 2025-01-19
**Docker Version**: 24.0+
**Docker Compose Version**: 2.0+
