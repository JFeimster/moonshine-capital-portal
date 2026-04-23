# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js front-end layer for a broker directory, partner onboarding flow, and the future Funding Agent OS experience.

It provides an operator-focused capital marketplace built on a strong, dark neo-brutalist aesthetic.

## 🚀 Purpose

Founders often lose weeks pitching to banks that will never approve them. This directory connects business owners directly with vetted capital allocators, brokers, and specialized lenders who underwrite fast and move money efficiently.

In the long term, this codebase is evolving into the front-end for **Funding Agent OS**—a comprehensive operating system for broker discovery, partner recruitment, lead routing, and multi-vertical funding.

## 🏗️ Architecture & Data Flow

This application uses a modular, decoupled architecture where Next.js acts as the presentation and routing layer.

**Data Flow:**
1. **Intake:** Partners apply via Tally embed (`/onboarding`).
2. **Review:** Applications are reviewed and managed externally.
3. **Storage (Source of Truth):** Approved broker profiles are stored in Wix CMS.
4. **Presentation:** The Next.js app fetches approved, active brokers from Wix CMS via the `lib/wix.ts` integration layer.
5. **Analytics & Routing:** High-intent clicks are tracked through a structured CTA model, paving the way for advanced lead routing.

**Current State:**
A mock data fallback (`lib/mock-brokers.ts`) is currently in place for local development and build verification when live Wix API credentials are not provided.

## 🧩 Full Scaffold

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
│   │   └── empty-state.tsx
│   ├── content/
│   │   ├── funding-categories.ts
│   │   ├── verticals.ts
│   │   ├── tools.ts
│   │   ├── partners.ts
│   │   ├── resources.ts
│   │   ├── faqs.ts
│   │   ├── industries.ts
│   │   └── compare-pages.ts
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
│   │   └── partner-defaults.ts
│   └── types/
│       ├── funding.ts
│       ├── vertical.ts
│       ├── tool.ts
│       ├── partner.ts
│       ├── tracking.ts
│       └── lead.ts
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs

## 🗺️ Current Routes

**Public:**
- `/` — Homepage / Positioning layer. Introduces the marketplace and highlights featured partners.
- `/directory` — The core broker directory. Features client-side filtering by State, Industry, Funding Type, and Urgency.
- `/directory/[slug]` — Individual broker profile pages. Designed as high-conversion SEO landing pages with distinct CTAs and tracked nodes.
- `/onboarding` — Partner onboarding page featuring a Tally form.
- `/terms` — Terms of Service and disclaimers.
- `/privacy` — Privacy Policy.

**Internal / Infrastructure:**
- `/out` — Centralized tracking route that logs CTA clicks before 302 redirecting users.

**Future (do not build yet):**
- `/portal` — Broker dashboard and authenticated view.
- `/admin` — Internal application review and system management.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Neo-brutalist theme)
- **CMS / Backend:** Wix CMS (via REST API)
- **Intake:** Tally Forms
- **Deployment:** Vercel

## ⚙️ Environment Variables

To run the app with live Wix data, provide the following environment variables:

```env
WIX_API_URL=https://your-wix-site.com/_functions/api
WIX_API_KEY=your_wix_api_key
```

*Note: If these are not provided, the app will safely fall back to local mock data.*

## 📝 Notion CRM Mapping (Future Data Layer)

We will map properties from Notion to the Wix CMS `BrokerProfile` model. Here is the preliminary mapping:

*   **Name** -> `fullName` (Title)
*   **Agency/Company** -> `agencyName` (Rich Text)
*   **Slug** -> `slug` (Formula or manually set Text)
*   **Bio/Summary** -> `shortBio` (Text)
*   **City** -> `city` (Select or Text)
*   **State** -> `state` (Select or Text)
*   **Website** -> `websiteUrl` (URL)
*   **Email** -> `publicEmail` (Email)
*   **Why Choose Us** -> `whyChooseYou` (Text)
*   **Industries** -> `industries` (Multi-Select)
*   **Funding Types/Specialties** -> `fundingTypes` / `fundingSpecialties` (Multi-Select)
*   **Speed/Urgency** -> `urgencyCategory` (Select)
*   **Primary CTA Link** -> `primaryCtaLink` (URL)
*   **Primary CTA Label** -> `ctaLabel` (Text)
*   **Approval Status** -> `approvalStatus` (Select: approved, pending, rejected)
*   **Broker Status** -> `brokerStatus` (Select: active, hidden, recruiting)
*   **Is Active** -> `isActive` (Checkbox)
*   **Phone Number** -> `phoneNumber` (Phone)
*   **Profile Image** -> `profileImage` (Files & media)

## 🛣️ Next Milestones

- **Live Wix CMS Wiring:** Finalize the Wix API endpoint structure and swap out mock data entirely in production.
- **Advanced CTA Tracking:** Connect the structured `CTANode` tracking IDs to PostHog, Segment, or Google Analytics.
- **Multi-Vertical Support:** Clone or adapt the directory structure to support specific funnels for Trucking, E-commerce, Real Estate, and Contractor funding.
- **Funding Agent OS Expansion:** Introduce authenticated broker views, agent dashboards, and dynamic lead routing.
