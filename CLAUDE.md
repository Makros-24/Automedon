# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automedon is an AI-powered digital twin portfolio application that allows recruiters and collaborators to interact with a chatbot representing the portfolio owner. The chatbot answers questions based solely on CV data, personal experiences, and professional history.

## Current Development Status

**Phase**: v1.3.0 Released - Categorized Project Showcase · Recommendations section unreleased on `feat/Recommendations`

- **Current Status**: Fully functional portfolio with multilingual support (English, French, German, Arabic with RTL), dynamic JSON-based data loading, and enhanced UI components
- **Latest Release**: `v1.3.0` (git tag on `main`) - Client Work / Personal Projects split
- **Unreleased**: Recommendations section (curated LinkedIn testimonials, infinite drift carousel) on `feat/Recommendations`
- **Tech Stack**: React 19, Next.js 16, TypeScript, Tailwind CSS 4, Radix UI, Motion
- **Architecture**: Component-based with 40+ UI components, theme provider, animation system, multilingual system, and comprehensive technology icon management
- **Recent Enhancements**:
  - Added a Recommendations section between Work and About, sourced from curated JSON
  - Split the Projects section into Client Work and Personal Projects tabs
  - Routed remote portfolio images through the Next.js image optimizer
  - Implemented multilingual support with 4 languages (EN, FR, DE, AR)
  - Added RTL (Right-to-Left) support for Arabic language
  - Enhanced project cards with markdown support and ProjectDetailsDialog
  - Improved accessibility with screen reader support
  - Implemented Work In Progress dialog for AI assistant feature
  - Optimized layout with glass morphism effects and badge truncation

## Development Commands

All commands should be run from the `src/app/web/` directory:

```bash
# Navigate to the web app
cd src/app/web

# Install dependencies
npm install

# Start development server with Turbopack (recommended)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Important Development Notes

- **Working Directory**: Always work from `src/app/web/` for all npm commands
- **Next.js App Router**: Uses App Router (not Pages Router) - components go in `src/app/`
- **Import Paths**: Uses `@/` alias pointing to `src/` directory
- **Configuration**: All build tools (TypeScript, ESLint, Jest, PostCSS, Tailwind) are configured and ready
- **Page Debugging**: Use Chrome for debugging pages in the browser. Run the dev server (`npm run dev`) and inspect the running page in Chrome - screenshots, console logs, network activity, and DOM interaction - to verify UI changes, diagnose layout/RTL issues, and confirm runtime behavior. Use the `claude-in-chrome` skill to drive the browser.

## Development Conventions

- **Data Source**: Portfolio data is organized in locale-based directories under `portfolio-data/{locale}/portfolio.json`. Locales are dynamically discovered on server startup by scanning available directories. The frontend fetches language-specific data through the `/api/portfolio?lang=<code>` API route.
- **Internationalization**: Language selection managed through URL query parameters and localStorage persistence. Locales are automatically detected from the filesystem, with metadata support for native names, flags, and RTL configuration. Currently supports EN, FR, DE, AR with automatic RTL layout for Arabic.
- **State Management**: Portfolio data and language preferences managed globally using React Context (`PortfolioDataContext`, `LanguageContext`) for efficient state distribution.
- **API Endpoint**: The backend is implemented as a Next.js API route. The main endpoint is `/api/portfolio?lang=<code>`, serving language-specific portfolio data with validation and caching.
- **Styling**: Tailwind CSS utility classes with RTL support. Custom variants managed using class-variance-authority (CVA). Glass morphism effects for modern design aesthetic.
- **Testing**: Jest and React Testing Library for testing. Test files located in `__tests__` directories alongside components.
- **Component Architecture**: Reusable components in `src/app/web/src/components`, organized by type (ui, sections, forms, layout).

## Project Documentation

### Context Files
For comprehensive project guidance, refer to these documentation files in the `docs/` directory:

- **@docs/architecture.md**: System architecture, design patterns, and technical decisions
- **@docs/git.md**: Version control guidelines, branching strategy, and commit conventions (uses conventional commits)
- **@docs/best-practices.md**: Coding standards, development patterns, and quality guidelines
- **@docs/setup.md**: Environment configuration and development setup instructions
- **@docs/features.md**: Current and planned feature specifications with implementation details
- **@docs/dependencies.md**: Package management, version control, and maintenance strategies
- **@docs/troubleshooting.md**: Common issues, debugging strategies, and emergency procedures
- **@docs/docker/DOCKER.md**: Docker deployment guide with detailed configuration
- **@docs/README.md**: Complete documentation index

### Project-Specific Terminology

#### Components
- **Glass Components**: Components using glass morphism design (backdrop-blur, transparency)
- **Section Components**: Main portfolio sections (Hero, Work, Recommendations, About, Contact)
- **UI Components**: Reusable Radix UI-based components
- **Theme Components**: Components related to dark/light theme switching

#### Features
- **Dynamic Multilingual Support**: Fully extensible internationalization with automatic locale discovery - currently EN, FR, DE, AR with RTL support, expandable to unlimited languages
- **Digital Twin**: AI chatbot representing the portfolio owner (UI implemented with WIP dialog, backend pending)
- **Portfolio Showcase**: Featured work with detailed project dialogs, markdown support, and technology badges
- **Skills Categories**: Detailed technology categorization with interactive cards and enhanced icons
- **Achievements Showcase**: Key metrics and professional accomplishments
- **Recommendations**: Curated LinkedIn testimonials in a continuously drifting infinite carousel; quotes are stored verbatim and never translated
- **Technology Icons**: Enhanced icon system supporting base64/URL icons with card-level hover effects
- **Project Details**: Modal dialogs with markdown rendering, accessibility features, and screen reader support

#### Technical Terms
- **SSR-Compatible**: Components that work with server-side rendering
- **Theme Provider**: Context provider managing dark/light theme state
- **Portfolio Data Context**: React Context (`PortfolioDataContext`) for global portfolio data state management
- **Language Context**: React Context managing language selection and RTL layout switching with async locale fetching
- **Locale Discovery**: Server-side filesystem scanning to automatically detect available locales
- **Locale Metadata**: Structured locale information (code, name, nativeName, flag, isRTL)
- **Dynamic Locale Validation**: Runtime validation of locale codes using `isValidLocale()` instead of compile-time union types
- **Module-level Caching**: In-memory cache for locale discovery results (single scan on startup)
- **Glass Morphism**: UI design technique using backdrop-blur and transparency
- **Radix Primitives**: Unstyled, accessible component foundations
- **Enhanced Icons**: Technology icon system supporting base64, URL, and Lucide fallback icons
- **Card-Level Hover**: Hover effects triggered by parent card rather than individual elements
- **Technology Icon Manager**: Utility system for processing and rendering technology icons with hover effects
- **Dynamic Data Loading**: Server-side JSON data loading via API routes with environment variable configuration
- **Portfolio API**: RESTful endpoint (`/api/portfolio`) for serving portfolio data with validation and caching
- **Locales API**: RESTful endpoint (`/api/locales`) for providing discovered locale metadata to clients
- **Icon Processing Pipeline**: Multi-step system for handling technology icons (base64 → URL → Lucide fallback)
- **Pull Quote / `highlight`**: A hand-picked *exact excerpt* of a recommendation, shown on the card in place of the full text. Never a paraphrase - see the verbatim rule below
- **Infinite Drift Carousel**: Continuously auto-scrolling track built from three duplicated copies of the list, wrapping modularly so it has no ends

## Recent Development Work

### Recommendations Section (Completed, unreleased)
- **Objective**: Add third-party social proof - LinkedIn recommendations - to a portfolio that
  otherwise only carries the owner's own claims
- **Live LinkedIn consumption is impossible**, and this is a constraint, not a preference:
  - The rich Profile API died with the 2019 v1 deprecation. What remains is *Sign In with
    LinkedIn via OpenID Connect* (`openid`, `profile`, `email`) - name, headline, picture,
    email, nothing else
  - The partner programs (Marketing Developer Platform, Talent Solutions) do not cover
    recommendations and gate on an approved company partnership
  - Scraping needs an authenticated session, violates the User Agreement §8.2, and is actively
    blocked. Proxycurl, the best-known third-party scraper, shut down in 2025 under LinkedIn
    legal pressure
  - Embedding is out too: LinkedIn's only widget is the profile badge, and the CSP in
    `next.config.js` is `default-src 'self'` with no `frame-src`
- **Approach**: Curated content in `portfolio-data/{locale}/portfolio.json`, exactly like every
  other piece of content. Each card links back to the recommender's profile, which keeps the
  claim verifiable without an integration. Mirrors the v1.3.0 `sideProjects` addition - one new
  optional key, one new hook, one new section, no change to the fetch architecture
- **⚠️ Verbatim rule**: `items` is **byte-identical across all four locale files**. Quotes,
  names, titles and dates are never translated - attributing translated words to a named person
  misrepresents what they wrote. Only `title`, `description` and `ctaLabel` are localized.
  `highlight` must be an exact substring of `quote` for the same reason
- **Key Changes**:
  - `Recommendation` / `RecommendationsData` types plus `recommendations?` on `PortfolioData`
    (optional, so pre-existing data still validates)
  - `validateRecommendations` in `dataLoader.ts` - absent is valid, present must be well-formed
  - `useRecommendations()` slice hook; no provider changes
  - `RecommendationCarousel.tsx` - hand-rolled infinite drift track, no new dependency
  - `RecommendationCard.tsx` - compact glass card showing the pull quote, not the full text
  - `Header.tsx` - nav item and scroll-spy array (two separate arrays, both need updating)
- **Carousel design notes** (all of these were bugs first):
  - **Three copies, resting in the middle.** Two only loops forwards: browsers clamp
    `scrollLeft` at 0 and the scroll event fires *after* the clamp, so backwards navigation hits
    an end no handler can intercept
  - **`wrap()` runs on `onScroll` as well as in the rAF loop.** The track is paused while the
    reader touches it, so the loop is not running to catch a wheel or drag past the edge
  - **Never read `scrollWidth` inside the animation loop** - it forces layout twice a frame.
    Cache it, recompute on `ResizeObserver`
  - **Keep the scroll position in a float accumulator.** At sub-pixel per-frame speeds, reading
    `scrollLeft` back each frame loses the fraction to rounding: the track stalls, then jumps
  - **`pt-5 pb-10` on the track is headroom, not spacing.** An x-scrolling container resolves
    `overflow-y` to `auto` and clips at the padding box, as does the mask - so both the hover
    lift and the `.glass` drop shadow were sliced into a hard horizontal line. The two sides
    differ because a `0 8px 32px` shadow reaches 24px below the card and 8px above it. Note
    `1rem = 14px` in this project, so the Tailwind scale is not what it looks like
  - Dots only, no arrows. The active highlight is one element travelling on a shared `layoutId`
- **Accessibility**: `role="group" aria-roledescription="carousel"`; only the middle copy is
  exposed as slides (the outer two are `aria-hidden`, otherwise every recommendation is
  announced three times); motion pauses on hover, focus and drag, and never starts under
  `prefers-reduced-motion` (WCAG 2.2.2)
- **Known gap**: the full `quote` is stored and validated but no longer surfaced on-page - the
  card shows only the pull quote. Restoring it would mean a dialog

### Single-Source Portfolio Data Fetching (Completed)
- **Problem**: A single page load issued **six** `/api/portfolio` requests
- **Cause**: Three independent fetchers, each doubled by React StrictMode's dev-only
  effect re-invocation:
  1. `app/layout.tsx` - `PortfolioDataProvider` (the intended one)
  2. `app/page.tsx` - a **second** `PortfolioDataProvider` nested inside the first
  3. `components/Footer.tsx` - bypassed the context and called `getPortfolioData()` itself
- **Fix**:
  - Removed the nested provider from `page.tsx`. It shadowed the layout's provider, so
    every page component read from the inner instance while the outer fetched for nobody
  - Added a `useFooter()` hook and pointed `Footer.tsx` at the shared context
- **Second bug found in passing**: `Footer` called `getPortfolioData()` with **no
  argument**, so it defaulted to `'en'` and never refetched on a language switch - the
  footer stayed English while the rest of the page translated
- **Result**: 2 requests in dev (StrictMode), **1 in production**. The 2 `/api/locales`
  calls are the same StrictMode doubling of one `LanguageProvider` effect and are correct
- **Invariant**: `PortfolioDataProvider` is mounted **once**, in the root layout. Components
  needing portfolio data consume a hook from `PortfolioDataContext` - never fetch privately

### Custom Lucide Icons Need an Explicit `key` (Completed)
- **Symptom**: `Each child in a list should have a unique "key" prop` pointing at
  `Contact.tsx`, but only for the three social icons - `Mail` / `MapPin` were silent
- **Cause**: lucide-react v1 renders icon children with a bare
  `iconNode.map(([tag, attrs]) => createElement(tag, attrs))` and supplies no key itself.
  Every upstream-generated icon carries `key` *inside its attrs* (see
  `node_modules/lucide-react/dist/esm/icons/mail.mjs`); the hand-rebuilt brand marks in
  `components/icons/brands.ts` omitted it
- **Fix**: Added a `key` to each path's attrs in `brands.ts`
- **Rule**: any icon built with `createLucideIcon` must give every `iconNode` entry a `key`

### Project Categorization - Client Work vs Personal Projects (Completed, v1.3.0)
- **Objective**: Separate paid client engagements from personal / open-source work
- **Approach**: A second `sideProjects` array in the portfolio JSON, surfaced through an accessible segmented control
- **Key Changes**:
  - Added `sideProjects?: Project[]` to `PortfolioData` (optional, so older data still loads)
  - Added `WorkData.tabs?: { client, personal }` for per-tab label and description
  - Created `ProjectTabs.tsx` implementing the WAI-ARIA tabs pattern
  - `Work.tsx` renders tabs only when *both* groups have content; a single populated
    group falls back to an untabbed grid and follows whichever group has projects
  - Added Automedon and Whitelisted-Ngrok as personal projects across all 4 locales
- **Accessibility Notes**:
  - Roving `tabIndex` - only the active tab is in the tab order, arrow keys move between tabs
  - Arrow direction is mirrored under RTL (`ArrowRight` walks backwards in Arabic)
  - `role="tabpanel"` is only applied when a tablist actually exists to label it
  - Active pill uses a shared `layoutId` so motion measures real DOM positions

### Remote Image Optimization (Completed, v1.3.0)
- **Problem**: Google Drive answers inconsistently with a non-image `Content-Type`, and
  Chrome's Opaque Response Blocking then drops the response - portfolio images silently failed
- **Fix**: Route remote images through the Next.js optimizer so they are served from our own
  origin, via `images.remotePatterns` in `next.config.js` **and** `next.config.ts`
- **Important**: Both config files must be kept in sync. `next.config.js` is what ships in
  Docker (the `.ts` variant would force a TypeScript install at container runtime).

### Multilingual Support Implementation (Completed)
- **Objective**: Add full internationalization with multiple languages and RTL support
- **Approach**: Language-specific JSON files with API route integration
- **Key Changes**:
  - Created language-specific portfolio data files (en.json, fr.json, de.json, ar.json)
  - Implemented language switching with URL query parameters and localStorage
  - Added RTL layout support for Arabic language
  - Updated API route to serve language-specific data
  - Created LanguageContext for global language state management

### Enhanced Project Components (Completed)
- **Objective**: Improve project showcase with detailed information and better UX
- **Approach**: Component-driven development with accessibility focus
- **Key Changes**:
  - Created ProjectDetailsDialog with markdown rendering support
  - Added screen reader support and ARIA labels for accessibility
  - Implemented badge truncation for technology lists
  - Enhanced layout with glass morphism effects
  - Added Work In Progress dialog for AI assistant feature
  - Improved project card layout and technology display

### Dynamic Data Loading Implementation (Completed)
- **Objective**: Convert static portfolio data to dynamic JSON-based loading
- **Key Changes**:
  - Created server-side API route `/api/portfolio?lang=<code>` for data serving
  - Implemented portfolio data validation and error handling
  - Added language-aware data loading with fallback mechanisms

### Technology Icon System Enhancement (Completed)
- **Objective**: Support base64/URL format icons with fallback handling
- **Key Changes**:
  - Extended type definitions with `ImageData` interface
  - Created comprehensive `technologyIconManager.ts` utility
  - Implemented icon processing pipeline (base64 → URL → Lucide)
  - Maintained backward compatibility with legacy string arrays

### Docker Deployment Implementation (Completed)
- **Objective**: Enable containerized deployment with Docker for production environments
- **Approach**: Pre-built Next.js artifacts with optimized Docker configuration
- **Key Challenges Resolved**:
  - Fixed permission errors by creating proper home directory for non-root user
  - Resolved TypeScript configuration issues by creating `next.config.js` (JavaScript version)
  - Corrected environment variable naming (`PORTFOLIO_CONFIG_PATH` instead of `PORTFOLIO_DATA_DIR`)
  - Configured writable npm cache location for container runtime
- **Files Created/Modified**:
  - `build-scripts/docker/Dockerfile.prebuilt` - Production-optimized Docker image
  - `build-scripts/docker/docker-compose.prebuilt.yml` - Pre-built deployment configuration
  - `docker-compose.yml` - Easy deployment with latest Docker Hub image
  - `.env.example` - Environment configuration template
  - `build-scripts/shell/build-and-push.sh` - Automated build and publish script (Linux/Mac)
  - `build-scripts/shell/build-and-push.bat` - Automated build and publish script (Windows)
  - `next.config.js` - JavaScript configuration to avoid runtime TypeScript dependencies
  - Updated `.dockerignore` to include `next.config.js`
- **Status**: ✅ Fully functional - Portfolio accessible at http://localhost:3000

### Repository Reorganization (Completed)
- **Objective**: Organize repository structure for better GitHub presentation
- **Changes**:
  - Created `build-scripts/` directory for Docker and shell scripts
  - Moved documentation to `docs/` with organized subdirectories
  - Created easy-deployment `docker-compose.yml` with configurable volumes
  - Removed legacy build scripts and redundant files
  - Updated all file references and paths in scripts
- **Benefits**: Cleaner root directory, better documentation discovery, organized build automation

### Dynamic Locale Discovery System (Completed)
- **Objective**: Eliminate hardcoded language lists and enable automatic locale detection based on filesystem structure
- **Approach**: Server-side directory scanning with module-level caching
- **Key Changes**:
  - Restructured `portfolio-data/` from flat files to locale-based directories (`{locale}/portfolio.json`)
  - Created `localeDiscovery.ts` utility for automatic locale detection with metadata support
  - Implemented `/api/locales` endpoint for client-side locale information
  - Updated type system from TypeScript union types (`'en' | 'fr'...`) to dynamic `string` type
  - Refactored LanguageContext to fetch and cache locales from API
  - Updated all API routes to use dynamic locale validation
  - Migrated all existing data files to new structure with automated script
- **Architecture**:
  - Single filesystem scan on server startup (cached for performance)
  - Locale metadata includes: code, name, nativeName, flag emoji, isRTL boolean
  - Fallback system: Generic defaults for unknown locales, English-only mode on errors
  - Support for optional `locale.json` metadata files per locale
  - Diagrams shared at root level across all locales
- **Files Created**:
  - `src/app/web/src/utils/localeDiscovery.ts` - Core locale discovery service
  - `src/app/web/src/app/api/locales/route.ts` - Locale metadata API endpoint
  - `scripts/migrate-locale-structure.js` - Automated migration script
- **Files Modified**:
  - `src/app/web/src/app/api/portfolio/route.ts` - Dynamic locale validation
  - `src/app/web/src/app/api/markdown/[filename]/route.ts` - Locale-aware markdown loading
  - `src/app/web/src/types/index.ts` - Changed Language type to dynamic string
  - `src/app/web/src/contexts/LanguageContext.tsx` - Async locale fetching
  - `src/app/web/src/components/LanguageSwitcher.tsx` - Dynamic locale rendering
  - `src/app/web/src/components/projects/ProjectDetailsDialog.tsx` - Language-aware markdown fetch
- **Benefits**:
  - Zero hardcoded language lists in codebase
  - Adding new locale requires only creating directory + restart
  - Future-proof for unlimited language expansion
  - Maintains full backward compatibility with existing features
- **Status**: ✅ Fully tested - All 4 locales (ar, de, en, fr) working correctly

### Docker Image Slimming (Completed)
- **Objective**: Understand and reduce a ~905MB production image
- **Findings**:
  - `.next/cache` (183MB) was being shipped - local incremental webpack/SWC state that
    `next start` never reads. Real runtime artifacts are ~3MB (`server/` + `static/`).
  - `@next/swc-linux-x64-gnu` + `-musl` (274MB) are build-time compilers the runtime never
    invokes; npm installs both variants even though the base image is Debian (glibc)
- **Applied**: Excluded `src/app/web/.next/cache` in `.dockerignore`, **below** the
  `!src/app/web/.next/**` re-include (last matching rule wins). **905MB -> 713MB.**
- **Also fixed**: `src/app/web/public/` had no tracked files since `22ec182` removed the
  create-next-app SVGs, and git does not track empty directories - so
  `COPY src/app/web/public ./public` failed on any clean clone. Added a tracked `.gitkeep`.
- **Not yet done**: `output: 'standalone'` would drop the SWC binaries and the `npm ci`
  layer entirely (~245MB), but changes the start command to `node server.js`

### Key Files Created/Modified
- `src/app/web/src/components/Recommendations.tsx` - Recommendations section shell
- `src/app/web/src/components/recommendations/RecommendationCarousel.tsx` - Infinite drift track
- `src/app/web/src/components/recommendations/RecommendationCard.tsx` - Compact testimonial card
- `src/app/web/src/components/projects/ProjectTabs.tsx` - Accessible project category tabs
- `src/app/web/src/components/Work.tsx` - Tab state, panel semantics, group fallback
- `portfolio-data/{locale}/portfolio.json` - Locale-specific portfolio data (en, fr, de, ar)
- `portfolio-data/{locale}/projects-md/` - Locale-specific markdown files for project details
- `portfolio-data/diagrams/` - Shared diagram assets across all locales
- `src/app/web/src/utils/localeDiscovery.ts` - Dynamic locale detection utility
- `src/app/web/src/app/api/locales/route.ts` - Locale metadata API endpoint
- `src/app/web/src/app/api/portfolio/route.ts` - Server-side API with dynamic locale validation
- `src/app/web/src/app/api/markdown/[filename]/route.ts` - Locale-aware markdown loading
- `src/app/web/src/components/sections/ProjectDetailsDialog.tsx` - Project details modal with markdown
- `src/app/web/src/components/ui/WIPDialog.tsx` - Work In Progress dialog component
- `src/app/web/src/contexts/LanguageContext.tsx` - Dynamic language state management
- `src/app/web/src/contexts/PortfolioDataContext.tsx` - Sole portfolio fetcher; per-slice hooks
- `src/app/web/src/components/icons/brands.ts` - Local brand marks (lucide v1 dropped them)
- `src/app/web/src/components/LanguageSwitcher.tsx` - Dynamic locale switching UI
- `src/app/web/src/utils/dataLoader.ts` - Updated to support language-specific loading
- `src/app/web/src/utils/technologyIconManager.ts` - Technology icon processing system
- `src/app/web/src/types/index.ts` - Extended with multilingual types and dynamic Language type
- `scripts/migrate-locale-structure.js` - Automated data migration script

### Environment Configuration
The application uses a `.env.local` file in the `src/app/web/` directory for configuration:

```env
# Portfolio Configuration
PORTFOLIO_CONFIG_PATH=./portfolio-data

# Application Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Language Settings
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_ENABLE_LANGUAGE_DETECTION=true

# Development Options
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_GRID=false
```

**Note**: The `.env.local` file is automatically loaded by Next.js. Locales are automatically discovered from the `portfolio-data/{locale}/` directories on server startup. No hardcoded language lists required.

# Task Completion Protocol

When you finish a task, always prompt me with the following question:

**"Do you want me to update The Project Context Files?"**

## Project Context Files to Update:
- @docs/architecture.md
- @docs/best-practices.md
- @CLAUDE.md (keep at root)
- @docs/dependencies.md
- @docs/features.md
- @docs/git.md
- @docs/setup.md
- @docs/troubleshooting.md 

---

*This ensures project documentation stays current and comprehensive after each completed task.*