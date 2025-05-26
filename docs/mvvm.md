# MVVM Pattern in Art Museum App

The app uses the **Model-View-ViewModel (MVVM)** pattern to separate concerns and improve testability and maintainability.

## MVVM Layers
- **Model**: Domain entities and business logic (in `core/domain` and `core/application`)
- **ViewModel**: State and logic for UI, interacts with use cases and repositories (in `presentation/viewmodels`)
- **View**: React components (in `presentation/components`)

## How It Works
- **ViewModels** expose hooks (e.g., `useArtworkDetailViewModel`) that the UI uses to get data and trigger actions.
- **Use Cases** encapsulate business logic and interact with repositories.
- **Repositories** abstract data sources (API, local storage, etc.).

## Example Flow
1. UI calls a ViewModel hook (e.g., to fetch artwork details).
2. ViewModel uses a use case (e.g., `GetArtworkByIdUseCase`).
3. Use case calls a repository (e.g., `ArtworkRepositoryImpl`).
4. Repository fetches data from API or local storage.
5. Data flows back up to the ViewModel, then to the UI.

## Benefits
- Decouples UI from business logic and data sources
- Makes testing easier (mock ViewModels/use cases)
- Encourages single-responsibility and modular code

See [architecture.md](architecture.md) for the big picture and [structure.md](structure.md) for file locations.
