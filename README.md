# Automedon — Your AI-Powered Digital Twin Portfolio

> *A modern, AI-infused portfolio experience where every interaction reveals who you are — professionally and personally.*

**Automedon** is not just a portfolio — it's your **AI-powered digital twin**. Recruiters and collaborators can interact with a smart chatbot that answers questions based solely on your CV, personal experiences, and professional history. From parsing job descriptions to evaluating personality traits, Automedon represents you with precision, authenticity, and professionalism.

Named after the legendary charioteer of Achilles, Automedon is your loyal, digital envoy — always ready to answer on your behalf.

---

## 🚀 Quick Start

### Docker Deployment (Recommended)

The fastest way to get started is using Docker with the pre-built image from Docker Hub:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/Automedon.git
cd Automedon

# 2. (Optional) Customize configuration
cp .env.example .env
# Edit .env with your settings

# 3. Start the application
docker compose up -d

# 4. Access at http://localhost:3000
```

### Local Development

```bash
# Navigate to web application
cd src/app/web

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Build & Deploy

```bash
# For Docker Hub deployment
./build-scripts/shell/build-and-push.sh  # Linux/Mac
build-scripts\shell\build-and-push.bat   # Windows
```

For detailed setup instructions, see the [Setup Guide](docs/setup.md).

---

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](docs/) directory:

- [Setup Guide](docs/setup.md) - Development environment setup
- [Docker Deployment](docs/docker/DOCKER.md) - Docker deployment guide
- [Architecture](docs/architecture.md) - System architecture & design patterns
- [Best Practices](docs/best-practices.md) - Coding standards & guidelines
- [Features](docs/features.md) - Current & planned features
- [Troubleshooting](docs/troubleshooting.md) - Common issues & solutions

See the full [Documentation Index](docs/README.md) for all available guides.

---

## 📁 Project Structure

```
Automedon/
├── build-scripts/              # Build automation scripts
│   ├── docker/                 # Docker files and compose configs
│   └── shell/                  # Shell scripts for building and publishing
├── docs/                       # Comprehensive documentation
│   ├── docker/                 # Docker-specific documentation
│   └── examples/               # Example configurations
├── portfolio-data/             # Portfolio content (localized)
│   ├── ar/, de/, en/, fr/     # Language-specific data
│   └── diagrams/               # Shared visual assets
├── src/app/web/                # Next.js application
│   ├── src/app/                # App Router pages and API routes
│   ├── src/components/         # React components (40+)
│   ├── src/contexts/           # React Context providers
│   └── src/utils/              # Utility functions
├── docker-compose.yml          # Easy deployment (latest image)
├── .env.example                # Environment configuration template
└── README.md                   # This file
```

---

## 🚀 Features

### ✅ Implemented
- 🌐 **Multilingual support** with 4 languages (EN, FR, DE, AR) and RTL layout
- 📱 **Responsive design** with modern glass morphism UI
- 💼 **Portfolio showcase** with markdown project descriptions and detailed dialogs
- 🎨 **Technology icons** with base64/URL support and smart fallbacks
- ♿ **Accessibility** with screen reader support and ARIA labels
- 🎭 **Theme switching** (dark/light mode)
- 📊 **Skills categorization** with interactive technology cards

### 🚧 In Progress / Planned
- ⚡️ Interactive AI chatbot that speaks only from your data (UI ready)
- 🧠 Copy-paste job description and check compatibility with your profile
- 🧭 Answers about your experiences, skills, values, and team style
- 💬 Suggests follow-up questions to guide recruiters
- 🔐 Private data gating (e.g., reveal certain info only upon verified email)
- 📊 Admin dashboard to preview and monitor AI answers
- 🗓️ Leave a message or schedule a meeting
- 🧬 Future: AI adapts responses to recruiter's company context
- 📈 Analytics dashboard to track recruiter interactions
- 🧪 Debug mode to inspect chatbot response context

---

## 🛣️ Roadmap

### Phase 0: Foundation ✅ COMPLETED
- [x] Build React/Next.js portfolio layout
- [x] Define schema type for CV and personal data
- [x] Multilingual support (EN, FR, DE, AR)
- [x] RTL layout support for Arabic
- [x] Enhanced project showcase with markdown
- [x] Accessibility features and screen reader support
- [x] Technology icon system with multiple formats
- [x] Glass morphism UI design

### Phase 1: UI Development ✅ COMPLETED
- [x] Portfolio sections (Hero, Work, About, Contact)
- [x] Theme switching (dark/light mode)
- [x] Responsive design
- [x] Project details dialog
- [x] Language switcher
- [x] WIP dialog for AI assistant

### Phase 2: Interaction Layer 🚧 IN PROGRESS
- [ ] Add sandboxed chatbot using OpenAI API
- [ ] Multilingual AI responses
- [ ] Admin dashboard for response preview & logs
- [ ] Restrict private data unless verified
- [ ] Debug mode for inspecting AI behavior

<!-- ### Phase 3: Smart Matching
- [ ] Job description parser + semantic matching
- [ ] Recruiter company-profile-aware responses
- [ ] Schedule meeting & leave a message modules
- [ ] Analytics dashboard for questions and usage

### Phase 4: AI Optimization
- [ ] Embeddings + vector search for better retrieval
- [ ] Feedback loop to refine answers over time
- [ ] LinkedIn and GitHub sync -->

---

## Tech Stack

- **Frontend**: React 19, Next.js 15 (App Router), TypeScript 5
- **Styling**: Tailwind CSS 4 with RTL support
- **UI Components**: Radix UI (40+ accessible primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React with custom base64/URL support
- **Data**: JSON-based with multilingual support (4 languages)
- **Backend**: Next.js API Routes
- **AI**: Planned - OpenAI API (GPT-4 with structured prompt injection)
- **Storage**: JSON portfolio data + later vector DB (Qdrant/Pinecone)
- **Auth**: Planned - Token/email-based data gating
- **Analytics**: Planned - TBD (PostHog, Plausible, custom)
- **Deployment**: Vercel-ready

---

## Why Automedon?

In the age of AI, static resumes are no longer enough. Recruiters want quick insights, compatibility answers, and personality assessments — **without reading a wall of text**. Automedon is your **living, breathing portfolio** that speaks for you — literally.

Whether you're offline, asleep, or just focused — **Automedon speaks your truth** and helps others discover your full professional potential.

---

## Current Phase

- [x] Brainstorming
- [x] Feature Scoping
- [x] Schema Design
- [x] Initial Layout/Wireframe
- [x] UI Development
- [x] Multilingual Support
- [x] Enhanced Project Showcase
- [x] Accessibility Implementation
- [ ] AI Backend Integration 🔄 NEXT

---

## Contributing

This project is currently personal and under early development, but contributors are welcome to observe or fork for inspiration. As it evolves, contribution guidelines and issues will be opened.

---

> Like it? Fork it. Inspired? Build your own.  
> Automedon is open-source, professional, and personal — just like you.
