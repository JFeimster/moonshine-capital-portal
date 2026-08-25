# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js front-end and application layer for broker discovery, partner onboarding, tracked routing, embedded tools, and the future Funding Agent OS experience.

It is no longer being treated as a Wix-first project.

The current direction is:
- **Tally** for intake
- **Notion** for canonical partner CRM and durable lifecycle state
- **Vercel / Next.js** for app logic, public UX, tracking, portal, and admin
- **Wix** as an optional compatibility/publish-read layer where useful

---

## 🚀 Purpose

Moonshine Capital Portal exists to:
- help business owners discover relevant funding partners faster
- onboard Funding Agents into a structured system
- assign and preserve canonical partner identity
- route outbound clicks through trackable infrastructure
- evolve into **Funding Agent OS**, a working environment for agents and admins

---

## 🏗️ Current Architecture

```text
Tally / normalized intake
→ Next.js intake routes
→ canonical partner identity
→ durable Notion CRM upsert
→ automatic activation for clean Funding Agent submissions
→ public directory / profiles
→ optional Wix compatibility layer
```

### Current operational roles
- **Tally** = Funding Agent application + profile-builder intake
- **Next.js** = validation, normalization, identity, activation logic, public display, CTA routing
- **Notion CRM** = durable operational source of truth for canonical identity and lifecycle
- **Wix** = optional downstream/compatibility public-data adapter
- **n8n** = optional webhook automation/orchestration layer

---

## 🔄 Partner Lifecycle

### Canonical Funding Agent application

1. Funding Agent submission reaches `/api/intake/tally/application`
2. The server assigns `partner_type = funding_agent`
3. Input is validated and normalized
4. Canonical identity is resolved using `partner_id`, submission ID, then normalized email
5. New identities receive a persistent `partner_id`, `referral_code`, and `slug`
6. The partner is durably upserted in **Moonshine Capital Partners CRM**
7. Clean submissions become `approved + published`
8. Exceptions become `needs_review + draft`
9. Operator-imposed `suspended`, `rejected`, `hidden`, or `archived` states are not undone by retries

### Profile enrichment

`/api/intake/tally/profile` is update-only. It must match an existing canonical partner and blank-safely enriches that same record while preserving identity and lifecycle state.

### Public eligibility

Durable Notion profiles render publicly only when:

```text
approval_status = approved
AND
profile_status = published
```

Published Notion partners are merged into directory/list queries, with Wix retained as a compatibility source.

### Public routing

1. User lands on directory or partner profile
2. User clicks a CTA
3. CTA routes through `/out`
4. Existing attribution/tracking data is preserved
5. User is redirected to the destination

---

## 🗺️ Current Routes

### Public routes
- `/` — Homepage / positioning layer
- `/directory` — Partner/broker directory index
- `/directory/[slug]` — Individual profile pages
- `/<partner-slug>` — Canonical top-level public partner route foundation
- `/onboarding` — Partner onboarding page with Tally embed
- `/industries` and `/industries/[slug]`
- `/funding-types` and `/funding-types/[slug]`
- `/terms`
- `/privacy`

### Infrastructure routes
- `/out` — Centralized tracked redirect route
- `/api/intake/tally/application` — canonical Funding Agent application intake
- `/api/intake/tally/profile` — existing-partner profile enrichment

---

## 🧩 Core Partner Files

- `lib/brokers.ts` — public broker/partner abstraction and source merge
- `lib/notion.ts` — durable Notion persistence adapter
- `lib/field-mapping.ts` — canonical application-domain model
- `lib/intake-normalizers.ts` — identity/input normalization
- `lib/validation.ts` — intake validation
- `lib/status-gating.ts` — public compatibility gating
- `app/api/intake/tally/application/route.ts` — application + automatic activation
- `app/api/intake/tally/profile/route.ts` — update-only profile enrichment

---

## 📚 Canonical Docs

- [`docs/FIELD_MAPPING_CONTRACT.md`](./docs/FIELD_MAPPING_CONTRACT.md) — cross-system identity/field contract
- [`docs/NOTION_BROKER_CRM_SCHEMA.md`](./docs/NOTION_BROKER_CRM_SCHEMA.md) — durable CRM schema
- [`docs/TALLY_APPLICATION_SCHEMA.md`](./docs/TALLY_APPLICATION_SCHEMA.md) — Funding Agent intake mapping
- [`docs/TALLY_PROFILE_BUILDER_SCHEMA.md`](./docs/TALLY_PROFILE_BUILDER_SCHEMA.md) — profile enrichment mapping
- [`docs/AUTOMATIC_ACTIVATION.md`](./docs/AUTOMATIC_ACTIVATION.md) — activation/exception lifecycle
- [`docs/PARTNER_COMMAND_PROFILE_CONTRACT.md`](./docs/PARTNER_COMMAND_PROFILE_CONTRACT.md) — Partner Command ↔ Capital ownership boundary
- [`docs/data-model.md`](./docs/data-model.md) — app-facing public profile model
- [`docs/tracking-flow.md`](./docs/tracking-flow.md) — `/out` attribution flow

---

## 🛠️ Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Intake:** Tally Forms
- **CRM / Ops:** Notion
- **Automation:** n8n where useful
- **Compatibility publish/read layer:** Wix
- **Testing:** Vitest

---

## ⚙️ Environment Variables

### Required for durable Notion persistence

```env
NOTION_API_KEY=your_notion_api_key
NOTION_BROKER_DATABASE_ID=your_notion_database_id
```

### Other integrations

```env
N8N_CTA_WEBHOOK_URL=https://your-n8n-instance.com/webhook/cta
WIX_API_URL=https://your-wix-site.com/_functions/api
WIX_API_KEY=your_wix_api_key
WIX_SITE_ID=your_wix_site_id
```

Credentials are runtime secrets and must never be committed.

---

## ✅ Current Priorities

1. Keep Notion as canonical durable partner state
2. Preserve immutable `partner_id`, persistent referral code, and slug across retries/enrichment
3. Keep automatic activation safe by making review an exception path without weakening public gating
4. Keep Wix optional instead of making durable partner activation depend on a second synchronization
5. Keep CTA attribution centered on `/out`
6. Build Partner Command and distribution tooling on top of the canonical identity contract

---

## ⚠️ Notes

- This repo is **not** `moonshine-partner-marketplace`
- Do not restore Wix-first assumptions as the operational core
- Avoid catch-all PRs; prefer focused batches tied to explicit architecture contracts
- Do not bypass durable lifecycle fields merely because normal activation is automatic
