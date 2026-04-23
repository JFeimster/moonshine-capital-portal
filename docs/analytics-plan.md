# Analytics Plan

## Purpose
This document defines the analytics plan for `moonshine-capital-portal`.

The portal already has the start of a tracked click flow through `app/out/route.ts`. This plan turns that MVP behavior into a more deliberate analytics strategy so future reporting, routing, and optimization work all point at the same operating model.

---

## Current Analytics Reality

Right now the repo appears to support:
- page rendering for homepage, directory, broker profiles, onboarding, legal pages
- tracked outbound redirects through `/out`
- server-side logging of broker CTA click context

That means analytics currently exist in an early form, but not yet as a full reporting system.

---

## Primary Analytics Goals

### 1. Measure discovery
Understand how users move through:
- homepage
- directory
- broker profile pages
- onboarding flow

### 2. Measure outbound intent
Track when users click broker CTAs and which brokers/pages drive the most action.

### 3. Measure partner / broker performance
Give the internal team visibility into:
- most-viewed profiles
- most-clicked brokers
- best-performing funding specialties or industries

### 4. Prepare for richer routing
Support future measurement of:
- lead intake
- application starts
- taxonomy page performance
- partner acquisition flow

---

## Current Key Funnel Stages

```text
Homepage
   ↓
Directory
   ↓
Broker Profile
   ↓
Tracked CTA Click (/out)
   ↓
External destination
```

Future funnel stages may include:

```text
Homepage / SEO page
   ↓
Directory / Taxonomy Page
   ↓
Broker Profile
   ↓
Tracked CTA Click
   ↓
Lead Intake / Application
   ↓
Qualified Lead / Routed Outcome
```

---

## Recommended Event Categories

### Page view events
Track page views for:
- homepage
- directory
- broker profile
- onboarding
- taxonomy pages (future)

Suggested events:
- `page_view_home`
- `page_view_directory`
- `page_view_broker_profile`
- `page_view_onboarding`
- `page_view_taxonomy`

### CTA click events
Track outbound broker clicks.

Suggested event:
- `cta_click`

### Onboarding events
Track broker onboarding flow.

Suggested events:
- `onboarding_page_view`
- `onboarding_start`
- `onboarding_submit`

### Search / filter events
Track how users interact with the directory.

Suggested events:
- `directory_filter_applied`
- `directory_search_used`
- `directory_result_clicked`

---

## Core Event Payloads

### Broker click event
```ts
export type BrokerClickEvent = {
  event: "cta_click";
  brokerSlug: string;
  brokerId?: string;
  ctaType: string;
  source: string;
  destinationUrl: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  trackingId?: string;
};
```

### Directory interaction event
```ts
export type DirectoryInteractionEvent = {
  event: "directory_filter_applied" | "directory_search_used" | "directory_result_clicked";
  filterState?: {
    state?: string;
    industry?: string;
    fundingType?: string;
    urgency?: string;
    search?: string;
  };
  brokerSlug?: string;
  timestamp: string;
};
```

### Onboarding event
```ts
export type OnboardingEvent = {
  event: "onboarding_page_view" | "onboarding_start" | "onboarding_submit";
  source?: string;
  timestamp: string;
};
```

---

## What Should Be Measured First

### Priority 1
- page views for `/`, `/directory`, `/directory/[slug]`, `/onboarding`
- CTA clicks via `/out`

### Priority 2
- directory filtering behavior
- onboarding starts / submits

### Priority 3
- taxonomy landing page performance
- downstream lead/application events

---

## Suggested Dimensions

Useful dimensions for reporting:
- route
- broker slug
- industry
- funding type
- state
- CTA type
- source
- referrer
- user agent class
- timestamp

---

## Suggested Reporting Questions

### Discovery questions
- Which pages bring users into the directory?
- Which broker profiles get the most views?
- Which taxonomy pages drive the strongest engagement?

### Intent questions
- Which brokers get the most CTA clicks?
- Which CTA types perform best?
- Which industries or funding specialties attract the strongest interest?

### Onboarding questions
- How many brokers visit onboarding?
- How many start vs. complete onboarding?
- Which recruitment channels drive the best partner applications?

---

## Recommended Tooling Direction

### Near-term
Use lightweight analytics and structured server logging.

### Mid-term
Add abstraction layers such as:
- `lib/tracking.ts`
- `lib/analytics.ts`

Possible downstream analytics destinations:
- PostHog
- Google Analytics
- Segment
- custom internal logging pipeline

---

## Recommended File Additions

### `lib/tracking.ts`
Should handle:
- event creation
- payload normalization
- source normalization

### `lib/analytics.ts`
Should handle:
- analytics provider forwarding
- environment-safe no-op behavior
- server/client dispatch helpers

### `app/api/broker-click/route.ts`
Optional future route for structured click event ingestion.

---

## Tracking Principles

### Keep it practical
Do not build a giant analytics machine before the portal needs it.

### Track real decisions
Prioritize events tied to:
- discovery
- CTA clicks
- onboarding
- lead intent

### Normalize early
If source values and event names are messy now, reporting becomes a nightmare later.

---

## Recommended Build Sequence

### Phase 1
- keep `/out` working and stable
- standardize `source` values
- define event payload types

### Phase 2
- add `lib/tracking.ts`
- add `lib/analytics.ts`
- wire page view + click events consistently

### Phase 3
- add directory interaction analytics
- add onboarding submit analytics
- add `/api/broker-click`

### Phase 4
- connect analytics to lead routing and downstream funnel outcomes
- support future `/portal` and `/admin` reporting dashboards

---

## Recommended Next Steps
- treat `app/out/route.ts` as the current analytics anchor
- formalize event shapes in code before adding too many providers
- keep the first analytics layer focused on page views, broker clicks, and onboarding
- expand only after the public directory and tracking foundations are stable
