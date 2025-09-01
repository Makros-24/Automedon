# Dependencies Management

This document provides comprehensive information about project dependencies, version management, and maintenance strategies for the Automedon portfolio application.

## Current Dependencies

### Core Framework Dependencies

#### React Ecosystem
```json
{
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "next": "15.4.5"
}
```
- **React 19.1.0**: Latest React with concurrent features and improved performance
- **React DOM 19.1.0**: DOM renderer for React with enhanced hydration
- **Next.js 15.4.5**: App Router, SSR/SSG, and advanced optimization features

**Rationale**: Using latest stable versions for cutting-edge features and performance improvements. React 19 brings significant rendering optimizations and concurrent features.

#### TypeScript & Build Tools
```json
{
  "typescript": "^5",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19"
}
```
- **TypeScript 5**: Latest TypeScript with improved type inference and performance
- **Type Definitions**: Official type definitions for Node.js and React

### UI Component Libraries

#### Radix UI Primitives (40+ Components)
```json
{
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-alert-dialog": "^1.1.15",
  "@radix-ui/react-aspect-ratio": "^1.1.7",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-collapsible": "^1.1.12",
  "@radix-ui/react-context-menu": "^2.2.16",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-hover-card": "^1.1.15",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-menubar": "^1.1.16",
  "@radix-ui/react-navigation-menu": "^1.2.14",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-radio-group": "^1.3.8",
  "@radix-ui/react-scroll-area": "^1.2.10",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.6",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.6",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-toggle": "^1.1.10",
  "@radix-ui/react-toggle-group": "^1.1.11",
  "@radix-ui/react-tooltip": "^1.2.8"
}
```

**Rationale**: Radix UI provides unstyled, accessible primitives that form the foundation of our design system. Each component follows WAI-ARIA standards and provides excellent keyboard navigation support.

**Key Benefits**:
- Full accessibility compliance (WCAG 2.1)
- Unstyled primitives for maximum customization
- Excellent TypeScript support
- Minimal bundle impact with tree-shaking

#### UI Enhancement Libraries
```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```
- **CVA**: Type-safe component variants and styling
- **clsx**: Utility for constructing className strings conditionally
- **tailwind-merge**: Merge Tailwind CSS classes without style conflicts

### Styling & Design System

#### Tailwind CSS 4
```json
{
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4"
}
```
- **Tailwind CSS 4**: Latest version with enhanced features and performance
- **PostCSS Plugin**: Integration with build system

**New Features in v4**:
- Improved performance with new engine
- Better IntelliSense support
- Enhanced container queries
- Streamlined configuration

#### Icons & Visual Elements
```json
{
  "lucide-react": "^0.539.0"
}
```
- **Lucide React**: Modern icon library with 1000+ icons
- Tree-shakeable for optimal bundle size
- Consistent design language

### Animation & Interactions

#### Motion Libraries
```json
{
  "motion": "^12.23.12"
}
```
- **Motion (Framer Motion 12)**: Declarative animations and gestures
- Spring-based animations for natural feel
- Layout animations and shared element transitions

### Data Visualization

#### Chart Libraries
```json
{
  "recharts": "^3.1.2"
}
```
- **Recharts**: React chart library built on D3
- Responsive charts with customizable styling
- Used for skills visualization and analytics

### Carousel & Media Components

#### Interactive Components
```json
{
  "embla-carousel-react": "^8.6.0",
  "react-slick": "^0.31.0"
}
```
- **Embla Carousel**: Lightweight, extensible carousel
- **React Slick**: Feature-rich carousel component
- Both provide different UX patterns for project showcases

### Form Handling

#### Form Libraries
```json
{
  "react-hook-form": "^7.62.0",
  "react-day-picker": "^9.9.0",
  "input-otp": "^1.4.2"
}
```
- **React Hook Form**: Performant forms with minimal re-renders
- **Day Picker**: Date selection components
- **Input OTP**: One-time password input (for future email verification)

### Utility Libraries

#### Theming & State
```json
{
  "next-themes": "^0.4.6"
}
```
- **Next Themes**: Theme provider with system preference detection
- SSR-compatible theme switching

#### UI Utilities
```json
{
  "sonner": "^2.0.7",
  "vaul": "^1.1.2",
  "cmdk": "^1.1.1",
  "react-resizable-panels": "^3.0.5"
}
```
- **Sonner**: Toast notifications with beautiful animations
- **Vaul**: Drawer/bottom sheet component
- **cmdk**: Command palette interface
- **Resizable Panels**: Layout panels with resize functionality

### 3D Graphics (Future Use)

#### Three.js
```json
{
  "three": "^0.179.1",
  "@types/three": "^0.179.0"
}
```
- **Three.js**: 3D graphics library for WebGL
- Prepared for future 3D background effects or interactive elements

## Development Dependencies

### Code Quality & Testing

#### Linting & Formatting
```json
{
  "eslint": "^9",
  "eslint-config-next": "15.4.5",
  "@eslint/eslintrc": "^3"
}
```
- **ESLint 9**: Latest linting with flat config support
- **Next.js Config**: Optimized rules for Next.js applications

#### Testing Framework
```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.7.0",
  "@testing-library/user-event": "^14.6.1",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0"
}
```
- **React Testing Library**: User-centric testing utilities
- **Jest**: Test runner with extensive mocking capabilities
- **JSDOM Environment**: DOM simulation for component testing

## Dependency Management Strategy

### Version Management

#### Semantic Versioning Approach
- **Major Updates**: Manual review and testing required
- **Minor Updates**: Automated with testing validation
- **Patch Updates**: Automated security and bug fixes

#### Update Schedule
```bash
# Weekly dependency checks
npm outdated

# Monthly security audits
npm audit

# Quarterly major version reviews
npm update --save
```

### Bundle Size Optimization

#### Current Bundle Analysis
```bash
# Analyze bundle size (when configured)
npm run analyze

# Check individual package sizes
npm ls --depth=0 --long
```

#### Tree Shaking Strategy
- **Radix UI**: Import only used components
- **Lucide Icons**: Import individual icons
- **Utility Libraries**: Use specific imports over default exports

#### Code Splitting
```typescript
// Component-based splitting
const AIChatPopup = lazy(() => import('./AIChatPopup'));

// Library splitting for large dependencies
const Chart = lazy(() => import('./Chart')); // recharts
```

### Security Management

#### Security Audit Process
```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Review high-severity issues manually
npm audit --audit-level high
```

#### Security Monitoring
- **Dependabot**: Automated security updates
- **NPM Audit**: Weekly security checks
- **Snyk**: Advanced vulnerability scanning (optional)

### Performance Impact Assessment

#### Bundle Size Targets
- **Total Bundle**: < 200KB gzipped
- **First Load JS**: < 130KB
- **Route Bundles**: < 50KB per route

#### Performance Monitoring
```json
{
  "bundleAnalyzer": {
    "enabled": true,
    "target": "browser",
    "threshold": 200000
  }
}
```

## Dependency Categories & Justification

### Critical Dependencies (Cannot Remove)
1. **React/Next.js**: Core framework
2. **TypeScript**: Type safety and development experience
3. **Tailwind CSS**: Styling system

### Essential Dependencies (High Value)
1. **Radix UI**: Accessibility and component foundation
2. **Motion**: User experience and animations
3. **React Hook Form**: Form handling performance

### Optional Dependencies (Nice-to-Have)
1. **Three.js**: Future 3D enhancements
2. **Recharts**: Data visualization
3. **React Slick**: Alternative carousel option

### Development Dependencies (Build-time Only)
1. **ESLint**: Code quality
2. **Jest/Testing Library**: Quality assurance
3. **Type Definitions**: Development experience

## Future Dependencies Planning

### Planned Additions

#### AI Integration (Phase 1)
```json
{
  "openai": "^4.x.x",
  "@ai-sdk/openai": "^0.x.x",
  "ai": "^3.x.x"
}
```
- **OpenAI**: Official OpenAI API client
- **AI SDK**: Vercel's AI SDK for streaming responses
- **AI Utilities**: Helper functions for AI integration

#### Database & Authentication (Phase 2)
```json
{
  "@prisma/client": "^5.x.x",
  "prisma": "^5.x.x",
  "next-auth": "^4.x.x",
  "nodemailer": "^6.x.x"
}
```
- **Prisma**: Type-safe database ORM
- **NextAuth**: Authentication solution
- **Nodemailer**: Email sending functionality

#### Analytics & Monitoring (Phase 3)
```json
{
  "@vercel/analytics": "^1.x.x",
  "@sentry/nextjs": "^7.x.x",
  "react-hotjar": "^6.x.x"
}
```
- **Vercel Analytics**: Privacy-focused analytics
- **Sentry**: Error tracking and performance monitoring
- **Hotjar**: User behavior analytics

### Dependencies to Avoid

#### Heavy Libraries
- **Moment.js**: Use native Date or date-fns instead
- **Lodash**: Use native methods or specific utilities
- **jQuery**: Conflicts with React paradigm

#### Unmaintained Packages
- Check last update date
- Review issue resolution activity
- Consider alternatives for stale dependencies

## Maintenance Procedures

### Regular Maintenance Tasks

#### Weekly Tasks
```bash
# Check for security updates
npm audit

# Review outdated packages
npm outdated

# Update patch versions
npm update
```

#### Monthly Tasks
```bash
# Deep dependency review
npm ls --depth=1

# Bundle size analysis
npm run build && npm run analyze

# Performance testing
npm run build && npm run start
```

#### Quarterly Tasks
- **Major Version Reviews**: Evaluate major version updates
- **Dependency Cleanup**: Remove unused dependencies
- **Alternative Evaluation**: Research better alternatives
- **Security Deep Dive**: Comprehensive security review

### Update Process

#### Safe Update Workflow
1. **Branch Creation**: Create feature branch for updates
2. **Incremental Updates**: Update packages one category at a time
3. **Testing**: Run full test suite after each category
4. **Build Verification**: Ensure production build succeeds
5. **Manual Testing**: Test critical user journeys
6. **Deployment**: Deploy to staging first, then production

#### Rollback Strategy
```bash
# If update causes issues
git checkout previous-working-commit

# Or revert specific package
npm install package-name@previous-version
```

## Troubleshooting Dependencies

### Common Issues

#### Version Conflicts
```bash
# Check dependency tree
npm ls package-name

# Force resolution (use sparingly)
npm install --force

# Use exact versions in package.json
"react": "19.1.0" // instead of "^19.1.0"
```

#### Peer Dependency Warnings
```bash
# Install missing peer dependencies
npm install --save-peer react@19.1.0

# Or use legacy peer deps (not recommended)
npm install --legacy-peer-deps
```

#### TypeScript Issues
```bash
# Update @types packages
npm update @types/react @types/react-dom

# Clear TypeScript cache
rm -rf .next
rm -rf node_modules/.cache
```

### Performance Issues

#### Bundle Size Problems
```bash
# Analyze bundle composition
npm run analyze

# Check for duplicate dependencies
npm ls --depth=0 | grep -E '\s\s'

# Use webpack-bundle-analyzer
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

#### Build Performance
```bash
# Clear all caches
npm cache clean --force
rm -rf .next node_modules
npm install

# Use Next.js build analysis
ANALYZE=true npm run build
```

## Quick Reference

### Essential Commands
```bash
# Install dependencies
npm install

# Add new dependency
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Remove dependency
npm uninstall package-name

# Update packages
npm update

# Security audit
npm audit

# Check outdated
npm outdated

# Clear cache
npm cache clean --force
```

### Package Information
```bash
# View package info
npm info package-name

# View installed version
npm list package-name

# View dependency tree
npm ls --depth=1

# Check package size
npm info package-name | grep unpacked
```

### Emergency Procedures
```bash
# Complete reset
rm -rf node_modules package-lock.json
npm install

# Revert to known good state
git checkout HEAD~1 -- package.json package-lock.json
npm install

# Force specific version
npm install package-name@specific-version --force
```