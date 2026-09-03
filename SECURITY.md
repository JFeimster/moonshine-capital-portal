# Security Policy

## Supported code

Security fixes target the current `main` branch.

## Reporting a vulnerability

Do not post secrets, credentials, private customer data, exploit details, or sensitive configuration in a public issue.

Use GitHub's private vulnerability/security reporting surface for this repository when available. Include:

- affected route, component, or workflow
- reproduction steps
- expected vs. actual behavior
- impact
- suggested mitigation if known

## Secret handling

- Never commit `.env`, `.env.local`, API keys, webhook signing secrets, database IDs that are intended to remain private, session secrets, or Vercel tokens.
- Keep examples in `.env.example` as placeholders only.
- `VERCEL_OIDC_TOKEN` and local/generated tokens must never be committed.
- Public webhook routes must fail closed when required authentication/signature configuration is missing.
- Error responses and logs must not expose secrets, stack traces, raw sensitive payloads, or private integration configuration.

## Architecture boundary

Canonical operational flow is Tally → Next.js/Vercel application logic → Notion. n8n may orchestrate downstream work. Wix is optional downstream compatibility only.
