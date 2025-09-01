# Git Guidelines & Version Control

This document outlines version control guidelines, branching strategies, and commit conventions for the Automedon portfolio project.

## Commit Message Convention

This project uses **Conventional Commits** with commitlint formatting. All commits must follow this standardized format.

### Commit Message Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- **feat**: A new feature for the user
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies

### Examples
```bash
feat: add AI chat interface with OpenAI integration
fix: resolve SSR hydration issue in ThemeProvider
docs: update architecture documentation
style: format component files with prettier
refactor: extract theme context logic into custom hook
perf: optimize image loading with Next.js Image component
test: add unit tests for utility functions
chore: update dependencies to latest versions
```

### Scope Examples
```bash
feat(ui): add new button variant for CTA
fix(theme): resolve dark mode toggle persistence
docs(api): add endpoint documentation
refactor(components): simplify card component structure
```

## Branching Strategy

### Main Branches
- **main**: Production-ready code, protected branch
- **develop**: Integration branch for features (if using GitFlow)

### Feature Branches
- **feature/**: New features (`feature/ai-chat-integration`)
- **fix/**: Bug fixes (`fix/theme-provider-ssr`)
- **refactor/**: Code refactoring (`refactor/component-architecture`)
- **chore/**: Maintenance tasks (`chore/update-dependencies`)

### Branch Naming Convention
```
<type>/<short-description>
```

**Examples:**
```
feature/ai-chat-popup
feature/project-carousel
fix/mobile-navigation
fix/theme-persistence
refactor/new-design
refactor/component-structure
chore/update-radix-ui
chore/setup-testing
```

### Branch Workflow
1. **Create branch** from main (or develop)
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-feature-name
   ```

2. **Make changes** and commit regularly
   ```bash
   git add .
   git commit -m "feat: add initial component structure"
   ```

3. **Push branch** and create pull request
   ```bash
   git push -u origin feature/new-feature-name
   ```

4. **Merge** after code review and testing

## Code Review Guidelines

### Pull Request Requirements
- [ ] **Clear title** following conventional commit format
- [ ] **Detailed description** of changes and reasoning
- [ ] **Tests pass** (lint, type check, unit tests)
- [ ] **No console errors** in development
- [ ] **Responsive design** tested on mobile/desktop
- [ ] **Accessibility** considerations addressed
- [ ] **Performance** impact considered

### Pull Request Template
```markdown
## Summary
Brief description of what this PR accomplishes.

## Changes
- List of key changes made
- Components added/modified
- New dependencies (if any)

## Testing
- [ ] Manual testing completed
- [ ] Unit tests added/updated
- [ ] Responsive design verified
- [ ] Accessibility checked

## Screenshots (if applicable)
Before/after screenshots for UI changes.

## Additional Notes
Any additional context or considerations.
```

## Protected Branch Rules

### Main Branch Protection
- **Require pull request reviews** before merging
- **Require status checks** to pass before merging
  - ESLint checks
  - TypeScript compilation
  - Jest tests (when added)
  - Build verification
- **Require branches to be up to date** before merging
- **Restrict pushes** that create files over 100MB
- **Require signed commits** (recommended)

### Status Check Requirements
```bash
# Required checks before merge
npm run lint      # ESLint validation
npm run build     # Build verification
npm run test      # Jest tests (when implemented)
```

## Git Workflow Best Practices

### Daily Workflow
```bash
# Start of day - sync with remote
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature

# Regular commits during development
git add .
git commit -m "feat: add component skeleton"
git commit -m "feat: implement component logic"
git commit -m "style: add responsive styles"

# End of day - push work
git push -u origin feature/your-feature
```

### Before Creating PR
```bash
# Ensure your branch is up to date
git checkout main
git pull origin main
git checkout feature/your-feature
git rebase main

# Run all checks locally
npm run lint
npm run build
npm run test

# Push final changes
git push origin feature/your-feature
```

## Repository Structure & File Organization

### Commit Organization
- **Atomic commits**: Each commit should represent a single logical change
- **Meaningful messages**: Descriptive commit messages that explain the "why"
- **Small PRs**: Keep pull requests focused and reviewable (< 500 lines when possible)

### File Staging Best Practices
```bash
# Stage specific files
git add src/components/NewComponent.tsx
git add src/types/interfaces.ts

# Review staged changes
git diff --cached

# Commit with conventional message
git commit -m "feat: add NewComponent with TypeScript interfaces"
```

## Version Tagging Strategy

### Semantic Versioning
Following semver format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Tags
```bash
# Create annotated tags for releases
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial portfolio launch"
git push origin v1.0.0
```

### Pre-release Tags
```bash
# Alpha/Beta releases
git tag -a v1.1.0-alpha.1 -m "Alpha release for AI chat feature"
git tag -a v1.1.0-beta.1 -m "Beta release for AI chat feature"
```

## Git Hooks & Automation

### Pre-commit Hooks (Recommended)
```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Configure pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

### Lint-staged Configuration
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,md}": [
      "prettier --write"
    ]
  }
}
```

### Commit Message Validation
```bash
# Install commitlint
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# Add commit-msg hook
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

## Common Git Commands

### Daily Operations
```bash
# Check status and current branch
git status
git branch

# View commit history
git log --oneline --graph --decorate

# Sync with remote
git fetch origin
git pull origin main

# Clean up merged branches
git branch --merged | grep -v main | xargs git branch -d
```

### Troubleshooting
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename
git reset --hard HEAD

# Interactive rebase (clean up commit history)
git rebase -i HEAD~3

# Force push after rebase (use carefully)
git push --force-with-lease origin feature-branch
```

## Repository Maintenance

### Regular Maintenance Tasks
- **Weekly**: Review and clean up merged branches
- **Monthly**: Update dependencies and run security audit
- **Per Release**: Create and push version tags
- **Quarterly**: Review and update git hooks and workflows

### Branch Cleanup
```bash
# Delete merged feature branches
git branch --merged main | grep -v main | xargs -n 1 git branch -d

# Delete remote tracking branches that no longer exist
git remote prune origin
```

### Security Considerations
- **Secrets**: Never commit API keys, passwords, or sensitive data
- **Large files**: Use Git LFS for assets over 100MB
- **History rewriting**: Avoid rewriting public history
- **Signed commits**: Enable GPG signing for verified commits

## Integration with GitHub/GitLab

### Issue Linking
```bash
# Link commits to issues
git commit -m "fix: resolve navigation bug (closes #123)"
git commit -m "feat: add new component (refs #124)"
```

### Automated Workflows
- **CI/CD**: Automated testing and deployment
- **Dependency updates**: Dependabot or Renovate integration
- **Security scanning**: CodeQL or similar tools
- **Performance monitoring**: Lighthouse CI for web vitals

## Quick Reference

### Essential Commands
```bash
git status                    # Check working directory status
git add .                     # Stage all changes
git commit -m "type: message" # Commit with conventional format
git push origin branch-name   # Push branch to remote
git pull origin main          # Pull latest from main
git checkout -b feature/name  # Create and switch to new branch
git merge main                # Merge main into current branch
git rebase main               # Rebase current branch onto main
```

### Conventional Commit Quick Guide
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructure
perf: performance improvement
test: testing
chore: maintenance
```