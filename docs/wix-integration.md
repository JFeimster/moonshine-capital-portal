# Wix Integration

## Purpose
This document explains how `moonshine-capital-portal` uses Wix as an optional downstream layer for broker profile data.

It is meant to guide:
- data fetching
- integration boundaries
- local fallback behavior
- normalization expectations
- future sync/API work

This file should describe **how Wix is used in the repo**, not re-document every schema field in full.
For field-level schema details, use:
- `docs/WIX_BROKERPROFILE_SCHEMA.md`
- `docs/FIELD_MAPPING_CONTRACT.md`
- `docs/data-model.md`

---

## Current Role of Wix in This Repo

Wix is an optional downstream publish/read adapter. Notion is the operational CRM and source of truth.

The high-level pattern is:
1. broker / partner data is approved in Notion
2. approved records may be pushed to Wix CMS via automation
3. the Next.js portal reads those records through `lib/wix.ts` if configured
4. `lib/brokers.ts` acts as the local abstraction layer consumed by pages and components

This keeps the app UI decoupled from the raw CMS integration.

---

## Current Integration Flow

```text
Wix CMS
   ↓
lib/wix.ts
   ↓
lib/brokers.ts
   ↓
app/page.tsx
app/directory/page.tsx
app/directory/[slug]/page.tsx
app/out/route.ts
```

---

## Key Files

### `lib/wix.ts`
Expected responsibilities:
- fetch broker collection data from Wix
- fetch a single broker by slug
- normalize raw Wix responses where needed
- handle API credentials and request logic

### `lib/brokers.ts`
Current responsibilities:
- provide the app-facing broker access functions
- expose:
  - `getBrokers()`
  - `getBrokerBySlug()`
  - `getFeaturedBrokers()`

### `lib/mock-brokers.ts`
Expected responsibilities:
- provide safe fallback data for development or build-time use
- support builds when live credentials are unavailable

---

## Recommended Integration Contract

The app should avoid importing raw Wix logic directly into routes/components.

Preferred pattern:
- pages/components use `lib/brokers.ts`
- `lib/brokers.ts` chooses between Wix data and fallback data
- `lib/wix.ts` stays focused on transport and normalization

This keeps the repo cleaner and makes later backend changes easier.

---

## Schema References

Use these docs for field-level definitions instead of duplicating them here:

### Wix collection schema
- `docs/WIX_BROKERPROFILE_SCHEMA.md`

### Cross-system field contract
- `docs/FIELD_MAPPING_CONTRACT.md`

### App-facing canonical model
- `docs/data-model.md`

---

## Environment Variables

The repo README already refers to a pattern like:

```env
WIX_API_URL=https://your-wix-site.com/_functions/api
WIX_API_KEY=your_wix_api_key
```

The exact final variable names should match `lib/wix.ts`.

Recommended minimum environment variables:
- `WIX_API_URL`
- `WIX_API_KEY`

Optional future additions:
- `WIX_SITE_ID`
- `WIX_COLLECTION_NAME`
- `WIX_TIMEOUT_MS`

---

## Fetching Patterns

### Fetch all brokers
Use when rendering:
- homepage featured section
- directory page
- generateStaticParams for profiles

### Fetch broker by slug
Use when rendering:
- `/directory/[slug]`
- `/out` redirect lookup

### Fetch featured brokers
This can either:
- be done inside `lib/brokers.ts`
- or by filtering `getBrokers()` results for `featuredBroker` / `featuredFlag`

---

## Suggested Normalization Rules

Wix data should be normalized before it hits UI code.

Recommended normalization tasks:
- trim empty strings
- normalize arrays
- ensure missing fields resolve safely
- coerce booleans consistently
- enforce slug-safe values
- ensure CTA destinations are valid / sanitized

This logic belongs in `lib/wix.ts` or a helper like `lib/wix-normalizers.ts`.

---

## Fallback Strategy

The repo should remain build-safe if Wix is unavailable.

Recommended fallback logic:
1. if live Wix config is present, fetch live data
2. if live config is missing or fetch fails, use local mock fallback in development
3. fail safely in production with clear logs if the live source is required and unavailable

This avoids fragile deploys.

---

## Error Handling Recommendations

### Handle these cases gracefully
- missing environment variables
- Wix API timeouts
- empty broker collection
- broker not found by slug
- malformed CTA links
- inactive / unapproved brokers accidentally returned

### App-level behavior
- homepage should still render if no featured brokers exist
- directory should show a useful empty state
- profile page should return `notFound()` if broker is missing
- `/out` should redirect safely if broker is missing or CTA is invalid

---

## Security / Data Exposure Notes

Wix (if used) should remain a read-only content replica, not an uncontrolled public dump.

Recommended safeguards:
- only publish approved / active brokers
- never expose internal-only review fields in the UI
- sanitize outbound URLs before redirecting
- keep API keys server-side only

---

## Recommended Future Enhancements

### Phase 1
- make normalization explicit in `lib/wix.ts`
- keep schema references centralized instead of repeating field inventories across docs

### Phase 2
- add `lib/wix-normalizers.ts`
- add stronger logging / telemetry around Wix fetch failures

### Phase 3
- add `/api/wix-sync` or equivalent internal sync route
- support richer field transforms and cache invalidation

### Phase 4
- support additional content models beyond broker profiles
- support multi-collection fetches for industries, funding types, or future portal data

---

## Recommended Next Steps
- verify the exact environment variable names used by `lib/wix.ts`
- keep page code dependent on `lib/brokers.ts`, not raw Wix fetch calls
- preserve development-safe fallback behavior so local builds remain stable
- use the schema docs for field-level definitions rather than duplicating them here
