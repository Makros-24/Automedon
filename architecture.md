# Architecture Documentation

This document outlines the system architecture, design patterns, and technical decisions for the Automedon AI-powered portfolio application.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           Client Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router (SSR/SSG)                                 │
│  ├── Hero Section (Animated Background + CTA)                 │
│  ├── Work Portfolio (Project Showcase + Tech Icons)           │
│  ├── About Section (Skills Categories + Achievements)         │
│  ├── Contact Section (Social Links + CTA)                     │
│  └── AI Chat Interface (Modal Overlay)                        │
├─────────────────────────────────────────────────────────────────┤
│                     Component Layer                             │
│  ├── UI Components (40+ Radix UI Components)                  │
│  ├── Section Components (Hero, Work, About, Contact)          │
│  ├── Interactive Components (Chat, Hidden: Charts, Carousels) │
│  ├── Layout Components (Header, Theme Provider)               │
│  └── Technology Icon System (Enhanced Icons + Hover Effects)  │
├─────────────────────────────────────────────────────────────────┤
│                      State Layer                               │
│  ├── Language Context (Multilingual + RTL Support)            │
│  ├── Theme Context (Dark/Light Mode)                          │
│  ├── Portfolio Data Context (Language-aware Data Loading)     │
│  ├── Local Component State (React Hooks)                      │
│  ├── Animation State (Framer Motion)                          │
│  └── Icon Processing State (Technology Icon Manager)          │
├─────────────────────────────────────────────────────────────────┤
│                     Styling Layer                              │
│  ├── Tailwind CSS 4 (Utility Classes + RTL Support)          │
│  ├── CSS Custom Properties (Theme Variables)                  │
│  ├── Glass Morphism Effects (Backdrop Blur)                   │
│  ├── Card-Level Hover Effects (Grayscale Transitions)         │
│  ├── RTL/LTR Layout System (Directional Styling)              │
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

### Technology Icon System
- **Enhanced Icon Format** - Supports base64, URL, and Lucide fallback icons
- **Priority System** - base64 > URL > Lucide icon fallback
- **Hover Effects** - Card-level grayscale-to-color transitions
- **Type Safety** - Full TypeScript support with ImageData interface
- **Backward Compatibility** - Supports legacy string arrays

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
- **Language Context**: Language selection, RTL/LTR layout, locale-specific formatting
- **Theme Context**: Dark/light mode preferences with system detection
- **Portfolio Data Context**: Language-aware portfolio data with API integration
- **Scoped to specific concerns**: Single responsibility, avoid god objects

#### Local State for Components
- **Component-specific data**: Form inputs, modal states, dialog visibility
- **Performance consideration**: Keep state as local as possible
- **Memoization**: React.useMemo for expensive computations

#### Animation State
- **Framer Motion**: Declarative animation states with variants
- **Scroll-triggered animations**: IntersectionObserver integration
- **Accessibility**: Respects prefers-reduced-motion settings

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

## Data Schema

Currently using JSON-based portfolio data with multilingual support. Schema per language file:

```typescript
interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    description: string;
    avatar: ImageData;
    resumeUrl: string;
  };
  about: {
    title: string;
    description: string;
    skillsTitle: string;
    achievementsTitle: string;
  };
  work: {
    title: string;
    description: string;
  };
  projects: Project[];
  skillCategories: SkillCategory[];
  achievements: Achievement[];
  contactInfo: ContactInfo;
  footer: FooterData;
}

interface Project {
  id: number;
  title: string;
  company: string;
  role: string;
  description: string;
  markdownDescription: string; // Detailed markdown content
  image: ImageData;
  technologies: TechnologyWithIcon[];
  links: {
    live?: string;
    github?: string;
  };
}

interface TechnologyWithIcon {
  name: string;
  icon?: ImageData | string; // Enhanced or legacy format
}

interface ImageData {
  base64?: string;
  url?: string;
}
```

## API Design Principles

### Portfolio Data API
```typescript
// Current implementation
GET /api/portfolio?lang=<code>
{
  lang: 'en' | 'fr' | 'de' | 'ar' // Language code
}

Response: PortfolioData // Language-specific portfolio data
```

### Future AI Chat API
```typescript
// Planned endpoint design
POST /api/chat
{
  message: string;
  lang: string; // Language for response
  context?: {
    section: 'experience' | 'skills' | 'projects' | 'general';
    projectId?: string;
  }
}

Response: {
  response: string; // Localized response
  sources?: string[];
  confidence: number;
}
```

### Data Fetching Strategy
- **Server-Side**: Portfolio data via API routes with language support
- **Static Generation**: HTML structure (ISG for updates)
- **Client-side**: Interactive features (chat, theme, language switching)
- **Error Boundaries**: Graceful failure handling with fallbacks
- **Caching**: Server-side caching per language with cache invalidation

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

## Technology Icon System Architecture

### Icon Processing Pipeline
```typescript
interface ImageData {
  base64?: string;  // Priority 1: Base64 encoded image
  url?: string;     // Priority 2: External URL
}

type TechnologyWithIcon = {
  name: string;
  icon?: ImageData | string;  // Enhanced or legacy format
}
```

### Processing Flow
1. **Icon Resolution**: Determine icon source (base64 > URL > Lucide fallback)
2. **Element Creation**: Generate appropriate React element (img vs Lucide component)
3. **Styling Application**: Apply hover effects and transitions
4. **Rendering**: Display with card-level hover behavior

### Hover Effect System
```typescript
// Card-level group classes for coordinated hover effects
<motion.div className="group/card">
  <Badge>
    <span className="group-hover/card:grayscale-0 grayscale">
      {iconElement}
    </span>
  </Badge>
</motion.div>
```

### Type Safety Features
- **Runtime Validation**: Icon data validation with fallback handling
- **TypeScript Integration**: Full type safety for icon data structures
- **Backward Compatibility**: Seamless support for legacy string arrays

### Performance Optimizations
- **Memoization**: React.useMemo for expensive icon processing
- **Lazy Loading**: Deferred loading for image-based icons
- **CSS Transitions**: Hardware-accelerated grayscale effects
- **Tree Shaking**: Only bundle used Lucide icons

## Internationalization Architecture

### Language Management
```typescript
interface LanguageContextValue {
  language: string; // Current language code
  setLanguage: (lang: string) => void;
  isRTL: boolean; // Right-to-left layout flag
  supportedLanguages: string[]; // Available languages
}
```

### RTL Support Implementation
- **Layout Direction**: Automatic `dir` attribute switching on HTML element
- **CSS Adjustments**: Tailwind directionality utilities (rtl: prefix)
- **Text Alignment**: Logical properties for start/end instead of left/right
- **Icon Mirroring**: Conditional icon flipping for directional icons

### Language File Structure
```
portfolio-data/
├── en.json    # English (default)
├── fr.json    # French
├── de.json    # German
└── ar.json    # Arabic (RTL)
```

### Language Persistence
- **Primary**: URL query parameter (?lang=en)
- **Fallback**: localStorage for user preference
- **Default**: English (en) if no preference

## Future Architecture Enhancements

### Planned Improvements
1. **Micro-frontends**: Modular development approach
2. **GraphQL API**: Efficient data fetching with language-aware queries
3. **Real-time Features**: WebSocket integration for live chat with i18n
4. **PWA Features**: Offline capability with cached translations
5. **Additional Languages**: Expand to more languages (ES, IT, ZH, JA)
6. **Translation Management**: Integration with translation services (Crowdin, Lokalise)

### Monitoring & Observability
- **Error Tracking**: Sentry integration with language context
- **Performance Monitoring**: Real User Monitoring per language/region
- **Analytics**: Privacy-focused analytics with language segmentation
- **A/B Testing**: Feature flags with language-specific variations