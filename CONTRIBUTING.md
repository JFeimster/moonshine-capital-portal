# Contributing

## Before starting

1. Check the canonical roadmap in GitHub issue #35.
2. Work from a focused issue. Material feature, architecture, data-pipeline, security, or operational automation PRs should reference that issue.
3. Keep PRs narrow. Split unrelated work instead of growing a branch indefinitely.

## Architecture

Current source-of-truth direction:

- Tally: intake
- Next.js/Vercel: application logic, public UX, portal/admin, tracking, canonical webhook normalization
- Notion: operational CRM/source of truth
- n8n: optional downstream orchestration
- Wix: optional downstream compatibility/publish adapter only

Do not reintroduce Wix-first or n8n-as-canonical-normalizer assumptions.

## Local setup

Use the committed pnpm version and lockfile:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

`pnpm check` is the canonical quality gate for typecheck, lint, data validation, internal-link validation, and tests.

## Data and schemas

Checked-in registries are application data. Update their schemas/validation when the current data contract genuinely changes; do not bypass validation in page components.

## Security and secrets

- Copy `.env.example` to a local env file as needed; never commit real values.
- Never commit API keys, signing secrets, session secrets, Vercel tokens, raw sensitive webhook payloads, or customer PII.
- Preserve approval/publication gates and protected-route authorization boundaries.

## Pull requests

PRs should include:

- issue reference (`Closes #...` or `Refs #...`)
- concise scope summary
- validation performed
- architecture/security notes when relevant
- explicit out-of-scope items when they prevent scope drift
