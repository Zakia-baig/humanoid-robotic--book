# Quickstart Guide: Humanoid Robotics Book

## Overview
This guide provides step-by-step instructions to set up, develop, and deploy the Humanoid Robotics Book project.

## Prerequisites
- Node.js v20 or higher
- npm or yarn package manager
- Git
- A GitHub account (for deployment)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd robotic-book
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the project root with the following variables:

```env
# Better Auth Configuration
AUTH_SECRET=your-auth-secret-here
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Other environment variables
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run start
# or
yarn start
```

This will start the Docusaurus development server at `http://localhost:3000`.

## Project Structure
```
robotic-book/
├── docs/                    # MDX content for all 13 chapters
│   ├── chapter-01/
│   ├── chapter-02/
│   ├── ...
│   └── chapter-13/
├── src/
│   ├── components/          # React components for translation, personalization
│   ├── pages/               # Custom pages if needed
│   └── theme/               # Custom theme components
├── static/                  # Static assets (images, documents)
├── i18n/                    # Translation files (en/ur)
├── docusaurus.config.js     # Docusaurus configuration
├── sidebars.js              # Navigation configuration
└── package.json
```

## Adding Content

### 1. Creating a New Chapter
Create a new directory in the `docs/` folder:

```bash
mkdir docs/chapter-XX
```

Create an `index.md` file in that directory with frontmatter:

```md
---
title: Chapter Title
sidebar_position: XX
description: Brief description of the chapter
---

# Chapter Title

Your chapter content in MDX format...

## Section 1

Content for the first section...

## Section 2

Content for the second section...
```

### 2. Updating Navigation
Add the new chapter to `sidebars.js`:

```js
module.exports = {
  docs: [
    // ... existing chapters
    {
      type: 'category',
      label: 'Chapter Title',
      items: ['chapter-XX/index'],
    },
  ],
};
```

## Translation

### 1. Adding Urdu Translation
Create translation files in the `i18n/ur/docusaurus-plugin-content-docs/current/` directory following the same structure as the English content.

### 2. Content Translation
For each MDX file, create a corresponding Urdu translation with the same filename in the Urdu directory.

## Authentication and Personalization

### 1. User Signup with Background Questions
The authentication system collects user background information during signup, including:
- Robotics experience level
- Learning goals
- Technical background
- Specific interests

### 2. Personalization Implementation
The system uses user profile data to provide:
- Content recommendations
- Difficulty-level adjustments
- Customized learning paths

## Building for Production

### 1. Build the Static Site
```bash
npm run build
# or
yarn build
```

This creates a `build/` directory with the static site.

### 2. Preview Build Locally
```bash
npm run serve
# or
yarn serve
```

## Deployment to GitHub Pages

### 1. Configure GitHub Pages
1. Go to your repository Settings → Pages
2. Select "GitHub Actions" as the source

### 2. GitHub Actions Workflow
The repository includes a workflow in `.github/workflows/deploy.yml` that automatically deploys to GitHub Pages when changes are pushed to the main branch.

### 3. Manual Deployment
To deploy manually:
```bash
npm run deploy
# or
yarn deploy
```

## Testing

### 1. Running Tests
```bash
# Run all tests
npm test
# or
yarn test

# Run unit tests
npm run test:unit
# or
yarn run test:unit

# Run end-to-end tests
npm run test:e2e
# or
yarn run test:e2e
```

### 2. Test Structure
- Unit tests: Located in `tests/unit/`
- Integration tests: Located in `tests/integration/`
- E2E tests: Located in `tests/e2e/`

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Run tests
npm test

# Run linter
npm run lint

# Run linter with fix
npm run lint:fix

# Run type checking (if TypeScript is used)
npm run typecheck
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - The development server runs on port 3000 by default
   - To use a different port: `npm start -- --port 3001`

2. **Dependency conflicts**
   - Delete `node_modules/` and `package-lock.json`
   - Run `npm install` again

3. **Build fails**
   - Ensure all MDX files have proper syntax
   - Check that all referenced assets exist

### Getting Help
- Check the project documentation in the `docs/` directory
- Review the issue tracker for known issues
- Contact the development team for assistance