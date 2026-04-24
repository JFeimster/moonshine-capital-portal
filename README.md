# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js front-end layer for a broker directory, partner onboarding flow, taxonomy-based discovery pages, and the future Funding Agent OS experience.

It provides an operator-focused capital marketplace built on a bold, dark neo-brutalist aesthetic while serving as the presentation and routing layer for broker discovery, onboarding, and click tracking.

## 🚀 Purpose

Founders often waste weeks pitching banks that were never going to say yes.

Moonshine Capital Portal exists to help business owners discover vetted funding partners, browse broker profiles, and move toward the right capital path faster.

In the long term, this codebase is evolving into the front-end for **Funding Agent OS** — a broader operating system for:
- broker discovery
- partner recruitment
- lead routing
- click attribution
- taxonomy-driven funding discovery
- future authenticated broker and admin experiences

## 🏗️ Architecture & Data Flow

This application uses a modular architecture where **Next.js** acts as the presentation, routing, and SEO layer.

### Current data flow
1. **Intake:** Partners apply through a Tally-powered onboarding flow at `/onboarding`
2. **Review:** Applications are reviewed and managed externally.
3. **Source of truth:** Notion is the operational CRM and primary source of truth.
4. **Output / CMS:** Approved profiles are stored in **Wix CMS** as a downstream publish layer.
5. **Presentation:** The app fetches broker records through the `lib/brokers.ts` → `lib/wix.ts` integration layer. Next.js handles all application logic, embeds, and public experience.
6. **Tracking:** CTA clicks route through `/out` before redirecting users to the appropriate external destination, while firing a non-blocking n8n webhook.

### Current state
- Broker data is fetched from the Wix integration layer
- Mock fallback patterns exist for local development and safe build behavior
- The repo now includes taxonomy discovery routes for industries and funding types
- Future phases may introduce `/portal`, `/admin`, richer analytics, and additional taxonomy/SEO surfaces

## 🗺️ Current Routes

### Public routes
- `/` — Homepage / positioning layer
- `/directory` — Broker directory index
- `/directory/[slug]` — Individual broker profile pages
- `/onboarding` — Partner onboarding page with Tally embed
- `/industries` — Industry discovery hub
- `/industries/[slug]` — Industry-specific broker discovery page
- `/funding-types` — Funding specialty discovery hub
- `/funding-types/[slug]` — Funding-type-specific broker discovery page
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy

### Internal / infrastructure routes
- `/out` — Centralized tracked redirect route for CTA clicks

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

### Core libraries
- `lib/brokers.ts`
- `lib/wix.ts`
- `lib/mock-brokers.ts`
- `lib/utils.ts`
- `lib/types.ts`

### Core components
- `HeroSection.tsx`
- `BrokerCard.tsx`
- `DirectoryClient.tsx`
- `ProfileHero.tsx`
- `CTASection.tsx`
- `SectionHeading.tsx`
- `TallyEmbedSection.tsx`

## 🧩 Core Docs

Primary docs for this repo:
- [`docs/full-scaffold.md`](./docs/full-scaffold.md)
- [`docs/route-map.md`](./docs/route-map.md)
- [`docs/page-inventory.md`](./docs/page-inventory.md)
- [`docs/data-model.md`](./docs/data-model.md)
- [`docs/wix-integration.md`](./docs/wix-integration.md)
- [`docs/tracking-flow.md`](./docs/tracking-flow.md)
- [`docs/onboarding-flow.md`](./docs/onboarding-flow.md)
- [`docs/future-roadmap.md`](./docs/future-roadmap.md)
- [`docs/seo-architecture.md`](./docs/seo-architecture.md)
- [`docs/analytics-plan.md`](./docs/analytics-plan.md)
- [`docs/admin-portal-plan.md`](./docs/admin-portal-plan.md)

Schema references:
- [`docs/WIX_BROKERPROFILE_SCHEMA.md`](./docs/WIX_BROKERPROFILE_SCHEMA.md)
- [`docs/NOTION_BROKER_CRM_SCHEMA.md`](./docs/NOTION_BROKER_CRM_SCHEMA.md)
- [`docs/TALLY_APPLICATION_SCHEMA.md`](./docs/TALLY_APPLICATION_SCHEMA.md)
- [`docs/TALLY_PROFILE_BUILDER_SCHEMA.md`](./docs/TALLY_PROFILE_BUILDER_SCHEMA.md)
- [`docs/FIELD_MAPPING_CONTRACT.md`](./docs/FIELD_MAPPING_CONTRACT.md)

### Canonical doc roles
- `docs/data-model.md` = canonical app model doc
- `docs/WIX_BROKERPROFILE_SCHEMA.md` = Wix-specific broker profile schema doc
- `docs/FIELD_MAPPING_CONTRACT.md` = master cross-system mapping contract
- `docs/wix-integration.md` = integration/data-flow behavior doc

## 🛣️ Suggested Next Pages

### High-priority public pages
- `/about`
- `/contact`
- `/faq`
- `/apply`

### SEO / taxonomy pages
- `/states`
- `/states/[slug]`
- `/compare/[slug]`

### Future product pages
- `/portal`
- `/admin`

## 🧠 Suggested Future Infra / API Routes

- `/api/broker-click`
- `/api/lead-intake`
- `/api/onboarding-submit`
- `/api/wix-sync`
- `/api/webhooks/n8n`
- `/api/webhooks/hubspot`

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS / Backend:** Wix CMS via integration layer
- **Intake:** Tally Forms
- **Deployment:** Vercel

## ⚙️ Environment Variables

To run the app with live Wix-backed data, provide the required Wix environment variables used by the integration layer.

Example placeholder values:

```env
WIX_API_URL=https://your-wix-site.com/_functions/api
WIX_API_KEY=your_wix_api_key
N8N_CTA_WEBHOOK_URL=https://your-n8n-instance.com/webhook/cta
```

If live Wix credentials are not provided, development-safe fallback behavior should continue to be supported where applicable. In production, mock fallbacks are disabled to prevent masking broken integrations.

## 📈 Near-Term Roadmap

### Phase 1
- add `/about`
- add `/contact`
- add `/faq`
- add `/apply`
- document route map and tracking flow more clearly

### Phase 2
- expand taxonomy surfaces with states and comparison pages
- improve SEO / schema support
- expand tracked discovery surfaces

### Phase 3
- harden CTA tracking and lead-intake routes
- add analytics helpers
- improve routing instrumentation

### Phase 4
- expand toward Funding Agent OS
- add `/portal`
- add `/admin`
- add richer internal workflows and broker lifecycle management

## ⚠️ Notes

- This repo is **not** the same as `moonshine-partner-marketplace`
- Its scaffold should remain aligned to the portal’s actual architecture and current purpose
- Avoid dropping marketplace-specific `src/app` scaffolds into this repo without adapting them to the portal structure
- Use `docs/full-scaffold.md` as the source of truth for future build prompts
