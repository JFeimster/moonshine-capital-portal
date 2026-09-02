# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js application layer for broker discovery, Funding Agent onboarding, funding intake, tracked routing, embedded tools, portal/admin workflows, and the broader Funding Agent OS experience.

It is not a Wix-first project.

The current direction is:
- **Tally** for intake
- **Notion** for canonical operational state
- **Vercel / Next.js** for app logic, public UX, ingestion, tracking, portal, and admin
- **n8n** for optional downstream automation/orchestration where useful
- **Wix** as an optional compatibility/publish-read layer where useful

---

## 🚀 Purpose

Moonshine Capital Portal exists to:
- help business owners enter a useful funding-review flow
- onboard Funding Agents into a structured system
- create broker profiles worth sharing
- assign and preserve canonical partner identity
- route outbound clicks through trackable infrastructure
- evolve into **Funding Agent OS**, a working environment for agents and admins

---

## 🏗️ Current Architecture

```text
Tally raw FORM_RESPONSE
→ POST /api/webhooks/tally
→ signature verification + canonical normalization
→ form-specific application service
→ durable Notion persistence
→ operator-controlled lifecycle / review
→ public directory, profiles, portal, admin
→ optional downstream automation / compatibility adapters
```

### Current operational roles
- **Tally** = funding applicant + Funding Agent intake
- **Next.js** = raw webhook verification, normalization, identity, persistence orchestration, public display, CTA routing
- **Notion** = durable operational source of truth for partner lifecycle and Funding Leads
- **n8n** = optional downstream notifications, follow-up, external handoffs, retries, and orchestration
- **Wix** = optional downstream/compatibility public-data adapter

---

## 🔄 Funding Agent Lifecycle

### Canonical Join

1. Raw Tally submission reaches `/api/webhooks/tally`
2. Tally signature and form ID are verified
3. The server normalizes the canonical Join payload and assigns `partner_type = funding_agent`
4. Canonical identity is resolved using `partner_id`, submission ID, then normalized email
5. New identities receive persistent `partner_id`, `referral_code`, and `slug`
6. The partner is durably upserted in **Moonshine Capital Partners CRM**
7. New Join identities initialize as `needs_review + draft`
8. Profile enrichment updates that same record
9. Approval/publication remain explicit operator-controlled lifecycle states
10. Existing `approved/published`, `suspended`, `rejected`, `hidden`, or `archived` states are not silently replaced by a public form retry

### Profile enrichment

The canonical Profile form is update-only. It must match an existing canonical partner and blank-safely enriches that record while preserving identity and lifecycle state.

### Public eligibility

Durable Notion profiles render publicly only when:

```text
approval_status = approved
AND
profile_status = published
```

Published Notion partners are merged into directory/list queries, with Wix retained only as a compatibility source.

---

## 💵 Funding Applicant Flow

```text
dWvEqN — Step 1 funding intake
→ /api/webhooks/tally
→ Funding Leads
→ review / next-step decision

w4R2Ad — Step 2/full application when needed
→ /api/webhooks/tally
→ enrich the same Funding Lead when session_id is preserved
```

Funding Leads use `External Lead ID` for idempotent upsert. The raw Tally payload is not copied wholesale into Notion. Sensitive DOB/residential-address fields from the legacy-shaped full application are intentionally excluded from the Funding Leads projection.

---

## 🗺️ Current Routes

### Public routes
- `/` — Homepage / positioning layer
- `/directory` — Partner/broker directory index
- `/directory/[slug]` — Individual profile pages
- `/<partner-slug>` — Canonical top-level public partner route foundation
- `/apply` — Funding application hub
- `/apply/quote` — Canonical Step 1 funding intake
- `/apply/fast` — Broader/full funding application
- `/onboarding` — Funding Agent Join
- `/onboarding/profile` — Funding Agent profile enrichment
- `/onboarding/launch` — Post-profile operating plan
- `/industries` and `/industries/[slug]`
- `/funding-types` and `/funding-types/[slug]`
- `/terms`
- `/privacy`

### Infrastructure routes
- `/out` — centralized tracked redirect route
- `POST /api/webhooks/tally` — canonical raw Tally webhook receiver
- `POST /api/intake/tally/application` — trusted normalized Funding Agent Join compatibility route
- `POST /api/intake/tally/profile` — trusted normalized profile compatibility route

---

## 🧩 Core Files

- `lib/brokers.ts` — public broker/partner abstraction and source merge
- `lib/notion.ts` — durable partner Notion persistence adapter
- `lib/funding-leads.ts` — Funding Leads normalization/upsert adapter
- `lib/tally-webhook.ts` — raw Tally verification, form mappings, and normalization
- `lib/intake/funding-agent.ts` — shared Funding Agent Join/Profile lifecycle services
- `lib/field-mapping.ts` — canonical partner application-domain model
- `lib/intake-normalizers.ts` — identity/input normalization
- `lib/validation.ts` — trusted canonical intake validation
- `lib/status-gating.ts` — public eligibility compatibility gating

---

## 📚 Canonical Docs

- [`docs/WEBHOOKS.md`](./docs/WEBHOOKS.md) — raw Tally ingestion and compatibility endpoints
- [`docs/AUTOMATIONS_AND_WEBHOOKS.md`](./docs/AUTOMATIONS_AND_WEBHOOKS.md) — ingestion vs. downstream automation ownership
- [`docs/FIELD_MAPPING_CONTRACT.md`](./docs/FIELD_MAPPING_CONTRACT.md) — cross-system identity/field contract
- [`docs/NOTION_BROKER_CRM_SCHEMA.md`](./docs/NOTION_BROKER_CRM_SCHEMA.md) — durable partner CRM schema
- [`docs/TALLY_APPLICATION_SCHEMA.md`](./docs/TALLY_APPLICATION_SCHEMA.md) — Funding Agent Join mapping
- [`docs/TALLY_PROFILE_BUILDER_SCHEMA.md`](./docs/TALLY_PROFILE_BUILDER_SCHEMA.md) — profile enrichment mapping
- [`docs/AUTOMATIC_ACTIVATION.md`](./docs/AUTOMATIC_ACTIVATION.md) — activation/publication lifecycle
- [`docs/PARTNER_COMMAND_PROFILE_CONTRACT.md`](./docs/PARTNER_COMMAND_PROFILE_CONTRACT.md) — Partner Command ↔ Capital ownership boundary
- [`docs/tracking-flow.md`](./docs/tracking-flow.md) — `/out` attribution flow

---

## 🛠️ Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Intake:** Tally Forms
- **CRM / Ops:** Notion
- **Automation:** n8n where it adds downstream leverage
- **Compatibility publish/read layer:** Wix
- **Testing:** Vitest

---

## ⚙️ Environment Variables

### Required for durable Notion persistence

```env
NOTION_API_KEY=your_notion_api_key
NOTION_BROKER_DATABASE_ID=your_broker_database_id
NOTION_FUNDING_LEADS_DB_ID=your_funding_leads_database_id
```

### Tally webhook verification

```env
TALLY_SIGNING_SECRET=your_tally_signing_secret
TALLY_WEBHOOK_SECRET=your_trusted_intake_secret
```

`TALLY_SIGNING_SECRET` is preferred for raw Tally HMAC verification. `TALLY_WEBHOOK_SECRET` remains the trusted normalized-route secret and is accepted as a migration fallback by the raw receiver.

Credentials are runtime secrets and must never be committed.

---

## ✅ Current Priorities

1. Keep Notion as canonical operational state
2. Preserve immutable partner identity and explicit publication controls
3. Keep Tally normalization in versioned/tested Next.js code
4. Keep the funding flow deliberately staged rather than forcing full underwriting data at first contact
5. Keep n8n optional and downstream of canonical persistence unless orchestration genuinely adds value
6. Keep Wix optional instead of making the system depend on a second CMS
7. Keep CTA attribution centered on `/out`
8. Build portal/admin/operator utility on top of these contracts

---

## ⚠️ Notes

- This repo is **not** `moonshine-partner-marketplace`
- Do not restore Wix-first assumptions as the operational core
- Avoid catch-all PRs; prefer focused batches tied to explicit architecture contracts
- Public form submission alone is never approval/publication authority
