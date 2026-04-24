# Future Roadmap

## Purpose
This document outlines the forward roadmap for `moonshine-capital-portal`.

It is not meant to be a rigid product spec. It is a practical planning document for the next layers of the portal so future work stays aligned with the repo’s real purpose:
- broker discovery
- onboarding
- tracked outbound routing
- Vercel/Next.js directory presentation
- future Funding Agent OS expansion

---

## Current State

The repo currently functions as a public-facing broker directory experience with:
- homepage positioning
- directory index
- broker detail pages
- onboarding flow
- tracked outbound redirects
- legal pages
- Notion-backed broker data (with optional Wix reads)

This is the public discovery layer.

---

## Product Direction

### Short-term identity
A broker directory and onboarding surface for Moonshine Capital.

### Mid-term identity
A richer partner discovery, qualification, and routing platform.

### Long-term identity
The front-end surface for **Funding Agent OS** with:
- directory discovery
- broker recruiting
- lead routing
- analytics
- future broker portal access
- internal admin workflows

---

## Roadmap Phases

## Phase 1 — Complete the public portal surface
### Goal
Finish the obvious missing public pages and make the portal feel complete.

### Priorities
- add `/about`
- add `/contact`
- add `/faq`
- add `/apply`
- polish homepage, directory, and profile UX
- improve docs consistency

### Deliverables
- public informational pages
- better navigation and footer coverage
- stronger directory-to-profile-to-CTA user flow

---

## Phase 2 — Expand discovery and SEO surfaces
### Goal
Make the portal easier to find, browse, and segment.

### Priorities
- add `/industries`
- add `/industries/[slug]`
- add `/funding-types`
- add `/funding-types/[slug]`
- add `/states`
- add `/states/[slug]`
- add `/compare/[slug]`
- improve structured data and metadata handling

### Deliverables
- taxonomy landing pages
- richer SEO entrypoints
- more contextual discovery paths into `/directory`

---

## Phase 3 — Strengthen tracking and lead instrumentation
### Goal
Turn the current click-tracking setup into a more usable routing and analytics layer.

### Priorities
- extract tracking logic into `lib/tracking.ts`
- add analytics abstraction in `lib/analytics.ts`
- add `/api/broker-click`
- add `/api/lead-intake`
- normalize source / CTA types
- connect outbound clicks to future lead data where possible

### Deliverables
- cleaner analytics event model
- better broker click observability
- easier downstream reporting

---

## Phase 4 — Operationalize onboarding and publishing
### Goal
Make broker onboarding and publishing more systematic.

### Priorities
- automate Tally → CRM handoffs
- add `/api/onboarding-submit`
- add `/api/wix-sync` (optional)
- strengthen profile publication rules
- document review and merge workflows clearly

### Deliverables
- cleaner broker lifecycle
- lower manual overhead
- more reliable publishing process

---

## Phase 5 — Introduce portal and admin surfaces
### Goal
Expand beyond the public directory into authenticated product surfaces.

### Priorities
- add `/portal`
- add `/admin`
- define permissions and access boundaries
- support broker editing / profile management
- support internal approval and review workflows

### Deliverables
- broker dashboard concepts
- internal management area
- foundation for Funding Agent OS evolution

---

## Phase 6 — Broader Funding Agent OS expansion
### Goal
Move the repo from a directory-only product to a broader operating system surface.

### Potential expansions
- broker performance reporting
- lead-routing dashboards
- multi-vertical partner programs
- admin review queues
- application orchestration views
- richer internal analytics and CRM integration

---

## Strategic Guardrails

### Keep the portal grounded in its actual job
This repo should remain focused on:
- directory discovery
- onboarding
- profile presentation
- tracking
- evolution toward operational tooling

### Avoid importing the wrong scaffold
Do not blindly force `moonshine-partner-marketplace` architecture into this repo.

### Keep broker profile delivery clean
The public directory should remain decoupled from raw CRM/CMS details through the `lib/brokers.ts` abstraction.

---

## Recommended Execution Order

### Immediate next moves
1. finish the public utility pages
2. add taxonomy/SEO expansion routes
3. harden click tracking and analytics helpers
4. formalize onboarding publishing flow
5. plan portal/admin surfaces

---

## Recommended Next Steps
- use `docs/full-scaffold.md` as the architecture source of truth
- use `docs/route-map.md` to sequence page creation
- use `docs/tracking-flow.md` to guide instrumentation work
- use `docs/wix-integration.md` and schema docs to keep data flow clean
