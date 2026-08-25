# Moonshine Capital Portal

`moonshine-capital-portal` is the canonical **public partner identity, co-branded funding-page, directory, intake, attribution, and publication-gating** application for the Moonshine / Distilled Funding partner ecosystem.

Target public host:

```text
capital.distilledfunding.com
```

This repository is **not** the authenticated Partner Command / Partner OS. Authenticated partner operations belong to [`JFeimster/partner-command-center`](https://github.com/JFeimster/partner-command-center), whose future canonical host is `app.distilledfunding.com`.

---

## Canonical ownership

This repo owns:

```text
PUBLIC PARTNER IDENTITY
PUBLIC PARTNER PROFILE
CO-BRANDED FUNDING PAGE
BROKER / PARTNER DIRECTORY
TRACKED CTA ROUTING
TALLY INTAKE
PROFILE ENRICHMENT
PUBLICATION GATING
```

It does **not** own:

```text
AUTHENTICATED PARTNER COMMAND
COMMISSIONS
TEAM MANAGEMENT
OPERATING DASHBOARD
TRAINING RUNTIME
PARTNER OS
```

Those responsibilities belong to `partner-command-center`.

---

## Current architecture

```text
Tally / normalized intake
        ↓
Next.js intake contracts
        ↓
canonical partner identity
partnerId + referralCode + reserved slug
        ↓
Notion CRM adapter
        ↓
approval / enrichment
        ↓
optional Wix publish/read adapter
        ↓
public Capital profile + tracked CTA routing
```

### Operational roles

- **Tally** = partner application and profile-builder intake.
- **Next.js** = validation, normalization, identity derivation, public rendering, discovery, and tracked routing.
- **Notion CRM** = intended operational source of truth for partner lifecycle/approvals.
- **Wix** = optional downstream publish/read adapter where useful.
- **n8n** = optional webhook orchestration and raw-Tally-to-canonical mapping.
- **Partner Command** = authenticated editing/operations surface in a separate canonical repo.

> Current limitation: `lib/notion.ts` is still a stub adapter. The identity/provisioning contract is implemented, but durable production persistence requires the real Notion adapter and credentials before this lifecycle can be considered fully production-live.

---

## Canonical partner lifecycle

```text
application_received
→ pending_review
→ approved
→ profile_incomplete
→ ready_to_publish
→ published
→ suspended / archived
```

The current intake foundation intentionally keeps applicants non-public. Public rendering remains guarded by approval/status gating.

### Application flow

1. Receive authenticated, pre-normalized application payload.
2. Validate required data.
3. Normalize the email merge key.
4. Preserve incoming canonical IDs when supplied; otherwise deterministically derive:
   - `partnerId`
   - `referralCode`
   - collision-resistant `slug`
5. Set pending/draft lifecycle state.
6. Upsert through the CRM adapter using the existing merge key.
7. Return `publicationEligible: false`.

Repeated submissions for the same normalized email converge on the same derived identity.

### Profile enrichment flow

1. Receive authenticated profile-builder payload.
2. Validate it.
3. Normalize profile fields.
4. Drop blank/empty enrichment values so they do not erase trusted existing data.
5. Upsert the existing partner record by merge key.
6. Keep the record non-public until the explicit approval/publication workflow authorizes it.

---

## Public routes

- `/` — public positioning layer.
- `/<partner-slug>` — canonical share-route foundation for a public approved partner profile.
- `/directory` — partner directory index.
- `/directory/[slug]` — mature internal public-profile route retained for compatibility.
- `/industries` and `/industries/[slug]` — industry discovery.
- `/funding-types` and `/funding-types/[slug]` — funding-type discovery.
- `/onboarding` — partner onboarding/application surface.
- `/terms` — Terms of Service.
- `/privacy` — Privacy Policy.

### Infrastructure routes

- `/out` — centralized tracked redirect route.
- `/api/intake/tally/application` — normalized partner application intake.
- `/api/intake/tally/profile` — existing-partner profile enrichment intake.

### Legacy / transitional authenticated surfaces

Existing `/portal/*` and `/admin/*` code is transitional/legacy implementation material. It does **not** establish canonical authenticated-OS ownership. Future partner operating features belong in `partner-command-center`; these routes should be migrated, reduced, redirected, or retired only in a controlled later batch after dependency review.

---

## Public profile safety

`lib/brokers.ts` routes public reads through `isEligibleForPublicDisplay()`.

A profile is public only when:

- approval is explicitly `approved`;
- the record is explicitly active; and
- it is not hidden.

The new top-level `/<partner-slug>` route delegates to the mature directory profile implementation, so pending/unapproved partners do not gain a second publication path.

---

## Canonical identity model

The application now supports the following identity/profile contract while preserving existing field names for backward compatibility:

```text
partnerId
referralCode
slug
fullName
displayName
email
phoneNumber
agencyName
title
profileStatus
approvalStatus
partnerType
specialties
industries
fundingTypes
markets
shortBio
profileImage
logoUrl
bookingUrl
primaryCtaLabel
primaryCtaLink
disclosures
createdAt
updatedAt
publishedAt
```

External integrations may use snake_case equivalents; see `docs/PARTNER_COMMAND_PROFILE_CONTRACT.md` and `docs/FIELD_MAPPING_CONTRACT.md` for boundary mapping.

---

## Attribution contract

Public profile/funding flows should preserve when present:

```text
partner_id
referral_code
source
campaign
utm_source
utm_medium
utm_campaign
```

Existing `/out` and tracking infrastructure remains the foundation. Do not build a competing attribution system.

---

## Core files

### Routes

- `app/[slug]/page.tsx`
- `app/directory/page.tsx`
- `app/directory/[slug]/page.tsx`
- `app/industries/*`
- `app/funding-types/*`
- `app/out/route.ts`
- `app/api/intake/tally/application/route.ts`
- `app/api/intake/tally/profile/route.ts`

### Libraries

- `lib/brokers.ts`
- `lib/wix.ts`
- `lib/field-mapping.ts`
- `lib/intake-normalizers.ts`
- `lib/validation.ts`
- `lib/status-gating.ts`
- `lib/notion.ts`
- `lib/publish-broker.ts`

---

## Core documentation

- [`docs/FIELD_MAPPING_CONTRACT.md`](./docs/FIELD_MAPPING_CONTRACT.md)
- [`docs/TALLY_APPLICATION_SCHEMA.md`](./docs/TALLY_APPLICATION_SCHEMA.md)
- [`docs/TALLY_PROFILE_BUILDER_SCHEMA.md`](./docs/TALLY_PROFILE_BUILDER_SCHEMA.md)
- [`docs/NOTION_BROKER_CRM_SCHEMA.md`](./docs/NOTION_BROKER_CRM_SCHEMA.md)
- [`docs/onboarding-flow.md`](./docs/onboarding-flow.md)
- [`docs/tracking-flow.md`](./docs/tracking-flow.md)
- [`docs/PARTNER_COMMAND_PROFILE_CONTRACT.md`](./docs/PARTNER_COMMAND_PROFILE_CONTRACT.md)
- [`docs/WEBHOOKS.md`](./docs/WEBHOOKS.md)
- [`docs/RUNBOOK.md`](./docs/RUNBOOK.md)

---

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel
- Vitest
- Tally
- Notion adapter (production persistence still to be wired)
- optional n8n orchestration
- optional Wix downstream adapter

---

## Environment variables

Production persistence requires:

```env
NOTION_API_KEY=your_notion_api_key
NOTION_BROKER_DATABASE_ID=your_notion_database_id
```

Adapter-specific/optional values may include:

```env
N8N_CTA_WEBHOOK_URL=https://your-n8n-instance.com/webhook/cta
WIX_API_URL=https://your-wix-site.com/_functions/api
WIX_API_KEY=your_wix_api_key
WIX_SITE_ID=your_wix_site_id
```

Do not assign `capital.distilledfunding.com` until the persistence path, production behavior, and current public routes have been verified end-to-end.

---

## Near-term priorities

1. Replace the Notion stub with a real idempotent persisted upsert.
2. Map canonical identity additions into the actual CRM schema without duplicating existing fields.
3. Verify application retry behavior against durable storage.
4. Preserve approval gating and existing directory behavior.
5. Complete the Partner Command ↔ Capital profile integration contract.
6. Assign the final Capital domain only after production readiness.

---

## Architecture references

The ecosystem-level ownership decision is tracked in `JFeimster/partner-command-center` Issue #25 and its canonical architecture docs.
