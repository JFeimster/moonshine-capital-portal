# Moonshine Capital Portal — Full Scaffold

## Purpose
This document defines the corrected full scaffold for the **moonshine-capital-portal** repo.

It replaces the earlier marketplace-oriented scaffold and is now aligned to the actual repo direction:
- broker directory
- partner onboarding flow
- Wix-backed broker profile presentation layer
- CTA tracking / redirect infrastructure
- future Funding Agent OS expansion

This file should be treated as the source of truth for future build prompts, repo planning, and expansion work.

---

## Repo Identity

**Repository:** `moonshine-capital-portal`

**Core role:**
A Next.js front-end for:
- partner / broker directory discovery
- profile pages
- onboarding and listing flow
- click tracking and routing
- future authenticated portal and admin surfaces

**Current architectural reality:**
- App Router project using `app/`, not `src/app/`
- broker data comes through `lib/brokers.ts`
- broker access is backed by Wix integration helpers
- onboarding is handled through Tally embed flow
- outbound CTAs route through a tracking redirect endpoint

---

## Existing Routes Confirmed
These routes are already represented in the current repo codebase.

### Public routes
- `/`
- `/directory`
- `/directory/[slug]`
- `/onboarding`
- `/terms`
- `/privacy`

### Internal / infrastructure routes
- `/out`

---

## Existing Core Files Confirmed
These files are already part of the live architectural direction for the portal repo.

### App routes
- `app/page.tsx`
- `app/directory/page.tsx`
- `app/directory/[slug]/page.tsx`
- `app/onboarding/page.tsx`
- `app/out/route.ts`
- `app/terms/page.tsx`
- `app/privacy/page.tsx`

### Core logic / data layer
- `lib/brokers.ts`
- `lib/wix.ts`
- `lib/mock-brokers.ts`
- `lib/utils.ts`
- `lib/types.ts`

### Core components already implied / in use
- `HeroSection.tsx`
- `BrokerCard.tsx`
- `CTASection.tsx`
- `SectionHeading.tsx`
- `DirectoryClient.tsx`
- `ProfileHero.tsx`
- `TallyEmbedSection.tsx`

---

## Recommended Additional Public Pages
These are the most sensible additions for the portal repo specifically.

### High-priority public pages
- `/about`
- `/contact`
- `/faq`
- `/apply`

### Discovery / SEO pages
- `/industries`
- `/industries/[slug]`
- `/funding-types`
- `/funding-types/[slug]`
- `/states`
- `/states/[slug]`
- `/compare/[slug]`

### Future product / portal pages
- `/portal`
- `/admin`

---

## Recommended Additional API / Infra Routes
- `/api/broker-click`
- `/api/lead-intake`
- `/api/onboarding-submit`
- `/api/wix-sync`
- `/api/webhooks/n8n`
- `/api/webhooks/hubspot`

Note: if you prefer to keep tracking under `app/out/route.ts`, that is fine. These are suggested additions, not requirements.

---

## Recommended Additional Components
- `FilterBar.tsx`
- `EmptyState.tsx`
- `SearchInput.tsx`
- `FacetPills.tsx`
- `BrokerStatsStrip.tsx`
- `DirectoryHero.tsx`
- `PageIntro.tsx`
- `LegalPageShell.tsx`
- `Breadcrumbs.tsx`
- `TrackedLink.tsx`

---

## Recommended Additional Library Files
- `tracking.ts`
- `seo.ts`
- `schema.ts`
- `directory-filters.ts`
- `analytics.ts`
- `onboarding.ts`
- `wix-normalizers.ts`

---

## Recommended Additional Documentation Files
- `docs/full-scaffold.md`
- `docs/route-map.md`
- `docs/data-model.md`
- `docs/wix-integration.md`
- `docs/broker-profile-schema.md`
- `docs/onboarding-flow.md`
- `docs/tracking-flow.md`
- `docs/future-roadmap.md`

---

## Corrected Full Scaffold
```text
moonshine-capital-portal/
├── README.md
├── docs/
│   ├── full-scaffold.md
│   ├── data-model.md
│   ├── route-map.md
│   ├── wix-integration.md
│   ├── broker-profile-schema.md
│   ├── onboarding-flow.md
│   ├── tracking-flow.md
│   └── future-roadmap.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── directory/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   ├── out/
│   │   └── route.ts
│   ├── terms/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── apply/
│   │   └── page.tsx
│   ├── industries/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── funding-types/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── states/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── compare/
│   │   └── [slug]/page.tsx
│   ├── portal/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── api/
│   │   ├── broker-click/route.ts
│   │   ├── lead-intake/route.ts
│   │   ├── onboarding-submit/route.ts
│   │   ├── wix-sync/route.ts
│   │   └── webhooks/
│   │       ├── n8n/route.ts
│   │       └── hubspot/route.ts
├── components/
│   ├── HeroSection.tsx
│   ├── BrokerCard.tsx
│   ├── DirectoryClient.tsx
│   ├── ProfileHero.tsx
│   ├── CTASection.tsx
│   ├── SectionHeading.tsx
│   ├── TallyEmbedSection.tsx
│   ├── FilterBar.tsx
│   ├── EmptyState.tsx
│   ├── SearchInput.tsx
│   ├── FacetPills.tsx
│   ├── BrokerStatsStrip.tsx
│   ├── DirectoryHero.tsx
│   ├── PageIntro.tsx
│   ├── LegalPageShell.tsx
│   ├── Breadcrumbs.tsx
│   └── TrackedLink.tsx
├── lib/
│   ├── brokers.ts
│   ├── wix.ts
│   ├── mock-brokers.ts
│   ├── utils.ts
│   ├── types.ts
│   ├── tracking.ts
│   ├── seo.ts
│   ├── schema.ts
│   ├── directory-filters.ts
│   ├── analytics.ts
│   ├── onboarding.ts
│   └── wix-normalizers.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── og/
├── package.json
├── tsconfig.json
├── next.config.*
├── tailwind.config.*
├── postcss.config.*
└── eslint.config.*
```

---

## Recommended Build Priority

### Phase 1 — complete public surface
- add `/about`
- add `/contact`
- add `/faq`
- add `/apply`
- add `docs/route-map.md`
- add `docs/tracking-flow.md`
- add `FilterBar.tsx` / `SearchInput.tsx` / `FacetPills.tsx` if not already present

### Phase 2 — SEO + taxonomy expansion
- add `/industries`
- add `/industries/[slug]`
- add `/funding-types`
- add `/funding-types/[slug]`
- add `/states`
- add `/states/[slug]`
- add `/compare/[slug]`
- add `seo.ts` and `schema.ts`

### Phase 3 — routing / tracking hardening
- add `/api/broker-click`
- add `/api/lead-intake`
- add `tracking.ts`
- add `analytics.ts`
- improve `app/out/route.ts`

### Phase 4 — product expansion
- add `/portal`
- add `/admin`
- add webhook routes
- add richer onboarding and broker management flow

---

## Notes
- This scaffold is for **moonshine-capital-portal**, not `moonshine-partner-marketplace`.
- Keep the portal repo anchored around the broker directory and Wix-backed profile model.
- Do not blindly port `src/app` marketplace scaffolds into this repo; the portal currently uses `app/`.
- Prefer adding pages that support directory discovery, onboarding, tracking, and future Funding Agent OS evolution.
- Use this document as the source scaffold for future Codex and GitHub connector prompts.
