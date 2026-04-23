# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js front-end layer for a broker directory, partner onboarding flow, and the future Funding Agent OS experience.

It provides an operator-focused capital marketplace built on a bold, dark neo-brutalist aesthetic while serving as the presentation and routing layer for broker discovery, onboarding, and click tracking.

## 🚀 Purpose

Founders often waste weeks pitching banks that were never going to say yes.

Moonshine Capital Portal exists to help business owners discover vetted funding partners, browse broker profiles, and move toward the right capital path faster.

In the long term, this codebase is evolving into the front-end for **Funding Agent OS** — a broader operating system for:
- broker discovery
- partner recruitment
- lead routing
- click attribution
- multi-vertical funding discovery
- future authenticated broker and admin experiences

## 🏗️ Architecture & Data Flow

This application uses a modular architecture where **Next.js** acts as the presentation, routing, and SEO layer.

### Current data flow
1. **Intake:** Partners apply through a Tally-powered onboarding flow at `/onboarding`
2. **Review:** Applications are reviewed externally
3. **Source of truth:** Approved profiles are stored in **Wix CMS**
4. **Presentation:** The app fetches broker records through the `lib/brokers.ts` → `lib/wix.ts` integration layer
5. **Tracking:** CTA clicks route through `/out` before redirecting users to the appropriate external destination

### Current state
- Broker data is fetched from the Wix integration layer
- Mock fallback patterns exist for local development and safe build behavior
- The repo currently focuses on the directory, onboarding, legal pages, and tracked outbound routing
- Future phases may introduce `/portal`, `/admin`, richer analytics, and additional taxonomy/SEO surfaces

## 🗺️ Current Routes

### Public routes
- `/` — Homepage / positioning layer
- `/directory` — Broker directory index
- `/directory/[slug]` — Individual broker profile pages
- `/onboarding` — Partner onboarding page with Tally embed
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

## 🧩 Full Scaffold

See the full corrected scaffold here:

- [`docs/full-scaffold.md`](./docs/full-scaffold.md)

That file contains:
- confirmed current repo structure
- recommended additional pages
- suggested component/library expansions
- suggested API routes
- phased build priority

## 🛣️ Suggested Next Pages

These are the most logical additions for this repo:

### High-priority public pages
- `/about`
- `/contact`
- `/faq`
- `/apply`

### SEO / taxonomy pages
- `/industries`
- `/industries/[slug]`
- `/funding-types`
- `/funding-types/[slug]`
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
```

If live Wix credentials are not provided, development-safe fallback behavior should continue to be supported where applicable.

## 📝 Data Model Direction

This repo is centered around a `BrokerProfile`-style model that includes fields such as:

- full name
- agency / company
- slug
- short bio
- city / state
- website URL
- public email
- why choose us
- industries
- funding types / specialties
- urgency / speed fit
- CTA link and CTA label
- approval status
- active / hidden / recruiting state
- phone number
- profile image
- featured flags

The detailed shape and future extensions should be documented in:
- `docs/data-model.md`
- `docs/broker-profile-schema.md`

## 📈 Near-Term Roadmap

### Phase 1
- add `/about`
- add `/contact`
- add `/faq`
- add `/apply`
- document route map and tracking flow more clearly

### Phase 2
- add industry, funding-type, and state-based landing pages
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
