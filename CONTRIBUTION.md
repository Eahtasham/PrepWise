# Contribution Guide for PrepWise

Thank you for your interest in contributing to PrepWise! This guide will help you understand how to contribute to this open-source project effectively.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Submitting Changes](#submitting-changes)
8. [Feature Requests](#feature-requests)
9. [Bug Reports](#bug-reports)
10. [Documentation](#documentation)
11. [Community](#community)

## Code of Conduct

Before contributing, please read our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a friendly, safe, and welcoming environment for all contributors.

## Getting Started

1. **Fork the Repository**: Click the "Fork" button at the top right of the [repository page](https://github.com/eahtasham/prepwise).

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/prepwise.git
   cd prepwise
   ```

3. **Set Up Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/eahtasham/prepwise.git
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

5. **Set Up Environment Variables**: Create a `.env.local` file based on the `.env.example` template.

6. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Sync with Main Repository**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

3. **Make Your Changes**: Follow the coding standards and project structure.

4. **Commit Your Changes**:
   ```bash
   git commit -m "feat: add new interview type support"
   # or
   git commit -m "fix: resolve authentication edge case"
   ```

5. **Push to Your Fork**:
   ```bash
   git push origin your-branch-name
   ```

6. **Create a Pull Request**: Go to your fork on GitHub and click "New Pull Request".

## Project Structure

Key directories and their purposes:

- **`app/`**: Next.js App Router with pages, layouts, and API routes
  - `(auth)/`: Authentication pages
  - `(root)/`: Authenticated user dashboard and pages
  - `api/`: API routes
  - `interview/`: Interview-related pages

- **`components/`**: Reusable UI components
  - `custom/`: Feature-specific components
  - `ui/`: Base UI components (Shadcn UI)

- **`constants/`**: Application-wide constants
- **`contexts/`**: React Context providers
- **`firebase/`**: Firebase configuration
- **`lib/`**: Utility functions and server actions
- **`types/`**: TypeScript type definitions

## Coding Standards

1. **TypeScript**: Strict typing is enforced. Avoid `any` types.
2. **React**: Use functional components with hooks.
3. **Styling**: Use Tailwind CSS utility classes. Custom styles go in `globals.css`.
4. **Naming Conventions**:
   - Components: outside the custom should be PascalCase (e.g., `InterviewCard.tsx`)
   - Custom Components: file name should be kebab-case
   - Files: kebab-case for non-components (e.g., `auth.action.ts`)
5. **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `chore:` for maintenance tasks
6. **Imports**: Group and order imports as:
   ```typescript
   // 1. External libraries
   import React from 'react';
   // 2. Internal components
   import { InterviewCard } from '@/components/InterviewCard';
   // 3. Styles
   import styles from './styles.module.css';
   ```

## Testing

While we don't yet have a comprehensive test suite, please:

1. Manually test your changes thoroughly
2. Add appropriate TypeScript types
3. Document edge cases you've considered
4. Include screenshots for UI changes in your PR

We welcome contributions to add Jest/React Testing Library tests!

## Submitting Changes

1. Ensure your branch is up-to-date with `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your changes:
   ```bash
   git push origin your-branch-name
   ```

3. Create a Pull Request with:
   - Clear description of changes
   - Screenshots for UI changes
   - Steps to test
   - Related issue number (if applicable)

4. Respond to code review feedback promptly

## Feature Requests

1. Check existing issues to avoid duplicates
2. Open an issue with:
   - Clear description of the feature
   - Use case/benefits
   - Proposed implementation (if you have ideas)
   - Screenshots/mockups (for UI changes)

## Bug Reports

1. Check existing issues to avoid duplicates
2. Open an issue with:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots/error messages
   - Environment details (browser, OS, etc.)

## Documentation

We welcome improvements to:
- Code comments
- README files
- User documentation
- Developer guides
- TypeScript type definitions

## Community

Join our [Discord/Slack channel]() (to be added) to:
- Ask questions
- Discuss ideas
- Get help with contributions
- Meet other contributors

Thank you for helping make PrepWise better! 🚀