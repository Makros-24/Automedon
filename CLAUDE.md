# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automedon is an AI-powered digital twin portfolio application that allows recruiters and collaborators to interact with a chatbot representing the portfolio owner. The chatbot answers questions based solely on CV data, personal experiences, and professional history.

## Current Development Status

This project is now in active development with a Next.js foundation established:

- **Phase**: Initial development (Next.js app created, ready for feature implementation)
- **Current Status**: Next.js app with TypeScript, Tailwind CSS, and ESLint configured
- **Tech Stack**: React 19, Next.js 15, TypeScript, Tailwind CSS 4, ESLint

## Repository Structure

```
src/
├── app/
│   └── web/              # Next.js application
│       ├── src/app/      # App router pages and layouts
│       ├── public/       # Static assets
│       ├── package.json  # Dependencies and scripts
│       └── *.config.*    # Configuration files
└── types/                # TypeScript type definitions (planned)

docs/                     # Project documentation (planned)
public/                   # Global static assets (planned)
docker/                   # Docker configuration (planned)
```

## Key Features (Planned)

- Interactive AI chatbot powered by OpenAI API
- Job description compatibility analysis
- Multilingual support
- Private data gating with email verification
- Admin dashboard for response monitoring
- Analytics dashboard for recruiter interactions
- Debug mode for AI behavior inspection

## Development Commands

All commands should be run from the `src/app/web/` directory:

```bash
# Navigate to the web app
cd src/app/web

# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Project Phases

1. **MVP**: Define data schema, build React/Next.js layout, add sandboxed chatbot
2. **Interaction Layer**: Admin dashboard, debug mode, multilingual support
3. **Smart Matching**: Job description parser, company-aware responses, scheduling
4. **AI Optimization**: Vector search, feedback loops, LinkedIn/GitHub sync

## Important Notes

- This is a personal portfolio project with Next.js foundation now established
- The web application is located at `src/app/web/` with full TypeScript and Tailwind CSS setup
- Uses Next.js App Router (not Pages Router)
- Turbopack is enabled for faster development builds
- Ready for implementing core features: data schema, AI chatbot integration, and portfolio layout
- After making changes on a web page always run a browser to verify it is correctly implemented or not. you have MCP playwright