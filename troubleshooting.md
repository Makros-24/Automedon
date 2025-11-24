# Troubleshooting Guide

This document provides solutions to common issues, debugging strategies, and emergency procedures for the Automedon portfolio application.

## Common Development Issues

### Next.js & React Issues

#### Hydration Mismatch Errors
**Symptoms**: Console errors about hydration, content appearing different between server and client

```bash
Error: Text content does not match server-rendered HTML
Error: Hydration failed because the initial UI does not match
```

**Solutions**:
```typescript
// ✅ Fix 1: Use useEffect for client-only content
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <div>Loading...</div>; // or skeleton
}

// ✅ Fix 2: suppressHydrationWarning for dynamic content
<div suppressHydrationWarning>
  {new Date().toLocaleString()}
</div>

// ✅ Fix 3: Use dynamic imports with ssr: false
const DynamicComponent = dynamic(() => import('./Component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

#### Theme Provider SSR Issues
**Symptoms**: Flash of wrong theme, localStorage errors during SSR

```typescript
// ✅ Solution: Safe localStorage access
useEffect(() => {
  const savedTheme = typeof window !== 'undefined' 
    ? localStorage.getItem('theme') as Theme 
    : null;
  
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
    setTheme(savedTheme);
  }
}, []);

// ✅ Alternative: Use next-themes
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const { theme, setTheme, mounted } = useTheme();
  
  if (!mounted) return null; // Avoid hydration mismatch
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
};
```

#### Image Loading Issues
**Symptoms**: Images not loading, optimization errors, layout shifts

```typescript
// ✅ Next.js Image best practices
import Image from 'next/image';

const ProjectImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={600}
    height={400}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    onError={(e) => {
      console.error('Image failed to load:', src);
      e.currentTarget.src = '/fallback-image.jpg';
    }}
  />
);

// ✅ Handle dynamic imports for images
const getImageSrc = (filename: string) => {
  try {
    return require(`@/assets/images/${filename}`).default;
  } catch (error) {
    console.warn(`Image not found: ${filename}`);
    return '/placeholder-image.jpg';
  }
};
```

### TypeScript Issues

#### Type Definition Errors
**Symptoms**: TypeScript compilation errors, missing type definitions

```bash
# Install missing type definitions
npm install --save-dev @types/react @types/react-dom @types/node

# For custom libraries without types
npm install --save-dev @types/library-name
# Or create custom type definitions
```

```typescript
// ✅ Custom type definitions (types/global.d.ts)
declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

// ✅ Augment existing types
declare module 'framer-motion' {
  interface AnimationProps {
    custom?: any;
  }
}
```

#### Import Path Issues
**Symptoms**: Module resolution errors, imports not found

```typescript
// ✅ Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}

// ✅ Use absolute imports consistently
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

// ✅ For barrel exports (index.ts files)
// components/ui/index.ts
export { Button } from './button';
export { Card } from './card';
// Use: import { Button, Card } from '@/components/ui';
```

### Styling & CSS Issues

#### Tailwind CSS Not Working
**Symptoms**: Tailwind classes not applied, styles not loading

```bash
# Check PostCSS configuration
# postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

# Verify Tailwind config
# tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ... rest of config
}
export default config
```

```css
/* Ensure Tailwind directives are in globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Check for CSS order issues */
```

#### Dark Mode Not Working
**Symptoms**: Dark mode classes not applied, theme switching broken

```typescript
// ✅ Ensure proper theme provider setup
// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// ✅ Check Tailwind dark mode configuration
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media'
  // ...
}

// ✅ CSS variables for theme switching
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

#### Animation Performance Issues
**Symptoms**: Janky animations, poor performance, layout thrashing

```typescript
// ✅ Use transform and opacity for better performance
const animationVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 // Use scale instead of width/height
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] // Custom easing
    }
  }
};

// ✅ Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const motionProps = prefersReducedMotion.matches 
  ? {} 
  : animationVariants;

// ✅ Use will-change for complex animations
<motion.div
  style={{ willChange: 'transform, opacity' }}
  animate={motionProps}
>
```

### Build & Deployment Issues

#### Build Failures
**Symptoms**: npm run build fails, compilation errors

```bash
# Clear caches and reinstall
rm -rf .next
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Run ESLint
npm run lint

# Build with verbose output
npm run build -- --debug

# Check bundle size
ANALYZE=true npm run build
```

#### Memory Issues During Build
**Symptoms**: Out of memory errors, slow builds

```json
// package.json - Increase Node.js memory
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

```bash
# Environment variable approach
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## Docker Issues

### Container Restart Loop / Permission Errors
**Symptoms**: Container keeps restarting, `EACCES: permission denied, mkdir '/home/nextjs'` error in logs

```bash
# Check container status
docker ps -a --filter "name=automedon"

# View logs
docker logs automedon-portfolio-prebuilt --tail 100
```

**Root Cause**: Next.js attempts to install TypeScript at runtime when loading `next.config.ts`, but the non-root `nextjs` user lacks write permissions to its home directory.

**Solutions**:

```dockerfile
# ✅ Fix 1: Create home directory with proper permissions
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --create-home nextjs && \
    mkdir -p /home/nextjs/.npm /app/web && \
    chown -R nextjs:nodejs /home/nextjs /app

# ✅ Fix 2: Set npm cache to writable location
USER nextjs
ENV npm_config_cache=/tmp/.npm

# ✅ Fix 3: Use JavaScript config instead of TypeScript
# Create next.config.js instead of next.config.ts to avoid
# runtime TypeScript installation
COPY --chown=nextjs:nodejs src/app/web/next.config.js ./next.config.js
```

**Prevention**: Always provide the `nextjs` user with:
- A home directory (`--create-home` flag)
- Proper ownership of required directories
- A writable npm cache location

### TypeScript Configuration Issues in Docker
**Symptoms**: `Failed to install TypeScript` errors, container crashes during startup

**Root Cause**: `next.config.ts` requires TypeScript to be available at runtime, but it's installed as a dev dependency which Docker excludes in production builds.

**Solution**: Create a JavaScript version of the config:

```javascript
// next.config.js (NEW)
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // ... rest of config
};

module.exports = nextConfig;
```

**Dockerfile changes**:
```dockerfile
# Copy JavaScript config (no TypeScript needed at runtime)
COPY --chown=nextjs:nodejs src/app/web/next.config.js ./next.config.js
```

**Update .dockerignore**:
```
!next.config.js
```

### Build Artifacts Issues
**Symptoms**: `TypeError: routesManifest.dataRoutes is not iterable`, container starts but crashes immediately

**Root Cause**: Corrupted or incompatible `.next` build artifacts, often from interrupted builds or version mismatches.

**Solution**:
```bash
# Stop container
docker compose -f docker-compose.prebuilt.yml down

# Clean and rebuild Next.js
cd src/app/web
rm -rf .next node_modules
npm install
npm run build
cd ../../..

# Rebuild Docker image
docker compose -f docker-compose.prebuilt.yml build

# Start container
docker compose -f docker-compose.prebuilt.yml up -d
```

**Prevention**: Always rebuild Next.js locally before rebuilding Docker images when using the prebuilt approach.

### Environment Variable Mismatch
**Symptoms**: API returns `Portfolio data file not found`, even though files exist in container

```bash
# Check if files exist in container
docker exec automedon-portfolio-prebuilt sh -c "ls -la /app/portfolio-data/"

# Check environment variables
docker exec automedon-portfolio-prebuilt sh -c "printenv | grep PORTFOLIO"
```

**Root Cause**: API code expects different environment variable name than what Docker is providing.

**Solution**: Ensure consistency between Dockerfile, docker-compose.yml, and API code:

```dockerfile
# Dockerfile.prebuilt
ENV PORTFOLIO_CONFIG_PATH=/app/portfolio-data
```

```yaml
# docker-compose.prebuilt.yml
environment:
  - PORTFOLIO_CONFIG_PATH=/app/portfolio-data
```

```typescript
// src/app/web/src/app/api/portfolio/route.ts
const configPath = process.env.PORTFOLIO_CONFIG_PATH || './portfolio-data';
```

### Port Binding Issues
**Symptoms**: Container runs but can't access on localhost:3000

```bash
# Check port mappings
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Check if port is already in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac
```

**Solutions**:
```bash
# Kill process using port
taskkill /PID <PID> /F  # Windows
kill -9 <PID>           # Linux/Mac

# Or use different port in docker-compose.yml
ports:
  - "3001:3000"  # Map host port 3001 to container port 3000
```

### Health Check Failures
**Symptoms**: Container shows as "unhealthy" in `docker ps` output

```bash
# View detailed health check logs
docker inspect automedon-portfolio-prebuilt | grep -A 10 Health
```

**Common causes**:
1. API endpoint not responding (check environment variables)
2. Container not fully started (increase `start_period`)
3. Network issues (check docker network configuration)

**Solution**:
```yaml
# Adjust health check parameters in docker-compose.yml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/portfolio?lang=en', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s  # Increase if needed
```

### Complete Docker Reset
**When**: Nothing works, multiple errors, corrupted state

```bash
# 1. Stop and remove containers
docker compose -f docker-compose.prebuilt.yml down

# 2. Remove images
docker rmi automedon-portfolio:prebuilt

# 3. Clean build artifacts
cd src/app/web
rm -rf .next node_modules
npm install
npm run build
cd ../../..

# 4. Rebuild from scratch
docker compose -f docker-compose.prebuilt.yml build --no-cache

# 5. Start fresh
docker compose -f docker-compose.prebuilt.yml up -d

# 6. Monitor logs
docker logs automedon-portfolio-prebuilt -f
```

### Docker Compose Version Warning
**Symptoms**: Warning about obsolete `version` attribute

```
level=warning msg="docker-compose.yml: the attribute `version` is obsolete"
```

**Solution**: Remove the `version:` line from docker-compose files (it's optional in modern Docker Compose).

#### Deployment Issues
**Symptoms**: Application not starting in production, 500 errors

```typescript
// ✅ Check environment variables
// next.config.ts
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Log environment in development
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
    },
  }),
};

// ✅ Add error boundaries for production
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Performance Issues

### Slow Page Loading
**Symptoms**: High LCP, FID, CLS scores, slow initial page load

```typescript
// ✅ Optimize images
import Image from 'next/image';

const HeroImage = () => (
  <Image
    src="/hero-image.jpg"
    alt="Hero"
    priority // For above-the-fold images
    width={1200}
    height={600}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
  />
);

// ✅ Code splitting
const AIChatPopup = lazy(() => import('./AIChatPopup'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));

// ✅ Preload critical resources
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Bundle Size Issues
**Symptoms**: Large bundle sizes, slow loading, high data usage

```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Check individual package sizes
npm list --depth=0 --long
```

```typescript
// ✅ Optimize imports
// ❌ Don't import entire libraries
import _ from 'lodash';
import * as Icons from 'lucide-react';

// ✅ Import specific functions/components
import { debounce } from 'lodash/debounce';
import { Search, Menu } from 'lucide-react';

// ✅ Dynamic imports for large components
const Chart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), {
  loading: () => <ChartSkeleton />,
});
```

### Memory Leaks
**Symptoms**: Increasing memory usage, browser crashes, slow performance over time

```typescript
// ✅ Clean up effects
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);

  const subscription = observable.subscribe();

  return () => {
    clearInterval(interval);
    subscription.unsubscribe();
  };
}, []);

// ✅ Abort fetch requests
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    });

  return () => controller.abort();
}, []);

// ✅ Remove event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## Dependency Issues

### Package Installation Problems
**Symptoms**: npm install fails, peer dependency warnings, version conflicts

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with exact versions
npm install

# Fix peer dependency warnings
npm install --legacy-peer-deps

# Or install specific peer dependencies
npm install react@18.2.0 react-dom@18.2.0 --save-peer
```

### Version Conflicts
**Symptoms**: Multiple versions of same package, TypeScript errors, runtime errors

```bash
# Check for duplicate packages
npm ls --depth=0 | grep -E '\s\s'

# Use resolution to force specific versions (package.json)
{
  "overrides": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}

# Or with npm resolutions
{
  "resolutions": {
    "react": "18.2.0"
  }
}
```

### Radix UI Issues
**Symptoms**: Component styling issues, accessibility problems, TypeScript errors

```typescript
// ✅ Proper Radix UI imports
import * as Dialog from '@radix-ui/react-dialog';

// ✅ Forward refs for custom components
const CustomButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn('custom-button', className)}
    {...props}
  />
));

// ✅ Proper ARIA attributes
<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>Open Dialog</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="dialog-overlay" />
    <Dialog.Content className="dialog-content" aria-describedby="dialog-description">
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description id="dialog-description">
        Dialog description
      </Dialog.Description>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Development Environment Issues

### VS Code Problems
**Symptoms**: IntelliSense not working, extensions not functioning, slow performance

```json
// .vscode/settings.json - Performance optimizations
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false,
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.next/**": true
  }
}
```

```bash
# Restart TypeScript server
# Command Palette (Ctrl+Shift+P) -> "TypeScript: Restart TS Server"

# Clear VS Code workspace cache
rm -rf .vscode/settings.json
# Restart VS Code
```

### Git Issues
**Symptoms**: Merge conflicts, corrupted repository, lost commits

```bash
# Resolve merge conflicts
git status
# Edit conflicted files
git add .
git commit -m "resolve merge conflicts"

# Recover lost commits
git reflog
git checkout <commit-hash>
git checkout -b recovered-branch

# Reset to clean state
git reset --hard HEAD
git clean -fd

# Fix corrupted repository
git fsck --full
git gc --prune=now
```

### Port Issues
**Symptoms**: Port already in use, can't start development server

```bash
# Find process using port
lsof -i :3000
# Or on Windows
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>
# Or on Windows
taskkill /PID <PID> /F

# Use different port
npm run dev -- -p 3001
```

## Debugging Strategies

### Client-Side Debugging

#### React DevTools
```bash
# Install React Developer Tools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

#### Console Debugging
```typescript
// ✅ Conditional logging
const DEBUG = process.env.NODE_ENV === 'development';

const debug = (message: string, data?: any) => {
  if (DEBUG) {
    console.group(`🐛 ${message}`);
    if (data) console.log(data);
    console.trace();
    console.groupEnd();
  }
};

// ✅ Component debugging
const MyComponent = ({ prop1, prop2 }: Props) => {
  useEffect(() => {
    debug('MyComponent mounted', { prop1, prop2 });
  }, []);

  useEffect(() => {
    debug('Props changed', { prop1, prop2 });
  }, [prop1, prop2]);

  return <div>Component content</div>;
};
```

#### Network Debugging
```typescript
// ✅ API call debugging
const fetchData = async (url: string) => {
  console.time(`API: ${url}`);
  
  try {
    const response = await fetch(url);
    console.log(`✅ ${response.status} ${url}`, response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.timeEnd(`API: ${url}`);
    
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${url}`, error);
    console.timeEnd(`API: ${url}`);
    throw error;
  }
};
```

### Server-Side Debugging

#### Next.js Debugging
```json
// package.json
{
  "scripts": {
    "debug": "NODE_OPTIONS='--inspect' next dev",
    "debug:break": "NODE_OPTIONS='--inspect-brk' next dev"
  }
}
```

```bash
# Debug mode
npm run debug
# Open chrome://inspect in Chrome
```

#### Build Debugging
```bash
# Verbose build output
DEBUG=1 npm run build

# Analyze bundle
ANALYZE=true npm run build

# Check build info
npm run build -- --debug
```

## Emergency Procedures

### Complete Reset
**When**: Nothing works, multiple errors, corrupted state

```bash
# 1. Stop all processes
pkill -f next
pkill -f node

# 2. Clean everything
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json
rm -rf .cache

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall
npm install

# 5. Restart development
npm run dev
```

### Rollback to Working State
**When**: Recent changes broke the application

```bash
# Check recent commits
git log --oneline -10

# Rollback to specific commit
git reset --hard <commit-hash>

# Or revert specific commit
git revert <commit-hash>

# Update dependencies to match
npm install
```

### Production Emergency
**When**: Production site is down or broken

```bash
# Quick rollback
git revert HEAD --no-edit
git push origin main

# Or rollback to last known good commit
git reset --hard <last-good-commit>
git push --force origin main # Use with caution

# Hotfix workflow
git checkout main
git checkout -b hotfix/critical-bug
# Fix the issue
git commit -m "hotfix: resolve critical issue"
git checkout main
git merge hotfix/critical-bug
git push origin main
```

## Getting Help

### Internal Resources
1. **Check documentation files**: `architecture.md`, `best-practices.md`, `setup.md`
2. **Review commit history**: `git log --oneline` for recent changes
3. **Check issue patterns**: Look for similar problems in git history

### External Resources
1. **Next.js Documentation**: https://nextjs.org/docs
2. **React Documentation**: https://react.dev/
3. **Tailwind CSS**: https://tailwindcss.com/docs
4. **Radix UI**: https://www.radix-ui.com/
5. **Framer Motion**: https://www.framer.com/motion/

### Community Support
1. **Stack Overflow**: Search for specific error messages
2. **GitHub Issues**: Check component library GitHub issues
3. **Discord Communities**: Next.js, React, Tailwind CSS communities
4. **Reddit**: r/nextjs, r/reactjs, r/webdev

### Error Reporting
When reporting issues, include:
- **Error message** (full stack trace)
- **Steps to reproduce**
- **Environment details** (Node.js version, OS, browser)
- **Code samples** (minimal reproduction)
- **Console logs** and network activity

## Prevention Strategies

### Code Quality
- **TypeScript strict mode**: Catch issues at compile time
- **ESLint rules**: Consistent code patterns
- **Pre-commit hooks**: Prevent bad code from being committed
- **Code reviews**: Multiple eyes on changes

### Monitoring
- **Error boundaries**: Catch and handle React errors
- **Logging**: Comprehensive logging for debugging
- **Performance monitoring**: Track Core Web Vitals
- **Dependency audits**: Regular security and update checks

### Documentation
- **Keep this guide updated**: Add new issues as they're discovered
- **Document workarounds**: Note temporary solutions
- **Share knowledge**: Team communication about common issues
- **Version notes**: Document changes and potential impact