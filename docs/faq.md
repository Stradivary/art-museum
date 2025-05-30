# FAQ

**Q: How do I add a new feature?**

- Create a new use case in `core/application` if business logic is needed.
- Add or update a repository in `infrastructure/repositories` for data access.
- Create a ViewModel hook in `presentation/viewmodels`.
- Build UI components in `presentation/components`.
- Write tests in the corresponding `tests/` folder.

**Q: Where do I put shared utilities?**

- Use the `lib/` directory for helpers and utilities used across the app.

**Q: How do I mock dependencies in tests?**

- Use `vi.mock()` and place custom mocks in `tests/__mocks__/`.

**Q: How do I run the app in production mode?**

```bash
npm run build && npm run preview
```

**Q: How do I update documentation?**

- Edit or add files in the `docs/` folder. Update the main `README.md` as needed.

**Q: What is the MVVM pattern?**

- See [mvvm.md](mvvm.md) for a full explanation.

For more, see the other docs or open an issue.
