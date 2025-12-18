# Documentation Index

Welcome to the Automedon Portfolio documentation. This directory contains comprehensive guides for development, deployment, and maintenance.

## Getting Started

- [Setup Guide](setup.md) - Complete development environment setup instructions
- [Docker Deployment](docker/DOCKER.md) - Docker deployment guide with detailed configuration options
- [Docker Pre-built Setup](docker/DOCKER-PREBUILT-README.md) - Pre-built Docker deployment approach

## Development Documentation

### Core Guides
- [Architecture](architecture.md) - System architecture, design patterns, and technical decisions
- [Best Practices](best-practices.md) - Coding standards, development patterns, and quality guidelines
- [Dependencies](dependencies.md) - Package management, version control, and maintenance strategies
- [Git Guidelines](git.md) - Version control conventions and branching strategy

### Features & Maintenance
- [Features](features.md) - Current features and planned implementations
- [Troubleshooting](troubleshooting.md) - Common issues, debugging strategies, and solutions

## Examples & References

- [Portfolio Data Example](examples/portfolio-data.example.json) - Sample portfolio configuration file

## Quick Links

### Essential Commands
```bash
# Development
cd src/app/web
npm install
npm run dev

# Docker Deployment (easy)
docker compose up

# Docker Deployment (pre-built)
./build-scripts/shell/build-and-push.sh
docker compose -f build-scripts/docker/docker-compose.prebuilt.yml up
```

### Documentation Structure
```
docs/
├── README.md                          # This file
├── architecture.md                    # System architecture
├── best-practices.md                  # Development standards
├── dependencies.md                    # Package management
├── features.md                        # Feature specifications
├── git.md                             # Git conventions
├── setup.md                           # Development setup
├── troubleshooting.md                 # Issue resolution
├── docker/                            # Docker-specific documentation
│   ├── DOCKER.md
│   ├── DOCKER-PREBUILT-README.md
│   └── CLEANUP_REPORT.md
└── examples/                          # Example configurations
    └── portfolio-data.example.json
```

## Contributing

When contributing to this project:
1. Read the [Best Practices](best-practices.md) guide
2. Follow the [Git Guidelines](git.md) for commits
3. Refer to [Architecture](architecture.md) for design decisions
4. Update documentation when adding new features

## Need Help?

- Check [Troubleshooting](troubleshooting.md) for common issues
- Review [Setup Guide](setup.md) for environment problems
- Consult [Architecture](architecture.md) for system design questions
