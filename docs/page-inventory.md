# Page Inventory

## Public pages

| Route | Status | Role |
|---|---|---|
| `/` | active | Homepage / positioning / primary conversion entry |
| `/about` | active | Explain the network and operating philosophy |
| `/contact` | active | Route users to funding intake, advisor discovery, or FAQ |
| `/faq` | active | Answer common funding/advisor questions |
| `/directory` | active | Primary advisor discovery index |
| `/brokers` | active | Advisor network index |
| `/<partner-slug>` | **canonical** | Public partner/funding page with attribution and utility |
| `/directory/[slug]` | legacy redirect | Permanently redirects to canonical `/<partner-slug>` |
| `/apply` | active | Funding intake path selector |
| `/apply/fast` | active | Broader/full funding application path |
| `/apply/quote` | active | Personalized funding intake path |
| `/onboarding` | active | Funding Agent Join |
| `/onboarding/profile` | active | Funding Agent profile enrichment |
| `/onboarding/launch` | active | Funding Agent launch-plan step |
| `/industries` | active | Industry discovery hub |
| `/industries/[slug]` | active | Industry-specific discovery |
| `/funding-types` | active | Funding-type discovery hub |
| `/funding-types/[slug]` | active | Funding-type-specific discovery |
| `/terms` | active | Terms/disclosures |
| `/privacy` | active | Privacy disclosures |

## Partner / operator pages

| Route | Status | Role |
|---|---|---|
| `/portal` | active scaffold | Broker/operator home |
| `/portal/tools` | active | Registry-backed broker tools |
| `/portal/resources` | active | Registry-backed broker resources |
| `/portal/profile` | active | Broker profile utility/recommendation surface |
| `/portal/tracking` | active scaffold | Partner tracking surface |
| `/admin` | active scaffold | Operator control home |
| `/admin/applications` | active | Application intake map |
| `/admin/brokers` | active | Broker utility/profile coverage |
| `/admin/tools` | active | Tool coverage |
| `/admin/resources` | active | Resource coverage |
| `/admin/tracking` | active | Tracking system status |
| `/access` | active interim | Protected-route access boundary |

## Infrastructure routes

- `/go/[slug]` — canonical registry redirect/tracking path
- `/out` — compatibility broker CTA redirect pending issue #85 migration
- `POST /api/webhooks/tally` — canonical raw Tally ingestion
- `/api/intake/tally/application` — trusted normalized compatibility intake
- `/api/intake/tally/profile` — trusted normalized profile compatibility intake

## Canonical partner route decision

Exactly one public partner URL should be promoted, indexed, linked, and emitted in structured metadata:

`/<partner-slug>`

The older `/directory/[slug]` route remains only as a permanent redirect so existing shared links do not break.

## Deferred routes

Add only when they can carry meaningful differentiated utility/content:

- `/states`
- `/states/[slug]`
- `/compare/[slug]`

## Current build sequence

1. #85 — finish tracked CTA migration
2. #34 — remaining canonical partner schema reconciliation
3. #29 — verify/finish broker gating
4. #4 — expand broker data model
5. #40 — continue public profile resource-hub utility
6. #53 — remaining application conversion UX
7. #118 — health/observability after public-route completion
