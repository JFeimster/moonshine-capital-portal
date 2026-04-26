# Route Map

## Purpose
This document maps the current and recommended routes for `moonshine-capital-portal`.

It is meant to help with:
- page planning
- navigation planning
- SEO expansion
- CTA routing
- future portal/admin growth

This route map is specific to the portal repo and its current architecture.

---

## Current Confirmed Routes

### Public routes
- `/` — Homepage / positioning layer
- `/directory` — Broker directory index
- `/directory/[slug]` — Individual broker profile pages
- `/onboarding` — Tally-powered partner onboarding flow
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy

### Internal / infrastructure routes
- `/out` — Tracked redirect route for broker CTA clicks

---

## Current Route Roles

### `/`
**Purpose:**
- position the brand
- explain why the directory exists
- feature selected partners
- move users into the broker directory

**Primary user:**
- founder / operator discovering the ecosystem

**Primary CTA direction:**
- broker discovery
- directory exploration

### `/directory`
**Purpose:**
- act as the main searchable/filterable broker directory
- help users discover the right funding partner
- support future SEO and faceted browsing

**Primary user:**
- business owner looking for the right broker / capital source

**Primary CTA direction:**
- click into `/directory/[slug]`

### `/directory/[slug]`
**Purpose:**
- serve as the main profile landing page for each broker
- provide specialties, industries, contact info, and trust signals
- route outbound clicks through tracked CTAs

**Primary user:**
- high-intent user evaluating a specific broker

**Primary CTA direction:**
- tracked external click via `/out`

### `/onboarding`
**Purpose:**
- recruit brokers / partners into the directory
- collect profile and funding specialty details

**Primary user:**
- prospective funding partner / broker

### `/terms`
**Purpose:**
- legal coverage
- affiliate and third-party disclaimers

### `/privacy`
**Purpose:**
- privacy disclosures
- data handling explanation

### `/out`
**Purpose:**
- central click-tracking redirect layer
- route users to broker website / CTA destination
- preserve attribution and measurement opportunities

---

## Recommended New Routes

### High-priority public pages
- `/about`
- `/contact`
- `/faq`
- `/apply`

### Taxonomy / SEO pages
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

### Recommended API routes
- `/api/broker-click`
- `/api/lead-intake`
- `/api/onboarding-submit`
- `/api/wix-sync` (optional downstream sync)
- `/api/webhooks/n8n`
- `/api/webhooks/hubspot`

---

## Recommended Route Hierarchy

```text
/
/directory
/directory/[slug]
/onboarding
/terms
/privacy
/out
/about
/contact
/faq
/apply
/industries
/industries/[slug]
/funding-types
/funding-types/[slug]
/states
/states/[slug]
/compare/[slug]
/portal
/admin
/api/broker-click
/api/lead-intake
/api/onboarding-submit
/api/wix-sync (optional downstream sync)
/api/webhooks/n8n
/api/webhooks/hubspot
```

---

## Route Strategy Notes

### Directory routes
The directory should remain the core public discovery system.

That means future taxonomy pages should generally feed into one of these patterns:
- category landing page → filtered directory
- SEO landing page → filtered directory
- broker profile → tracked CTA

### Taxonomy routes
The strongest expansion routes are:
- industries
- funding types
- states

These support:
- SEO growth
- easier user navigation
- better broker matching by context

### Tracking routes
`/out` is already the central redirect pattern.

Future API routes should support:
- richer analytics
- lead capture
- webhook handoff
- application tracking

### Portal routes
`/portal` and `/admin` should be treated as later-phase surfaces, not first-priority public routes.

---

## Build Priority

### Phase 1
- `/about`
- `/contact`
- `/faq`
- `/apply`

### Phase 2
- `/industries`
- `/industries/[slug]`
- `/funding-types`
- `/funding-types/[slug]`
- `/states`
- `/states/[slug]`

### Phase 3
- `/compare/[slug]`
- `/api/broker-click`
- `/api/lead-intake`
- `/api/onboarding-submit`

### Phase 4
- `/portal`
- `/admin`
- webhook routes

---

## Recommended Next Steps
- keep `docs/full-scaffold.md` as the structural source of truth
- use this file to guide future page creation prompts
- tie every new SEO or taxonomy page back to directory discovery and tracked CTA flow
- avoid expanding public routes in ways that bypass `/directory/[slug]` and `/out`
