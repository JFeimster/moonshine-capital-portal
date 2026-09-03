# Route Map

## Canonical public route strategy

The public partner profile URL is:

`/<partner-slug>`

Example:

`https://capital.distilledfunding.com/darwin-hanneman`

`/directory/[slug]` is a legacy compatibility route and permanently redirects to the top-level canonical partner URL.

## Current public routes

- `/` — homepage / positioning
- `/about` — network/platform explanation
- `/contact` — routing page for funding, advisor discovery, and support paths
- `/faq` — common funding/advisor questions
- `/directory` — primary advisor discovery index
- `/brokers` — advisor network index
- `/<slug>` — canonical public partner/funding page
- `/directory/[slug]` — legacy compatibility redirect to `/<slug>`
- `/apply` — application path selector
- `/apply/fast` — full/direct funding application path
- `/apply/quote` — personalized funding intake path
- `/onboarding` — Funding Agent Join
- `/onboarding/profile` — Funding Agent profile enrichment
- `/onboarding/launch` — Funding Agent launch-plan step
- `/industries` and `/industries/[slug]` — current industry discovery layer
- `/funding-types` and `/funding-types/[slug]` — current funding-type discovery layer
- `/terms` — terms/disclosures
- `/privacy` — privacy disclosures

## Internal / operator routes

- `/portal/*` — partner operating layer
- `/admin/*` — internal control layer
- `/access` — interim protected-route access boundary

## Tracking / intake infrastructure

- `/go/[slug]` — canonical registry tracked redirect path
- `/out` — older broker CTA compatibility route; remaining migration is tracked in issue #85
- `POST /api/webhooks/tally` — canonical raw Tally webhook receiver
- `/api/intake/tally/application` — trusted normalized Funding Agent compatibility endpoint
- `/api/intake/tally/profile` — trusted normalized profile compatibility endpoint

## Architecture

Canonical operational path:

Tally → Next.js/Vercel application logic → Notion

- n8n is optional downstream orchestration, not canonical normalization.
- Wix is optional downstream compatibility/publishing only.

## Deferred public expansion

The following should be added only when there is enough differentiated utility/content to justify them:

- `/states`
- `/states/[slug]`
- `/compare/[slug]`

Do not create thin routes simply to increase route count.

## Current execution dependencies

- issue #85 — complete remaining `/out` → `/go/[slug]` migration
- issue #34 — remaining Tally/app/Notion partner schema reconciliation
- issue #40 — continue broker profile resource-hub utility work
- issue #53 — remaining public application conversion hardening
