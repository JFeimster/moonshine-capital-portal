# AGENTS.md

## Project
`moonshine-capital-portal`

## What this repo is
A Next.js App Router project for:
- broker directory discovery
- broker profile pages
- Tally-powered onboarding
- tracked outbound CTA redirects
- future Funding Agent OS expansion

## What this repo is not
- not `moonshine-partner-marketplace`
- not a generic fintech template
- not a repo that should receive `src/app` marketplace scaffolds without adapting them to `app/`

## Build priorities
1. strengthen public directory UX
2. keep onboarding simple and conversion-oriented
3. preserve Wix-backed broker data abstraction
4. harden tracking and analytics flow
5. add taxonomy pages only when they support discovery

## Source-of-truth docs
- `docs/full-scaffold.md`
- `docs/route-map.md`
- `docs/page-inventory.md`
- `docs/data-model.md`
- `docs/wix-integration.md`
- `docs/tracking-flow.md`
- `docs/onboarding-flow.md`
- `docs/future-roadmap.md`
- `docs/seo-architecture.md`
- `docs/analytics-plan.md`
- `docs/admin-portal-plan.md`

## Guardrails
- keep public route additions tied to directory discovery, onboarding, tracking, or portal evolution
- avoid duplicate docs when a system-specific schema doc already exists
- prefer updating existing docs over creating overlapping files
- keep CTA routing centered on `/out` unless there is a strong reason to replace it
- keep page code dependent on `lib/brokers.ts`, not raw Wix fetch logic

## Recommended next build surfaces
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/faq/page.tsx`
- `app/apply/page.tsx`
- `app/states/page.tsx`
- `app/states/[slug]/page.tsx`
- `app/compare/[slug]/page.tsx`
- future `/portal` and `/admin`
