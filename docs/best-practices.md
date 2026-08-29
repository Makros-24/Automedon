# Development Best Practices

This document outlines coding standards, development patterns, and quality guidelines for the Automedon portfolio project.

## Code Quality Standards

### TypeScript Best Practices

#### Type Safety
```typescript
// ✅ Good - Explicit interfaces and types
interface ProjectData {
  id: string;
  title: string;
  technologies: readonly string[];
  featured: boolean;
  createdAt: Date;
}

// ✅ Good - Type guards for runtime validation
function isProjectData(data: unknown): data is ProjectData {
  return typeof data === 'object' && 
         data !== null && 
         'id' in data && 
         typeof (data as ProjectData).id === 'string';
}

// ❌ Avoid - Any types and loose typing
const project: any = getProjectData();
```

#### Utility Types
```typescript
// ✅ Good - Use utility types for transformations
type PartialProject = Partial<ProjectData>;
type ProjectPreview = Pick<ProjectData, 'id' | 'title' | 'featured'>;
type CreateProjectData = Omit<ProjectData, 'id' | 'createdAt'>;

// ✅ Good - Generic type constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
}
```

#### Enums vs Union Types
```typescript
// ✅ Prefer const assertions and union types
const THEME_MODES = ['light', 'dark', 'system'] as const;
type ThemeMode = typeof THEME_MODES[number];

// ✅ Use enums for numeric or complex mappings
enum StatusCode {
  SUCCESS = 200,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}
```

### React Component Patterns

#### Component Architecture
```typescript
// ✅ Good - Composition over inheritance
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = ({ children, className, variant = 'default' }: CardProps) => {
  return (
    <div className={cn(cardVariants({ variant }), className)}>
      {children}
    </div>
  );
};

// ✅ Good - Compound components
export const CardHeader = ({ children, ...props }: CardHeaderProps) => (
  <div className="card-header" {...props}>{children}</div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
```

#### Custom Hooks Pattern
```typescript
// ✅ Good - Custom hooks for reusable logic
export const useInViewAnimation = (threshold = 0.1) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  });

  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      });
    }
  }, [inView, animation]);

  return { ref, animation };
};

// ✅ Usage in components
const ProjectCard = ({ project }: ProjectCardProps) => {
  const { ref, animation } = useInViewAnimation();
  
  return (
    <motion.div ref={ref} animate={animation}>
      {/* Component content */}
    </motion.div>
  );
};
```

#### Shared Data: Consume the Context, Never Refetch
Portfolio data has exactly one fetcher - `PortfolioDataProvider` in `app/layout.tsx`. A
component that needs a slice of it takes a hook, and never reaches for the loader itself.

```typescript
// ❌ Bad - a private fetch. Two costs, one of them invisible:
//    1. a duplicate network request on every page load
//    2. no `language` argument, so it defaults to 'en' forever and the component
//       silently stops matching the rest of the page after a language switch
export function Footer() {
  const [footerData, setFooterData] = useState<FooterInfo | null>(null);
  useEffect(() => {
    getPortfolioData().then(data => setFooterData(data.footer));
  }, []);
}

// ✅ Good - one line, language-aware for free, no extra request
export function Footer() {
  const { footer, loading } = useFooter();
}
```

The same rule governs providers: mount each **once**, at the root. A second
`PortfolioDataProvider` nested lower down does not error or render wrong - `useContext`
quietly binds to the nearest one, and the outer instance fetches for no consumer. Duplicate
providers are found by counting requests, not by reading the UI.

#### State Management Patterns
```typescript
// ✅ Good - useReducer for complex state
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

type ChatAction = 
  | { type: 'SEND_MESSAGE'; payload: string }
  | { type: 'RECEIVE_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, createUserMessage(action.payload)],
        isLoading: true,
      };
    // ... other cases
    default:
      return state;
  }
};
```

#### Technology Icon Patterns
```typescript
// ✅ Good - Enhanced icon interface with backward compatibility
interface ImageData {
  base64?: string;  // Priority 1: Base64 encoded image
  url?: string;     // Priority 2: External URL
}

type TechnologyWithIcon = {
  name: string;
  icon?: ImageData | string;  // Enhanced or legacy format
}

// ✅ Good - Icon processing with fallback handling
export function getTechnologyIconElement(
  iconData: ImageData | string | null | undefined,
  techName: string,
  className: string = 'w-4 h-4'
): React.ReactElement {
  const iconSource = getTechnologyIcon(iconData);
  
  // Image icons for base64/URL
  if (iconSource.startsWith('data:') || iconSource.startsWith('http')) {
    return React.createElement('img', {
      src: iconSource,
      alt: `${techName} icon`,
      className: `${className} transition-all duration-300 ease-out`,
      loading: 'lazy' as const
    });
  }
  
  // Lucide fallback icons
  const IconComponent = getIconComponent(iconSource);
  return React.createElement(IconComponent, { 
    className: `${className} text-gray-400 hover:text-foreground transition-colors duration-300 ease-out`
  });
}

// ✅ Good - Card-level hover effects
export const SkillCategory = ({ category }: SkillCategoryProps) => {
  const processedSkills = React.useMemo(() => 
    processSkillsWithIcons(category.skills, 'w-3.5 h-3.5'), 
    [category.skills]
  );

  return (
    <motion.div className="group/card relative">
      <div className="p-6 rounded-2xl glass">
        <div className="flex flex-wrap gap-2">
          {processedSkills.map((skill) => (
            <Badge key={skill.name} className="flex items-center gap-1.5">
              {/* Card hover triggers icon color change */}
              <span className="group-hover/card:grayscale-0 grayscale transition-all duration-300 ease-out">
                {skill.iconElement}
              </span>
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ✅ Good - Memoized processing for performance
const processedTechnologies = React.useMemo(() => 
  processProjectTechnologies(project.technologies, 'w-3.5 h-3.5'), 
  [project.technologies]
);
```

### Error Handling

#### Component Error Boundaries
```typescript
// ✅ Error boundary for graceful failures
class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
    // Report to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

#### Async Error Handling
```typescript
// ✅ Good - Proper async error handling with Result pattern
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export const fetchProject = async (id: string): Promise<Result<ProjectData>> => {
  try {
    const response = await fetch(`/api/projects/${id}`);
    
    if (!response.ok) {
      return { success: false, error: new Error(`HTTP ${response.status}`) };
    }
    
    const data = await response.json();
    
    if (!isProjectData(data)) {
      return { success: false, error: new Error('Invalid project data') };
    }
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
};
```

## Performance Best Practices

### React Performance Optimization

#### Memoization Strategy
```typescript
// ✅ Good - Memo for expensive components
export const ProjectGrid = React.memo(({ projects, filters }: ProjectGridProps) => {
  const filteredProjects = useMemo(() => 
    projects.filter(project => 
      filters.technologies.every(tech => 
        project.technologies.includes(tech)
      )
    ), 
    [projects, filters.technologies]
  );

  return (
    <div className="grid">
      {filteredProjects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
});

// ✅ Good - Callback memoization
const ProjectCard = ({ project }: ProjectCardProps) => {
  const handleClick = useCallback(() => {
    analytics.track('project_click', { projectId: project.id });
    router.push(`/projects/${project.id}`);
  }, [project.id, router]);

  return <Card onClick={handleClick}>{/* ... */}</Card>;
};
```

#### Lazy Loading & Code Splitting
```typescript
// ✅ Component lazy loading
const AIChatPopup = lazy(() => import('./AIChatPopup'));
const ProjectDetails = lazy(() => import('./ProjectDetails'));

// ✅ Route-based splitting
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

// ✅ Usage with Suspense and error boundaries
<Suspense fallback={<SkeletonLoader />}>
  <ErrorBoundary>
    <AIChatPopup />
  </ErrorBoundary>
</Suspense>
```

### Image and Asset Optimization
```typescript
// ✅ Next.js Image optimization
import Image from 'next/image';

export const ProjectImage = ({ src, alt, priority = false }: ImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={600}
    height={400}
    priority={priority}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    className="rounded-lg object-cover"
  />
);
```

## Accessibility Standards

### WCAG 2.1 Compliance

#### Semantic HTML
```tsx
// ✅ Good - Semantic structure
export const Navigation = () => (
  <nav role="navigation" aria-label="Main navigation">
    <ul>
      <li><a href="#about" aria-describedby="about-desc">About</a></li>
      <li><a href="#work" aria-describedby="work-desc">Work</a></li>
      <li><a href="#contact" aria-describedby="contact-desc">Contact</a></li>
    </ul>
  </nav>
);

// ✅ Good - Proper heading hierarchy
export const ProjectSection = () => (
  <section aria-labelledby="projects-heading">
    <h2 id="projects-heading">Featured Projects</h2>
    {projects.map(project => (
      <article key={project.id}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </article>
    ))}
  </section>
);
```

#### ARIA Attributes
```tsx
// ✅ Good - Interactive elements with ARIA
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
      className="theme-toggle"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

// ✅ Good - Loading states
export const ChatInterface = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div>
      <button 
        disabled={isLoading}
        aria-describedby={isLoading ? "loading-message" : undefined}
      >
        Send Message
      </button>
      {isLoading && (
        <div id="loading-message" role="status" aria-live="polite">
          Sending message...
        </div>
      )}
    </div>
  );
};
```

#### Keyboard Navigation
```tsx
// ✅ Good - Focus management
export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const focusableRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      focusableRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <div
      ref={focusableRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
```

## Testing Best Practices

### Unit Testing with Jest & React Testing Library

#### Component Testing
```typescript
// ✅ Good - User-centric testing
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
    
    await user.click(toggleButton);
    
    expect(toggleButton).toHaveAccessibleName(/switch to light mode/i);
  });
  
  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button');
    
    await user.tab();
    expect(toggleButton).toHaveFocus();
    
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(toggleButton).toHaveAccessibleName(/switch to light mode/i);
    });
  });
});
```

#### Custom Hook Testing
```typescript
// ✅ Good - Hook testing
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  it('initializes with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });
  
  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ''));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(localStorage.getItem('test-key')).toBe('"new-value"');
    expect(result.current[0]).toBe('new-value');
  });
});
```

## Security Best Practices

### Client-Side Security

#### XSS Prevention
```typescript
// ✅ Good - Sanitize user input
import DOMPurify from 'dompurify';

export const UserContent = ({ content }: { content: string }) => {
  const sanitizedHTML = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

// ✅ Good - Escape user data
export const SearchResults = ({ query, results }: SearchProps) => (
  <div>
    <h2>Results for "{query}"</h2> {/* React automatically escapes */}
    {results.map(result => (
      <div key={result.id}>
        <h3>{result.title}</h3> {/* Escaped by React */}
        <p>{result.description}</p>
      </div>
    ))}
  </div>
);
```

#### Content Security Policy
```typescript
// ✅ next.config.ts - CSP headers
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader.replace(/\s{2,}/g, ' ').trim() }
        ],
      },
    ];
  },
};
```

### Data Validation
```typescript
// ✅ Good - Runtime validation with Zod
import { z } from 'zod';

const ContactFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
  honeypot: z.string().optional(), // Bot detection
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const validateContactForm = (data: unknown): ContactFormData => {
  return ContactFormSchema.parse(data);
};
```

## Styling Best Practices

### Tailwind CSS Guidelines

#### Utility Organization
```tsx
// ✅ Good - Logical grouping and responsive design
export const ProjectCard = ({ project }: ProjectCardProps) => (
  <div className={cn(
    // Layout
    "relative overflow-hidden rounded-xl",
    // Spacing
    "p-6 mb-8",
    // Background & borders
    "bg-card border border-border",
    // Hover effects
    "hover:shadow-lg hover:scale-[1.02]",
    // Responsive
    "sm:p-8 lg:p-10",
    // Dark mode
    "dark:bg-card-dark dark:border-border-dark",
    // Transitions
    "transition-all duration-300 ease-out"
  )}>
    {/* Card content */}
  </div>
);
```

#### Component Variants
```typescript
// ✅ Good - CVA for component variants
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
);
```

### Animation Best Practices
```typescript
// ✅ Good - Respect user preferences
const motion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.6,
    ease: [0.25, 0.46, 0.45, 0.94], // Custom ease
  }
};

// ✅ Good - Performance-optimized animations
export const FadeInUp = ({ children, delay = 0 }: AnimationProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay,
      ease: 'easeOut',
      // Use transform and opacity for better performance
      willChange: 'transform, opacity'
    }}
  >
    {children}
  </motion.div>
);
```

## Docker & Build Artifact Hygiene

### Never ship build cache
```
# ✅ .dockerignore - exclude cache BELOW the re-include.
# The last matching rule wins, so ordering is behaviour, not cosmetics.
!src/app/web/.next
!src/app/web/.next/**

src/app/web/.next/cache
```

`.next/cache` is local incremental webpack/SWC state that `next start` never reads. It was
183MB against ~3MB of artifacts the runtime actually needs.

### The build context is your working tree, not git
A `COPY` whose source exists only as untracked local state will build on your machine and
fail on every clean clone. When adding a `COPY`, confirm the source is committed:

```bash
git ls-files <path> | wc -l    # 0 means it will not survive a fresh clone
```

Git does not track empty directories. If a directory must exist but has no content, commit a
`.gitkeep` - otherwise it silently disappears from the repo the moment its last file is removed.

### Measure before optimizing an image
Guessing at image size wastes effort. Get the layer breakdown first:

```bash
docker history <image> --format "{{.Size}}\t{{.CreatedBy}}"
docker run --rm --entrypoint sh <image> -c "du -sm /app/web/node_modules/* | sort -rn | head"
```

### Verify the container, not just the build
A smaller image that does not serve is not an improvement. After any Dockerfile or
`.dockerignore` change, confirm the app actually responds:

```bash
docker run -d --name verify -p 3100:3000 <image>
docker exec verify node -e "require('http').get('http://localhost:3000/api/portfolio?lang=en',r=>console.log(r.statusCode))"
docker ps --filter name=verify --format "{{.Status}}"   # expect "healthy"
```

Note that on Docker Desktop for Windows, host-side port forwarding can time out even while
the container is healthy and serving correctly - check from *inside* the container before
concluding the app is broken.

## Documentation Standards

### Code Documentation
```typescript
/**
 * Custom hook for managing intersection observer animations
 * 
 * @param threshold - Intersection threshold (0-1)
 * @param triggerOnce - Whether to trigger animation only once
 * @returns Object containing ref and inView state
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { ref, inView } = useInViewAnimation(0.3);
 *   
 *   return (
 *     <motion.div ref={ref} animate={inView ? "visible" : "hidden"}>
 *       Content
 *     </motion.div>
 *   );
 * };
 * ```
 */
export const useInViewAnimation = (
  threshold: number = 0.1,
  triggerOnce: boolean = true
) => {
  // Implementation...
};
```

### README Standards
- **Clear project description** and purpose
- **Installation instructions** with prerequisites
- **Development setup** with environment variables
- **Available scripts** with descriptions
- **Architecture overview** with diagrams
- **Contributing guidelines** with code standards
- **License information** and credits

## File Organization

### Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI primitives
│   ├── sections/        # Page sections
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── constants/           # App constants and configs
├── styles/              # Global styles and themes
└── __tests__/          # Test files (co-located preferred)
```

### File Naming Conventions
- **Components**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useLocalStorage.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserTypes.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)

## Quick Reference Checklist

### Before Committing
- [ ] **TypeScript**: No type errors
- [ ] **Linting**: ESLint passes without warnings
- [ ] **Testing**: All tests pass
- [ ] **Performance**: No obvious performance issues
- [ ] **Accessibility**: ARIA labels and keyboard navigation work
- [ ] **Responsive**: Works on mobile and desktop
- [ ] **Security**: No sensitive data exposed
- [ ] **Documentation**: Complex logic is commented

### Code Review Checklist
- [ ] **Logic**: Code solves the intended problem
- [ ] **Readability**: Code is self-documenting
- [ ] **Performance**: No unnecessary re-renders or computations
- [ ] **Security**: Input validation and XSS prevention
- [ ] **Accessibility**: WCAG compliance where applicable
- [ ] **Testing**: Adequate test coverage
- [ ] **Style**: Follows established patterns
- [ ] **Dependencies**: New dependencies are justified