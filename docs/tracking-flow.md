# Tracking Flow

## Purpose
This document explains the current and recommended click-tracking flow for `moonshine-capital-portal`.

The portal already uses a centralized tracked redirect route. This file turns that into a clearer operational model so future analytics, routing, and reporting work can build from a consistent foundation.

---

## Current Tracking Pattern

The current tracked click flow centers on:
- broker profile discovery
- outbound CTA click handling
- redirect through `app/out/route.ts`

Current route behavior includes:
- reading broker slug from query params
- determining destination URL from broker data
- logging a click event server-side
- redirecting the user to the destination

---

## Current Flow Overview

```text
User visits /directory or /directory/[slug]
   ↓
User clicks CTA
   ↓
CTA points to /out?broker=<slug>&type=<type>&source=<source>
   ↓
app/out/route.ts resolves broker record
   ↓
destination URL is selected and sanitized
   ↓
server logs click event
   ↓
user is redirected to final external destination
```

---

## Existing Tracked Parameters

Based on the current route behavior, the main parameters are:
- `broker`
- `type`
- `source`

### `broker`
The broker slug used to resolve the correct profile.

### `type`
The CTA type, such as:
- `apply`
- `website`

### `source`
The page or context where the click came from.

Examples:
- `directory`
- `profile`
- `homepage`

---

## Current Tracking Responsibilities

### `app/out/route.ts`
Responsible for:
- reading search params
- resolving the broker from `getBrokerBySlug()`
- selecting the destination URL
- sanitizing the URL
- logging a click event
- redirecting the user

### `lib/brokers.ts`
Responsible for:
- providing broker lookup used by the redirect route

### `lib/utils.ts`
Responsible for:
- URL sanitization helpers used before redirecting

---

## Current Event Shape

The current server-side log event effectively captures:
- event name
- broker slug
- type
- source
- destination URL
- timestamp
- user agent
- referrer

This is a good MVP shape for future analytics forwarding.

---

## Recommended Event Model

Standardize outbound click events around a shape like this:

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

---

## Recommended Tracking Stages

### Stage 1 — Current MVP
- tracked redirect route
- server log output
- destination sanitization

### Stage 2 — Structured analytics
- move log events into a helper like `lib/tracking.ts`
- normalize click payloads
- forward events to analytics provider(s)

### Stage 3 — Lead-intent enrichment
- capture richer `source` values
- attach campaign / partner context
- support broker-level reporting

### Stage 4 — Funnel / application attribution
- tie outbound broker clicks to downstream application or lead events
- support richer reporting across discovery → click → form → routing

---

## Recommended Additional Parameters

As the portal grows, consider supporting:
- `campaign`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `ref`
- `tracking_id`

These should only be added if they fit the portal UX and are actually consumed downstream.

---

## Suggested Source Values

To keep reporting cleaner, normalize `source` to a known set:
- `homepage`
- `directory`
- `profile`
- `onboarding`
- `industry-page`
- `funding-type-page`
- `state-page`
- `compare-page`

---

## Redirect Decision Rules

### If `type=website`
Use `broker.websiteUrl` when available.

### Otherwise
Use the broker’s primary CTA link.

### If no valid destination exists
Redirect to the broker profile page or directory safely.

### If broker is missing
Redirect back to `/directory`.

---

## Security Notes

Tracked redirects should always:
- sanitize destination URLs
- avoid unsafe open redirect behavior
- avoid redirecting to blank or malformed values
- avoid exposing internal-only broker data in query strings

---

## Recommended Future Files

To make tracking easier to evolve, consider adding:
- `lib/tracking.ts`
- `lib/analytics.ts`
- `app/api/broker-click/route.ts`

### `lib/tracking.ts`
Should handle:
- event normalization
- source normalization
- payload building

### `lib/analytics.ts`
Should handle:
- forwarding to PostHog / GA / Segment / custom backend
- environment-safe no-op behavior when analytics is disabled

### `app/api/broker-click/route.ts`
Optional future alternative to `/out` for structured click event ingestion

---

## Example Improved Flow

```text
User visits /directory/[slug]
   ↓
User clicks CTA button
   ↓
Link points to /out?broker=<slug>&type=apply&source=profile
   ↓
Tracking helper normalizes event payload
   ↓
Server logs event and optionally forwards to analytics provider
   ↓
Destination URL is sanitized
   ↓
User is redirected
```

---

## Build Priority

### Phase 1
- keep `/out` stable
- document current event shape
- normalize `source` values

### Phase 2
- add `lib/tracking.ts`
- add `lib/analytics.ts`
- centralize click event creation

### Phase 3
- add `/api/broker-click`
- support richer attribution parameters
- add broker-level reporting hooks

### Phase 4
- connect outbound click data to downstream lead / funding workflows
- support future portal/admin reporting surfaces

---

## Recommended Next Steps
- extract tracking logic from `app/out/route.ts` into reusable helpers as the system grows
- define a canonical broker click event type in `lib/types.ts` or a new `lib/tracking.ts`
- normalize source values now so analytics doesn’t become messy later
- keep `/out` as the primary redirect gateway unless there is a strong reason to replace it
