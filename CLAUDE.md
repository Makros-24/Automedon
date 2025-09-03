# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automedon is an AI-powered digital twin portfolio application that allows recruiters and collaborators to interact with a chatbot representing the portfolio owner. The chatbot answers questions based solely on CV data, personal experiences, and professional history.

## Current Development Status

**Phase**: Dynamic Data Loading Complete - Technology Icon System Enhanced

- **Current Status**: Fully functional portfolio with dynamic JSON-based data loading, server-side API integration, and enhanced technology icon system
- **Tech Stack**: React 19, Next.js 15, TypeScript, Tailwind CSS 4, Radix UI, Framer Motion
- **Architecture**: Component-based with 40+ UI components, theme provider, animation system, and comprehensive technology icon management
- **Recent Enhancements**: 
  - Converted from static to dynamic JSON-based data loading via API routes
  - Implemented comprehensive technology icon manager with base64/URL support and Lucide fallbacks
  - Added extensive test coverage for technology icon system
  - Created server-side portfolio data API with validation and caching

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
- **Digital Twin**: AI chatbot representing the portfolio owner (UI implemented, backend pending)
- **Tech Radar**: Interactive chart showing technology proficiency (currently hidden)
- **Skill Carousel**: Scrolling showcase of core skills (currently hidden)
- **Portfolio Showcase**: Featured work and project displays
- **Skills Categories**: Detailed technology categorization with interactive cards and enhanced icons
- **Achievements Showcase**: Key metrics and professional accomplishments
- **Technology Icons**: Enhanced icon system supporting base64/URL icons with card-level hover effects

#### Technical Terms
- **SSR-Compatible**: Components that work with server-side rendering
- **Theme Provider**: Context provider managing dark/light theme state
- **Glass Morphism**: UI design technique using backdrop-blur and transparency
- **Radix Primitives**: Unstyled, accessible component foundations
- **Enhanced Icons**: Technology icon system supporting base64, URL, and Lucide fallback icons
- **Card-Level Hover**: Hover effects triggered by parent card rather than individual elements
- **Technology Icon Manager**: Utility system for processing and rendering technology icons with hover effects
- **Dynamic Data Loading**: Server-side JSON data loading via API routes with environment variable configuration
- **Portfolio API**: RESTful endpoint (`/api/portfolio`) for serving portfolio data with validation and caching
- **Icon Processing Pipeline**: Multi-step system for handling technology icons (base64 → URL → Lucide fallback)

## Recent Development Work

### Dynamic Data Loading Implementation (Completed)
- **Objective**: Convert static portfolio data to dynamic JSON-based loading with environment variable support
- **Approach**: Test-driven development with comprehensive test coverage
- **Key Changes**:
  - Created server-side API route `/api/portfolio` for data serving
  - Updated `dataLoader.ts` to fetch from API endpoint instead of static imports
  - Added development cache-busting for immediate JSON file updates
  - Implemented portfolio data validation and error handling
  - Converted from client-side to server-side data loading

### Technology Icon System Enhancement (Completed)
- **Objective**: Extend technology icons to support base64/URL format like project images
- **Approach**: Test-driven development with extensive test suite
- **Key Changes**:
  - Extended type definitions with `ImageData` interface and `TechnologyWithIcon` type
  - Created comprehensive `technologyIconManager.ts` utility system
  - Implemented icon processing pipeline with priority system (base64 → URL → Lucide)
  - Added 28 test cases covering all functionality and edge cases
  - Maintained backward compatibility with legacy string arrays

### Key Files Created/Modified
- `src/app/web/src/app/api/portfolio/route.ts` - Server-side portfolio data API
- `src/app/web/src/utils/dataLoader.ts` - Updated to use API endpoint
- `src/app/web/src/utils/technologyIconManager.ts` - Technology icon processing system
- `src/app/web/src/utils/__tests__/dataLoader.test.ts` - 20 test cases for data loading
- `src/app/web/src/utils/__tests__/technologyIconManager.test.ts` - 28 test cases for icon system
- `src/app/web/src/types/index.ts` - Extended with enhanced technology icon types
- `portfolio-data.json` - Root-level JSON data file with base64 SVG images

### Environment Configuration
The application uses a `.env.local` file in the `src/app/web/` directory for configuration:

```env
# Portfolio Configuration
PORTFOLIO_CONFIG_PATH=./portfolio-data.json

# Application Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Options
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_GRID=false
```

**Note**: The `.env.local` file is automatically loaded by Next.js and contains all necessary environment variables. No additional command-line parameters are needed.

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