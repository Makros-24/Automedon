# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automedon is an AI-powered digital twin portfolio application that allows recruiters and collaborators to interact with a chatbot representing the portfolio owner. The chatbot answers questions based solely on CV data, personal experiences, and professional history.

## Current Development Status

**Phase**: Multilingual Support Complete - Full Internationalization

- **Current Status**: Fully functional portfolio with multilingual support (English, French, German, Arabic with RTL), dynamic JSON-based data loading, and enhanced UI components
- **Tech Stack**: React 19, Next.js 15, TypeScript, Tailwind CSS 4, Radix UI, Framer Motion
- **Architecture**: Component-based with 40+ UI components, theme provider, animation system, multilingual system, and comprehensive technology icon management
- **Recent Enhancements**:
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

## Development Conventions

- **Data Source**: Portfolio data is organized by language in the `portfolio-data/` directory (en.json, fr.json, de.json, ar.json). The frontend fetches language-specific data through the `/api/portfolio?lang=<code>` API route.
- **Internationalization**: Language selection managed through URL query parameters and localStorage persistence. Supports EN, FR, DE, AR with automatic RTL layout for Arabic.
- **State Management**: Portfolio data and language preferences managed globally using React Context (`PortfolioDataContext`, `LanguageContext`) for efficient state distribution.
- **API Endpoint**: The backend is implemented as a Next.js API route. The main endpoint is `/api/portfolio?lang=<code>`, serving language-specific portfolio data with validation and caching.
- **Styling**: Tailwind CSS utility classes with RTL support. Custom variants managed using class-variance-authority (CVA). Glass morphism effects for modern design aesthetic.
- **Testing**: Jest and React Testing Library for testing. Test files located in `__tests__` directories alongside components.
- **Component Architecture**: Reusable components in `src/app/web/src/components`, organized by type (ui, sections, forms, layout).

## Project Documentation

### Context Files
For comprehensive project guidance, refer to these documentation files:

- **@architecture.md**: System architecture, design patterns, and technical decisions
- **@git.md**: Version control guidelines, branching strategy, and commit conventions (uses conventional commits)
- **@best-practices.md**: Coding standards, development patterns, and quality guidelines
- **@setup.md**: Environment configuration and development setup instructions
- **@features.md**: Current and planned feature specifications with implementation details
- **@dependencies.md**: Package management, version control, and maintenance strategies
- **@troubleshooting.md**: Common issues, debugging strategies, and emergency procedures

### Project-Specific Terminology

#### Components
- **Glass Components**: Components using glass morphism design (backdrop-blur, transparency)
- **Section Components**: Main portfolio sections (Hero, Work, About, Contact)
- **UI Components**: Reusable Radix UI-based components
- **Theme Components**: Components related to dark/light theme switching

#### Features
- **Multilingual Support**: Full internationalization with EN, FR, DE, AR languages and RTL support
- **Digital Twin**: AI chatbot representing the portfolio owner (UI implemented with WIP dialog, backend pending)
- **Portfolio Showcase**: Featured work with detailed project dialogs, markdown support, and technology badges
- **Skills Categories**: Detailed technology categorization with interactive cards and enhanced icons
- **Achievements Showcase**: Key metrics and professional accomplishments
- **Technology Icons**: Enhanced icon system supporting base64/URL icons with card-level hover effects
- **Project Details**: Modal dialogs with markdown rendering, accessibility features, and screen reader support

#### Technical Terms
- **SSR-Compatible**: Components that work with server-side rendering
- **Theme Provider**: Context provider managing dark/light theme state
- **Portfolio Data Context**: React Context (`PortfolioDataContext`) for global portfolio data state management
- **Language Context**: React Context managing language selection and RTL layout switching
- **Glass Morphism**: UI design technique using backdrop-blur and transparency
- **Radix Primitives**: Unstyled, accessible component foundations
- **Enhanced Icons**: Technology icon system supporting base64, URL, and Lucide fallback icons
- **Card-Level Hover**: Hover effects triggered by parent card rather than individual elements
- **Technology Icon Manager**: Utility system for processing and rendering technology icons with hover effects
- **Dynamic Data Loading**: Server-side JSON data loading via API routes with environment variable configuration
- **Portfolio API**: RESTful endpoint (`/api/portfolio`) for serving portfolio data with validation and caching
- **Icon Processing Pipeline**: Multi-step system for handling technology icons (base64 → URL → Lucide fallback)

## Recent Development Work

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

### Key Files Created/Modified
- `portfolio-data/en.json` - English portfolio data with project details and markdown
- `portfolio-data/fr.json` - French translation of portfolio data
- `portfolio-data/de.json` - German translation of portfolio data
- `portfolio-data/ar.json` - Arabic translation with RTL support considerations
- `src/app/web/src/app/api/portfolio/route.ts` - Server-side API with language parameter support
- `src/app/web/src/components/sections/ProjectDetailsDialog.tsx` - Project details modal with markdown
- `src/app/web/src/components/ui/WIPDialog.tsx` - Work In Progress dialog component
- `src/app/web/src/contexts/LanguageContext.tsx` - Language state management
- `src/app/web/src/utils/dataLoader.ts` - Updated to support language-specific loading
- `src/app/web/src/utils/technologyIconManager.ts` - Technology icon processing system
- `src/app/web/src/types/index.ts` - Extended with multilingual and project types

### Environment Configuration
The application uses a `.env.local` file in the `src/app/web/` directory for configuration:

```env
# Portfolio Configuration
PORTFOLIO_DATA_DIR=./portfolio-data

# Application Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supported Languages (comma-separated)
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,fr,de,ar
NEXT_PUBLIC_DEFAULT_LANGUAGE=en

# Development Options
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_GRID=false
```

**Note**: The `.env.local` file is automatically loaded by Next.js. Language-specific data is loaded from the `portfolio-data/` directory based on the selected language.

# Task Completion Protocol

When you finish a task, always prompt me with the following question:

**"Do you want me to update The Project Context Files?"**

## Project Context Files to Update:
- @architecture.md 
- @best-practices.md 
- @CLAUDE.md 
- @dependencies.md 
- @features.md 
- @git.md 
- @setup.md 
- @troubleshooting.md 

---

*This ensures project documentation stays current and comprehensive after each completed task.*