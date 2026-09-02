# TESTING_POLICY

## Standard
Use **Vitest** as the single test runner.

Do not introduce `bun:test` or random parallel test stacks.

Use **pnpm** as the repository package manager. The committed lockfile is authoritative and CI installs with `pnpm install --frozen-lockfile`.

## Quality gate
Run:

```bash
pnpm check
```

The #116 quality gate runs type checking, linting, and Vitest. Data/schema validation will join this gate when the dedicated #115 validation work lands.

Run `pnpm build` separately for the production Next.js build; CI runs it after the quality gate.

## What to test first
1. intake normalizers
2. validation rules
3. status gating
4. tracked redirect helpers
5. webhook and authorization rejection paths
6. adapter outage/fallback behavior

## What to avoid
- flaky external dependency tests by default
- tests that require live third-party APIs just to pass locally
- fake coverage with weak fixtures or `as any` garbage

## Recommended structure
- `__tests__/lib/*.test.ts`
- `__tests__/api/*.test.ts`
- `__tests__/security/*.test.ts`
- `__tests__/fixtures/*`
- `__tests__/helpers/*`

Keep stable tests where they are unless moving them materially improves clarity. Prefer typed fixture factories for canonical application models.

## Notes
Testing should harden the real system boundaries: intake, mapping, gating, routing, authorization, and publish decisions.
