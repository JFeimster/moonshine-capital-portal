# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js front-end layer for a broker directory, partner onboarding flow, and future Funding Agent OS experience.

## What this repo is
This project powers:
- a public broker / partner directory
- broker profile pages
- partner onboarding via Tally
- a Wix CMS-backed data model
- the first front-end layer of Funding Agent OS

## Product direction
The long-term goal is to turn this codebase into an operational front-end for:
- broker discovery
- partner recruitment
- lead routing
- broker-specific conversion pages
- multi-vertical funding directory pages
- agent enablement and dashboard experiences

## Current routes
- `/` — homepage / positioning layer
- `/directory` — broker directory
- `/directory/[slug]` — broker profile pages
- `/onboarding` — partner onboarding page with Tally placeholder

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel deployment target
- Wix CMS as source of truth
- Tally for onboarding intake

## Architecture
Planned data flow:
- Tally intake → automation / review flow
- Wix CMS stores approved broker data
- Next.js renders directory and profile pages from Wix-backed data
- CTA actions later support analytics and lead routing

Current implementation:
- mock data exists as a development fallback
- Wix integration layer is isolated in `lib/wix.ts`
- broker data access is centralized in `lib/brokers.ts`

## Design direction
The UI system is intentionally dark neo-brutalist:
- black-heavy base
- cream contrast panels
- bold typography
- hard borders
- controlled accent colors
- stronger operator / funding marketplace feel instead of generic fintech SaaS

## Near-term roadmap
- replace mock broker data with real Wix CMS reads
- add richer broker fields
- expand directory filters
- add CTA tracking
- add multi-vertical support
- improve broker pages as SEO + conversion assets
- evolve into Funding Agent OS front-end layer

## Future roadmap
- real partner onboarding workflow
- authenticated broker/admin views
- analytics and click tracking
- routing by vertical / funding type / urgency
- recruiting / enablement layer
- agent dashboards

## Notes
This repo is intentionally being built in clean stages:
1. scaffold and design system
2. real data integration
3. conversion and routing improvements
4. Funding Agent OS expansion

See `JULES.md` for implementation context and build rules.
