# Development Guide

This guide will help you set up, develop, and contribute to the Art Museum App.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Modern browser

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. **Open the app:**
   Visit `http://localhost:5173` (or the port shown in your terminal).

## Scripts

- `dev`: Start the development server
- `build`: Build for production
- `preview`: Preview the production build
- `test`: Run tests with Vitest
- `lint`: Lint the codebase
- `format`: Format code with Prettier

## Linting & Formatting

- ESLint, Prettier, and Stylelint are configured.
- Run `npm run lint` and `npm run format` before committing.

## Environment Variables

- Use a `.env` file for secrets and environment-specific settings.
- Do **not** commit `.env` files (see `.gitignore`).

## Contributing

- Fork the repo and create a feature branch.
- Write tests for new features.
- Open a pull request with a clear description.

See [Testing](testing.md) for more details on the test setup.
