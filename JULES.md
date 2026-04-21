# JULES.md

## Project Name
Distilled Funding — Partner Directory

## Objective
Build a production-ready Next.js application for Distilled Funding’s broker marketplace and onboarding flow.

This app will power a public-facing broker directory and profile pages, while using:
- Tally for onboarding intake
- Wix CMS as the content/backend source of truth for broker profiles
- Vercel as the frontend hosting platform

This is not a generic fintech SaaS template.
The visual direction should feel:
- dark neo-brutalist
- hard-edged
- high contrast
- confident
- colorful in controlled accent blocks
- bold and premium
- more “operator marketplace” than “corporate lender brochure”

Avoid soft pastel fintech aesthetics, generic gradients, rounded-pill everything, and default blue SaaS visuals.

---

## Product Scope

### Routes to build
Use Next.js App Router.

Create these routes:

- `/`
- `/onboarding`
- `/directory`
- `/directory/[slug]`

### Route purpose

#### `/`
Landing / hub page for the partner directory experience.
Primary CTAs:
- Browse Directory
- Become a Partner

This page should:
- introduce the partner marketplace
- explain the value quickly
- show featured brokers or preview cards
- drive users into the directory or onboarding flow

#### `/onboarding`
Partner onboarding page.

Do NOT build a custom form UI yet.
This page should use a Tally embed container as the primary intake mechanism.

The page should include:
- headline
- short trust-building copy
- brief explanation of review/publishing process
- embed area for Tally
- optional FAQ or note block

The actual Tally form embed is already implemented and functional.

#### `/directory`
Public broker directory page.

Features:
- search by broker name or agency
- filter by state
- filter by funding specialty
- responsive card grid
- empty state
- CTA section at bottom

Only approved and active brokers should appear.

#### `/directory/[slug]`
Individual broker profile page.

Must include:
- hero
- headshot image area
- name
- agency
- city/state
- short bio
- specialties
- why choose this broker
- CTA buttons

---

## Backend / Data Source Strategy

### Source of truth
Use Wix CMS as the canonical data source.

Assume the Wix CMS collection is called:

`brokerProfiles`

### Public filtering rules
Only render brokers where:
- `approvalStatus = approved`
- `isActive = true`

### Broker fields
Assume the following fields exist in Wix CMS:

- `fullName`
- `agencyName`
- `slug`
- `shortBio`
- `city`
- `state`
- `websiteUrl`
- `publicEmail`
- `whyChooseYou`
- `fundingSpecialties`
- `primaryCtaLink`
- `profileImage`
- `approvalStatus`
- `isActive`

Optional / future-safe:
- `ctaLabel`
- `phoneNumber`
- `featuredBroker`
- `submissionSource`

### Data layer requirement
Create a data layer abstraction so the UI does NOT directly depend on raw Wix response shapes.

Add helpers in a lib layer that:
- fetch all approved active brokers
- fetch a single broker by slug
- normalize data into a consistent frontend type

If live Wix API wiring is not implemented yet, create a clear placeholder fetch layer with mocked broker data and a TODO section showing where the Wix CMS API integration should go.

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

### Accent colors
Use a restrained but vivid palette such as:
- yellow
- electric blue
- hot pink
- acid green
- orange
- red

Do NOT make everything the same color.
Use color intentionally to create hierarchy and energy.

### Avoid
- glassmorphism
- generic fintech gradients
- over-rounded buttons
- overly soft shadows
- default Tailwind aesthetic with no personality
- “startup template” look
- pale muted corporate blues as the main theme

---

## UX Direction

### Directory UX
The directory should feel fast and obvious.
Users should immediately understand:
- who the brokers are
- what they specialize in
- where they are
- where to click next

Card design should prioritize:
- clarity
- punch
- strong hierarchy
- immediate scanability

### Profile UX
The broker profile page should feel like:
- a premium operator page
- not a sterile CRM record
- not a generic team member page

It should balance:
- trust
- expertise
- action

### Onboarding UX
The onboarding page should feel:
- simple
- serious
- direct
- low-friction

The page should frame the Tally form as:
- the official intake flow
- the fastest way to get listed
- part of a reviewed directory process

---

## Technical Requirements

### Framework
- Next.js
- App Router
- TypeScript

### Styling
Use whichever styling approach gets to clean reusable code fastest, but favor one of:
- Tailwind with strong custom design decisions
- CSS modules
- a small token-based CSS system

Do NOT produce generic Tailwind soup with weak design.

### Components
Create reusable components for:

- `Navbar`
- `Footer`
- `HeroSection`
- `BrokerCard`
- `DirectoryFilters`
- `ProfileHero`
- `CTASection`
- `TallyEmbedSection`
- `SectionHeading`

### Suggested file structure
Use something close to:

app/
- layout.tsx
- globals.css
- page.tsx
- onboarding/page.tsx
- directory/page.tsx
- directory/[slug]/page.tsx

components/
- Navbar.tsx
- Footer.tsx
- HeroSection.tsx
- BrokerCard.tsx
- DirectoryFilters.tsx
- ProfileHero.tsx
- CTASection.tsx
- TallyEmbedSection.tsx
- SectionHeading.tsx

lib/
- wix.ts
- brokers.ts
- mock-brokers.ts
- types.ts

### Types
Create a strong broker type definition.
Use a normalized shape for frontend rendering.

Example concept:
- id
- fullName
- agencyName
- slug
- shortBio
- city
- state
- websiteUrl
- publicEmail
- whyChooseYou
- fundingSpecialties
- primaryCtaLink
- profileImage

### Data fetching
For now, prioritize:
- stable structure
- placeholder data support
- easy swap-in for live Wix API later

### Search/filter behavior
On `/directory`, implement:
- client-side search by `fullName` and `agencyName`
- client-side filter by `state`
- client-side filter by `fundingSpecialties`

This is enough for v1.

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

Avoid:
- fake startup optimism
- generic empowerment language
- stale corporate finance copy
- overly cute microcopy

---

## Homepage Content Direction

### Homepage sections
Build the homepage with these sections:

1. Navbar
2. Hero
3. Broker preview / featured cards
4. Short “How it works” or “Why this directory exists”
5. CTA band
6. Footer

### Hero
The homepage hero should immediately communicate:
- this is a broker marketplace
- this is not a bank
- this is for operators and businesses who want capital options

---

## Directory Page Content Direction

### Directory page sections
1. Hero / intro header
2. Filter bar
3. Broker card grid
4. Empty state
5. CTA section

### Card content
Each broker card should show:
- headshot placeholder or image
- full name
- agency name
- city/state
- short bio
- specialty chips
- profile button
- connect/apply button

---

## Profile Page Content Direction

### Profile sections
1. Breadcrumb / back link
2. Profile hero
3. Specialties and “why choose this broker”
4. Longer about block
5. CTA section

### CTA hierarchy
Primary CTA:
- Apply / Connect

Secondary CTA:
- Visit Website or Book Call

---

## Onboarding Page Content Direction

This page is NOT a custom multi-step form.
Use a Tally embed section.

### Content blocks
- Hero / intro
- Tally embed section
- Short note on review process
- Optional FAQ / reassurance block

### Review messaging
Use language similar to:
- profiles may be reviewed before publishing
- approved profiles are added to the public directory
- onboarding helps create a clean partner listing

---

## Build Priorities

### Priority 1
Get the structure and UI done:
- all routes
- reusable components
- mock data support
- dark neo-brutalist visual system

### Priority 2
Prepare the data integration layer:
- `lib/wix.ts`
- TODOs or placeholder fetches for real Wix CMS API calls

### Priority 3
Keep the code deployment-friendly:
- clean TypeScript
- no unnecessary abstraction
- minimal dependency bloat
- readable structure

---

## Code Quality Requirements
- keep code simple and readable
- avoid overengineering
- avoid unnecessary abstraction
- prefer explicitness
- make the project easy to hand off to another dev or agent

---

## Deliverable
Generate the initial project scaffold and code files for the full v1 app.
The output should be good enough to:
- open locally
- preview the UI
- swap mock data for Wix CMS later
- deploy to Vercel with minimal cleanup
