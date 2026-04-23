# Moonshine Partner Marketplace — Full Scaffold

## Purpose
This document defines the full intended scaffold for the Moonshine Partner Marketplace architecture based on the current coded repo state plus recommended additions. It is meant to act as the source of truth for future GitHub/Codex build prompts so the project can be expanded from a clear, stable blueprint instead of rebuilding the plan from memory.

This scaffold reflects:
- the routes and files already present in the existing marketplace repo
- the dynamic route pattern already in use for funding, verticals, and partners
- the tracking and attribution model already introduced on partner pages
- additional pages, APIs, docs, and support files that would make the repo feel complete and easier to scale

## Existing Core Routes Confirmed
These routes are already represented in the current codebase:

- `/`
- `/funding`
- `/funding/[slug]`
- `/tools`
- `/verticals/[slug]`
- `/partners/[partnerSlug]`
- `/apply`
- `/about`
- `/contact`
- `/tools/funding-match`
- `/tools/startup-planner`
- `/tools/revenue-estimator`
- `/api/lead`
- `/api/track`
- `/api/webhook`

## Existing Content / Logic Layers Confirmed
These content and support concepts already exist in the current marketplace repo structure:

- funding category content
- vertical content
- tool content
- partner content
- shared cards/components
- tracking parameter support (`partner_id`, `utm_source`, `utm_medium`, `utm_campaign`, `ref`, `asset_id`)
- dynamic route generation through slug-based pages

## Recommended Missing / Additional Public Pages
These are the next most useful route additions for a fuller site scaffold.

### Core index / navigation pages
- `/verticals`
- `/partners`
- `/resources`
- `/faq`
- `/pricing`
- `/for-partners`
- `/industries`
- `/compare`
- `/about/marketplace`
- `/contact/partner`
- `/apply/start`
- `/apply/success`

### Comparison / conversion pages
- `/funding/compare/[slug]`
- `/industries/[slug]`
- `/resources/[slug]`

## Recommended Additional Tool Pages
These are strong engineering-as-marketing and partner-distribution assets.

- `/tools/working-capital-estimator`
- `/tools/equipment-finance-calculator`
- `/tools/revenue-advance-checker`
- `/tools/business-funding-readiness`
- `/tools/partner-link-builder`
- `/tools/offer-router-preview`

## Recommended Additional API Routes
These would round out routing, attribution, and integration workflows.

- `/api/partner-click`
- `/api/lead-intake`
- `/api/lead-score`
- `/api/route-decision`
- `/api/referral-context`
- `/api/tool-submit`
- `/api/application-start`
- `/api/application-complete`
- `/api/webhooks/n8n`
- `/api/webhooks/hubspot`

## Recommended Additional Components
These would help with scalability and UI consistency.

- `breadcrumbs.tsx`
- `filter-bar.tsx`
- `param-badges.tsx`
- `empty-state.tsx`
- `stats-strip.tsx`
- `page-shell.tsx`
- `detail-hero.tsx`
- `cta-row.tsx`
- `resource-card.tsx`
- `faq-item.tsx`

## Recommended Additional Content Files
- `resources.ts`
- `faqs.ts`
- `industries.ts`
- `compare-pages.ts`
- `lead-magnets.ts`

## Recommended Additional Support Libraries
- `seo.ts`
- `schema.ts`
- `analytics.ts`
- `content-map.ts`
- `lead-routing.ts`
- `partner-defaults.ts`
- `application-flow.ts`

## Recommended Types Layer
- `funding.ts`
- `vertical.ts`
- `tool.ts`
- `partner.ts`
- `tracking.ts`
- `lead.ts`
- `resource.ts`

## Full Repo Scaffold
```text
moonshine-partner-marketplace/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── docs/
│   ├── build-sheet.md
│   ├── data-model.md
│   ├── route-map.md
│   ├── full-scaffold.md
│   ├── page-inventory.md
│   ├── lead-routing-logic.md
│   ├── partner-attribution-flow.md
│   ├── tool-roadmap.md
│   └── seo-architecture.md
├── public/
│   ├── images/
│   ├── icons/
│   └── og/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   ├── page.tsx
│   │   │   └── marketplace/page.tsx
│   │   ├── apply/
│   │   │   ├── page.tsx
│   │   │   ├── start/page.tsx
│   │   │   └── success/page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── partner/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── funding/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── compare/
│   │   │       └── [slug]/page.tsx
│   │   ├── verticals/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── industries/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── partners/
│   │   │   ├── page.tsx
│   │   │   └── [partnerSlug]/page.tsx
│   │   ├── tools/
│   │   │   ├── page.tsx
│   │   │   ├── funding-match/page.tsx
│   │   │   ├── startup-planner/page.tsx
│   │   │   ├── revenue-estimator/page.tsx
│   │   │   ├── working-capital-estimator/page.tsx
│   │   │   ├── equipment-finance-calculator/page.tsx
│   │   │   ├── business-funding-readiness/page.tsx
│   │   │   └── partner-link-builder/page.tsx
│   │   ├── resources/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── for-partners/page.tsx
│   │   └── api/
│   │       ├── lead/route.ts
│   │       ├── track/route.ts
│   │       ├── webhook/route.ts
│   │       ├── partner-click/route.ts
│   │       ├── lead-intake/route.ts
│   │       ├── lead-score/route.ts
│   │       ├── route-decision/route.ts
│   │       ├── referral-context/route.ts
│   │       ├── application-start/route.ts
│   │       ├── application-complete/route.ts
│   │       └── webhooks/
│   │           ├── n8n/route.ts
│   │           └── hubspot/route.ts
│   ├── components/
│   │   ├── hero.tsx
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── section-heading.tsx
│   │   ├── card-grid.tsx
│   │   ├── offer-card.tsx
│   │   ├── vertical-card.tsx
│   │   ├── tool-card.tsx
│   │   ├── cta-banner.tsx
│   │   ├── breadcrumbs.tsx
│   │   ├── filter-bar.tsx
│   │   ├── param-badges.tsx
│   │   ├── stats-strip.tsx
│   │   ├── empty-state.tsx
│   │   ├── page-shell.tsx
│   │   ├── detail-hero.tsx
│   │   ├── cta-row.tsx
│   │   ├── resource-card.tsx
│   │   └── faq-item.tsx
│   ├── content/
│   │   ├── funding-categories.ts
│   │   ├── verticals.ts
│   │   ├── tools.ts
│   │   ├── partners.ts
│   │   ├── resources.ts
│   │   ├── faqs.ts
│   │   ├── industries.ts
│   │   ├── compare-pages.ts
│   │   └── lead-magnets.ts
│   ├── lib/
│   │   ├── routes.ts
│   │   ├── site.ts
│   │   ├── tracking.ts
│   │   ├── utils.ts
│   │   ├── seo.ts
│   │   ├── schema.ts
│   │   ├── analytics.ts
│   │   ├── content-map.ts
│   │   ├── lead-routing.ts
│   │   ├── partner-defaults.ts
│   │   └── application-flow.ts
│   └── types/
│       ├── funding.ts
│       ├── vertical.ts
│       ├── tool.ts
│       ├── partner.ts
│       ├── tracking.ts
│       ├── lead.ts
│       └── resource.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
```

## Recommended Build Priority

### Phase 1 — navigation and inventory completeness
- add `/verticals`
- add `/partners`
- add `/resources`
- add `/faq`
- add `src/types/*`
- add `docs/page-inventory.md`
- add `docs/partner-attribution-flow.md`

### Phase 2 — tools and routing infrastructure
- add new tool pages
- add `/api/partner-click`
- add `/api/lead-intake`
- add `/api/route-decision`
- add `lead-routing.ts`
- add `partner-defaults.ts`

### Phase 3 — SEO and comparison expansion
- add `/industries`
- add `/funding/compare/[slug]`
- add `seo.ts`
- add `schema.ts`
- add `compare-pages.ts`

### Phase 4 — application and partner lifecycle support
- add `/apply/start`
- add `/apply/success`
- add `/contact/partner`
- add webhook-specific routes
- add application flow helper files

## Notes for Future Prompts
- preserve Moonshine Capital as the front-end marketplace and routing layer
- do not expose backend providers in public-facing content
- prefer dynamic routes over unnecessary duplicate page files
- keep attribution and routing logic reusable across funding, vertical, tool, and partner pages
- if a page is meant to scale by content, prefer a slug-based dynamic route plus structured content file
- use this document as the repo scaffold source of truth for future Codex / GitHub connector build instructions
