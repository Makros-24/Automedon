# Development Environment Setup

This document provides comprehensive setup instructions for the Automedon portfolio development environment.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.17.0 or higher (LTS recommended)
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: Version 2.34.0 or higher
- **Code Editor**: VS Code (recommended) or similar

### Operating System Support
- **Windows**: 10/11 (WSL2 recommended for optimal performance)
- **macOS**: 10.15 or higher
- **Linux**: Ubuntu 18.04+ or equivalent

### Browser Requirements (Development)
- **Chrome/Chromium**: 100+ (recommended for DevTools)
- **Firefox**: 100+ (for cross-browser testing)
- **Safari**: 15+ (macOS users)
- **Edge**: 100+ (Windows users)

## Initial Setup

### 1. Clone Repository
```bash
# Clone the repository
git clone https://github.com/yourusername/automedon.git
cd automedon
```

### 2. Navigate to Web Application
```bash
# Navigate to the Next.js application directory
cd src/app/web
```

### 3. Install Dependencies
```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 4. Environment Configuration
```bash
# Copy environment template (when available)
cp .env.example .env.local

# Edit environment variables
code .env.local  # or your preferred editor
```

### 5. Start Development Server
```bash
# Start development server with Turbopack (recommended)
npm run dev

# Alternative: Standard Next.js dev server
npx next dev
```

The application should now be running at `http://localhost:3000`

## Development Tools Setup

### VS Code Configuration

#### Required Extensions
Install these extensions for optimal development experience:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-jest",
    "usernamehw.errorlens"
  ]
}
```

#### VS Code Settings
Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

#### VS Code Tasks
Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "isBackground": true,
      "problemMatcher": "$tsc-watch"
    },
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "test",
      "type": "npm",
      "script": "test",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### Git Configuration

#### Global Git Setup
```bash
# Configure user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable helpful options
git config --global pull.rebase true
git config --global push.autoSetupRemote true
```

#### Project-Specific Hooks (Optional)
```bash
# Install husky for git hooks (recommended)
npm install --save-dev husky lint-staged
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add commit-msg hook (for conventional commits)
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

## Environment Variables

### Required Variables
Create `.env.local` file in `src/app/web/`:

```env
# Application Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Future API Configuration (when implemented)
# OPENAI_API_KEY=your_openai_api_key_here
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Email Configuration (future)
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=your_email@example.com
# SMTP_PASS=your_app_password

# Analytics (future)
# NEXT_PUBLIC_GA_TRACKING_ID=GA_TRACKING_ID
# NEXT_PUBLIC_HOTJAR_ID=HOTJAR_ID

# Development Options
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_GRID=false
```

### Environment Variable Types
```typescript
// types/env.d.ts - Type definitions for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_DEBUG_MODE?: string;
    
    // Future variables
    OPENAI_API_KEY?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
  }
}
```

## Package Management

### NPM Configuration
Create `.npmrc` file in project root:

```ini
# Use exact versions for better reproducibility
save-exact=true

# Prefer offline when possible
prefer-offline=true

# Audit level
audit-level=moderate

# Engine strict
engine-strict=true
```

### Dependency Management
```bash
# Check for outdated packages
npm outdated

# Update dependencies (patch versions)
npm update

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix

# Clean install (removes node_modules and reinstalls)
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Daily Development
1. **Start of Day**
   ```bash
   # Navigate to project
   cd src/app/web
   
   # Pull latest changes
   git pull origin main
   
   # Install any new dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

2. **Development Commands**
   ```bash
   # Run development server (with Turbopack)
   npm run dev
   
   # Run linting
   npm run lint
   
   # Run type checking
   npx tsc --noEmit
   
   # Run tests
   npm run test
   
   # Run tests in watch mode
   npm run test:watch
   ```

3. **Build and Production Testing**
   ```bash
   # Build for production
   npm run build
   
   # Start production server locally
   npm run start
   
   # Analyze bundle size (when configured)
   npm run analyze
   ```

### Code Quality Checks
```bash
# Complete check before committing
npm run lint && npx tsc --noEmit && npm run test && npm run build
```

## Troubleshooting Setup Issues

### Common Node.js Issues

#### Wrong Node Version
```bash
# Check current version
node --version

# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use correct Node version
nvm install 18.17.0
nvm use 18.17.0
nvm alias default 18.17.0
```

#### NPM Permission Issues (Linux/macOS)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Common Next.js Issues

#### Port Already in Use
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Or manually check types
npx tsc --noEmit
```

#### Cache Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Dependencies Issues

#### Peer Dependencies Warnings
```bash
# Install peer dependencies
npm install --save-dev @types/react @types/react-dom

# Or ignore peer deps warnings (not recommended)
npm install --legacy-peer-deps
```

#### Version Conflicts
```bash
# Check dependency tree
npm ls

# Find conflicting packages
npm ls package-name

# Force resolution in package.json (use sparingly)
{
  "overrides": {
    "package-name": "^1.0.0"
  }
}
```

## Performance Optimization

### Development Performance
```bash
# Use Turbopack for faster builds (already configured)
npm run dev  # Uses --turbopack flag

# Enable TypeScript incremental compilation
# Already configured in tsconfig.json
```

### VS Code Performance
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false,
  "extensions.experimental.affinity": {
    "vscodevim.vim": 1
  }
}
```

## Platform-Specific Setup

### Windows (WSL2 Recommended)
```bash
# Install WSL2 (if not already installed)
wsl --install

# Use WSL2 for development
wsl

# Clone and work within WSL filesystem
cd ~
git clone https://github.com/yourusername/automedon.git
```

### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via Homebrew
brew install node

# Install watchman for better file watching
brew install watchman
```

### Linux
```bash
# Update package manager
sudo apt update

# Install curl and git (if not installed)
sudo apt install curl git

# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Verification Checklist

After setup, verify everything works:

- [ ] **Node.js**: `node --version` shows 18.17.0+
- [ ] **NPM**: `npm --version` shows 9.0.0+
- [ ] **Dependencies**: `npm install` completes without errors
- [ ] **Development server**: `npm run dev` starts successfully
- [ ] **TypeScript**: No type errors in editor
- [ ] **Linting**: `npm run lint` passes
- [ ] **Building**: `npm run build` completes successfully
- [ ] **Testing**: `npm run test` runs (even if no tests yet)
- [ ] **Git**: Repository initialized and remote configured

## Quick Reference Commands

```bash
# Project setup
cd src/app/web && npm install && npm run dev

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Maintenance
npm update           # Update dependencies
npm audit            # Check for vulnerabilities
npm outdated         # Check outdated packages

# Git workflow
git checkout -b feature/name  # Create feature branch
git add .                     # Stage changes
git commit -m "feat: description"  # Commit with conventional format
git push origin feature/name  # Push branch
```

## Getting Help

### Documentation Resources
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

### Common Commands Help
```bash
# NPM help
npm help

# Next.js help
npx next --help

# Git help
git --help
```

### Project-Specific Help
- Check `troubleshooting.md` for common issues
- Review `best-practices.md` for coding standards
- Consult `architecture.md` for system design
- Follow `git.md` for version control guidelines