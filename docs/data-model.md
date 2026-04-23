# Data Model

## Purpose
This document defines the practical data model direction for `moonshine-capital-portal`.

It is based on the current repo behavior, which centers around a broker directory backed by Wix data and rendered through Next.js App Router pages.

**This file should be treated as the canonical app model document** for the portal repo.
That means:
- this is the main app-facing model reference for frontend and application logic
- `docs/WIX_BROKERPROFILE_SCHEMA.md` remains the Wix-system-specific schema doc
- `docs/FIELD_MAPPING_CONTRACT.md` remains the master cross-system contract

The goal is to keep the public directory model clean, flexible, and easy to extend as the portal evolves into a broader Funding Agent OS surface.

---

## Core Entity: BrokerProfile

The central object in this repo is the broker profile.

This is the record shape used to:
- render directory cards
- render broker profile pages
- support filtering
- support CTA tracking
- support onboarding review and approval logic

---

## Recommended BrokerProfile Fields

### Identity fields
- `id`
- `fullName`
- `agencyName`
- `slug`
- `shortBio`
- `whyChooseYou`
- `profileImage`

### Contact fields
- `publicEmail`
- `phoneNumber`
- `websiteUrl`
- `city`
- `state`

### Classification fields
- `industries`
- `fundingTypes`
- `fundingSpecialties`
- `urgencyCategory`

### CTA / routing fields
- `primaryCtaLink`
- `ctaLabel`
- `primaryCta`
- `featuredBroker`
- `featuredFlag`

### Status / ops fields
- `approvalStatus`
- `brokerStatus`
- `isActive`
- `createdAt`
- `updatedAt`

---

## BrokerProfile Example Shape

```ts
export type BrokerProfile = {
  id: string;
  fullName: string;
  agencyName: string;
  slug: string;
  shortBio?: string;
  whyChooseYou?: string;
  profileImage?: string;
  publicEmail?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  city?: string;
  state?: string;
  industries?: string[];
  fundingTypes?: string[];
  fundingSpecialties?: string[];
  urgencyCategory?: string;
  primaryCtaLink?: string;
  ctaLabel?: string;
  primaryCta?: {
    label: string;
    url: string;
    type?: string;
  };
  featuredBroker?: boolean;
  featuredFlag?: boolean;
  approvalStatus?: "approved" | "pending" | "rejected";
  brokerStatus?: "active" | "hidden" | "recruiting";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
```

---

## Current Usage in the Repo

### Homepage
Used for:
- featured broker cards
- homepage trust and discovery layer

### Directory page
Used for:
- list rendering
- filtering
- SEO list data

### Broker profile page
Used for:
- profile hero
- industries and specialties
- contact display
- CTA routing

### Tracking route
Used for:
- broker slug lookup
- destination selection
- tracked outbound redirect

---

## Suggested Supporting Entities

### CTA Node
Represents a structured outbound action.

```ts
export type CTANode = {
  label: string;
  url: string;
  type?: "apply" | "website" | "book" | "contact";
  trackingId?: string;
};
```

**Use for:**
- cleaner outbound routing
- analytics mapping
- future multi-CTA profile support

### DirectoryFilterState
Represents active user filtering in the directory UI.

```ts
export type DirectoryFilterState = {
  state?: string;
  industry?: string;
  fundingType?: string;
  urgency?: string;
  search?: string;
};
```

### OnboardingSubmission
Represents an incoming broker application.

```ts
export type OnboardingSubmission = {
  fullName: string;
  agencyName: string;
  email: string;
  phoneNumber?: string;
  websiteUrl?: string;
  industries?: string[];
  fundingSpecialties?: string[];
  notes?: string;
  source?: string;
  submittedAt?: string;
};
```

---

## Relationship to Other Schema Docs

### `docs/WIX_BROKERPROFILE_SCHEMA.md`
Use that file for:
- Wix CMS collection fields
- Wix-specific frontend mappings
- collection-level implementation details

### `docs/FIELD_MAPPING_CONTRACT.md`
Use that file for:
- cross-system mapping rules
- Tally ↔ Notion ↔ Wix contract
- transformation and merge rules

### This file (`docs/data-model.md`)
Use this file for:
- canonical app-facing shape
- frontend rendering model
- app logic and entity planning

---

## Wix Mapping Direction

The Wix collection should remain the source of truth for approved broker profiles.

### Suggested field mapping
- `Name` → `fullName`
- `Agency/Company` → `agencyName`
- `Slug` → `slug`
- `Bio/Summary` → `shortBio`
- `Why Choose Us` → `whyChooseYou`
- `City` → `city`
- `State` → `state`
- `Website` → `websiteUrl`
- `Email` → `publicEmail`
- `Phone Number` → `phoneNumber`
- `Industries` → `industries`
- `Funding Types/Specialties` → `fundingTypes` / `fundingSpecialties`
- `Speed/Urgency` → `urgencyCategory`
- `Primary CTA Link` → `primaryCtaLink`
- `Primary CTA Label` → `ctaLabel`
- `Approval Status` → `approvalStatus`
- `Broker Status` → `brokerStatus`
- `Is Active` → `isActive`
- `Profile Image` → `profileImage`
- `Featured` → `featuredBroker` / `featuredFlag`

---

## Validation Rules

### Minimum public requirements for a live profile
- `fullName`
- `agencyName`
- `slug`
- `shortBio`
- at least one contact method or CTA destination
- `approvalStatus = approved`
- `isActive = true`

### Strongly recommended requirements
- at least one industry
- at least one funding type / specialty
- `whyChooseYou`
- image or visual identity

---

## Filtering Priorities

The most useful directory filters are:
- state
- industry
- funding type
- urgency / speed category

These should remain first-class fields in the broker profile model.

---

## Data Model Growth Path

### Phase 1
Keep the model centered on the single `BrokerProfile` object.

### Phase 2
Add structured CTA nodes and onboarding submission records.

### Phase 3
Add analytics and lead-routing support objects.

### Phase 4
Support richer internal models for:
- broker ownership
- performance metrics
- review workflows
- portal/admin permissions

---

## Recommended Next Steps
- formalize `BrokerProfile` in `lib/types.ts`
- keep this file as the canonical app model reference
- use the Wix schema and field-mapping docs for system-specific detail
- add `tracking.ts` and `schema.ts` as the repo grows
- keep public display fields separate from internal review / status fields
