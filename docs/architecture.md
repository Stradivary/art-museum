# Architecture Overview

The Art Museum App is built with a modular, scalable architecture using modern frontend technologies and best practices.

## Key Technologies
- **React** (with hooks and functional components)
- **TypeScript** (type safety)
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling)
- **MVVM Pattern** (Model-View-ViewModel)
- **React Query** (data fetching and caching)
- **Vitest** (testing)

## Directory Structure
- `src/` — Main source code
  - `core/` — Domain logic, use cases, entities
  - `infrastructure/` — Data access, services, repositories
  - `lib/` — Utilities and helpers
  - `presentation/` — UI components, hooks, viewmodels
  - `routes/` — App routes/pages
  - `styles/` — Global styles
  - `types/` — Shared TypeScript types
- `tests/` — Unit and integration tests
- `public/` — Static assets

## Layered Approach
- **Core**: Pure business logic, entities, and use cases (framework-agnostic)
- **Infrastructure**: Implements data access (APIs, local storage)
- **Presentation**: UI, state management, and user interaction

## Dependency Flow
```
core → infrastructure → presentation
```
- Core has no dependencies on infrastructure or presentation.
- Infrastructure depends on core.
- Presentation depends on both core and infrastructure.

See [MVVM Pattern](mvvm.md) for details on the app's state management and separation of concerns.
