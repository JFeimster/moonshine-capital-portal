# SEO Architecture

## Purpose
This document defines the SEO architecture direction for `moonshine-capital-portal`.

The portal is currently strongest as a broker directory and public discovery surface. SEO should support that core job by driving qualified traffic into:
- the homepage
- the directory
- broker profile pages
- future industry, funding-type, state, and comparison pages

This doc is meant to prevent random SEO page creation that doesn’t connect back to the actual portal structure.

---

## Current SEO-Relevant Surfaces

### Homepage (`/`)
Role:
- broad positioning page
- top-level brand / directory entry point
- trust and discovery layer

### Directory index (`/directory`)
Role:
- broker list page
- strong candidate for category + filter-based search visibility
- supports ItemList-style structured data

### Broker profiles (`/directory/[slug]`)
Role:
- individual profile landing pages
- can rank for branded queries, broker names, specialties, and regional queries
- strong long-tail SEO surface

### Legal pages (`/terms`, `/privacy`)
Role:
- trust and completeness, not growth

---

## Core SEO Principles

### 1. SEO pages should feed the directory
The portal should not become a disconnected pile of content pages.

New SEO surfaces should usually do one of these:
- route users to `/directory`
- route users to `/directory/[slug]`
- narrow discovery by industry, funding type, or state

### 2. Profile pages are a major asset
Each broker profile page should function as:
- a trust page
- a conversion page
- a long-tail search page

### 3. Taxonomy pages are the natural next expansion
Best next SEO layers:
- industry pages
- funding-type pages
- state pages
- comparison pages

### 4. Structured data should support list + detail pages
The directory and broker pages should continue to carry schema where useful.

---

## Current SEO Stack Direction

### Directory page
Recommended schema:
- `ItemList`

### Broker profile pages
Recommended schema:
- `Person`
- possibly `Organization` relationships where appropriate

### Future taxonomy pages
Recommended schema:
- `CollectionPage`
- `BreadcrumbList`
- optional FAQ schema where relevant

---

## Recommended SEO Surface Map

```text
/
/directory
/directory/[slug]
/industries
/industries/[slug]
/funding-types
/funding-types/[slug]
/states
/states/[slug]
/compare/[slug]
/faq
/about
```

---

## Recommended Page Types

### 1. Core positioning pages
- `/`
- `/about`
- `/faq`

### 2. Directory discovery pages
- `/directory`
- `/industries`
- `/funding-types`
- `/states`

### 3. Directory detail pages
- `/directory/[slug]`
- `/industries/[slug]`
- `/funding-types/[slug]`
- `/states/[slug]`
- `/compare/[slug]`

---

## Metadata Priorities

### Homepage
Should target:
- broker directory intent
- funding partner discovery intent
- Moonshine Capital brand intent

### Directory page
Should target:
- partner directory intent
- business funding partner discovery intent
- broker-finder intent

### Broker pages
Should target:
- broker name
- agency name
- funding specialties
- region / industry modifiers where appropriate

### Taxonomy pages
Should target:
- industry-specific funding partner searches
- state-specific partner searches
- funding-type-specific discovery searches

---

## URL Strategy

### Keep URLs clean and stable
Examples:
- `/directory/jane-doe`
- `/industries/saas`
- `/funding-types/equipment-financing`
- `/states/virginia`
- `/compare/working-capital-vs-invoice-factoring`

### Avoid noisy URL patterns
Avoid:
- unnecessary query-string-heavy landing pages for core indexable pages
- duplicate taxonomy naming
- slugs tied to unstable internal terms

---

## Internal Linking Strategy

### Homepage should link to:
- `/directory`
- featured broker profiles
- `/onboarding`
- future taxonomy hubs

### Directory should link to:
- broker profiles
- future industry and funding-type landing pages

### Broker profiles should link to:
- `/directory`
- related discovery pages when relevant

### Taxonomy pages should link to:
- filtered broker lists
- broker detail pages
- related taxonomy pages

---

## Future Taxonomy Expansion

### Industries
Examples:
- SaaS
- Construction
- E-commerce
- Real Estate
- Healthcare
- Trucking

### Funding Types
Examples:
- equipment financing
- working capital
- invoice factoring
- lines of credit
- revenue-based funding

### States
Examples:
- Virginia
- Maryland
- DC
- Texas
- California

These pages should be created only if they route meaningfully into broker discovery.

---

## Cannibalization Risks

Watch for:
- too many thin taxonomy pages
- duplicate pages targeting the same funding term
- broker profile pages and taxonomy pages competing for identical intent
- city/state pages with no meaningful content or differentiation

---

## Recommended Supporting Files

As SEO expands, consider adding:
- `lib/seo.ts`
- `lib/schema.ts`
- `components/Breadcrumbs.tsx`
- `components/PageIntro.tsx`

---

## Build Priority

### Phase 1
- refine metadata for `/` and `/directory`
- strengthen broker profile metadata
- keep schema clean and valid

### Phase 2
- add `/about`
- add `/faq`
- create `/industries` and `/industries/[slug]`

### Phase 3
- add `/funding-types` and `/funding-types/[slug]`
- add `/states` and `/states/[slug]`
- add `/compare/[slug]`

### Phase 4
- improve internal linking and schema coverage
- monitor which taxonomy pages actually deserve expansion

---

## Recommended Next Steps
- treat `/directory` and `/directory/[slug]` as the current SEO foundation
- expand SEO through taxonomy pages only when they improve discovery quality
- keep every new SEO page tied to broker discovery or broker profiles
- avoid thin, disconnected SEO pages that do not support the portal’s actual job
