# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automedon is an AI-powered digital twin portfolio application that allows recruiters and collaborators to interact with a chatbot representing the portfolio owner. The chatbot answers questions based solely on CV data, personal experiences, and professional history.

## Current Development Status

This project has been reset for a fresh rebuild:

- **Phase**: Project Reset - Ready for clean rebuild from minimal Next.js foundation
- **Current Status**: Minimal Next.js app with TypeScript, Tailwind CSS 4, ESLint, Jest testing configurations preserved
- **Tech Stack**: React 19, Next.js 15, TypeScript, Tailwind CSS 4 (configurations ready)

## Repository Structure

```
src/app/web/                    # Next.js application root
├── src/
│   └── app/                    # Next.js App Router
│       ├── layout.tsx          # Minimal root layout
│       ├── page.tsx            # Basic "Hello World" page
│       ├── globals.css         # Basic global styles with Tailwind
│       └── favicon.ico         # Default favicon
├── package.json               # Dependencies and scripts (preserved)
├── jest.config.js            # Jest testing configuration (preserved)
├── jest.setup.js             # Jest setup file (preserved)
├── eslint.config.mjs         # ESLint configuration (preserved)
├── next.config.ts            # Next.js configuration (preserved)
├── postcss.config.mjs        # PostCSS configuration (preserved)
└── tsconfig.json             # TypeScript configuration (preserved)
```

## Architecture Overview

The project has been reset to a minimal foundation. Previous architecture included:

### Planned Architecture (To Be Rebuilt)
- **Data Layer**: Will use centralized configuration with TypeScript interfaces
- **Component Architecture**: Modular sections approach with reusable components
- **Theme System**: Dark/light theme with system preference detection
- **UI Components**: Radix UI primitives with custom styling
- **Styling System**: Tailwind CSS 4 with responsive design and animations

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

## Testing Setup

- **Framework**: Jest with jsdom environment
- **Testing Library**: React Testing Library with user-event
- **Configuration**: Jest configured for Next.js with path mapping (`@/` → `src/`)
- **Test Location**: `src/utils/__tests__/` (expandable to other directories)

## Current Status

### Preserved Configuration
- ✅ TypeScript configuration with strict settings
- ✅ Next.js 15 with App Router setup
- ✅ Tailwind CSS 4 configuration
- ✅ ESLint configuration with Next.js rules
- ✅ Jest testing setup with React Testing Library
- ✅ PostCSS configuration
- ✅ All dependencies maintained in package.json

### Ready for Rebuild
- 🔄 Minimal Next.js app structure with basic layout and page
- 🔄 Clean slate for component development
- 🔄 Fresh start for implementing features

## Planned Features (Next Phase)

- [ ] OpenAI API integration for chat functionality
- [ ] Email verification system for private data
- [ ] Admin dashboard for response monitoring
- [ ] Job description compatibility analysis
- [ ] Multilingual support
- [ ] Analytics dashboard
- [ ] Debug mode for AI behavior inspection

## Next Steps for Development

After the project reset, you can:

1. **Install Dependencies**: Run `npm install` in the `src/app/web/` directory
2. **Start Development**: Run `npm run dev` to start the development server
3. **Begin Rebuilding**: Create components, pages, and features as needed
4. **Test Configuration**: All testing and linting configurations are preserved and ready to use

## Important Development Notes

- **Working Directory**: Always work from `src/app/web/` for all npm commands
- **Next.js App Router**: Uses App Router (not Pages Router) - components go in `src/app/`
- **Import Paths**: Uses `@/` alias pointing to `src/` directory
- **Configuration**: All build tools (TypeScript, ESLint, Jest, PostCSS, Tailwind) are configured and ready
- **Testing**: Jest and React Testing Library are set up for component and utility testing
- **Development**: Start with `npm install` then `npm run dev` to begin development
- **Fresh Start**: Project has been cleared of all previous components and data for a clean rebuild