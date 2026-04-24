# TESTING_POLICY

## Standard
Use **Vitest** as the single test runner.

Do not introduce `bun:test` or random parallel test stacks.

## What to test first
1. intake normalizers
2. validation rules
3. status gating
4. tracked redirect helpers
5. data mapping contracts

## What to avoid
- flaky external dependency tests by default
- tests that require live third-party APIs just to pass locally
- fake coverage with weak fixtures or `as any` garbage

## Recommended structure
- `__tests__/lib/*.test.ts`
- `__tests__/api/*.test.ts`
- fixtures/helpers for valid broker objects

## CI intent
Eventually the repo should run:
- typecheck
- lint
- Vitest
- build

## Notes
Testing should harden the real system boundaries:
intake, mapping, gating, routing, and publish decisions.
