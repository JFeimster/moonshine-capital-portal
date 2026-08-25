# Canonical Partner Schema & Field Mapping Contract

This document defines the canonical data model and cross-system mapping contract for public partner identity in `moonshine-capital-portal`.

## Repository role

This repository owns public partner identity, public profile rendering, co-branded funding pages, directory/discovery, tracked CTA routing, Tally intake/profile enrichment, and publication gating. Authenticated Partner Command ownership belongs to `JFeimster/partner-command-center`.

## Merge and identity keys

### Current persistence merge key

Normalized partner email remains the current CRM merge key because the existing Notion adapter contract was built around email.

Rules:

- trim whitespace;
- lowercase before matching;
- reject writes without a merge key;
- never create a second record merely because email casing differs.

### Canonical immutable identity

The target cross-system identity is `partner_id` / `partnerId`.

Until durable storage is wired, the intake foundation deterministically derives stable identifiers from normalized email:

- `partnerId` — canonical internal/cross-system identity;
- `referralCode` — stable attribution/referral identity;
- `slug` — human-readable name plus stable collision-resistant suffix.

If a trusted existing canonical ID/referral code/slug is supplied, preserve it rather than generating a replacement.

## Field categories

### Internal lifecycle / CRM

- `profileStatus`
- `approvalStatus`
- internal notes
- application date
- Tally submission ID
- `createdAt`
- `updatedAt`
- `publishedAt`

### Public identity/profile

- `partnerId`
- `referralCode`
- `slug`
- `fullName`
- `displayName`
- `email`
- `phoneNumber`
- `agencyName`
- `title`
- `partnerType`
- `city`
- `state`
- `websiteUrl`
- `shortBio`
- `whyChooseYou`
- `specialties`
- `industries`
- `fundingTypes`
- `markets`
- `profileImage`
- `logoUrl`
- `bookingUrl`
- `primaryCtaLabel`
- `primaryCtaLink`
- `disclosures`

### Existing Wix/public gating fields retained for compatibility

- `featuredFlag`
- `brokerStatus`
- `approvalStatus`
- `isActive`

Do not remove or reinterpret these until the public adapter migration is explicit. Existing `isEligibleForPublicDisplay()` remains authoritative for current public reads.

## Canonical lifecycle target

```text
application_received
→ pending_review
→ approved
→ profile_incomplete
→ ready_to_publish
→ published
→ suspended
→ archived
```

Legacy internal statuses (`pending`, `in_review`, `approved`, `rejected`) remain supported while storage adapters are migrated.

## Canonical model

| Field | Type | Purpose |
|---|---|---|
| `partnerId` | String | Immutable canonical partner identity. |
| `referralCode` | String | Stable public attribution/referral identity. |
| `slug` | String | Reserved public profile slug. |
| `fullName` | String | Legal/full name used by existing intake. |
| `displayName` | String | Public display name. |
| `email` | String | Current normalized CRM merge key. |
| `phoneNumber` | String | Contact phone. |
| `agencyName` | String | Company/agency name. |
| `title` | String | Public professional title. |
| `profileStatus` | Enum | Profile lifecycle state. |
| `approvalStatus` | Enum | Approval decision/state. |
| `partnerType` | String | Partner classification. |
| `city` | String | Operating city. |
| `state` | String | Normalized state code. |
| `websiteUrl` | URL | Agency/partner website. |
| `shortBio` | String | Public bio. |
| `whyChooseYou` | String | Public value proposition. |
| `specialties` | Array<String> | Partner specialties. |
| `industries` | Array<String> | Target industries. |
| `fundingTypes` | Array<String> | Funding products/types. |
| `markets` | Array<String> | Geographic/segment markets. |
| `urgencyCategory` | String | Existing speed/complexity category. |
| `profileImage` | URL | Partner photo/headshot. |
| `logoUrl` | URL | Company/agency logo. |
| `bookingUrl` | URL | Booking/scheduling link. |
| `primaryCtaLabel` | String | Public primary CTA label. |
| `primaryCtaLink` | URL | Public tracked CTA destination. |
| `disclosures` | Array<String> | Approved public disclosures. |
| `createdAt` | ISO timestamp | First canonical creation time. |
| `updatedAt` | ISO timestamp | Last canonical write time. |
| `publishedAt` | ISO timestamp | Authoritative publication time. |

## External naming

TypeScript currently uses camelCase. External integrations SHOULD use snake_case where appropriate:

| TypeScript | External/API |
|---|---|
| `partnerId` | `partner_id` |
| `referralCode` | `referral_code` |
| `fullName` | `full_name` |
| `displayName` | `display_name` |
| `agencyName` | `company_name` |
| `phoneNumber` | `phone` |
| `profileStatus` | `profile_status` |
| `approvalStatus` | `approval_status` |
| `partnerType` | `partner_type` |
| `fundingTypes` | `funding_types` |
| `profileImage` | `photo_url` |
| `logoUrl` | `logo_url` |
| `bookingUrl` | `booking_url` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |
| `publishedAt` | `published_at` |

Casing differences are adapter concerns, not justification for duplicate semantic fields.

## Transformation rules

### Email normalization

`Partner@Example.COM` → `partner@example.com`.

### Partner ID / referral code

Generated deterministically from normalized email only when trusted existing values are absent. These helpers are identity conveniences, not cryptographic security tokens.

### Slug reservation

Slug base is derived from the full name, then a short stable identity suffix is appended to reduce same-name collisions.

Example shape:

```text
jane-doe-a1b2c
```

### URL cleanup

Ensure `https://` when protocol is absent and strip a trailing slash.

### Arrays

Comma-separated or array input is normalized to a trimmed, non-empty string array.

### State normalization

Known U.S. states/territories normalize to two-letter codes. Unknown values return blank instead of fabricating a state code.

### Blank-safe enrichment

Profile-builder updates omit blank strings and empty arrays before the downstream upsert. Partial enrichment must not erase trusted application/operator data.

## Application defaults

Initial application ingestion sets:

```text
profileStatus = pending_review
approvalStatus = pending
publicationEligible = false
```

Application submission does not equal approval or publication.

## Attribution fields

Public partner flows should preserve when present:

```text
partner_id
referral_code
source
campaign
utm_source
utm_medium
utm_campaign
```

Existing `/out` tracking remains the canonical redirect/tracking foundation.

## Contract notes

- Reuse/normalize existing storage fields before adding duplicates.
- Preserve canonical IDs across retries and profile enrichment.
- Capital owns public slug, gating, rendering, and tracked CTA behavior.
- Partner Command may manage profile configuration through the contract in `PARTNER_COMMAND_PROFILE_CONTRACT.md`.
- The live Notion persistence adapter is still required before deterministic provisioning becomes a durable production upsert.
