# Automedon — Your AI-Powered Digital Twin Portfolio

> *A modern, AI-infused portfolio experience where every interaction reveals who you are — professionally and personally.*

**Automedon** is not just a portfolio — it's your **AI-powered digital twin**. Recruiters and collaborators can interact with a smart chatbot that answers questions based solely on your CV, personal experiences, and professional history. From parsing job descriptions to evaluating personality traits, Automedon represents you with precision, authenticity, and professionalism.

Named after the legendary charioteer of Achilles, Automedon is your loyal, digital envoy — always ready to answer on your behalf.

---

## 🚀 Quick Start

### Docker Deployment (Recommended)

The fastest way to get started is using Docker:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/Automedon.git
cd Automedon

# 2. Start the application
docker compose up -d

# 3. Access at http://localhost:3000
```

**Customizing Portfolio Data:**

To customize your portfolio content without rebuilding the Docker image, use volume mounting:

1. Edit the `docker-compose.yml` file and uncomment the volume mount:
   ```yaml
   volumes:
     - ./portfolio-data:/app/portfolio-data:ro
   ```

2. Restart the container:
   ```bash
   docker compose down
   docker compose up -d
   ```

3. Edit your portfolio files in `portfolio-data/{locale}/portfolio.json` (en, fr, de, ar)

Changes to mounted files will be reflected immediately without rebuilding.

**Environment Configuration:**

Create a `.env` file to customize settings:

```env
PORTFOLIO_CONFIG_PATH=./portfolio-data
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_DEBUG_MODE=false
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

## ✨ Features

### Implemented
- **Multilingual Support**: 4 languages (EN, FR, DE, AR) with automatic locale discovery and RTL layout
- **Responsive Design**: Modern glass morphism UI optimized for all devices
- **Portfolio Showcase**: Markdown-powered project descriptions with detailed modal dialogs
- **Technology Icons**: Enhanced icon system with base64/URL support and smart fallbacks
- **Accessibility**: WCAG 2.1 compliant with screen reader support and ARIA labels
- **Theme System**: Dark/light mode with system preference detection
- **Skills Visualization**: Interactive categorized technology cards with hover effects
- **Docker Deployment**: Production-ready containerization with volume mounting support

### Planned
- **AI Chatbot**: Interactive assistant that answers questions based on your portfolio data
- **Job Compatibility**: Analyze job descriptions and check profile compatibility
- **CV Generation**: Automatically generate tailored CVs based on job descriptions
- **Motivation Letter Generation**: AI-powered cover letter creation customized for each position
- **Seamless Live Data Configuration**: Real-time portfolio updates without rebuilding or restarting
- **Private Data Gating**: Selective information reveal with email verification
- **Admin Dashboard**: Monitor AI responses and conversation analytics
- **Contact Features**: Message submission and meeting scheduling integration
- **Analytics**: Track visitor interactions and engagement metrics

---

## 💡 Why Automedon?

In the age of AI, static resumes are no longer enough. Recruiters want quick insights, compatibility answers, and personality assessments — **without reading a wall of text**. Automedon is your **living, breathing portfolio** that speaks for you — literally.

Whether you're offline, asleep, or just focused — **Automedon speaks your truth** and helps others discover your full professional potential.

---

## 🤝 Contributing

This project is currently personal and under early development, but contributors are welcome to observe or fork for inspiration. As it evolves, contribution guidelines and issues will be opened.

---

> Like it? Fork it. Inspired? Build your own.  
> Automedon is open-source, professional, and personal — just like you.
