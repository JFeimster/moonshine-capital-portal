# Test organization

Vitest is the single test runner.

- `fixtures/` — typed shared model factories
- `security/` — focused authorization, redirect, webhook, and failure-mode regressions
- `api/`, `lib/`, `helpers/` — reserved for grouping when moving a suite materially improves clarity

Stable existing suites remain at the top level during the #116 foundation pass to avoid churn for churn's sake.
