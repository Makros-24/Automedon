## Automedon - AI-Powered Digital Twin Portfolio

**Why I built it**: A CV is a static document that answers only the questions its author anticipated. Recruiters end up scanning for keywords instead of asking what they actually want to know. Automedon inverts that: it is a portfolio you can talk to, backed by an assistant grounded strictly in my CV, project history, and professional experience — no invented credentials, no answers outside the source material.

**Technical Implementation**

**Architecture**: Next.js 15 App Router with React 19 and TypeScript in strict mode. Content lives entirely outside the codebase in `portfolio-data/{locale}/portfolio.json`, served through validated API routes rather than imported at build time. Updating the portfolio means editing JSON and restarting — not redeploying an application.

**Dynamic locale discovery**: Rather than hardcoding a language union type, the server scans `portfolio-data/` on startup, treats every subdirectory containing a `portfolio.json` as a locale, and reads optional `locale.json` metadata for native name, flag, and RTL flag. Results are cached at module level, so the filesystem is walked once. Adding a fifth language is a directory and a restart — zero code changes.

**Internationalization**: Four languages ship today (English, French, German, Arabic), including full right-to-left layout for Arabic. Language selection is driven by URL query parameter with `localStorage` fallback, and content swaps without a page reload. Every user-facing string — project descriptions, skill categories, contact copy — is localized, and each locale carries its own long-form markdown for project detail views.

**State and rendering**: Global state is split by concern across three React contexts (`LanguageContext`, `PortfolioDataContext`, `ThemeProvider`) rather than a single store. UI is composed from Radix primitives with Tailwind CSS 4, using a glass-morphism design system and Motion for scroll-triggered, `prefers-reduced-motion`-aware animation.

**Technology icon pipeline**: A resolution chain (base64 → remote URL → Lucide fallback) renders technology badges, with card-level grayscale-to-color hover transitions. Legacy string arrays still work alongside the enhanced object format, so data files can be migrated incrementally.

**Deployment**: Docker-first, with a pre-built image approach that sidesteps the `lightningcss` native-binary problem in Tailwind CSS 4. The container runs as a non-root user with health checks and pinned resource limits.

**Stack**

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript 5, strict mode |
| Styling | Tailwind CSS 4, Radix UI, Motion |
| Content | Filesystem JSON + Markdown, served via API routes |
| Deployment | Docker, Docker Compose |

**Status**: The portfolio, multilingual system, and project showcase are live. The conversational AI layer is the active piece of work — the interface ships behind a work-in-progress dialog while the retrieval and grounding backend is built out.

The source is public at [github.com/Makros-24/Automedon](https://github.com/Makros-24/Automedon).
