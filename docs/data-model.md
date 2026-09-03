# Data Model

## Purpose

This document defines the app-facing broker/profile model for `moonshine-capital-portal`.

The authoritative cross-system contract is `docs/FIELD_MAPPING_CONTRACT.md`; executable lifecycle values and field classifications live in `lib/partner-contract.ts`. Notion is the operational source of truth. Wix is an optional downstream compatibility adapter only.

## Core entity: BrokerProfile

`BrokerProfile` is the public/app rendering projection used for directory cards, canonical partner pages, filtering, and CTA routing. It is not the full operational CRM record.

### Identity
- `id`
- `partnerId`
- `referralCode`
- `fullName`
- `displayName`
- `agencyName`
- `slug`

### Public profile
- `shortBio`
- `whyChooseYou`
- `profileImage`
- `publicEmail`
- `phoneNumber`
- `websiteUrl`
- `bookingUrl`
- `city`
- `state`
- `markets`
- `industries`
- `fundingTypes`
- `fundingSpecialties`
- `urgencyCategory`

### CTA/routing
- `primaryCtaLink`
- `ctaLabel`
- `primaryCta`
- optional CTA `registrySlug` for `/go/[slug]` routing

### Lifecycle/display
- `approvalStatus`
- `profileStatus`
- `brokerStatus`
- `isActive`
- `featuredBroker`
- `featuredFlag`

## Canonical lifecycle

```ts
export type ApprovalStatus =
  | 'approved'
  | 'needs_review'
  | 'suspended'
  | 'rejected';

export type ProfileStatus =
  | 'draft'
  | 'published'
  | 'hidden'
  | 'archived';
```

These values are defined once in `lib/partner-contract.ts` and imported by app types.

A new public Funding Agent Join starts `needs_review + draft`. Public rendering from the durable Notion source requires `approved + published`.

## Public projection rules and lifecycle invariants

The public `BrokerProfile` is a deliberate projection of the canonical operational record:

- Public pages must consume `BrokerProfile` from `lib/brokers.ts`, never raw Tally, Notion, or Wix records.
- `specialties` in the canonical record projects to `fundingSpecialties` in `BrokerProfile`.
- `agencyName` may also populate the compatibility-only `companyName` field; it is not an independent source value.
- `primaryCtaLabel` may populate `ctaLabel` and `primaryCta.label`, while the tracked route remains responsible for attribution.
- Optional fields are omitted or represented by their documented empty collection default; they must not be fabricated as trusted source data.
- Public projection must preserve normalized arrays, labels, URLs, and stable slugs.

The following lifecycle invariants apply at every public boundary:

```text
approved + published + available  → eligible for public display
anything else                     → not eligible for public display
```

Wix compatibility data may normalize legacy values such as `pending` to `needs_review`, but it cannot promote a record to `approved` or `published`. Enrichment may add profile data but cannot approve, publish, or create an orphan profile without an eligible canonical identity.

## BrokerProfile example

```ts
export type BrokerProfile = {
  id: string;
  partnerId?: string;
  referralCode?: string;
  fullName: string;
  displayName?: string;
  agencyName: string;
  slug: string;
  shortBio: string;
  publicEmail: string;
  phoneNumber?: string;
  websiteUrl?: string;
  bookingUrl?: string;
  city: string;
  state: string;
  markets?: string[];
  industries: string[];
  fundingTypes: string[];
  fundingSpecialties?: string[];
  urgencyCategory: string;
  primaryCta?: {
    label: string;
    url: string;
    trackingId?: string;
    registrySlug?: string;
  };
  approvalStatus: ApprovalStatus;
  profileStatus?: ProfileStatus;
  brokerStatus?: 'active' | 'hidden' | 'recruiting';
  isActive: boolean;
};
```

## Operational canonical record

The fuller intake/persistence record is `CanonicalBrokerProfile` in `lib/field-mapping.ts`. It includes lifecycle, identity, source, and traceability fields that are not necessarily rendered publicly:

- immutable/persistent identity: `partnerId`, `referralCode`, `slug`
- merge keys: normalized `email`, Tally submission ID
- lifecycle: `approvalStatus`, `profileStatus`, `reviewReason`
- traceability: `sourceForm`, `tallyFormId`, submission timestamps, `notionPageId`
- server-assigned classification: `partnerType`

## CTA node

```ts
export type CTANode = {
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  trackingId?: string;
  registrySlug?: string;
};
```

When `registrySlug` exists, eligible broker CTAs can use `/go/[slug]`. When it does not, attributed `/out?...` remains the compatibility route.

## Source-of-truth flow

```text
Tally
  → /api/webhooks/tally
  → canonical normalization + lifecycle services
  → Notion Partners CRM
  → Next.js public/portal/admin projections
  → optional downstream adapters
```

n8n may orchestrate downstream work but is not the canonical mapping layer. Wix may mirror/publish compatible data but cannot introduce lifecycle states that differ from the canonical contract.

## Public eligibility

For the durable Notion-backed profile path:

```text
approvalStatus = approved
AND
profileStatus = published
```

Additional UI-level availability fields such as `brokerStatus` and `isActive` may further restrict display/routing, but they never override the canonical approval/publication gate.

## Related contracts

- `docs/FIELD_MAPPING_CONTRACT.md` — canonical cross-system field/identity/lifecycle mapping
- `docs/TALLY_APPLICATION_SCHEMA.md` — Funding Agent Join intake rules
- `data/schemas/broker-profile.schema.json` — checked-in JSON validation contract
- `lib/partner-contract.ts` — executable lifecycle enums, field groups, and Notion property map
- `docs/WIX_BROKERPROFILE_SCHEMA.md` — optional Wix-specific compatibility details only
