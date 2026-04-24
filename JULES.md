# JULES.md

## Project Name
Moonshine Capital Portal

## Objective
Build and extend a production-ready Next.js application for Moonshine Capital’s broker directory, partner onboarding flow, taxonomy discovery pages, and future Funding Agent OS surfaces.

This app powers a public-facing broker directory and profile pages while using:
- Tally for onboarding intake
- Notion as the CRM and operational source of truth
- Wix CMS as an optional read adapter
- Vercel as the frontend hosting platform

This is not a generic fintech SaaS template.
The visual direction should feel:
- dark neo-brutalist
- hard-edged
- high contrast
- confident
- colorful in controlled accent blocks
- bold and premium
- more “operator directory” than “corporate lender brochure”

Avoid soft pastel fintech aesthetics, generic gradients, rounded-pill everything, and default blue SaaS visuals.

---

## Product Scope

### Existing core routes
- `/`
- `/onboarding`
- `/directory`
- `/directory/[slug]`
- `/terms`
- `/privacy`
- `/out`

### Routes now added or being actively expanded
- `/industries`
- `/industries/[slug]`
- `/funding-types`
- `/funding-types/[slug]`

### Recommended next routes
- `/about`
- `/contact`
- `/faq`
- `/apply`
- `/states`
- `/states/[slug]`
- `/compare/[slug]`
- `/portal`
- `/admin`

### Route purpose

#### `/`
Landing / hub page for the partner directory experience.
Primary CTAs:
- Browse Directory
- Become a Partner

#### `/directory`
Public broker directory page.
Main searchable/filterable broker discovery surface.

#### `/directory/[slug]`
Individual broker profile page.
Primary conversion page for each broker.

#### `/onboarding`
Partner onboarding page using Tally embed.

#### `/industries`
Industry hub page.
Should help founders jump into relevant broker coverage by market segment.

#### `/industries/[slug]`
Industry-specific directory discovery page.
Should show brokers relevant to a specific industry.

#### `/funding-types`
Funding-type hub page.
Should help founders browse by capital specialty.

#### `/funding-types/[slug]`
Funding-type-specific discovery page.
Should show brokers aligned to that funding specialty.

---

## Backend / Data Source Strategy

### Source of truth
Use Notion as the canonical CRM data source, with Wix as an optional read adapter for approved broker profiles.

Assume the optional Wix CMS collection is:
`brokerProfiles`

### Public filtering rules
Only render brokers where:
- `approvalStatus = approved`
- `isActive = true`

### Data layer requirement
Create and preserve a clean data layer abstraction so the UI does NOT directly depend on raw CRM/CMS response shapes.

Use helpers in `lib/` that:
- fetch all approved active brokers
- fetch a single broker by slug
- normalize data into a consistent frontend type

If live Wix API wiring is incomplete, maintain a clear fallback path for development and build stability.

---

## Visual Direction

### Core style
Dark neo-brutalist.

### Desired feel
- bold
- premium
- confrontational in a tasteful way
- more “we move money” than “we are a helpful app”

### Use
- dark backgrounds
- sharp borders
- strong contrast
- offset shadows where useful
- large uppercase or tightly set headings
- cream/off-white surfaces for contrast blocks
- loud accent colors in controlled doses

### Avoid
- glassmorphism
- generic fintech gradients
- over-rounded buttons
- overly soft shadows
- default Tailwind aesthetic with no personality
- “startup template” look

---

## UX Direction

### Directory UX
The directory should feel fast and obvious.
Users should immediately understand:
- who the brokers are
- what they specialize in
- where they are
- where to click next

### Profile UX
The broker profile page should feel like:
- a premium operator page
- not a sterile CRM record
- not a generic team member page

### Onboarding UX
The onboarding page should feel:
- simple
- serious
- direct
- low-friction

### Taxonomy UX
Industry and funding-type pages should:
- support SEO and user discovery
- lead back to broker profiles
- avoid becoming disconnected content silos

---

## Technical Requirements

### Framework
- Next.js
- App Router
- TypeScript

### Styling
Favor reusable, explicit UI with strong design decisions.
Avoid generic Tailwind soup.

### Components
Create or extend reusable components such as:
- `HeroSection`
- `BrokerCard`
- `DirectoryClient`
- `ProfileHero`
- `CTASection`
- `SectionHeading`
- `TallyEmbedSection`
- future filter/taxonomy helpers where needed

### Suggested file structure focus
Use the repo’s real structure:
- `app/`
- `components/`
- `lib/`
- `docs/`

Do NOT blindly port `src/app` marketplace scaffolds into this repo.

---

## Copy / Messaging Direction

Tone should be:
- direct
- high-conviction
- clear
- slightly contrarian
- not corporate
- not goofy
- not overhyped nonsense

Examples of the right energy:
- “Find a funding partner that actually moves.”
- “No fluff. No slow banks. Just operators who know how to move money.”
- “Built for founders who do not have time for institutional theater.”

---

## Source-of-Truth Docs

Before expanding the repo, consult:
- `docs/full-scaffold.md`
- `docs/route-map.md`
- `docs/page-inventory.md`
- `docs/data-model.md`
- `docs/wix-integration.md`
- `docs/tracking-flow.md`
- `docs/onboarding-flow.md`
- `docs/future-roadmap.md`
- `docs/seo-architecture.md`
- `docs/analytics-plan.md`
- `docs/admin-portal-plan.md`
- `docs/WIX_BROKERPROFILE_SCHEMA.md`
- `docs/FIELD_MAPPING_CONTRACT.md`

### Important documentation rule
Do not create duplicate docs when a system-specific schema doc already exists.
For example:
- `docs/WIX_BROKERPROFILE_SCHEMA.md` already fills the Wix-side broker profile schema role
- `docs/FIELD_MAPPING_CONTRACT.md` is the master cross-system mapping contract
- `docs/data-model.md` should be treated as the canonical app model doc

---

## Build Priorities

### Priority 1
Keep the public directory, onboarding, and tracking flow stable.

### Priority 2
Expand taxonomy pages that improve discovery:
- industries
- funding types
- states
- comparison pages

### Priority 3
Strengthen analytics, metadata, and structured data.

### Priority 4
Plan future `/portal` and `/admin` surfaces without overbuilding too early.

---

## Deliverable Standard
Any new build work should be good enough to:
- run locally
- preview the UI clearly
- keep mock/Wix data swappable
- deploy to Vercel with minimal cleanup
- remain aligned with the portal repo’s actual architecture
