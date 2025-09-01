# Architecture Documentation

This document outlines the system architecture, design patterns, and technical decisions for the Automedon AI-powered portfolio application.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           Client Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router (SSR/SSG)                                 │
│  ├── Hero Section (Animated Background + CTA)                 │
│  ├── Work Portfolio (Project Showcase)                        │
│  ├── About Section (Skills Categories + Achievements)         │
│  ├── Contact Section (Social Links + CTA)                     │
│  └── AI Chat Interface (Modal Overlay)                        │
├─────────────────────────────────────────────────────────────────┤
│                     Component Layer                             │
│  ├── UI Components (40+ Radix UI Components)                  │
│  ├── Section Components (Hero, Work, About, Contact)          │
│  ├── Interactive Components (Chat, Hidden: Charts, Carousels) │
│  └── Layout Components (Header, Theme Provider)               │
├─────────────────────────────────────────────────────────────────┤
│                      State Layer                               │
│  ├── Theme Context (Dark/Light Mode)                          │
│  ├── Local Component State (React Hooks)                      │
│  └── Animation State (Framer Motion)                          │
├─────────────────────────────────────────────────────────────────┤
│                     Styling Layer                              │
│  ├── Tailwind CSS 4 (Utility Classes)                        │
│  ├── CSS Custom Properties (Theme Variables)                  │
│  ├── Glass Morphism Effects (Backdrop Blur)                   │
│  └── Responsive Design (Mobile-First)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack & Rationale

### Frontend Framework
- **Next.js 15** - App Router for modern React patterns, SSR/SSG capabilities, and excellent developer experience
- **React 19** - Latest React features, concurrent rendering, and improved performance
- **TypeScript 5** - Type safety, better IDE support, and reduced runtime errors

### UI & Styling
- **Radix UI** - Accessible, unstyled components as foundation for design system
- **Tailwind CSS 4** - Utility-first CSS with enhanced features and better performance
- **Framer Motion** - Declarative animations with smooth transitions
- **Lucide React** - Consistent icon library with tree-shaking support

### Development Tools
- **ESLint** - Code quality and consistency
- **Jest + React Testing Library** - Unit and integration testing
- **TypeScript Strict Mode** - Maximum type safety

## Design Patterns

### Component Architecture

#### 1. Composition Pattern
```typescript
// Example: Composable UI components
<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Project description</CardDescription>
  </CardHeader>
  <CardContent>
    <ProjectDetails />
  </CardContent>
  <CardFooter>
    <Button>View Project</Button>
  </CardFooter>
</Card>
```

#### 2. Provider Pattern
```typescript
// Theme management across the application
<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>
```

#### 3. Custom Hook Pattern
```typescript
// Reusable logic extraction
const useInViewOnce = (threshold = 0.1) => {
  // Animation trigger logic
  return { ref, isInView };
};
```

### State Management Strategy

#### Context for Global State
- **Theme Context**: Dark/light mode preferences
- **Scoped to specific concerns**: Avoid god objects

#### Local State for Components
- **Component-specific data**: Form inputs, modal states
- **Performance consideration**: Keep state as local as possible

#### Animation State
- **Framer Motion**: Declarative animation states
- **Scroll-triggered animations**: IntersectionObserver integration

## Component Structure

### Section Components
Large, feature-specific components that represent main portfolio sections:

```typescript
interface SectionComponent {
  id: string;           // For navigation anchoring
  className?: string;   // Additional styling
  children?: ReactNode; // Flexible content
}
```

**Examples**: `Hero`, `Work`, `About`, `Contact`

### UI Components
Reusable, styled components based on Radix UI primitives:

```typescript
interface UIComponent {
  variant?: string;     // Style variants
  size?: string;        // Size variants
  disabled?: boolean;   // State handling
  className?: string;   // Custom styling
}
```

**Examples**: `Button`, `Card`, `Dialog`, `Tooltip`

### Layout Components
Structural components that manage application layout:

```typescript
interface LayoutComponent {
  children: ReactNode;
  theme?: Theme;
}
```

**Examples**: `Header`, `ThemeProvider`, `AnimatedBackground`

## Database Schema

Currently using static data with typed interfaces. Future database schema:

```typescript
interface User {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: Skill[];
  projects: Project[];
  contact: ContactInfo;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-100
  icon?: string;
}
```

## API Design Principles

### Future AI Chat API
```typescript
// RESTful endpoint design
POST /api/chat
{
  message: string;
  context?: {
    section: 'experience' | 'skills' | 'projects' | 'general';
    projectId?: string;
  }
}

Response: {
  response: string;
  sources?: string[];
  confidence: number;
}
```

### Data Fetching Strategy
- **Static Generation**: Portfolio content (ISG for updates)
- **Client-side**: Interactive features (chat, theme preferences)
- **Error Boundaries**: Graceful failure handling

## Performance Considerations

### Core Web Vitals Optimization

#### Largest Contentful Paint (LCP)
- **Hero image optimization**: Next.js Image component with priority loading
- **Above-the-fold content**: Critical CSS inlined
- **Font optimization**: Preload display fonts

#### First Input Delay (FID)
- **Code splitting**: Route-based and component-based
- **Lazy loading**: Non-critical components below the fold
- **Bundle optimization**: Tree shaking and dead code elimination

#### Cumulative Layout Shift (CLS)
- **Fixed dimensions**: All images and components have defined dimensions
- **Animation considerations**: Transform and opacity only
- **Skeleton loading**: Preserve layout during loading states

### React Performance Patterns

#### Memoization Strategy
```typescript
// Component memoization for expensive renders
const TechRadarChart = React.memo(({ data }) => {
  const processedData = useMemo(() => 
    processChartData(data), [data]
  );
  
  return <Chart data={processedData} />;
});

// Callback memoization for event handlers
const Header = () => {
  const handleNavClick = useCallback((section: string) => {
    scrollToSection(section);
  }, []);
  
  return <Navigation onItemClick={handleNavClick} />;
};
```

#### Lazy Loading Implementation
```typescript
// Component-based code splitting
const AIChatPopup = lazy(() => import('./AIChatPopup'));
const TechRadarChart = lazy(() => import('./TechRadarChart'));

// Usage with Suspense
<Suspense fallback={<SkeletonLoader />}>
  <AIChatPopup />
</Suspense>
```

## Security Considerations

### Client-Side Security
- **XSS Prevention**: React's built-in escaping, sanitized HTML rendering
- **CSRF Protection**: SameSite cookies for future authentication
- **Content Security Policy**: Strict CSP headers

### Future API Security
```typescript
// Rate limiting for AI chat endpoint
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Input validation
const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  context: z.object({
    section: z.enum(['experience', 'skills', 'projects', 'general']),
  }).optional(),
});
```

## Accessibility Architecture

### WCAG 2.1 Compliance
- **Semantic HTML**: Proper heading hierarchy, landmark elements
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Focus management and tab order
- **Color Contrast**: 4.5:1 minimum ratio for normal text

### Implementation Patterns
```typescript
// Focus management for modals
const useModal = () => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
};

// Accessible animations
const AccessibleMotion = motion.div.attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      ? 0 : 0.3 
  }
});
```

## Deployment Architecture

### Build Process
1. **TypeScript Compilation**: Type checking and compilation
2. **Bundle Optimization**: Tree shaking, code splitting
3. **Asset Optimization**: Image optimization, CSS purging
4. **Static Generation**: Pre-render static pages

### Performance Monitoring
- **Core Web Vitals**: Lighthouse CI integration
- **Bundle Analysis**: webpack-bundle-analyzer
- **Runtime Monitoring**: Error boundaries with logging

### Scalability Considerations
- **CDN Strategy**: Static assets distribution
- **Caching Strategy**: Aggressive caching for static content
- **Database Scaling**: Future consideration for user-generated content

## Future Architecture Enhancements

### Planned Improvements
1. **Micro-frontends**: Modular development approach
2. **GraphQL API**: Efficient data fetching
3. **Real-time Features**: WebSocket integration for live chat
4. **PWA Features**: Offline capability, push notifications
5. **Internationalization**: Multi-language support

### Monitoring & Observability
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Real User Monitoring (RUM)
- **Analytics**: Privacy-focused analytics solution
- **A/B Testing**: Feature flag implementation