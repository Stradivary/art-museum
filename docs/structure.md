# Project Structure

The project is organized for clarity, scalability, and maintainability.

## Root
- `src/` — Main source code
- `tests/` — All test files and mocks
- `public/` — Static assets
- `docs/` — Project documentation

## `src/` Breakdown
- `core/`
  - `domain/` — Entities and domain models
  - `application/` — Use cases (business logic)
  - `frameworks/` — API and data adapters
- `infrastructure/`
  - `repositories/` — Data access implementations
  - `services/` — Utilities (e.g., local storage, query client)
- `lib/` — Shared utilities and helpers
- `presentation/`
  - `components/` — UI components (features, shared, ui)
  - `hooks/` — Custom React hooks
  - `layouts/` — Layout components
  - `pages/` — Page-level components (if used)
  - `viewmodels/` — ViewModel hooks for MVVM
- `routes/` — App routes/pages (if using file-based routing)
- `styles/` — Global and base styles
- `types/` — Shared TypeScript types

## `tests/` Breakdown
- Mirrors the `src/` structure for easy navigation
- `__mocks__/` — Custom mocks for libraries and modules
- `integration/` — Integration tests

See [architecture.md](architecture.md) and [mvvm.md](mvvm.md) for more details on how the structure supports the app's patterns.
