# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automedon is an AI-powered digital twin portfolio application that allows recruiters and collaborators to interact with a chatbot representing the portfolio owner. The chatbot answers questions based solely on CV data, personal experiences, and professional history.

## Current Development Status

**Phase**: Portfolio Implementation Complete - Feature Development Ready

- **Current Status**: Fully functional portfolio with integrated Figma design, complete UI component library, and theme system
- **Tech Stack**: React 19, Next.js 15, TypeScript, Tailwind CSS 4, Radix UI, Framer Motion
- **Architecture**: Component-based with 40+ UI components, theme provider, and animation system

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
- **Skills Categories**: Detailed technology categorization with interactive cards
- **Achievements Showcase**: Key metrics and professional accomplishments

#### Technical Terms
- **SSR-Compatible**: Components that work with server-side rendering
- **Theme Provider**: Context provider managing dark/light theme state
- **Glass Morphism**: UI design technique using backdrop-blur and transparency
- **Radix Primitives**: Unstyled, accessible component foundations
- # Task Completion Protocol

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