# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automedon is an AI-powered digital twin portfolio application that allows recruiters and collaborators to interact with a chatbot representing the portfolio owner. The chatbot answers questions based solely on CV data, personal experiences, and professional history.

## Current Development Status

This project is in active development with a comprehensive Next.js foundation:

- **Phase**: UI Development Complete - Interactive portfolio with chat functionality implemented
- **Current Status**: Next.js app with TypeScript, Tailwind CSS 4, ESLint, Jest testing, and interactive components
- **Tech Stack**: React 19, Next.js 15, TypeScript, Tailwind CSS 4, Three.js, Radix UI, ESLint

## Repository Structure

```
src/app/web/                    # Next.js application root
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Main portfolio page
│   │   └── globals.css         # Global styles and Tailwind imports
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components (buttons, cards, etc.)
│   │   ├── common/             # Common components (ImageWithFallback)
│   │   ├── HeroSection.tsx     # Landing hero with particles effect
│   │   ├── AboutSection.tsx    # About/summary section
│   │   ├── ExperienceSection.tsx # Professional experience
│   │   ├── SkillsSection.tsx   # Technical skills with progress bars
│   │   ├── ProjectsSection.tsx # Portfolio projects
│   │   ├── EducationSection.tsx # Educational background
│   │   ├── ContactSection.tsx  # Contact information
│   │   ├── ChatSection.tsx     # Chat interface for AI interaction
│   │   ├── ChatPopup.tsx       # Floating chat popup
│   │   ├── Navigation.tsx      # Main navigation bar
│   │   ├── FloatingNavDots.tsx # Section navigation dots
│   │   ├── ThemeProvider.tsx   # Dark/light theme context
│   │   ├── ThemeToggle.tsx     # Theme switching component
│   │   ├── EnhancedParticles.tsx # Three.js particle system
│   │   ├── ScrollProgress.tsx  # Reading progress indicator
│   │   ├── SmoothScrollCanvas.tsx # Smooth scrolling effects
│   │   └── ErrorBoundary.tsx   # Error handling wrapper
│   ├── config/
│   │   └── portfolioData.ts    # Centralized data configuration
│   ├── constants/
│   │   └── animation.ts        # Animation constants
│   └── utils/
│       ├── inputValidation.ts  # Form validation utilities
│       └── __tests__/         # Unit tests for utilities
├── package.json               # Dependencies and scripts
├── jest.config.js            # Jest testing configuration
├── jest.setup.js             # Jest setup file
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Architecture Overview

### Data Layer
- **Portfolio Data**: Centralized in `src/config/portfolioData.ts` with TypeScript interfaces
- **Type Definitions**: Comprehensive interfaces for PersonalInfo, Experience, Skills, Projects, Education
- **Chat Responses**: Pre-configured responses for common queries stored in portfolioData.ts

### Component Architecture
- **Section-based Layout**: Modular sections (Hero, About, Experience, Skills, Projects, Education, Contact, Chat)
- **Theme System**: Context-based dark/light theme with system preference detection
- **UI Components**: Radix UI primitives with custom styling using class-variance-authority
- **Particle System**: Three.js-based interactive background particles
- **Navigation**: Dual navigation (main navbar + floating section dots)

### Styling System
- **Tailwind CSS 4**: Latest version with advanced features
- **CSS Variables**: Theme-aware color system
- **Responsive Design**: Mobile-first approach with comprehensive breakpoints
- **Animation**: CSS animations with Tailwind and custom keyframes

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

## Key Features (Implemented)

### UI Features
- ✅ Responsive portfolio layout with smooth scrolling
- ✅ Dark/light theme switching with system preference
- ✅ Interactive particle background using Three.js
- ✅ Section navigation with floating dots
- ✅ Scroll progress indicator
- ✅ Chat interface (UI ready for API integration)
- ✅ Contact form with validation
- ✅ Skills visualization with progress bars
- ✅ Project cards with technology badges

### Technical Features
- ✅ TypeScript throughout with strict configuration
- ✅ Next.js App Router with server components
- ✅ Tailwind CSS 4 with custom design system
- ✅ ESLint configuration with Next.js rules
- ✅ Jest testing setup with React Testing Library
- ✅ Error boundaries for component error handling
- ✅ Form validation utilities with comprehensive tests

## Planned Features (Next Phase)

- [ ] OpenAI API integration for chat functionality
- [ ] Email verification system for private data
- [ ] Admin dashboard for response monitoring
- [ ] Job description compatibility analysis
- [ ] Multilingual support
- [ ] Analytics dashboard
- [ ] Debug mode for AI behavior inspection

## Data Configuration

Portfolio content is managed through `src/config/portfolioData.ts`:

- **Personal Information**: Name, title, contact, summary, social links
- **Skills**: Categorized with proficiency levels (frontend, backend, database, cloud, tools)
- **Experience**: Professional history with achievements and technologies
- **Projects**: Portfolio projects with features, technologies, and links
- **Education**: Academic background with achievements
- **Chat Responses**: Pre-configured responses for common chatbot queries

## Important Development Notes

- **Working Directory**: Always work from `src/app/web/` for all npm commands
- **Next.js App Router**: Uses App Router (not Pages Router) - components go in `src/app/`
- **Import Paths**: Uses `@/` alias pointing to `src/` directory
- **Theme System**: Components should use theme-aware classes and CSS variables
- **Component Structure**: Follow existing patterns for new components (props interfaces, error boundaries)
- **Testing**: Write tests for utilities and complex logic, place in `__tests__` directories
- **Data Updates**: Modify `portfolioData.ts` to update portfolio content
- **Browser Testing**: Use MCP Playwright to verify UI changes after implementation