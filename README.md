# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js front-end and application layer for broker discovery, partner onboarding, tracked routing, embedded tools, and the future Funding Agent OS experience.

It is no longer being treated as a Wix-first project.

The current direction is:
- **Tally** for intake
- **Notion** for broker CRM and operational workflow
- **Vercel / Next.js** for app logic, public UX, tracking, portal, and admin
- **Wix** as an optional downstream publish/read layer where useful

---

## 🚀 Purpose

Most founders waste time talking to the wrong lenders, the wrong brokers, or the wrong capital paths.

Moonshine Capital Portal exists to:
- help business owners discover relevant funding partners faster
- onboard brokers into a structured system instead of a loose affiliate mess
- route outbound clicks through trackable infrastructure
- evolve into **Funding Agent OS**, a working environment for agents and admins

In the long term, this codebase is the front-end and systems layer for:
- broker discovery
- partner recruitment
- intake normalization
- lead routing
- click attribution
- embedded calculators and tools
- future authenticated `/portal` and `/admin` experiences

---

## 🏗️ Current Architecture

This application uses a modular architecture where **Next.js** is the presentation, routing, API, and application layer.

## Current system direction

```text
Tally → n8n / Next.js intake routes → Notion CRM → approval workflow → optional Wix publish layer → public directory / profiles
```

### Current operational roles
- **Tally** = broker application + profile-builder intake
- **Next.js** = route handling, normalization, validation, broker display, CTA routing, future portal/admin
- **Notion CRM** = operational source of truth for broker lifecycle and approvals
- **Wix** = optional downstream publish/read adapter for public broker data
- **n8n** = webhook automation and orchestration layer

### Why this matters
This keeps intake, approval, and ops under your control instead of forcing the entire system to revolve around one CMS.

---

## 🔄 Current Data Flow

### Intake flow
1. Broker submits an application through a Tally form
2. Broker may later submit a profile-builder form for richer public profile data
3. Intake payloads are normalized through Next.js routes and/or n8n
4. Broker record is stored/updated in Notion CRM
5. Approved broker records may optionally be published to Wix for public-facing read support
6. Public surfaces render broker data and route outbound clicks through `/out`

### Public routing flow
1. User lands on broker directory or broker profile
2. User clicks a CTA
3. CTA routes through `/out`
4. Tracking payload is logged / forwarded
5. User is redirected to the broker destination

---

## 🗺️ Current Routes

### Public routes
- `/` — Homepage / positioning layer
- `/directory` — Broker directory index
- `/directory/[slug]` — Individual broker profile pages
- `/onboarding` — Partner onboarding page with live Tally embed
- `/industries` — Industry discovery hub
- `/industries/[slug]` — Industry-specific discovery page
- `/funding-types` — Funding specialty discovery hub
- `/funding-types/[slug]` — Funding-type-specific discovery page
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy

### Internal / infrastructure routes
- `/out` — Centralized tracked redirect route for CTA clicks
- `/api/intake/tally/application` — intake endpoint for application submissions
- `/api/intake/tally/profile` — intake endpoint for profile-builder submissions

### Planned future routes
- `/portal`
- `/portal/tools`
- `/portal/resources`
- `/portal/profile`
- `/portal/tracking`
- `/admin`
- `/admin/submissions`
- `/admin/brokers`
- `/admin/logs`
- `/admin/settings`

---

## 🧩 Current Core Files

### App routes
- `app/page.tsx`
- `app/directory/page.tsx`
- `app/directory/[slug]/page.tsx`
- `app/onboarding/page.tsx`
- `app/industries/page.tsx`
- `app/industries/[slug]/page.tsx`
- `app/funding-types/page.tsx`
- `app/funding-types/[slug]/page.tsx`
- `app/out/route.ts`
- `app/terms/page.tsx`
- `app/privacy/page.tsx`
- `app/api/intake/tally/application/route.ts`
- `app/api/intake/tally/profile/route.ts`

### Core libraries
- `lib/brokers.ts`
- `lib/wix.ts`
- `lib/mock-brokers.ts`
- `lib/utils.ts`
- `lib/types.ts`
- `lib/field-mapping.ts`
- `lib/intake-normalizers.ts`
- `lib/validation.ts`
- `lib/status-gating.ts`
- `lib/notion.ts`
- `lib/publish-broker.ts`

### Core components
- `HeroSection.tsx`
- `BrokerCard.tsx`
- `DirectoryClient.tsx`
- `ProfileHero.tsx`
- `CTASection.tsx`
- `SectionHeading.tsx`
- `TallyEmbedSection.tsx`

---

## 📚 Core Docs

### Architecture / planning
- [`docs/full-scaffold.md`](./docs/full-scaffold.md)
- [`docs/route-map.md`](./docs/route-map.md)
- [`docs/page-inventory.md`](./docs/page-inventory.md)
- [`docs/data-model.md`](./docs/data-model.md)
- [`docs/future-roadmap.md`](./docs/future-roadmap.md)
- [`docs/seo-architecture.md`](./docs/seo-architecture.md)
- [`docs/analytics-plan.md`](./docs/analytics-plan.md)
- [`docs/admin-portal-plan.md`](./docs/admin-portal-plan.md)

### Intake / schema / workflow docs
- [`docs/FIELD_MAPPING_CONTRACT.md`](./docs/FIELD_MAPPING_CONTRACT.md)
- [`docs/TALLY_APPLICATION_SCHEMA.md`](./docs/TALLY_APPLICATION_SCHEMA.md)
- [`docs/TALLY_PROFILE_BUILDER_SCHEMA.md`](./docs/TALLY_PROFILE_BUILDER_SCHEMA.md)
- [`docs/NOTION_BROKER_CRM_SCHEMA.md`](./docs/NOTION_BROKER_CRM_SCHEMA.md)
- [`docs/WIX_BROKERPROFILE_SCHEMA.md`](./docs/WIX_BROKERPROFILE_SCHEMA.md)
- [`docs/WEBHOOKS.md`](./docs/WEBHOOKS.md)
- [`docs/RUNBOOK.md`](./docs/RUNBOOK.md)
- [`docs/onboarding-flow.md`](./docs/onboarding-flow.md)
- [`docs/tracking-flow.md`](./docs/tracking-flow.md)
- [`docs/wix-integration.md`](./docs/wix-integration.md)

### Canonical doc roles
- `docs/FIELD_MAPPING_CONTRACT.md` = cross-system contract
- `docs/NOTION_BROKER_CRM_SCHEMA.md` = operational CRM source-of-truth schema
- `docs/WIX_BROKERPROFILE_SCHEMA.md` = optional publish/read schema for Wix
- `docs/WEBHOOKS.md` = intake/webhook flow and failure modes
- `docs/RUNBOOK.md` = operational recovery and manual rescue procedures

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Intake:** Tally Forms
- **CRM / Ops:** Notion
- **Automation:** n8n
- **Optional publish/read layer:** Wix
- **Testing:** Vitest

---

## ⚙️ Environment Variables

### Required soon
```env
N8N_CTA_WEBHOOK_URL=https://your-n8n-instance.com/webhook/cta
NOTION_API_KEY=your_notion_api_key
NOTION_BROKER_DATABASE_ID=your_notion_database_id
```

### Optional / adapter-specific
```env
WIX_API_URL=https://your-wix-site.com/_functions/api
WIX_API_KEY=your_wix_api_key
WIX_SITE_ID=your_wix_site_id
```

### Current intent
- The app should not depend on Wix to function as the operational core
- Wix credentials should only be needed where the optional adapter path is enabled
- Development-safe fallback behavior can still exist where appropriate

---

## 📈 Near-Term Roadmap

### Phase 1 — lock the data contract
- finalize field mapping contract
- align Tally application + profile-builder flows
- align Notion CRM properties
- make intake payload contract explicit

### Phase 2 — harden ingestion
- finish intake normalization and validation
- wire Notion adapter for live writes
- keep status gating enforced for public broker display
- ensure profile intake does not auto-publish publicly before approval

### Phase 3 — optional publish/output layer
- wire thin Wix adapter for optional public publish/read support
- keep Wix isolated from core intake/CRM logic

### Phase 4 — utility and monetization
- build embed registry
- add calculators, widgets, GPT/AI tools, and partner utilities
- expand tracked discovery and attribution infrastructure

### Phase 5 — internal operating system
- add `/portal`
- add `/admin`
- add broker workflow controls, approvals, resources, and tracking views

---

## ✅ Current Priorities

1. Merge and harden schema + ingestion work
2. Keep Notion as the source of truth
3. Treat Wix as optional downstream infrastructure
4. Build useful broker and portal experiences instead of static directory fluff

---

## 📄 Suggested Files / Docs To Add Next

### Docs
- `docs/PORTAL_IA.md`
- `docs/ADMIN_IA.md`
- `docs/EMBED_REGISTRY.md`
- `docs/OAUTH_AND_SECRETS.md`
- `docs/OPENAPI_INTEGRATIONS.md`
- `docs/SECURITY_MODEL.md`
- `docs/TESTING_POLICY.md`

### App / API
- `app/portal/page.tsx`
- `app/portal/tools/page.tsx`
- `app/portal/resources/page.tsx`
- `app/portal/profile/page.tsx`
- `app/portal/tracking/page.tsx`
- `app/admin/page.tsx`
- `app/admin/submissions/page.tsx`
- `app/admin/brokers/page.tsx`
- `app/admin/logs/page.tsx`
- `app/admin/settings/page.tsx`

### Libraries / components
- `lib/embed-registry.ts`
- `components/portal/ToolCard.tsx`
- `components/portal/ToolGrid.tsx`
- `components/admin/BrokerApprovalQueue.tsx`
- `components/admin/BrokerStatusToggle.tsx`

---

## ⚠️ Notes

- This repo is **not** the same as `moonshine-partner-marketplace`
- Do not treat old Wix-centric assumptions as the default architecture going forward
- Avoid catch-all mega PRs; prefer focused PRs tied to one issue or one tight dependency pair
- Use the schema docs and runbook docs as the operational source of truth for the next build pass
