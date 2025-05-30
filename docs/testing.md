# Testing

The Art Museum App uses **Vitest** for unit and integration testing. Mocks and test utilities are provided for external dependencies and hooks.

## Test Structure

- All tests are in the `tests/` directory, mirroring the source structure.
- Mocks for libraries (e.g., `react-router`, `framer-motion`) are in `tests/__mocks__/`.
- Each feature, hook, and component has its own test file.

## Running Tests

```bash
npm run test
# or
yarn test
```

## Mocking

- Use `vi.mock()` to mock modules and dependencies.
- Custom mocks are provided for common libraries and hooks.

## Coverage

- Coverage reports are generated in the `coverage/` directory.
- See the badge in the main `README.md` for current coverage status.

## Best Practices

- Write tests for all new features and bug fixes.
- Use descriptive test names and group related tests with `describe`.
- Mock external dependencies to isolate unit tests.

See the `tests/` folder and [development.md](development.md) for more details.
